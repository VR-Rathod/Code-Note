// import { FileTrieNode } from "../../util/fileTrie"
import { FullSlug, resolveRelative } from "../../util/path"
import { ContentDetails } from "../../plugins/emitters/contentIndex"

type MaybeHTMLElement = HTMLElement | undefined

interface NamespaceNode {
  name: string
  fullName: string
  slug: string
  children: NamespaceNode[]
}

function escapeHTML(str: string): string {
  return str.replace(/[&<>'"]/g,
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag as '&' | '<' | '>' | "'" | '"'] || tag)
  );
}

function checkIsDescendantActive(node: NamespaceNode, currentSlug: FullSlug): boolean {
  if (node.slug === currentSlug) return true
  for (const child of node.children) {
    if (checkIsDescendantActive(child, currentSlug)) return true
  }
  return false
}

function countTotalFiles(node: NamespaceNode): number {
  let count = 0
  if (node.slug) count += 1
  for (const child of node.children) {
    count += countTotalFiles(child)
  }
  return count
}

function renderNamespaceNode(
  node: NamespaceNode,
  currentSlug: FullSlug,
  isCollapsedDefault: boolean
): string {
  if (node.children.length === 0) {
    const href = resolveRelative(currentSlug, node.slug as FullSlug)
    const activeClass = currentSlug === node.slug ? ' class="active"' : ""
    const activeClassForLi = currentSlug === node.slug ? ' active-file' : ""
    return `<li class="explorer-file-item${activeClassForLi}">
      <a href="${href}" data-for="${node.slug}"${activeClass}>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="file-icon">
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
          <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
        </svg>
        <span class="file-title">${escapeHTML(node.name)}</span>
      </a>
    </li>`
  }

  const folderPath = node.fullName
  const activeClass = currentSlug === node.slug ? ' active' : ""

  let titleHtml = ""
  if (node.slug) {
    const href = resolveRelative(currentSlug, node.slug as FullSlug)
    titleHtml = `<a href="${href}" data-for="${node.slug}" class="folder-title">${escapeHTML(node.name)}</a>`
  } else {
    titleHtml = `<button class="folder-button"><span class="folder-title">${escapeHTML(node.name)}</span></button>`
  }

  let savedState: Record<string, boolean> = {}
  try {
    savedState = JSON.parse(localStorage.getItem("explorerNamespaceStates") || "{}")
  } catch (e) { }

  const isDescendantActive = checkIsDescendantActive(node, currentSlug)
  const isCollapsed = isDescendantActive ? false : (savedState[folderPath] ?? isCollapsedDefault)

  const openClass = !isCollapsed ? ' open' : ""
  const parentOpenClass = !isCollapsed ? ' open-folder' : ""

  let childrenHtml = ""
  node.children.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }))
  for (const child of node.children) {
    childrenHtml += renderNamespaceNode(child, currentSlug, isCollapsedDefault)
  }

  return `<li class="explorer-folder-item${parentOpenClass}">
    <div class="folder-container${activeClass}" data-folderpath="${folderPath}">
      <span class="folder-chevron-wrap">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="5 8 14 8" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="folder-icon">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </span>
      <div class="folder-title-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="folder-glyph-icon folder-closed">
          <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="folder-glyph-icon folder-open">
          <path d="M6 20h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>
          <path d="M2 10h20"/>
        </svg>
        ${titleHtml}
        <span class="folder-badge">${countTotalFiles(node)}</span>
      </div>
    </div>
    <div class="folder-outer${openClass}">
      <ul class="content">${childrenHtml}</ul>
    </div>
  </li>`
}

function createFileItemStr(currentSlug: FullSlug, slug: string, title: string): string {
  const href = resolveRelative(currentSlug, slug as FullSlug)
  const activeClass = currentSlug === slug ? ' class="active"' : ""
  const activeClassForLi = currentSlug === slug ? ' active-file' : ""
  return `<li class="explorer-file-item${activeClassForLi}">
    <a href="${href}" data-for="${slug}"${activeClass}>
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="file-icon">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
        <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
      </svg>
      <span class="file-title">${escapeHTML(title)}</span>
    </a>
  </li>`
}

function createCategoryFolderStr(
  categoryId: string,
  icon: string,
  title: string,
  count: number,
  childrenHtml: string,
  isChildActive: boolean,
  isCollapsedDefault: boolean = true
): string {
  let savedState: Record<string, boolean> = {}
  try {
    savedState = JSON.parse(localStorage.getItem("explorerCatStates") || "{}")
  } catch (e) { }

  const isCollapsed = isChildActive ? false : (savedState[categoryId] ?? isCollapsedDefault)

  const openClass = !isCollapsed ? ' open' : ""
  const parentOpenClass = !isCollapsed ? ' open-folder' : ""

  return `<li class="explorer-folder-item${parentOpenClass}" data-catid="${categoryId}">
    <div class="folder-container" data-folderpath="${categoryId}">
      <span class="folder-chevron-wrap">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="5 8 14 8" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="folder-icon">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </span>
      <div class="folder-title-wrapper">
        <span class="cat-icon" style="margin-right: 4px;">${icon}</span>
        <button class="folder-button"><span class="folder-title">${escapeHTML(title)}</span></button>
        <span class="folder-badge">${count}</span>
      </div>
    </div>
    <div class="folder-outer${openClass}">
      <ul class="content">${childrenHtml}</ul>
    </div>
  </li>`
}

function toggleExplorer(this: HTMLElement) {
  const nearestExplorer = this.closest(".explorer") as HTMLElement
  if (!nearestExplorer) return
  const explorerCollapsed = nearestExplorer.classList.toggle("collapsed")
  nearestExplorer.setAttribute(
    "aria-expanded",
    nearestExplorer.getAttribute("aria-expanded") === "true" ? "false" : "true",
  )

  if (!explorerCollapsed) {
    document.documentElement.classList.add("mobile-no-scroll")
  } else {
    document.documentElement.classList.remove("mobile-no-scroll")
  }
}

function toggleFolder(evt: MouseEvent) {
  evt.stopPropagation()
  const target = evt.target as MaybeHTMLElement
  if (!target) return

  const folderContainer = target.closest(".folder-container") as HTMLElement | null
  if (!folderContainer) return
  const childFolderContainer = folderContainer.nextElementSibling as MaybeHTMLElement
  if (!childFolderContainer) return

  childFolderContainer.classList.toggle("open")

  const isCollapsed = !childFolderContainer.classList.contains("open")
  setFolderState(childFolderContainer, isCollapsed)

  const parentLi = folderContainer.parentElement
  if (parentLi) {
    parentLi.classList.toggle("open-folder", !isCollapsed)
  }

  const folderPath = folderContainer.dataset.folderpath
  if (folderPath) {
    try {
      const savedNamespaceState = JSON.parse(localStorage.getItem("explorerNamespaceStates") || "{}")
      const savedCatState = JSON.parse(localStorage.getItem("explorerCatStates") || "{}")

      savedNamespaceState[folderPath] = isCollapsed
      savedCatState[folderPath] = isCollapsed

      localStorage.setItem("explorerNamespaceStates", JSON.stringify(savedNamespaceState))
      localStorage.setItem("explorerCatStates", JSON.stringify(savedCatState))
    } catch (e) { }
  }
}

function collapseAllFolders(explorer: HTMLElement) {
  const explorerUl = explorer.querySelector(".explorer-ul")
  if (!explorerUl) return

  const allFolders = explorerUl.querySelectorAll("li.explorer-folder-item")
  allFolders.forEach((folderLi) => {
    folderLi.classList.remove("open-folder")
    const folderOuter = folderLi.querySelector(".folder-outer")
    if (folderOuter) {
      folderOuter.classList.remove("open")
    }
  })

  try {
    const savedNamespaceState: Record<string, boolean> = {}
    const savedCatState: Record<string, boolean> = {}

    const categories = ["history", "hierarchies", "standalone"]
    categories.forEach(c => {
      savedCatState[c] = true
    })

    const namespaceContainers = explorerUl.querySelectorAll(".folder-container[data-folderpath]")
    namespaceContainers.forEach(container => {
      const path = (container as HTMLElement).dataset.folderpath
      if (path) {
        savedNamespaceState[path] = true
      }
    })

    localStorage.setItem("explorerNamespaceStates", JSON.stringify(savedNamespaceState))
    localStorage.setItem("explorerCatStates", JSON.stringify(savedCatState))
  } catch (e) { }
}

function filterExplorer(query: string, explorer: HTMLElement) {
  const q = query.toLowerCase().trim()
  const explorerUl = explorer.querySelector(".explorer-ul")
  if (!explorerUl) return

  if (q === "") {
    explorerUl.classList.remove("search-active")
    const allFolders = explorerUl.querySelectorAll("li.explorer-folder-item")
    allFolders.forEach((folderLi) => {
      const folderContainer = folderLi.querySelector(".folder-container") as HTMLElement
      const folderOuter = folderLi.querySelector(".folder-outer") as HTMLElement
      if (!folderContainer || !folderOuter) return

      const folderPath = folderContainer.dataset.folderpath
      let savedNamespaceState: Record<string, boolean> = {}
      let savedCatState: Record<string, boolean> = {}
      try {
        savedNamespaceState = JSON.parse(localStorage.getItem("explorerNamespaceStates") || "{}")
        savedCatState = JSON.parse(localStorage.getItem("explorerCatStates") || "{}")
      } catch (e) { }

      const collapsed = savedNamespaceState[folderPath ?? ""] ?? savedCatState[folderPath ?? ""] ?? (folderPath === "hierarchies" ? false : true)

      folderLi.classList.remove("search-hidden", "search-match", "search-child-match")
      folderOuter.classList.toggle("open", !collapsed)
      folderLi.classList.toggle("open-folder", !collapsed)
    })

    const allFiles = explorerUl.querySelectorAll("li.explorer-file-item")
    allFiles.forEach((fileLi) => {
      fileLi.classList.remove("search-hidden", "search-match")
    })
    return
  }

  explorerUl.classList.add("search-active")

  function processLi(li: HTMLElement): boolean {
    let matches = false

    if (li.classList.contains("explorer-file-item")) {
      const titleSpan = li.querySelector(".file-title")
      const title = titleSpan ? titleSpan.textContent || "" : ""
      matches = title.toLowerCase().includes(q)

      if (matches) {
        li.classList.remove("search-hidden")
        li.classList.add("search-match")
      } else {
        li.classList.remove("search-match")
        li.classList.add("search-hidden")
      }
    } else if (li.classList.contains("explorer-folder-item")) {
      const folderTitleSpan = li.querySelector(".folder-title")
      const folderTitle = folderTitleSpan ? folderTitleSpan.textContent || "" : ""
      const folderMatchesSelf = folderTitle.toLowerCase().includes(q)

      const childUl = li.querySelector(".folder-outer > ul.content")
      let childMatches = false
      if (childUl) {
        const childLis = Array.from(childUl.children) as HTMLElement[]
        for (const childLi of childLis) {
          if (processLi(childLi)) {
            childMatches = true
          }
        }
      }

      matches = folderMatchesSelf || childMatches

      if (matches) {
        li.classList.remove("search-hidden")
        if (folderMatchesSelf) {
          li.classList.add("search-match")
        } else {
          li.classList.remove("search-match")
        }

        if (childMatches) {
          li.classList.add("search-child-match")
          const folderOuter = li.querySelector(".folder-outer")
          if (folderOuter) folderOuter.classList.add("open")
          li.classList.add("open-folder")
        } else {
          li.classList.remove("search-child-match")
        }
      } else {
        li.classList.add("search-hidden")
        li.classList.remove("search-match", "search-child-match")
      }
    }

    return matches
  }

  const rootLis = Array.from(explorerUl.children) as HTMLElement[]
  for (const rootLi of rootLis) {
    processLi(rootLi)
  }
}

async function setupExplorer(currentSlug: FullSlug) {
  const allExplorers = document.querySelectorAll("div.explorer") as NodeListOf<HTMLElement>

  for (const explorer of allExplorers) {
    const data = await fetchData
    const entries = [...Object.entries(data)] as [FullSlug, ContentDetails][]

    const rootNodes: NamespaceNode[] = []

    function insertNamespace(parts: string[], slug: string) {
      let currentList = rootNodes
      let currentPath = ""

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i]
        currentPath = currentPath ? `${currentPath} - ${part}` : part

        let node = currentList.find(n => n.name === part)
        if (!node) {
          node = {
            name: part,
            fullName: currentPath,
            slug: i === parts.length - 1 ? slug : "",
            children: []
          }
          currentList.push(node)
        } else {
          if (i === parts.length - 1) {
            node.slug = slug
          }
        }
        currentList = node.children
      }
    }

    for (const [slug, page] of entries) {
      if (slug === "index" || page.title === "index" || page.title === "") continue

      const parts = (page.treeTitle || page.title || slug).split(" - ").map(s => s.trim())
      insertNamespace(parts, slug)
    }

    const hierarchyNodes: NamespaceNode[] = []
    const standaloneNodes: NamespaceNode[] = []

    for (const node of rootNodes) {
      if (node.children.length > 0) {
        hierarchyNodes.push(node)
      } else {
        standaloneNodes.push(node)
      }
    }

    const alphaSort = (a: NamespaceNode, b: NamespaceNode) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" })
    hierarchyNodes.sort(alphaSort)
    standaloneNodes.sort(alphaSort)

    const explorerUl = explorer.querySelector(".explorer-ul")
    if (!explorerUl) continue

    let htmlStr = ""

    let history: string[] = []
    try {
      history = JSON.parse(sessionStorage.getItem("explorerHistory") || "[]")
    } catch (e) { }

    const historyPages = history.filter(slug => data[slug]).map(slug => [slug, data[slug].title] as [string, string])
    if (historyPages.length > 0) {
      const isHistoryActive = historyPages.some(x => x[0] === currentSlug)
      let historyHtml = ""
      for (const [slug, title] of historyPages) {
        historyHtml += createFileItemStr(currentSlug, slug, title)
      }
      htmlStr += createCategoryFolderStr("history", "🕒", "Recent Sessions", historyPages.length, historyHtml, isHistoryActive, true)
    }

    if (hierarchyNodes.length > 0) {
      const isHierarchyActive = hierarchyNodes.some(node => checkIsDescendantActive(node, currentSlug))
      let hierarchyHtml = ""
      for (const node of hierarchyNodes) {
        hierarchyHtml += renderNamespaceNode(node, currentSlug, true)
      }
      htmlStr += createCategoryFolderStr("hierarchies", "📚", "Page Hierarchies", countTotalFiles({ name: "", fullName: "", slug: "", children: hierarchyNodes }), hierarchyHtml, isHierarchyActive, false)
    }

    if (standaloneNodes.length > 0) {
      const isStandaloneActive = standaloneNodes.some(node => node.slug === currentSlug)
      let standaloneHtml = ""
      for (const node of standaloneNodes) {
        standaloneHtml += renderNamespaceNode(node, currentSlug, true)
      }
      htmlStr += createCategoryFolderStr("standalone", "📝", "Standalone Notes", standaloneNodes.length, standaloneHtml, isStandaloneActive, true)
    }

    explorerUl.innerHTML = htmlStr

    const activeElement = explorerUl.querySelector(".active")
    if (activeElement) {
      activeElement.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }

    const explorerButtons = explorer.getElementsByClassName(
      "explorer-toggle",
    ) as HTMLCollectionOf<HTMLElement>
    for (const button of explorerButtons) {
      button.addEventListener("click", toggleExplorer)
      window.addCleanup(() => button.removeEventListener("click", toggleExplorer))
    }

    const filterInput = explorer.querySelector(".explorer-filter") as HTMLInputElement | null
    const filterClear = explorer.querySelector(".explorer-filter-clear") as HTMLButtonElement | null
    if (filterInput) {
      const handleInput = () => {
        const query = filterInput.value
        if (filterClear) {
          filterClear.style.display = query ? "block" : "none"
        }
        filterExplorer(query, explorer)
      }
      filterInput.addEventListener("input", handleInput)
      window.addCleanup(() => filterInput.removeEventListener("input", handleInput))

      if (filterClear) {
        const handleClear = () => {
          filterInput.value = ""
          filterClear.style.display = "none"
          filterExplorer("", explorer)
          filterInput.focus()
        }
        filterClear.addEventListener("click", handleClear)
        window.addCleanup(() => filterClear.removeEventListener("click", handleClear))
      }
    }

    const collapseAllBtn = explorer.querySelector(".collapse-all-btn") as HTMLButtonElement | null
    if (collapseAllBtn) {
      const handleCollapseAll = () => {
        collapseAllFolders(explorer)
      }
      collapseAllBtn.addEventListener("click", handleCollapseAll)
      window.addCleanup(() => collapseAllBtn.removeEventListener("click", handleCollapseAll))
    }

    const folderContainers = explorer.getElementsByClassName(
      "folder-container",
    ) as HTMLCollectionOf<HTMLElement>
    for (const container of folderContainers) {
      container.addEventListener("click", toggleFolder)
      window.addCleanup(() => container.removeEventListener("click", toggleFolder))
    }
  }
}

document.addEventListener("prenav", async () => {
})

document.addEventListener("nav", async (e: CustomEventMap["nav"]) => {
  const currentSlug = e.detail.url

  if (currentSlug && currentSlug !== "index") {
    let history: string[] = []
    try {
      history = JSON.parse(sessionStorage.getItem("explorerHistory") || "[]")
    } catch (err) { }

    history = [currentSlug, ...history.filter(s => s !== currentSlug)].slice(0, 5)

    try {
      sessionStorage.setItem("explorerHistory", JSON.stringify(history))
    } catch (err) { }
  }

  await setupExplorer(currentSlug)

  for (const explorer of document.getElementsByClassName("explorer")) {
    const mobileExplorer = explorer.querySelector(".mobile-explorer")
    if (!mobileExplorer) return

    if (mobileExplorer.checkVisibility()) {
      explorer.classList.add("collapsed")
      explorer.setAttribute("aria-expanded", "false")
      document.documentElement.classList.remove("mobile-no-scroll")
    }

    mobileExplorer.classList.remove("hide-until-loaded")
  }
})

window.addEventListener("resize", function () {
  const explorer = document.querySelector(".explorer")
  if (explorer && !explorer.classList.contains("collapsed")) {
    document.documentElement.classList.add("mobile-no-scroll")
    return
  }
})

function setFolderState(folderElement: HTMLElement, collapsed: boolean) {
  return collapsed ? folderElement.classList.remove("open") : folderElement.classList.add("open")
}
