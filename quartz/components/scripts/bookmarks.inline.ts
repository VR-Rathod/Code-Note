// @ts-ignore
import { createClient, SupabaseClient, User } from "@supabase/supabase-js"

interface Bookmark { url: string; title: string }

// ─── Single source-of-truth state ────────────────────────────────────────────
// All mutations go through setState() which triggers a single render pass.
// This eliminates every race condition that existed in the old system.
const STATE: {
  supabase: SupabaseClient | null
  user: User | null
  bookmarks: Bookmark[] | null   // null = not yet loaded
  initialized: boolean
  giscusLogin: string | null
} = {
  supabase: null,
  user: null,
  bookmarks: lsRead(), // Initialize from local cache immediately on startup for instant UI
  initialized: false,
  giscusLogin: null,
}

function setState(patch: Partial<typeof STATE>) {
  Object.assign(STATE, patch)
  render()
}

// ─── localStorage (write-through cache only) ──────────────────────────────────
// Cloud is always authoritative. localStorage is a read-fallback when offline
// and a write-through cache for instant UI. It is NEVER merged into the cloud.
const LS_KEY = "bm-v2"

function lsRead(): Bookmark[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    const parsed = JSON.parse(raw || "[]")
    return Array.isArray(parsed) ? parsed : []
  } catch { return [] }
}

function lsWrite(bms: Bookmark[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(bms)) } catch { }
}

function lsClear() {
  localStorage.removeItem(LS_KEY)
  localStorage.removeItem("study-bookmarks") // migrate away from old key
}

// ─── Toast notifications ──────────────────────────────────────────────────────
function toast(msg: string, ms = 3500) {
  document.querySelector(".bm-toast")?.remove()
  const el = Object.assign(document.createElement("div"), {
    className: "bm-toast", textContent: msg,
  })
  document.body.appendChild(el)
  setTimeout(() => el.remove(), ms)
}

// ─── Supabase operations (upsert / delete-by-url) ─────────────────────────────
// We NEVER use delete-all + insert-all. Each operation is atomic.

async function cloudFetch(uid: string): Promise<Bookmark[] | null> {
  if (!STATE.supabase) return null
  try {
    // Race the Supabase query against a 12-second timeout.
    // If the network/auth queue stalls on page load, we give it enough time to resolve.
    const queryPromise = STATE.supabase
      .from("bookmarks")
      .select("url,title")
      .eq("user_id", uid)

    const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
      setTimeout(() => resolve({ data: null, error: new Error("timeout") }), 12000)
    )

    const { data, error } = await Promise.race([queryPromise, timeoutPromise])

    if (error) {
      // console.error("[BM] fetch error:", error.message ?? error)
      return null
    }
    return Array.isArray(data) ? (data as Bookmark[]) : []
  } catch (e) {
    // console.error("[BM] fetch exception:", e)
    return null
  }
}


async function cloudUpsert(uid: string, bm: Bookmark): Promise<boolean> {
  if (!STATE.supabase) return false
  try {
    // Delete any existing row for this URL first (no-op if not present), then insert.
    // This avoids needing a unique constraint while still being idempotent.
    await STATE.supabase
      .from("bookmarks")
      .delete()
      .eq("user_id", uid)
      .eq("url", bm.url)

    const { error } = await STATE.supabase
      .from("bookmarks")
      .insert({ user_id: uid, url: bm.url, title: bm.title })
    if (error) { console.error("[BM] insert:", error); return false }
    return true
  } catch (e) { console.error("[BM] insert exception:", e); return false }
}

async function cloudDeleteUrl(uid: string, url: string): Promise<boolean> {
  if (!STATE.supabase) return false
  try {
    const { error } = await STATE.supabase
      .from("bookmarks")
      .delete()
      .eq("user_id", uid)
      .eq("url", url)
    if (error) { console.error("[BM] delete:", error); return false }
    return true
  } catch (e) { console.error("[BM] delete exception:", e); return false }
}

// ─── Load bookmarks — deduped: only one cloud fetch can be in-flight at a time ─
// This prevents the race between onAuthStateChange(INITIAL_SESSION) and
// resolveSession() both calling loadBookmarks() simultaneously.
let loadPromise: Promise<void> | null = null

async function loadBookmarks() {
  // If a load is already in progress, wait for it — don't start a second one
  if (loadPromise) {
    // console.log("[BM] loadBookmarks: already in progress, waiting.")
    await loadPromise
    return
  }

  loadPromise = (async () => {
    if (STATE.user) {
      const uid = STATE.user.id
      // console.log("[BM] loadBookmarks: starting fetch for user:", uid)
      const cloud = await cloudFetch(uid)
      if (STATE.user?.id !== uid) {
        // console.log("[BM] loadBookmarks: user changed mid-flight, bailing.")
        return
      }
      if (cloud !== null) {
        // console.log("[BM] loadBookmarks: cloud fetch succeeded, loaded", cloud.length, "bookmarks.")
        lsWrite(cloud)
        setState({ bookmarks: cloud })
      } else {
        // console.log("[BM] loadBookmarks: cloud fetch failed or timed out, falling back to local cache.")
        setState({ bookmarks: lsRead() })
        toast("⚠️ Couldn't reach cloud — showing local bookmarks.")
      }
    } else {
      // console.log("[BM] loadBookmarks: no user, loading local cache.")
      setState({ bookmarks: lsRead() })
    }
  })()

  try {
    await loadPromise
  } finally {
    loadPromise = null
  }
}

// ─── Bookmark mutations (optimistic UI + async cloud sync) ────────────────────

async function addBookmark(bm: Bookmark) {
  const current = STATE.bookmarks ?? lsRead()
  if (current.some(b => b.url === bm.url)) return // already exists

  // 1. Optimistic update → instant UI
  const next = [...current, bm]
  setState({ bookmarks: next })
  lsWrite(next)

  // 2. Background cloud sync
  if (STATE.user && STATE.supabase) {
    const uid = STATE.user.id
    const ok = await cloudUpsert(uid, bm)
    if (STATE.user?.id !== uid) return // user changed mid-flight

    if (!ok) {
      // Revert optimistic update
      const reverted = (STATE.bookmarks ?? []).filter(b => b.url !== bm.url)
      setState({ bookmarks: reverted })
      lsWrite(reverted)
      toast("❌ Could not save bookmark — please check your connection.")
    }
  }
}

async function removeBookmark(url: string) {
  const current = STATE.bookmarks ?? lsRead()
  const removed = current.find(b => b.url === url)
  if (!removed) return

  // 1. Optimistic remove → instant UI
  const next = current.filter(b => b.url !== url)
  setState({ bookmarks: next })
  lsWrite(next)

  // 2. Background cloud sync
  if (STATE.user && STATE.supabase) {
    const uid = STATE.user.id
    const ok = await cloudDeleteUrl(uid, url)
    if (STATE.user?.id !== uid) return // user changed mid-flight

    if (!ok) {
      // Revert optimistic remove
      const reverted = [...(STATE.bookmarks ?? []), removed]
      setState({ bookmarks: reverted })
      lsWrite(reverted)
      toast("❌ Could not remove bookmark — please check your connection.")
    }
  }
}

// ─── Auth helpers ─────────────────────────────────────────────────────────────

function cleanOAuthUrl() {
  const u = new URL(window.location.href)
  u.searchParams.delete("code")
  u.hash = ""
  if (u.pathname + u.search !== window.location.pathname + window.location.search) {
    window.history.replaceState(null, "", u.pathname + u.search)
  }
}

// Resolves the current session from Supabase storage and loads bookmarks.
// Only used as a fallback from the nav hook (onAuthStateChange handles the primary flow).
async function resolveSession() {
  if (!STATE.supabase) return
  try {
    const { data: { session } } = await STATE.supabase.auth.getSession()
    const freshUser = session?.user ?? null
    if (freshUser?.id !== STATE.user?.id) {
      loadPromise = null
      // Only clear cache and show spinner if switching to a completely different user account
      if (STATE.user && freshUser && STATE.user.id !== freshUser.id) {
        lsClear()
        setState({ user: freshUser, bookmarks: null })
      } else {
        setState({ user: freshUser })
      }
    }
    await loadBookmarks()
  } catch (e) {
    console.error("[BM] resolveSession:", e)
  }
}

// ─── Render (one unified pass) ────────────────────────────────────────────────
function render() {
  renderProfile()
  renderList()
  renderTocButtons()
}

function renderProfile() {
  const { user, giscusLogin } = STATE
  const guestEls = document.querySelectorAll<HTMLElement>(".profile-guest")
  const loggedEls = document.querySelectorAll<HTMLElement>(".profile-logged-in")
  const badges = document.querySelectorAll<HTMLElement>(".bm-toggle-badge")
  const hintEls = document.querySelectorAll<HTMLElement>(".giscus-connection-hint")
  const hasGiscus = !!document.querySelector("iframe.giscus-frame, .giscus")

  if (user) {
    guestEls.forEach(el => { el.style.display = "none" })
    badges.forEach(b => { b.style.display = "block" })
    hintEls.forEach(el => { el.style.display = (hasGiscus && !giscusLogin) ? "block" : "none" })
    loggedEls.forEach(el => {
      el.style.display = "flex"
      const nameEl = el.querySelector<HTMLElement>(".profile-name")
      const avatarEl = el.querySelector<HTMLImageElement>(".profile-avatar")
      const letterEl = el.querySelector<HTMLElement>(".profile-avatar-letter")

      if (nameEl) {
        nameEl.textContent =
          user.user_metadata?.full_name ||
          user.user_metadata?.user_name ||
          user.email?.split("@")[0] || "User"
      }
      const avatarUrl = user.user_metadata?.avatar_url
      if (avatarUrl && avatarEl) {
        avatarEl.src = avatarUrl
        avatarEl.style.display = "block"
        if (letterEl) letterEl.style.display = "none"
      } else {
        if (avatarEl) avatarEl.style.display = "none"
        if (letterEl) {
          letterEl.textContent = (user.email || user.user_metadata?.full_name || "U").charAt(0).toUpperCase()
          letterEl.style.display = "flex"
        }
      }
    })
  } else {
    guestEls.forEach(el => { el.style.display = "flex" })
    loggedEls.forEach(el => { el.style.display = "none" })
    badges.forEach(b => { b.style.display = "none" })
    hintEls.forEach(el => { el.style.display = "none" })
  }
}

function renderList() {
  document.querySelectorAll(".bookmarks-list-wrapper").forEach(wrapper => {
    renderInto(wrapper as HTMLElement, STATE.bookmarks)
  })
}

function renderInto(wrapper: HTMLElement, bms: Bookmark[] | null) {
  wrapper.innerHTML = ""

  if (bms === null) {
    wrapper.innerHTML = `<p class="bm-empty bm-loading">
      <span class="bm-spinner"></span> Loading…
    </p>`
    return
  }
  if (!bms.length) {
    wrapper.innerHTML = `<p class="bm-empty">No bookmarks yet.<br>
      <small>Click the 🔖 icon next to any heading.</small></p>`
    return
  }

  const groupEl = document.createElement("div")
  groupEl.className = "bm-groups"

  if (bms.length > 4) {
    const searchRow = document.createElement("div")
    searchRow.className = "bm-search-row"
    searchRow.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input class="bm-search" type="text" placeholder="Filter bookmarks…" autocomplete="off"/>
    `
    wrapper.appendChild(searchRow)
    const input = searchRow.querySelector<HTMLInputElement>("input")!
    input.addEventListener("input", () => renderGrouped(groupEl, bms, input.value.toLowerCase()))
  }

  wrapper.appendChild(groupEl)
  renderGrouped(groupEl, bms, "")
}

function renderGrouped(container: HTMLElement, bms: Bookmark[], filter: string) {
  container.innerHTML = ""

  const parsed = (bms || [])
    .filter(bm => bm && typeof bm === "object")
    .map(bm => {
      const title = bm.title || "Untitled"
      const url = bm.url || ""
      const dash = title.indexOf(" - ")
      return {
        url,
        title,
        page: dash > -1 ? title.slice(0, dash) : title,
        section: dash > -1 ? title.slice(dash + 3) : "",
      }
    })
    .filter(b => !filter ||
      b.page.toLowerCase().includes(filter) ||
      b.section.toLowerCase().includes(filter))

  if (!parsed.length) {
    container.innerHTML = `<p class="bm-empty">No results for "<em>${filter}</em>"</p>`
    return
  }

  const pages = new Map<string, typeof parsed>()
  parsed.forEach(b => { const a = pages.get(b.page) || []; a.push(b); pages.set(b.page, a) })

  pages.forEach((items, page) => {
    const group = document.createElement("div")
    group.className = "bm-group"
    group.innerHTML = `
      <div class="bm-page-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        <span>${page}</span>
      </div>`
    items.forEach(b => {
      const row = document.createElement("div")
      row.className = "bm-item"
      row.innerHTML = `
        <a href="${b.url}" class="bm-link" title="${b.title}">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          <span>${b.section || b.page}</span>
        </a>
        <button class="bm-remove" data-url="${b.url}" title="Remove bookmark" aria-label="Remove bookmark">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>`
      group.appendChild(row)
    })
    container.appendChild(group)
  })
}


// ─── TOC inline bookmark buttons ──────────────────────────────────────────────
function injectTocButtons() {
  document.querySelectorAll("article h1[id], article h2[id], article h3[id], article h4[id], article h5[id], article h6[id]").forEach(heading => {
    if (heading.querySelector(".toc-bookmark-btn")) return
    if (heading.classList.contains("article-title")) return
    const clone = heading.cloneNode(true) as HTMLElement
    clone.querySelectorAll(".toc-bookmark-btn, a, .anchor").forEach(el => el.remove())
    const title = clone.textContent?.replace(/🔖|#/g, "").trim() || "Section"
    const btn = document.createElement("button")
    btn.className = "toc-bookmark-btn inline-bookmark-btn"
    btn.setAttribute("data-hash", `#${heading.id}`)
    btn.setAttribute("data-title", title)
    btn.setAttribute("aria-label", "Bookmark this section")
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>`
    heading.appendChild(btn)
  })
}

function renderTocButtons() {
  injectTocButtons()
  const bms = STATE.bookmarks ?? []
  const path = window.location.pathname
  document.querySelectorAll(".toc-bookmark-btn").forEach(btn => {
    const url = path + (btn.getAttribute("data-hash") || "")
    btn.classList.toggle("bookmarked", bms.some(b => b && b.url === url))
  })
}

// ─── Menu helpers ─────────────────────────────────────────────────────────────
function closeMenus() {
  document.querySelectorAll(".bookmarks-menu").forEach(m => m.classList.remove("show"))
  document.querySelectorAll(".bookmarks-toggle").forEach(b => b.setAttribute("aria-expanded", "false"))
}

// ─── Event delegation (single listener for everything) ───────────────────────
function setupEvents() {
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeMenus()
  })

  document.addEventListener("click", async e => {
    const t = e.target as HTMLElement

    // ── Login with GitHub ──
    const loginBtn = t.closest<HTMLElement>(".login-btn")
    if (loginBtn) {
      e.preventDefault(); e.stopPropagation()
      if (!STATE.supabase) return void toast("⚠️ Database not connected.")
      loginBtn.textContent = "Redirecting to GitHub…"
      const redirectTo = window.location.origin + window.location.pathname + window.location.search
      STATE.supabase.auth.signInWithOAuth({ provider: "github", options: { redirectTo } })
        .catch(() => { loginBtn.innerHTML = `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg> Sign In with GitHub` })
      return
    }

    // ── Sign out ──
    const logoutBtn = t.closest<HTMLElement>(".logout-btn")
    if (logoutBtn) {
      e.preventDefault(); e.stopPropagation()
      if (!STATE.supabase) return
      logoutBtn.textContent = "Signing out…"
      lsClear()
      await Promise.race([STATE.supabase.auth.signOut(), new Promise(r => setTimeout(r, 1500))])
      cleanOAuthUrl()
      window.location.replace(window.location.pathname + window.location.search)
      return
    }

    // ── Delete account ──
    const deleteBtn = t.closest<HTMLElement>(".delete-account-btn")
    if (deleteBtn) {
      e.preventDefault(); e.stopPropagation()
      if (!STATE.supabase || !STATE.user) return
      if (!window.confirm("Are you absolutely sure you want to permanently delete your account, bookmarks, and all associated user data? This cannot be undone.")) return
      deleteBtn.textContent = "Deleting…"
      const uid = STATE.user.id
      try {
        // Attempt to delete data across all possible database tables
        await Promise.allSettled([
          STATE.supabase.from("bookmarks").delete().eq("user_id", uid),
          STATE.supabase.from("faq").delete().eq("user_id", uid),
          STATE.supabase.from("faqs").delete().eq("user_id", uid),
          STATE.supabase.from("profiles").delete().eq("id", uid),
          STATE.supabase.from("user_data").delete().eq("user_id", uid),
        ])

        // Call the database function to delete the auth account
        const { error } = await STATE.supabase.rpc("delete_user")
        if (error) {
          console.error("Supabase RPC delete_user failed:", error)
          toast("⚠️ Account database record could not be deleted automatically. Make sure the 'delete_user' RPC is configured in Supabase.")
        }
      } catch (err) {
        console.error("Error during deletion process:", err)
      }
      lsClear()
      try {
        await Promise.race([STATE.supabase.auth.signOut(), new Promise(r => setTimeout(r, 1500))])
      } catch { }
      cleanOAuthUrl()
      window.location.replace(window.location.pathname + window.location.search)
      return
    }

    // ── Remove single bookmark ──
    const rmBtn = t.closest<HTMLElement>(".bm-remove")
    if (rmBtn) {
      e.preventDefault(); e.stopPropagation()
      const url = rmBtn.dataset.url
      if (url) removeBookmark(url)
      return
    }

    // ── TOC bookmark toggle ──
    const tocBtn = t.closest<HTMLElement>(".toc-bookmark-btn")
    if (tocBtn) {
      e.preventDefault(); e.stopPropagation()
      const hash = tocBtn.getAttribute("data-hash") || ""
      const title = tocBtn.getAttribute("data-title") || "Section"
      const url = window.location.pathname + hash
      const pageTitle = document.querySelector(".article-title")?.textContent?.trim() || "Page"
      const bms = STATE.bookmarks ?? []
      bms.some(b => b.url === url)
        ? removeBookmark(url)
        : addBookmark({ url, title: `${pageTitle} - ${title}` })
      return
    }

    // ── Giscus connect ──
    const giscusBtn = t.closest<HTMLElement>(".jump-to-comments-btn")
    if (giscusBtn) {
      e.preventDefault(); e.stopPropagation()
      const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame")
      if (iframe) {
        iframe.scrollIntoView({ behavior: "smooth", block: "center" })
        setTimeout(() => {
          iframe.contentWindow?.postMessage({ giscus: { setConfig: {} } }, "https://giscus.app")
          iframe.contentWindow?.postMessage({ giscus: { signIn: true } }, "https://giscus.app")
        }, 600)
        closeMenus()
      } else {
        toast("💬 This page doesn't have a comments section.")
      }
      return
    }

    // ── Funding feature → open donation modal ──
    const fundingItem = t.closest<HTMLElement>("[data-requires-funding='true']")
    if (fundingItem) {
      e.preventDefault(); e.stopPropagation()
      closeMenus()
      const modal = document.querySelector<HTMLElement>("#donation-hub-modal")
      if (modal) { modal.classList.add("show"); document.body.classList.add("modal-open") }
      return
    }

    // ── Toggle bookmarks panel ──
    const toggleBtn = t.closest<HTMLElement>(".bookmarks-toggle")
    if (toggleBtn) {
      e.stopPropagation()
      const allToggles = Array.from(document.querySelectorAll(".bookmarks-toggle"))
      const idx = allToggles.indexOf(toggleBtn)
      document.querySelectorAll(".bookmarks-menu").forEach((m, i) => {
        const isOpen = i === idx && !m.classList.contains("show")
        m.classList.toggle("show", isOpen)
        const btn = allToggles[i] as HTMLElement
        if (btn) btn.setAttribute("aria-expanded", isOpen ? "true" : "false")
      })
      return
    }

    // ── Click-outside → close ──
    document.querySelectorAll(".bookmarks-menu").forEach(m => {
      if (m.classList.contains("show") && !m.contains(t)) {
        m.classList.remove("show")
        document.querySelectorAll(".bookmarks-toggle").forEach(b => b.setAttribute("aria-expanded", "false"))
      }
    })
  })

  // Giscus postMessage (detect if user is signed in to comments)
  window.addEventListener("message", ev => {
    if (ev.origin !== "https://giscus.app") return
    const login = ev.data?.giscus?.viewer?.login ?? null
    if (login !== STATE.giscusLogin) {
      STATE.giscusLogin = login
      renderProfile()
    }
  })
}

// ─── INITIALIZATION (guarded: runs exactly once per page lifetime) ─────────────
if (!STATE.initialized) {
  STATE.initialized = true
  cleanOAuthUrl()

  // Build Supabase client from env vars injected by Bookmarks.tsx
  const sbUrl = (window as any).SUPABASE_URL || ""
  const sbAnon = (window as any).SUPABASE_ANON_KEY || ""
  if (sbUrl && sbAnon) {
    try {
      STATE.supabase = createClient(sbUrl, sbAnon, {
        auth: { detectSessionInUrl: true, persistSession: true, autoRefreshToken: true },
      })
    } catch (e) { console.error("[BM] Supabase init failed:", e) }
  }

  if (STATE.supabase) {
    STATE.supabase.auth.onAuthStateChange(async (event, session) => {
      const newUser = session?.user ?? null

      // OAuth redirect: session now stored in localStorage — reload cleanly
      if (event === "SIGNED_IN" &&
        (window.location.hash.includes("access_token=") ||
          window.location.search.includes("code="))) {
        cleanOAuthUrl()
        window.location.reload()
        return
      }

      // Act when user IDENTITY changes (covers INITIAL_SESSION, SIGNED_IN, SIGNED_OUT).
      if (newUser?.id !== STATE.user?.id) {
        // console.log("[BM] Auth identity change. Event:", event, "User:", newUser?.email || "Guest")
        if (!newUser) {
          loadPromise = null
          setState({ user: null, bookmarks: lsRead() })
        } else {
          loadPromise = null  // Reset so a fresh fetch happens for the new user
          // Only clear cache and show spinner if switching to a completely different user account
          if (STATE.user && STATE.user.id !== newUser.id) {
            console.log("[BM] Switching user accounts, clearing cache.")
            lsClear()
            setState({ user: newUser, bookmarks: null })
          } else {
            setState({ user: newUser })
          }

          // Defer loading to the next event loop tick.
          // This avoids a deadlock where GoTrue holds its internal auth lock during
          // onAuthStateChange, blocking the Postgrest client's token-retrieval call.
          setTimeout(() => {
            loadBookmarks()
          }, 0)
        }
      }
    })

    // Clock-skew resilience: if OAuth params are present but onAuthStateChange
    // hasn't fired yet, manually try getSession after a short delay
    if (window.location.hash.includes("access_token=") || window.location.search.includes("code=")) {
      setTimeout(async () => {
        const { data: { session } } = await STATE.supabase!.auth.getSession()
        if (session && !STATE.user) {
          cleanOAuthUrl()
          window.location.reload()
        } else if (!session) {
          toast("⚠️ Sign-in failed. Your system clock may be out of sync.")
        }
      }, 2000)
    }
  }

  setupEvents()

  // NOTE: We do NOT call resolveSession() here.
  // onAuthStateChange fires INITIAL_SESSION almost immediately on registration,
  // which sets the user and loads bookmarks. Calling resolveSession() here too
  // would cause two parallel loadBookmarks() calls that race each other.
  // The loadPromise deduplicator protects against races from the nav hook.
}

// ─── SPA nav hook (Quartz fires "nav" on every page transition) ───────────────
document.addEventListener("nav", async () => {
  STATE.giscusLogin = null

  if (STATE.bookmarks !== null) {
    // Bookmarks already loaded — just re-render for the new page context
    render()
  } else if (STATE.user !== null) {
    // User is known but bookmarks not yet loaded — load them (deduped)
    await loadBookmarks()
  } else {
    // Neither user nor bookmarks are known yet — full session resolution
    // (handles edge case where nav fires before INITIAL_SESSION fires)
    await resolveSession()
  }
})
