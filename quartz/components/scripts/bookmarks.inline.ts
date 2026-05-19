// @ts-ignore
import { createClient, SupabaseClient, User } from "@supabase/supabase-js"

interface Bookmark { url: string; title: string }

// ─── Singleton global state ───────────────────────────────────────────────────
let supabase: SupabaseClient | null = null
let currentUser: User | null = null
let cachedBookmarks: Bookmark[] | null = null
let isInitialized = false
let giscusUserLogin: string | null = null   // set when Giscus broadcasts viewer info
let syncTimeoutId: any = null


// ─── Utility ───────────────────────────────────────────────────────────────
/**
 * Remove any URL fragment (hash) that might remain after OAuth redirects or sign‑out.
 * This works for `#access_token=…` as well as a plain `#`.
 */
function cleanAuthHashFromUrl(): void {
  const hash = window.location.hash;
  // Remove only if the hash is empty ("#") or contains an OAuth token.
  if (!hash) return;
  if (hash === "#" || hash.includes("access_token=")) {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }
}

// ─── Profile UI ───────────────────────────────────────────────────────────────
function updateProfileUI() {
  const guestEls = document.querySelectorAll<HTMLElement>(".profile-guest")
  const loggedEls = document.querySelectorAll<HTMLElement>(".profile-logged-in")
  const hintEls = document.querySelectorAll<HTMLElement>(".giscus-connection-hint")
  const badges = document.querySelectorAll<HTMLElement>(".bm-toggle-badge")
  const hasGiscus = !!document.querySelector("iframe.giscus-frame, .giscus")

  if (currentUser) {
    guestEls.forEach(el => { el.style.display = "none" })
    loggedEls.forEach(el => {
      el.style.display = "flex"
      const nameEl = el.querySelector<HTMLElement>(".profile-name")
      const avatarEl = el.querySelector<HTMLImageElement>(".profile-avatar")
      const letterEl = el.querySelector<HTMLElement>(".profile-avatar-letter")
      
      if (nameEl) {
        nameEl.textContent = currentUser!.user_metadata?.full_name
          || currentUser!.user_metadata?.user_name
          || currentUser!.email?.split("@")[0]
          || "User"
      }
      
      if (currentUser!.user_metadata?.avatar_url) {
        if (avatarEl) {
          avatarEl.src = currentUser!.user_metadata.avatar_url
          avatarEl.style.display = "block"
        }
        if (letterEl) {
          letterEl.style.display = "none"
        }
      } else {
        if (avatarEl) {
          avatarEl.style.display = "none"
        }
        if (letterEl) {
          const char = (currentUser!.email || currentUser!.user_metadata?.full_name || "U").charAt(0).toUpperCase()
          letterEl.textContent = char
          letterEl.style.display = "flex"
        }
      }
    })
    // Show green badge dot on toggle button
    badges.forEach(b => { b.style.display = "block" })
    const showHint = hasGiscus && !giscusUserLogin
    hintEls.forEach(el => { el.style.display = showHint ? "block" : "none" })
  } else {
    guestEls.forEach(el => { el.style.display = "flex" })
    loggedEls.forEach(el => { el.style.display = "none" })
    badges.forEach(b => { b.style.display = "none" })
  }
}

// ─── Toast helper ─────────────────────────────────────────────────────────────
function showToast(msg: string) {
  document.querySelector(".giscus-no-comments-tip")?.remove()
  const tip = Object.assign(document.createElement("div"), {
    className: "giscus-no-comments-tip", textContent: msg
  })
  document.body.appendChild(tip)
  setTimeout(() => tip.remove(), 3000)
}

// ─── Local storage helpers ─────────────────────────────────────────────────────
function loadLocalBookmarks(): Bookmark[] {
  try {
    const p = JSON.parse(localStorage.getItem("study-bookmarks") || "[]")
    return Array.isArray(p) ? p : []
  } catch { return [] }
}
function saveLocalBookmarks(bms: Bookmark[]) {
  localStorage.setItem("study-bookmarks", JSON.stringify(bms))
}

// ─── Cloud helpers ─────────────────────────────────────────────────────────────
async function fetchCloud(): Promise<Bookmark[]> {
  if (!supabase || !currentUser) return []
  const { data, error } = await supabase
    .from("bookmarks").select("url,title").eq("user_id", currentUser.id)
  if (error) { console.error("Supabase fetch:", error); return [] }
  return Array.isArray(data) ? (data as Bookmark[]) : []
}

async function loadBookmarks(): Promise<Bookmark[]> {
  if (cachedBookmarks !== null) return cachedBookmarks
  cachedBookmarks = currentUser ? await fetchCloud() : loadLocalBookmarks()
  return cachedBookmarks
}

async function forceSyncCloud(bms: Bookmark[]) {
  if (!currentUser || !supabase) return
  syncTimeoutId = null
  const uid = currentUser.id
  try {
    // Single batch transaction: Delete previous entries and insert the current list
    await supabase.from("bookmarks").delete().eq("user_id", uid)
    if (bms.length > 0) {
      await supabase.from("bookmarks").insert(bms.map(b => ({ user_id: uid, ...b })))
    }
  } catch (err) {
    console.error("Supabase cloud sync failed:", err)
  }
}

async function persistBookmarks(bms: Bookmark[]) {
  cachedBookmarks = bms
  saveLocalBookmarks(bms) // Always keep local cache updated instantly (optimistic UI)
  
  if (currentUser && supabase) {
    // If another bookmark action happens within 2 seconds, cancel the previous sync request
    if (syncTimeoutId) {
      clearTimeout(syncTimeoutId)
    }
    
    // Batch all changes and sync once user stops bookmarking for 2 seconds
    syncTimeoutId = setTimeout(() => {
      forceSyncCloud(bms)
    }, 2000)
  }
}

async function addBookmark(bm: Bookmark) {
  const bms = await loadBookmarks()
  if (bms.some(b => b.url === bm.url)) return
  cachedBookmarks = [...bms, bm]
  renderBookmarksList(); updateTocButtons()
  persistBookmarks(cachedBookmarks)
}

async function removeBookmark(url: string) {
  const bms = await loadBookmarks()
  cachedBookmarks = bms.filter(b => b.url !== url)
  renderBookmarksList(); updateTocButtons()
  persistBookmarks(cachedBookmarks)
}

// ─── Migration ─────────────────────────────────────────────────────────────────
async function migrateLocalToCloud() {
  if (!currentUser || !supabase) return
  const local = loadLocalBookmarks()
  const cloud = await fetchCloud()
  const merged = [...cloud]
  local.forEach(lb => { if (!merged.some(c => c.url === lb.url)) merged.push(lb) })
  await persistBookmarks(merged)
  cachedBookmarks = null
}

// ─── REDESIGNED Bookmark List Renderer ────────────────────────────────────────
// Groups bookmarks by page, shows a search bar when > 4 items
async function updateMenus() {
  const bms = await loadBookmarks()
  document.querySelectorAll(".bookmarks-list-wrapper").forEach(wrapper => {
    renderBookmarksInto(wrapper as HTMLElement, bms)
  })
}

function renderBookmarksList() {
  if (cachedBookmarks === null) return
  document.querySelectorAll(".bookmarks-list-wrapper").forEach(wrapper => {
    renderBookmarksInto(wrapper as HTMLElement, cachedBookmarks!)
  })
}

function renderBookmarksInto(wrapper: HTMLElement, bms: Bookmark[]) {
  wrapper.innerHTML = ""

  if (!bms.length) {
    wrapper.innerHTML = `<p class="bm-empty">No bookmarks yet.<br><small>Click the 🔖 icon next to any heading in the table of contents.</small></p>`
    return
  }

  if (bms.length > 4) {
    const searchRow = document.createElement("div")
    searchRow.className = "bm-search-row"
    searchRow.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input class="bm-search" type="text" placeholder="Filter bookmarks…" autocomplete="off"/>
    `
    wrapper.appendChild(searchRow)
    const input = searchRow.querySelector("input")!
    input.addEventListener("input", () => renderGrouped(groupEl, bms, input.value.toLowerCase()))
  }

  // Grouped list
  const groupEl = document.createElement("div")
  groupEl.className = "bm-groups"
  wrapper.appendChild(groupEl)
  renderGrouped(groupEl, bms, "")
}

function renderGrouped(container: HTMLElement, bms: Bookmark[], filter: string) {
  container.innerHTML = ""

  // Parse title: "Page - Section" or just "Page"
  const parsed = bms
    .map(bm => {
      const dash = bm.title.indexOf(" - ")
      const page = dash > -1 ? bm.title.slice(0, dash) : bm.title
      const section = dash > -1 ? bm.title.slice(dash + 3) : ""
      return { ...bm, page, section }
    })
    .filter(b => !filter || b.page.toLowerCase().includes(filter) || b.section.toLowerCase().includes(filter))

  if (!parsed.length) {
    container.innerHTML = `<p class="bm-empty">No results for "<em>${filter}</em>"</p>`
    return
  }

  // Group by page
  const pages = new Map<string, typeof parsed>()
  parsed.forEach(b => {
    const arr = pages.get(b.page) || []
    arr.push(b); pages.set(b.page, arr)
  })

  pages.forEach((items, page) => {
    const group = document.createElement("div")
    group.className = "bm-group"

    const header = document.createElement("div")
    header.className = "bm-page-header"
    header.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      <span>${page}</span>
    `
    group.appendChild(header)

    items.forEach(b => {
      const row = document.createElement("div")
      row.className = "bm-item"
      row.innerHTML = `
        <a href="${b.url}" class="bm-link" title="${b.title}">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          <span>${b.section || b.page}</span>
        </a>
        <button class="remove-bookmark" data-url="${b.url}" title="Remove">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      `
      group.appendChild(row)
    })

    container.appendChild(group)
  })
}

function injectInlineBookmarkButtons() {
  const headings = document.querySelectorAll("article h1[id], article h2[id], article h3[id], article h4[id], article h5[id], article h6[id]")
  headings.forEach(heading => {
    // Prevent double injection
    if (heading.querySelector(".toc-bookmark-btn")) return
    // Exclude actual article title
    if (heading.classList.contains("article-title")) return

    const hash = `#${heading.id}`
    
    // Deep clone heading and remove sub-elements (like anchor tags or icons) to extract pure text
    const clone = heading.cloneNode(true) as HTMLElement
    clone.querySelectorAll(".toc-bookmark-btn, a, .anchor").forEach(el => el.remove())
    const title = clone.textContent?.replace(/🔖|#/g, "").trim() || "Section"

    const btn = document.createElement("button")
    btn.className = "toc-bookmark-btn inline-bookmark-btn"
    btn.setAttribute("data-hash", hash)
    btn.setAttribute("data-title", title)
    btn.setAttribute("aria-label", "Bookmark section")
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>`

    heading.appendChild(btn)
  })
}

async function updateTocButtons() {
  // Dynamically inject inline heading bookmark buttons so they can be styled & processed
  injectInlineBookmarkButtons()

  const bms = await loadBookmarks()
  const path = window.location.pathname
  document.querySelectorAll(".toc-bookmark-btn").forEach(btn => {
    const url = path + (btn.getAttribute("data-hash") || "")
    btn.classList.toggle("bookmarked", bms.some(b => b.url === url))
  })
}

// ─── GLOBAL INITIALIZATION (runs exactly once) ─────────────────────────────────
if (!isInitialized) {
  isInitialized = true

  const sbUrl = (window as any).SUPABASE_URL || ""
  const sbAnon = (window as any).SUPABASE_ANON_KEY || ""
  if (sbUrl && sbAnon) {
    try {
      supabase = createClient(sbUrl, sbAnon, {
        auth: { 
          detectSessionInUrl: true, 
          persistSession: true,
          autoRefreshToken: true
        }
      })
    } catch (e) { console.error("Supabase init failed:", e) }
  }

  if (supabase) {
    supabase.auth.onAuthStateChange(async (event, session) => {
      const prevId = currentUser?.id
      currentUser = session?.user || null
      if (prevId !== currentUser?.id) cachedBookmarks = null

      const hasHashToken = window.location.hash.includes("access_token=")
      const hasQueryCode = window.location.search.includes("code=")

      if (event === "SIGNED_IN" && (hasHashToken || hasQueryCode)) {
        // Session is now safely stored in localStorage. Do a clean reload so
        // the SPA starts fresh with a valid session (eliminates the ghost-login race).
        const url = new URL(window.location.href)
        url.searchParams.delete("code")
        url.hash = ""
        window.history.replaceState(null, "", url.pathname + url.search)
        window.location.reload()
        return
      }

      // For all other events (TOKEN_REFRESHED, SIGNED_OUT, etc.) update UI in-place and keep URL clean
      if (hasHashToken || hasQueryCode) {
        const url = new URL(window.location.href)
        url.searchParams.delete("code")
        url.hash = ""
        window.history.replaceState(null, "", url.pathname + url.search)
      }

      updateProfileUI()
      if (event === "SIGNED_IN" && !prevId && currentUser) await migrateLocalToCloud()
      await updateMenus()
      await updateTocButtons()
    })

    // Resilience for Clock Skew: If we see a token or code in the URL but no session yet,
    // wait 2 seconds (for the computer clock to catch up) and try to recover it.
    const hasHashToken = window.location.hash.includes("access_token=")
    const hasQueryCode = window.location.search.includes("code=")
    if (hasHashToken || hasQueryCode) {
      setTimeout(async () => {
        const { data: { session } } = await supabase!.auth.getSession()
        if (session && !currentUser) {
          const url = new URL(window.location.href)
          url.searchParams.delete("code")
          url.hash = ""
          window.history.replaceState(null, "", url.pathname + url.search)
          window.location.reload()
        } else if (!session) {
          showToast("⚠️ Login error: Your computer's clock might be out of sync. Local bookmarks couldn't be saved to the cloud.")
        }
      }, 2000)
    }
  }

  // Listen for Giscus metadata messages to detect if user is logged into Giscus
  window.addEventListener("message", (ev) => {
    if (ev.origin !== "https://giscus.app") return
    const data = ev.data?.giscus
    if (!data) return
    const login = data.viewer?.login || null
    if (login !== giscusUserLogin) {
      giscusUserLogin = login
      updateProfileUI()   // re-render hint visibility
    }
  })

  // Escape key → close all menus and restore aria-expanded
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".bookmarks-menu.show").forEach(m => m.classList.remove("show"))
      document.querySelectorAll(".bookmarks-toggle").forEach(b => b.setAttribute("aria-expanded", "false"))
    }
  })

  // Single global click delegation
  document.addEventListener("click", async (e) => {
    const t = e.target as HTMLElement

    // Login
    const loginBtn = t.closest<HTMLElement>(".login-btn")
    if (loginBtn) {
      e.preventDefault(); e.stopPropagation()
      if (!supabase) return void showToast("⚠️ Database not connected.")
      const orig = loginBtn.innerHTML
      loginBtn.textContent = "Redirecting to GitHub…"
      // Strip the hash so Supabase can append #access_token cleanly.
      const redirectTo = window.location.origin + window.location.pathname + window.location.search
      supabase.auth.signInWithOAuth({
        provider: "github", options: { redirectTo }
      }).catch(() => { loginBtn.innerHTML = orig })
      return
    }

    // Email Passwordless Login (Magic Link)
    const emailBtn = t.closest<HTMLElement>(".email-login-btn")
    if (emailBtn) {
      e.preventDefault(); e.stopPropagation()
      if (!supabase) return void showToast("⚠️ Database not connected.")
      
      const emailInput = emailBtn.parentElement?.querySelector<HTMLInputElement>(".email-login-input")
      if (!emailInput) return

      const email = emailInput.value.trim().toLowerCase()
      
      // Basic syntax validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!email || !emailRegex.test(email)) {
        showToast("⚠️ Please enter a valid email address.")
        return
      }

      // Curated disposable/temporary email provider blacklist
      const tempMailDomains = new Set([
        "10minutemail.com", "temp-mail.org", "tempmail.com", "mailinator.com",
        "yopmail.com", "dispostable.com", "guerrillamail.com", "sharklasers.com",
        "guerrillamailblock.com", "guerrillamail.net", "guerrillamail.org",
        "guerrillamail.biz", "grr.la", "pokemail.net", "trashmail.com",
        "getairmail.com", "maildrop.cc", "mintemail.com", "mailnesia.com",
        "mailcatch.com", "tempail.com", "disposable.com", "throwawaymail.com",
        "temp-mail.ru", "temp-mail.io", "moakt.com", "generator.email",
        "tmail.com", "fakeinbox.com", "incognitomail.com", "safetymail.info",
        "disposablemail.com", "getnada.com", "dropmail.me", "tempmailaddress.com"
      ])

      const domain = email.split("@").pop() || ""
      if (tempMailDomains.has(domain)) {
        showToast("⚠️ Temporary/disposable emails are not allowed!")
        return
      }

      const orig = emailBtn.innerHTML
      emailBtn.textContent = "Sending Magic Link…"
      emailBtn.style.pointerEvents = "none"
      emailBtn.style.opacity = "0.7"

      const redirectTo = window.location.origin + window.location.pathname + window.location.search
      
      try {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: redirectTo
          }
        })

        if (error) {
          console.error("Magic link request failed:", error)
          showToast("❌ error: " + error.message)
        } else {
          showToast("📧 Magic link sent! Check your inbox.")
          emailInput.value = ""
        }
      } catch (err) {
        console.error("OTP Sign-In Error:", err)
        showToast("❌ Failed to request magic link.")
      } finally {
        emailBtn.innerHTML = orig
        emailBtn.style.pointerEvents = "auto"
        emailBtn.style.opacity = "1"
      }
      return
    }

    // Logout
    const logoutBtn = t.closest<HTMLElement>(".logout-btn")
    if (logoutBtn) {
      e.preventDefault(); e.stopPropagation()
      if (!supabase) return
      logoutBtn.textContent = "Signing out…"
      
      if (syncTimeoutId) {
        clearTimeout(syncTimeoutId)
        syncTimeoutId = null
      }

      Object.keys(localStorage).forEach(k => {
        if (k.startsWith("sb-") && k.endsWith("-auth-token")) localStorage.removeItem(k)
      })

      Promise.race([
        supabase.auth.signOut(),
        new Promise(r => setTimeout(r, 1000))
      ]).finally(() => {
        currentUser = null; cachedBookmarks = null;
        cleanAuthHashFromUrl();
        window.location.replace(window.location.pathname + window.location.search);
      })
      return
    }

    // Delete account & all data
    const deleteBtn = t.closest<HTMLElement>(".delete-account-btn")
    if (deleteBtn) {
      e.preventDefault(); e.stopPropagation()
      if (!supabase || !currentUser) return

      const confirmed = window.confirm(
        "Are you sure you want to delete all your bookmarks and sign out?\n\n" +
        "This will permanently remove all your saved bookmarks from our database. " +
        "This action cannot be undone."
      )
      if (!confirmed) return

      deleteBtn.textContent = "Deleting…"
      const uid = currentUser.id

      if (syncTimeoutId) {
        clearTimeout(syncTimeoutId)
        syncTimeoutId = null
      }

      try {
        // Delete all bookmarks from cloud
        await supabase.from("bookmarks").delete().eq("user_id", uid)
        // Clear local storage bookmarks cache
        localStorage.removeItem("study-bookmarks")
        // Clear auth tokens
        Object.keys(localStorage).forEach(k => {
          if (k.startsWith("sb-") && k.endsWith("-auth-token")) localStorage.removeItem(k)
        })
        cachedBookmarks = []
        // Sign out
        await Promise.race([
          supabase.auth.signOut(),
          new Promise(r => setTimeout(r, 1000))
        ])
      } catch (err) {
        console.error("Delete failed:", err)
      } finally {
        currentUser = null; cachedBookmarks = null;
        cleanAuthHashFromUrl();
        window.location.replace(window.location.pathname + window.location.search);
      }
      return
    }

    // Remove bookmark
    const rmBtn = t.closest<HTMLElement>(".remove-bookmark")
    if (rmBtn) {
      e.preventDefault(); e.stopPropagation()
      const url = rmBtn.dataset.url || ""
      if (url) removeBookmark(url)
      return
    }

    // TOC bookmark toggle
    const tocBtn = t.closest<HTMLElement>(".toc-bookmark-btn")
    if (tocBtn) {
      e.preventDefault(); e.stopPropagation()
      const hash = tocBtn.getAttribute("data-hash") || ""
      const title = tocBtn.getAttribute("data-title") || "Section"
      const url = window.location.pathname + hash
      const label = `${document.title.split(" - ")[0]} - ${title}`
      loadBookmarks().then(bms =>
        bms.some(b => b.url === url) ? removeBookmark(url) : addBookmark({ url, title: label })
      )
      return
    }

    // Connect to Giscus
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
        document.querySelectorAll(".bookmarks-menu").forEach(m => m.classList.remove("show"))
      } else {
        showToast("💬 This page doesn't have a comments section.")
      }
      return
    }

    // Click on any feature requiring funding -> open donation modal
    const fundingFeatureItem = t.closest<HTMLElement>("[data-requires-funding='true']")
    if (fundingFeatureItem) {
      e.preventDefault(); e.stopPropagation()
      // Close the bookmarks menu
      document.querySelectorAll(".bookmarks-menu").forEach(m => m.classList.remove("show"))
      document.querySelectorAll(".bookmarks-toggle").forEach(b => b.setAttribute("aria-expanded", "false"))
      
      // Open the donation hub modal
      const donationModal = document.querySelector<HTMLElement>("#donation-hub-modal")
      if (donationModal) {
        donationModal.classList.add("show")
        document.body.classList.add("modal-open")
      }
      return
    }

    // Toggle bookmarks menu
    const toggleBtn = t.closest<HTMLElement>(".bookmarks-toggle")
    const menus = document.querySelectorAll(".bookmarks-menu")
    if (toggleBtn) {
      e.stopPropagation()
      const allToggles = Array.from(document.querySelectorAll(".bookmarks-toggle"))
      const idx = allToggles.indexOf(toggleBtn)
      menus.forEach((m, i) => {
        const isOpen = i === idx && !m.classList.contains("show")
        m.classList.toggle("show", isOpen)
        // Sync aria-expanded on the matching toggle button
        const btn = allToggles[i] as HTMLElement
        if (btn) btn.setAttribute("aria-expanded", isOpen ? "true" : "false")
      })
      return
    }

    // Click-outside → close menus
    menus.forEach(m => {
      if (m.classList.contains("show") && !m.contains(t)) {
        m.classList.remove("show")
        document.querySelectorAll(".bookmarks-toggle").forEach(b => b.setAttribute("aria-expanded", "false"))
      }
    })
  })
}

// ─── SPA nav hook ─────────────────────────────────────────────────────────────
document.addEventListener("nav", async () => {
  // Only fetch the session if we don't already know who the user is.
  // This prevents a race where getSession() returns null before onAuthStateChange
  // has had time to store the session (ghost-login bug).
  if (supabase && !currentUser) {
    const { data: { session } } = await supabase.auth.getSession()
    const freshUser = session?.user || null
    if (freshUser) {
      currentUser = freshUser
      cachedBookmarks = null
    }
  }
  // Reset Giscus login state per-page (new page may not have giscus)
  giscusUserLogin = null
  updateProfileUI()
  await updateMenus()
  await updateTocButtons()
})
