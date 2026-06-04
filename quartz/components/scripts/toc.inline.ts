// ── TOC: single active item + proximity fade ──────────────────────────────────

function getAllTocLinks(): HTMLAnchorElement[] {
  return Array.from(document.querySelectorAll<HTMLAnchorElement>("ul.toc-content a[data-for]"))
}

function applyProximity(activeIdx: number, links: HTMLAnchorElement[]) {
  links.forEach((link, idx) => {
    link.classList.remove("toc-active", "toc-near", "toc-far", "toc-hidden")
    const dist = Math.abs(idx - activeIdx)
    if (dist === 0) {
      link.classList.add("toc-active")

      // Auto-scroll TOC container to center the active item
      const tocContainer = link.closest("ul.toc-content")
      if (tocContainer) {
        const activeContainer = link.closest(".toc-item-container") || link
        const activeRect = activeContainer.getBoundingClientRect()
        const containerRect = tocContainer.getBoundingClientRect()

        if (tocContainer.scrollHeight > tocContainer.clientHeight) {
          const relativeTop = activeRect.top - containerRect.top + tocContainer.scrollTop
          const targetScrollTop = relativeTop - containerRect.height / 2 + activeRect.height / 2
          
          tocContainer.scrollTo({
            top: targetScrollTop,
            behavior: "smooth"
          })
        }
      }
    }
    else if (dist === 1) link.classList.add("toc-near")
    else if (dist === 2) link.classList.add("toc-far")
    else link.classList.add("toc-hidden")
  })
}

// Track the single heading closest to the top of the viewport
let activeSlug = ""

const observer = new IntersectionObserver(
  () => {
    // Find which heading is closest to top of viewport (just above or at top)
    const headers = Array.from(
      document.querySelectorAll<HTMLElement>("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]"),
    )

    let best: HTMLElement | null = null
    let bestDist = Infinity

    for (const h of headers) {
      const rect = h.getBoundingClientRect()
      // We want the heading that is at or just above the viewport center-ish
      // Use top of viewport + small offset as the "reading line"
      const dist = Math.abs(rect.top - 80)
      if (rect.top <= 120 && dist < bestDist) {
        bestDist = dist
        best = h
      }
    }

    // fallback: if nothing is above viewport, use first heading
    if (!best && headers.length > 0) best = headers[0]

    const slug = best?.id ?? ""
    if (slug === activeSlug) return
    activeSlug = slug

    const links = getAllTocLinks()
    const activeIdx = links.findIndex((a) => a.getAttribute("data-for") === slug)
    if (activeIdx !== -1) applyProximity(activeIdx, links)
  },
  {
    threshold: [0, 0.1, 1],
    rootMargin: "0px 0px -60% 0px",
  },
)

// ── smooth collapse/expand ────────────────────────────────────────────────────
function toggleToc(this: HTMLElement) {
  this.classList.toggle("collapsed")
  this.setAttribute(
    "aria-expanded",
    this.getAttribute("aria-expanded") === "true" ? "false" : "true",
  )
  const content = this.nextElementSibling as HTMLElement | null
  if (!content) return

  const isCollapsing = this.classList.contains("collapsed")

  if (isCollapsing) {
    content.style.height = content.scrollHeight + "px"
    content.style.overflow = "hidden"
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        content.style.transition = "height 0.3s ease, opacity 0.25s ease"
        content.style.height = "0"
        content.style.opacity = "0"
      })
    })
    content.addEventListener(
      "transitionend",
      () => {
        content.classList.add("collapsed")
        content.style.cssText = ""
      },
      { once: true },
    )
  } else {
    content.classList.remove("collapsed")
    content.style.height = "0"
    content.style.opacity = "0"
    content.style.overflow = "hidden"
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        content.style.transition = "height 0.3s ease, opacity 0.25s ease"
        content.style.height = content.scrollHeight + "px"
        content.style.opacity = "1"
      })
    })
    content.addEventListener(
      "transitionend",
      () => {
        content.style.cssText = ""
      },
      { once: true },
    )
  }
}

function setupToc() {
  for (const toc of document.getElementsByClassName("toc")) {
    const button = toc.querySelector(".toc-header")
    if (!button) return
    button.addEventListener("click", toggleToc)
    window.addCleanup(() => button.removeEventListener("click", toggleToc))
  }
}

document.addEventListener("nav", () => {
  setupToc()
  activeSlug = ""
  observer.disconnect()
  const headers = document.querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]")
  headers.forEach((h) => observer.observe(h))

  // init on load — highlight first visible heading
  const links = getAllTocLinks()
  if (links.length > 0) applyProximity(0, links)
})
