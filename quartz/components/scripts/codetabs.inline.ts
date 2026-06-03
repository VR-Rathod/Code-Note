function switchTab(container: Element, activeIdx: number) {
  const buttons = container.querySelectorAll(".code-tab-button")
  const activeBtn = buttons[activeIdx] as HTMLElement | undefined

  const indicator = container.querySelector(".code-tabs-nav-indicator") as HTMLElement | null
  const isAlreadyActive = activeBtn && activeBtn.classList.contains("active")

  if (isAlreadyActive && indicator && indicator.style.width) {
    return
  }

  // Panels live inside the .code-tabs-panel wrapper box
  const panelWrapper = container.querySelector(".code-tabs-panel")
  const panels = panelWrapper
    ? panelWrapper.querySelectorAll(
        ":scope > figure[data-rehype-pretty-code-figure], :scope > pre",
      )
    : container.querySelectorAll(
        ":scope > figure[data-rehype-pretty-code-figure], :scope > pre",
      )

  buttons.forEach((btn, idx) => {
    if (idx === activeIdx) {
      btn.classList.add("active")
      btn.setAttribute("aria-selected", "true")
    } else {
      btn.classList.remove("active")
      btn.setAttribute("aria-selected", "false")
    }
  })

  if (indicator && activeBtn) {
    const isFirstTime = !indicator.style.width
    if (isFirstTime) {
      indicator.style.transition = "none"
    }
    indicator.style.width = `${activeBtn.offsetWidth}px`
    indicator.style.transform = `translateX(${activeBtn.offsetLeft}px)`
    if (isFirstTime) {
      indicator.offsetHeight // force repaint/reflow
      indicator.style.transition = ""
    }
  }

  panels.forEach((panel, idx) => {
    if (idx === activeIdx) {
      panel.setAttribute("style", "display: block !important;")
    } else {
      panel.setAttribute("style", "display: none !important;")
    }
  })
}

function syncTabsByTitle(title: string) {
  localStorage.setItem("preferred-code-tab", title)

  const allContainers = document.querySelectorAll(".code-tabs")
  allContainers.forEach((container) => {
    const buttons = container.querySelectorAll(".code-tab-button")
    buttons.forEach((btn, idx) => {
      if (btn.getAttribute("data-tab-title") === title) {
        switchTab(container, idx)
      }
    })
  })
}

function getDirectTextContent(el: Element): string {
  let text = ""
  for (let i = 0; i < el.childNodes.length; i++) {
    const node = el.childNodes[i]
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const child = node as Element
      if (child.tagName !== "UL" && child.tagName !== "OL") {
        text += getDirectTextContent(child)
      }
    }
  }
  return text
}

function stripTabsMarker(el: Node) {
  if (el.nodeType === Node.TEXT_NODE) {
    if (el.textContent && el.textContent.includes("[tabs]")) {
      el.textContent = el.textContent.replace("[tabs]", "")
    }
  } else if (el.nodeType === Node.ELEMENT_NODE) {
    const element = el as Element
    if (element.tagName !== "UL" && element.tagName !== "OL") {
      for (let i = 0; i < element.childNodes.length; i++) {
        stripTabsMarker(element.childNodes[i])
      }
    }
  }
}

function setupCodeTabs() {
  const preferredTab = localStorage.getItem("preferred-code-tab")

  // Helper: Find Lowest Common Ancestor (LCA)
  function findLCA(nodeA: Node, nodeB: Node): Node | null {
    const ancestorsA: Node[] = []
    let currA: Node | null = nodeA
    while (currA) {
      ancestorsA.push(currA)
      currA = currA.parentNode
    }
    let currB: Node | null = nodeB
    while (currB) {
      const idx = ancestorsA.indexOf(currB)
      if (idx !== -1) return currB
      currB = currB.parentNode
    }
    return null
  }

  // Helper: Find child of parent that is ancestor of descendant
  function getChildAncestor(parent: Node, descendant: Node): Node | null {
    let curr: Node | null = descendant
    while (curr && curr.parentNode !== parent) {
      curr = curr.parentNode
    }
    return curr
  }

  // 1. Process explicit :::code-tabs span markers
  const starts = Array.from(document.querySelectorAll("span[data-code-tabs-start]"))
  const ends = Array.from(document.querySelectorAll("span[data-code-tabs-end]"))

  starts.forEach((startComment) => {
    // Find matching end comment that is AFTER startComment in document order
    const endComment = ends.find(
      (end) => startComment.compareDocumentPosition(end) & Node.DOCUMENT_POSITION_FOLLOWING,
    )
    if (!endComment) return

    const lca = findLCA(startComment, endComment)
    if (!lca) return

    const startBlock = getChildAncestor(lca, startComment)
    const endBlock = getChildAncestor(lca, endComment)
    if (!startBlock || !endBlock) return

    const collectedNodes: Node[] = []
    let curr: Node | null = startBlock
    while (curr) {
      collectedNodes.push(curr)
      if (curr === endBlock) break
      curr = curr.nextSibling
    }

    const panels: Element[] = []
    collectedNodes.forEach((n) => {
      if (n.nodeType === Node.ELEMENT_NODE) {
        const el = n as Element
        if (el.matches("figure[data-rehype-pretty-code-figure], pre")) {
          panels.push(el)
        } else {
          el.querySelectorAll("figure[data-rehype-pretty-code-figure], pre").forEach((p) => {
            if (!p.parentElement?.closest("figure[data-rehype-pretty-code-figure], pre")) {
              panels.push(p)
            }
          })
        }
      }
    })

    if (panels.length === 0) return

    const container = document.createElement("div")
    container.className = "code-tabs"
    const nav = document.createElement("div")
    nav.className = "code-tabs-nav"
    nav.setAttribute("role", "tablist")
    
    const indicator = document.createElement("div")
    indicator.className = "code-tabs-nav-indicator"
    nav.appendChild(indicator)

    container.appendChild(nav)

    // Separate panel wrapper box (the code area card)
    const panelWrapper = document.createElement("div")
    panelWrapper.className = "code-tabs-panel"

    let activeIndex = 0
    panels.forEach((panel, idx) => {
      let tabTitle = "Code"
      const figure = panel.matches("figure[data-rehype-pretty-code-figure]") ? panel : null

      if (figure) {
        const figcaption = figure.querySelector("figcaption[data-rehype-pretty-code-title]")
        if (figcaption) {
          tabTitle = figcaption.textContent || "Code"
          figcaption.setAttribute("style", "display: none !important;")
        }
      }

      if (tabTitle === "Code") {
        const code = panel.querySelector("code")
        if (code) {
          const lang = code.getAttribute("data-language") || code.getAttribute("class") || ""
          const normalizedLang = lang.toString().replace(/language-/, "")
          tabTitle = normalizedLang
            ? normalizedLang.charAt(0).toUpperCase() + normalizedLang.slice(1)
            : `Tab ${idx + 1}`
        } else {
          tabTitle = `Tab ${idx + 1}`
        }
      }

      if (preferredTab && tabTitle.toLowerCase() === preferredTab.toLowerCase()) {
        activeIndex = idx
      }

      const button = document.createElement("button")
      button.className = "code-tab-button"
      button.type = "button"
      button.role = "tab"
      button.textContent = tabTitle
      button.setAttribute("data-tab-index", idx.toString())
      button.setAttribute("data-tab-title", tabTitle)

      const clickHandler = () => {
        switchTab(container, idx)
        syncTabsByTitle(tabTitle)
      }
      button.addEventListener("click", clickHandler)
      window.addCleanup(() => button.removeEventListener("click", clickHandler))

      nav.appendChild(button)
      panelWrapper.appendChild(panel)
    })

    container.appendChild(panelWrapper)

    lca.insertBefore(container, startBlock)
    collectedNodes.forEach((n) => {
      if (n.parentNode === lca) {
        lca.removeChild(n)
      }
    })

    switchTab(container, activeIndex)
  })

  // 2. Process headings (h1..h6) with [tabs] marker
  const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
  headings.forEach((heading) => {
    const directText = getDirectTextContent(heading)
    if (!directText.includes("[tabs]")) return

    const collectedNodes: Element[] = []
    let next = heading.nextElementSibling
    while (next) {
      const tag = next.tagName
      if (
        tag === "UL" ||
        tag === "OL" ||
        next.matches("figure[data-rehype-pretty-code-figure], pre")
      ) {
        collectedNodes.push(next)
        next = next.nextElementSibling
      } else {
        break
      }
    }

    if (collectedNodes.length === 0) return

    // Find tab items (LI)
    const allLIs: Element[] = []
    collectedNodes.forEach((n) => {
      if (n.tagName === "UL" || n.tagName === "OL") {
        n.querySelectorAll("li").forEach((li) => {
          if (!li.closest("figure[data-rehype-pretty-code-figure], pre")) {
            allLIs.push(li)
          }
        })
      }
    })

    // Find panels
    const panels: Element[] = []
    collectedNodes.forEach((n) => {
      if (n.matches("figure[data-rehype-pretty-code-figure], pre")) {
        panels.push(n)
      } else {
        n.querySelectorAll("figure[data-rehype-pretty-code-figure], pre").forEach((p) => {
          if (!p.parentElement?.closest("figure[data-rehype-pretty-code-figure], pre")) {
            panels.push(p)
          }
        })
      }
    })

    const count = Math.min(allLIs.length, panels.length)
    if (count === 0) return

    const container = document.createElement("div")
    container.className = "code-tabs"
    const nav = document.createElement("div")
    nav.className = "code-tabs-nav"
    nav.setAttribute("role", "tablist")
    
    const indicator = document.createElement("div")
    indicator.className = "code-tabs-nav-indicator"
    nav.appendChild(indicator)

    container.appendChild(nav)

    // Separate panel wrapper box (the code area card)
    const panelWrapper = document.createElement("div")
    panelWrapper.className = "code-tabs-panel"

    let activeIndex = 0
    for (let idx = 0; idx < count; idx++) {
      const tabLi = allLIs[idx]
      const panel = panels[idx]

      let tabTitle = ""
      for (let i = 0; i < tabLi.childNodes.length; i++) {
        const node = tabLi.childNodes[i]
        if (node.nodeType === Node.TEXT_NODE) {
          tabTitle += node.textContent
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const tagName = (node as Element).tagName
          if (
            tagName !== "UL" &&
            tagName !== "OL" &&
            tagName !== "FIGURE" &&
            tagName !== "PRE" &&
            tagName !== "CODE" &&
            tagName !== "FIGCAPTION"
          ) {
            tabTitle += (node as Element).textContent
          }
        }
      }
      tabTitle = tabTitle.trim()
      if (!tabTitle) tabTitle = `Tab ${idx + 1}`

      const figcaption = panel.matches("figure[data-rehype-pretty-code-figure]")
        ? panel.querySelector("figcaption[data-rehype-pretty-code-title]")
        : null
      if (figcaption) {
        figcaption.setAttribute("style", "display: none !important;")
      }

      if (preferredTab && tabTitle.toLowerCase() === preferredTab.toLowerCase()) {
        activeIndex = idx
      }

      const button = document.createElement("button")
      button.className = "code-tab-button"
      button.type = "button"
      button.role = "tab"
      button.textContent = tabTitle
      button.setAttribute("data-tab-index", idx.toString())
      button.setAttribute("data-tab-title", tabTitle)

      const clickHandler = () => {
        switchTab(container, idx)
        syncTabsByTitle(tabTitle)
      }
      button.addEventListener("click", clickHandler)
      window.addCleanup(() => button.removeEventListener("click", clickHandler))
      nav.appendChild(button)

      panelWrapper.appendChild(panel)
    }

    container.appendChild(panelWrapper)

    stripTabsMarker(heading)

    const parent = heading.parentNode
    if (parent) {
      parent.insertBefore(container, collectedNodes[0])
      collectedNodes.forEach((n) => {
        if (n.parentNode === parent) {
          parent.removeChild(n)
        }
      })
    }

    switchTab(container, activeIndex)
  })

  // 3. Process Logseq outline lists with [tabs] marker
  const listItems = document.querySelectorAll("li")
  listItems.forEach((li) => {
    const directText = getDirectTextContent(li)
    if (!directText.includes("[tabs]")) return

    // Find tab items (LI) under this block
    const allLIs: Element[] = []
    li.querySelectorAll("li").forEach((subLi) => {
      if (!subLi.closest("figure[data-rehype-pretty-code-figure], pre")) {
        allLIs.push(subLi)
      }
    })

    // Find panels under this block
    const panels: Element[] = []
    li.querySelectorAll("figure[data-rehype-pretty-code-figure], pre").forEach((p) => {
      if (!p.parentElement?.closest("figure[data-rehype-pretty-code-figure], pre")) {
        panels.push(p)
      }
    })

    const count = Math.min(allLIs.length, panels.length)
    if (count === 0) return

    const container = document.createElement("div")
    container.className = "code-tabs"
    const nav = document.createElement("div")
    nav.className = "code-tabs-nav"
    nav.setAttribute("role", "tablist")
    
    const indicator = document.createElement("div")
    indicator.className = "code-tabs-nav-indicator"
    nav.appendChild(indicator)

    container.appendChild(nav)

    // Separate panel wrapper box (the code area card)
    const panelWrapper = document.createElement("div")
    panelWrapper.className = "code-tabs-panel"

    let activeIndex = 0
    for (let idx = 0; idx < count; idx++) {
      const tabLi = allLIs[idx]
      const panel = panels[idx]

      let tabTitle = ""
      for (let i = 0; i < tabLi.childNodes.length; i++) {
        const node = tabLi.childNodes[i]
        if (node.nodeType === Node.TEXT_NODE) {
          tabTitle += node.textContent
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const tagName = (node as Element).tagName
          if (
            tagName !== "UL" &&
            tagName !== "OL" &&
            tagName !== "FIGURE" &&
            tagName !== "PRE" &&
            tagName !== "CODE" &&
            tagName !== "FIGCAPTION"
          ) {
            tabTitle += (node as Element).textContent
          }
        }
      }
      tabTitle = tabTitle.trim()
      if (!tabTitle) tabTitle = `Tab ${idx + 1}`

      const figcaption = panel.matches("figure[data-rehype-pretty-code-figure]")
        ? panel.querySelector("figcaption[data-rehype-pretty-code-title]")
        : null
      if (figcaption) {
        figcaption.setAttribute("style", "display: none !important;")
      }

      if (preferredTab && tabTitle.toLowerCase() === preferredTab.toLowerCase()) {
        activeIndex = idx
      }

      const button = document.createElement("button")
      button.className = "code-tab-button"
      button.type = "button"
      button.role = "tab"
      button.textContent = tabTitle
      button.setAttribute("data-tab-index", idx.toString())
      button.setAttribute("data-tab-title", tabTitle)

      const clickHandler = () => {
        switchTab(container, idx)
        syncTabsByTitle(tabTitle)
      }
      button.addEventListener("click", clickHandler)
      window.addCleanup(() => button.removeEventListener("click", clickHandler))
      nav.appendChild(button)

      panelWrapper.appendChild(panel)
    }

    container.appendChild(panelWrapper)

    stripTabsMarker(li)

    // Remove the sublists that contained the tab titles
    const directLists = li.querySelectorAll(":scope > ul, :scope > ol")
    directLists.forEach((list) => {
      list.parentNode?.removeChild(list)
    })

    const cleanedText = getDirectTextContent(li).trim().replace(/^-\s*/, "")
    if (cleanedText === "") {
      li.parentNode?.replaceChild(container, li)
    } else {
      li.appendChild(container)
    }

    switchTab(container, activeIndex)
  })

  // 4. Automatically wrap all remaining code blocks (not already inside a .code-tabs container)
  const allFiguresAndPres = Array.from(document.querySelectorAll("figure[data-rehype-pretty-code-figure], pre"))
  allFiguresAndPres.forEach((el) => {
    // If it's a pre inside a figure, ignore it (we'll process the parent figure instead)
    if (el.tagName === "PRE" && el.parentElement?.closest("figure[data-rehype-pretty-code-figure]")) {
      return
    }
    // If it's already inside a .code-tabs container, ignore it
    if (el.closest(".code-tabs")) {
      return
    }
    // Ignore if it's a mermaid block
    if (el.querySelector("code.mermaid") || el.classList.contains("mermaid") || el.matches("pre:has(> code.mermaid)")) {
      return
    }

    // Ignore if it has no syntax highlighting language (plain text blocks)
    const code = el.querySelector("code")
    let hasLanguage = false
    if (code) {
      const lang = code.getAttribute("data-language") || code.getAttribute("class") || ""
      const normalizedLang = lang.toString().replace(/language-/, "").trim().toLowerCase()
      if (normalizedLang && normalizedLang !== "text" && normalizedLang !== "txt" && normalizedLang !== "plaintext") {
        hasLanguage = true
      }
    }
    if (!hasLanguage) {
      return
    }

    const container = document.createElement("div")
    container.className = "code-tabs"
    const nav = document.createElement("div")
    nav.className = "code-tabs-nav"
    nav.setAttribute("role", "tablist")
    
    const indicator = document.createElement("div")
    indicator.className = "code-tabs-nav-indicator"
    nav.appendChild(indicator)

    container.appendChild(nav)

    const panelWrapper = document.createElement("div")
    panelWrapper.className = "code-tabs-panel"

    let tabTitle = "Code"
    const figure = el.matches("figure[data-rehype-pretty-code-figure]") ? el : null

    if (figure) {
      const figcaption = figure.querySelector("figcaption[data-rehype-pretty-code-title]")
      if (figcaption) {
        tabTitle = figcaption.textContent || "Code"
        figcaption.setAttribute("style", "display: none !important;")
      }
    }

    if (tabTitle === "Code") {
      const code = el.querySelector("code")
      if (code) {
        const lang = code.getAttribute("data-language") || code.getAttribute("class") || ""
        const normalizedLang = lang.toString().replace(/language-/, "")
        tabTitle = normalizedLang
          ? normalizedLang.charAt(0).toUpperCase() + normalizedLang.slice(1)
          : "Code"
      }
    }

    const button = document.createElement("button")
    button.className = "code-tab-button"
    button.type = "button"
    button.role = "tab"
    button.textContent = tabTitle
    button.setAttribute("data-tab-index", "0")
    button.setAttribute("data-tab-title", tabTitle)

    const clickHandler = () => {
      switchTab(container, 0)
    }
    button.addEventListener("click", clickHandler)
    window.addCleanup(() => button.removeEventListener("click", clickHandler))

    nav.appendChild(button)

    const parent = el.parentNode
    if (parent) {
      parent.insertBefore(container, el)
      panelWrapper.appendChild(el)
      container.appendChild(panelWrapper)
    }

    switchTab(container, 0)
  })

  // Reposition all indicators after layout has computed
  requestAnimationFrame(() => {
    repositionIndicators()
  })
}

function repositionIndicators() {
  const allContainers = document.querySelectorAll(".code-tabs")
  allContainers.forEach((container) => {
    const activeBtn = container.querySelector(".code-tab-button.active") as HTMLElement | null
    const indicator = container.querySelector(".code-tabs-nav-indicator") as HTMLElement | null
    if (indicator && activeBtn) {
      indicator.style.transition = "none"
      indicator.style.width = `${activeBtn.offsetWidth}px`
      indicator.style.transform = `translateX(${activeBtn.offsetLeft}px)`
      indicator.offsetHeight // force repaint
      indicator.style.transition = ""
    }
  })
}

window.addEventListener("resize", repositionIndicators)
if (document.fonts) {
  document.fonts.ready.then(repositionIndicators)
}

document.addEventListener("DOMContentLoaded", setupCodeTabs)
if (document.readyState !== "loading") {
  setupCodeTabs()
}
document.addEventListener("nav", setupCodeTabs)
