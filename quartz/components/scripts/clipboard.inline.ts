const svgCopy =
  '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"><path fill-rule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"></path><path fill-rule="evenodd" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"></path></svg>'
const svgCheck =
  '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"><path fill-rule="evenodd" fill="rgb(63, 185, 80)" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>'
const svgZoom = 
  '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"><path fill-rule="evenodd" d="M11.5 7a4.499 4.499 0 11-8.998 0A4.499 4.499 0 0111.5 7zm-.83 4.244a6.5 6.5 0 111.414-1.414l3.62 3.62a1 1 0 01-1.414 1.414l-3.62-3.62zM7 9a2 2 0 100-4 2 2 0 000 4z"></path></svg>'

document.addEventListener("nav", () => {
  // --- Code block copy buttons ---
  const els = document.getElementsByTagName("pre")
  for (let i = 0; i < els.length; i++) {
    const codeBlock = els[i].getElementsByTagName("code")[0]
    if (codeBlock) {
      const source = (
        codeBlock.dataset.clipboard ? JSON.parse(codeBlock.dataset.clipboard) : codeBlock.innerText
      ).replace(/\n\n/g, "\n")
      const button = document.createElement("button")
      button.className = "clipboard-button"
      button.type = "button"
      button.innerHTML = svgCopy
      button.ariaLabel = "Copy source"
      function onClick() {
        navigator.clipboard.writeText(source).then(
          () => {
            button.blur()
            button.innerHTML = svgCheck
            setTimeout(() => {
              button.innerHTML = svgCopy
              button.style.borderColor = ""
            }, 2000)
          },
          (error) => console.error(error),
        )
      }
      button.addEventListener("click", onClick)
      window.addCleanup(() => button.removeEventListener("click", onClick))
      els[i].prepend(button)
    }
  }

  // --- Math block interactive features ---
  const mathEls = document.querySelectorAll(".katex-display")
  for (let i = 0; i < mathEls.length; i++) {
    const mathEl = mathEls[i] as HTMLElement
    if (mathEl.querySelector(".math-action-buttons")) continue

    // Create container for buttons
    const actionsContainer = document.createElement("div")
    actionsContainer.className = "math-action-buttons"

    // Zoom Button
    const zoomBtn = document.createElement("button")
    zoomBtn.className = "math-btn math-zoom-btn"
    zoomBtn.type = "button"
    zoomBtn.innerHTML = svgZoom
    zoomBtn.title = "Zoom equation"
    
    // Copy Button
    const copyBtn = document.createElement("button")
    copyBtn.className = "math-btn math-copy-btn"
    copyBtn.type = "button"
    copyBtn.innerHTML = svgCopy
    copyBtn.title = "Copy LaTeX"

    actionsContainer.appendChild(zoomBtn)
    actionsContainer.appendChild(copyBtn)
    mathEl.appendChild(actionsContainer)

    // Copy LaTeX action logic
    const annotation = mathEl.querySelector('annotation[encoding="application/x-tex"]')
    const latexText = annotation ? annotation.textContent || "" : ""

    function onMathCopyClick(e: MouseEvent) {
      e.stopPropagation()
      navigator.clipboard.writeText(latexText).then(
        () => {
          copyBtn.blur()
          copyBtn.innerHTML = svgCheck
          setTimeout(() => {
            copyBtn.innerHTML = svgCopy
          }, 2000)
        },
        (err) => console.error("Failed to copy math:", err)
      )
    }

    copyBtn.addEventListener("click", onMathCopyClick)
    window.addCleanup(() => copyBtn.removeEventListener("click", onMathCopyClick))

    // Zoom action logic
    function onMathZoomClick(e: MouseEvent) {
      e.stopPropagation()
      
      const overlay = document.createElement("div")
      overlay.className = "math-zoom-overlay"
      
      const card = document.createElement("div")
      card.className = "math-zoom-card"
      
      const closeBtn = document.createElement("button")
      closeBtn.className = "math-zoom-close"
      closeBtn.innerHTML = "×"
      
      // Clone the katex container
      const clonedMath = mathEl.cloneNode(true) as HTMLElement
      // Remove action buttons from the clone to prevent recursive buttons
      const clonedActions = clonedMath.querySelector(".math-action-buttons")
      if (clonedActions) clonedActions.remove()

      card.appendChild(closeBtn)
      card.appendChild(clonedMath)
      overlay.appendChild(card)
      document.body.appendChild(overlay)

      // Trigger transition
      setTimeout(() => {
        overlay.classList.add("active")
        card.classList.add("active")
      }, 10)

      function closeZoom() {
        overlay.classList.remove("active")
        card.classList.remove("active")
        setTimeout(() => {
          overlay.remove()
        }, 300)
      }

      closeBtn.addEventListener("click", closeZoom)
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeZoom()
      })
    }

    zoomBtn.addEventListener("click", onMathZoomClick)
    window.addCleanup(() => zoomBtn.removeEventListener("click", onMathZoomClick))
  }
})
