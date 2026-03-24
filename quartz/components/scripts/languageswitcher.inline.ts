type LangStrings = Record<string, string>
type LangMap = Record<string, LangStrings>

// Maps translation keys to DOM selectors that contain the UI label text
const SELECTOR_MAP: Record<string, string> = {
  explorer: ".explorer > .fold-button > .title-text, .explorer > button > .title-text, #explorer-title, .explorer-title",
  search: "#search-button > p, .search-button > p",
  tableOfContents: "#toc-content > .toc-title, .toc-title",
  backlinks: ".backlinks > h3, .backlinks > .backlinks-title",
  graph: ".graph > h3, .graph-title",
  recentNotes: ".recent-notes > h3",
  createdWith: "footer p",
}

const PLACEHOLDER_MAP: Record<string, string> = {
  searchBarPlaceholder: "#search-bar, input[type='text'].search-bar",
}

document.addEventListener("nav", () => {
  const savedLang = localStorage.getItem("locale") ?? "hi-IN"
  applyLanguage(savedLang)

  for (const btn of document.querySelectorAll<HTMLButtonElement>(".lang-option")) {
    const handler = () => {
      const lang = btn.dataset.lang!
      localStorage.setItem("locale", lang)
      applyLanguage(lang)
      document.querySelectorAll(".lang-option").forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")
    }
    btn.addEventListener("click", handler)
    window.addCleanup(() => btn.removeEventListener("click", handler))

    if (btn.dataset.lang === savedLang) btn.classList.add("active")
  }
})

function applyLanguage(lang: string) {
  const raw = document.documentElement.dataset.translations
  if (!raw) return

  let all: LangMap
  try {
    all = JSON.parse(raw)
  } catch {
    return
  }

  const strings: LangStrings = all[lang] ?? all["en-US"]
  if (!strings) return

  document.documentElement.lang = lang

  // Swap text via selector map
  for (const [key, selector] of Object.entries(SELECTOR_MAP)) {
    if (!strings[key]) continue
    for (const sel of selector.split(",")) {
      const el = document.querySelector<HTMLElement>(sel.trim())
      if (el) {
        el.textContent = strings[key]
        break
      }
    }
  }

  // Swap placeholders
  for (const [key, selector] of Object.entries(PLACEHOLDER_MAP)) {
    if (!strings[key]) continue
    for (const sel of selector.split(",")) {
      const el = document.querySelector<HTMLInputElement>(sel.trim())
      if (el) {
        el.placeholder = strings[key]
        break
      }
    }
  }

  // Also handle any explicit data-i18n elements
  for (const el of document.querySelectorAll<HTMLElement>("[data-i18n]")) {
    const key = el.dataset.i18n!
    if (strings[key]) el.textContent = strings[key]
  }
}
