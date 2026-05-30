document.addEventListener("nav", () => {
  const shareButtons = document.querySelectorAll(".share-btn")
  const downloadBtn = document.querySelector(".download-pdf-btn")

  // ─── Share buttons ────────────────────────────────────────────────────────
  const handleShareClick = (e: Event) => {
    e.preventDefault()
    const target = e.currentTarget as HTMLElement
    const platform = target.getAttribute("data-platform")
    const url = window.location.href
    const title = document.querySelector("h1.article-title")?.textContent?.trim() || document.title

    if (platform === "whatsapp") {
      const text = `💡 *${title}* \n\nComprehensive dev reference & programming notes by Vaibhav Rathod. Check it out: \n👉 ${url}`
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank")
    } else if (platform === "twitter") {
      const text = `💡 ${title} — Programming notes & dev reference by Vaibhav Rathod. 🚀\n\nRead here: ${url}\n\n#programming #developer #notes`
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank")
    } else if (platform === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank")
    } else if (platform === "copy") {
      navigator.clipboard.writeText(url).then(() => {
        const icon = target.querySelector(".copy-icon")
        const successIcon = target.querySelector(".success-icon")
        const label = target.querySelector(".share-btn-label")
        if (icon && successIcon && label) {
          icon.classList.add("hidden")
          successIcon.classList.remove("hidden")
          const oldLabel = label.textContent
          label.textContent = "Copied!"
          setTimeout(() => {
            icon.classList.remove("hidden")
            successIcon.classList.add("hidden")
            label.textContent = oldLabel
          }, 2000)
        }
      })
    }
  }

  shareButtons.forEach((btn) => {
    btn.addEventListener("click", handleShareClick)
    window.addCleanup(() => btn.removeEventListener("click", handleShareClick))
  })

  // ─── Script tag loader (for UMD libraries) ────────────────────────────────
  const loadScript = (src: string, globalKey: string): Promise<void> =>
    new Promise((resolve, reject) => {
      if ((window as any)[globalKey]) { resolve(); return }
      const existing = document.querySelector(`script[data-pdf-lib="${globalKey}"]`)
      if (existing) {
        // already injected — wait for load
        const poll = setInterval(() => {
          if ((window as any)[globalKey]) { clearInterval(poll); resolve() }
        }, 50)
        setTimeout(() => { clearInterval(poll); reject(new Error(`Timeout loading ${globalKey}`)) }, 15000)
        return
      }
      const s = document.createElement("script")
      s.src = src
      s.setAttribute("data-pdf-lib", globalKey)
      s.onload = () => resolve()
      s.onerror = () => reject(new Error(`Failed to load: ${src}`))
      document.head.appendChild(s)
    })

  // ─── ESM dynamic import (bypasses esbuild static analysis) ───────────────
  const importESM = new Function("url", "return import(url)") as (url: string) => Promise<any>

  // ─── Convert cross-origin <img> to base64 data URLs ──────────────────────
  const bakeImages = async (el: HTMLElement) => {
    const imgs = Array.from(el.querySelectorAll<HTMLImageElement>("img"))
    await Promise.all(
      imgs.map(async (img) => {
        let src = img.getAttribute("src") || ""
        if (!src || src.startsWith("data:")) return

        // Resolve relative URLs
        if (src.startsWith("/")) src = window.location.origin + src
        else if (!/^https?:\/\//i.test(src)) {
          const base = window.location.href.replace(/\/[^/]*$/, "/")
          src = base + src
        }

        // Fix GitHub avatar redirects → direct CDN
        if (src.includes("github.com/") && src.endsWith(".png")) {
          const username = src.split("github.com/")[1]?.replace(".png", "").split("/")[0]
          if (username) src = `https://avatars.githubusercontent.com/${username}`
        }

        try {
          const res = await fetch(src)
          if (!res.ok) return
          const blob = await res.blob()
          const b64 = await new Promise<string>((ok, err) => {
            const r = new FileReader()
            r.onloadend = () => ok(r.result as string)
            r.onerror = () => err(new Error("FileReader error"))
            r.readAsDataURL(blob)
          })
          img.src = b64
        } catch {
          // leave as-is; html-to-image may still handle it via CORS proxy
        }
      }),
    )
  }

  // ─── Strip Mermaid pan-zoom UI from cloned DOM ────────────────────────────
  const cleanMermaid = (el: HTMLElement) => {
    el.querySelectorAll(
      ".mermaid-controls, .mermaid-control-button, .expand-button, .clipboard-button, #mermaid-container",
    ).forEach((n) => n.remove())

    el.querySelectorAll<HTMLElement>(
      "code.mermaid, .mermaid, .mermaid-content, .mermaid-space",
    ).forEach((n) => {
      n.style.transform = ""
      n.style.transformOrigin = ""
      n.style.cursor = "default"
      n.style.overflow = "visible"
    })
  }

  // ─── PDF Download (html-to-image + jsPDF, no html2pdf.js) ────────────────
  const handleDownloadClick = async (e: Event) => {
    e.preventDefault()
    const btn = e.currentTarget as HTMLButtonElement
    const savedHTML = btn.innerHTML
    btn.disabled = true

    // ── Loading overlay ──────────────────────────────────────────────────────
    const overlay = document.createElement("div")
    overlay.className = "pdf-loading-overlay"
    overlay.innerHTML = `
      <div class="pdf-loading-card">
        <div class="pdf-loading-spinner">
          <svg width="44" height="44" viewBox="0 0 50 50">
            <circle class="path" cx="25" cy="25" r="20"
              fill="none" stroke="currentColor" stroke-width="4"/>
          </svg>
        </div>
        <h3>Generating PDF</h3>
        <p class="pdf-loading-step">Starting...</p>
        <div class="pdf-loading-bar-outer">
          <div class="pdf-loading-bar-inner"></div>
        </div>
      </div>`
    document.body.appendChild(overlay)
    requestAnimationFrame(() => overlay.classList.add("active"))

    const step = async (msg: string, pct: number) => {
      const p = overlay.querySelector(".pdf-loading-step")
      const b = overlay.querySelector<HTMLElement>(".pdf-loading-bar-inner")
      if (p) p.textContent = msg
      if (b) b.style.width = `${pct}%`
      await new Promise((r) => requestAnimationFrame(r))
      await new Promise((r) => setTimeout(r, 40))
    }

    await new Promise((r) => setTimeout(r, 320)) // entrance animation

    let shell: HTMLDivElement | null = null
    const savedTheme = document.documentElement.getAttribute("saved-theme") || "light"

    try {
      // ── 1. Load jsPDF (UMD → window.jspdf) ─────────────────────────────
      await step("Loading PDF engine...", 8)
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
        "jspdf",
      )

      // ── 2. Load html-to-image (ESM) ─────────────────────────────────────
      await step("Loading image renderer...", 18)
      // Use Function constructor so esbuild doesn't try to bundle this URL
      const hti = await importESM("https://esm.sh/html-to-image@1.11.11")

      // ── 3. Force light mode for white-background PDF ─────────────────────
      await step("Applying print theme...", 26)
      document.documentElement.setAttribute("saved-theme", "light")
      await new Promise((r) => setTimeout(r, 280)) // let theme CSS recompute

      // ── 4. Clone main content ────────────────────────────────────────────
      await step("Cloning page content...", 34)
      const source = document.querySelector<HTMLElement>("main.center")
      if (!source) throw new Error("Could not find page content (main.center)")

      const clone = source.cloneNode(true) as HTMLElement
      clone.classList.add("html2pdf-pdf-mode")

      // Remove elements that must not appear in PDF
      clone
        .querySelectorAll(
          ".share-download-container, .no-pdf, #comments, .giscus, " +
            ".page-footer, hr, .mermaid-controls, .expand-button, " +
            ".clipboard-button, #mermaid-container",
        )
        .forEach((n) => n.remove())

      // Fix pan-zoom wrapper transforms on Mermaid diagrams
      cleanMermaid(clone)

      // Rewrite localhost / relative links → production URL
      const PROD = "https://code-note-vr.vercel.app"
      clone.querySelectorAll<HTMLAnchorElement>("a").forEach((a) => {
        const href = a.getAttribute("href")
        if (!href) return
        if (href.startsWith("/") && !href.startsWith("//")) {
          a.href = PROD + href
        } else if (/localhost|127\.0\.0\.1/i.test(href)) {
          try {
            const u = new URL(href)
            a.href = PROD + u.pathname + u.search + u.hash
          } catch {
            a.href = href.replace(/https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i, PROD)
          }
        }
      })

      // ── 5. Mount clone off-screen ────────────────────────────────────────
      // position:absolute left:-9999px keeps element in layout flow so
      // getBoundingClientRect() works, but it's off-screen visually.
      shell = document.createElement("div")
      shell.style.cssText = [
        "position: absolute",
        "left: -9999px",
        "top: 0",
        `width: ${source.offsetWidth}px`,
        "background: #ffffff",
        "overflow: visible",
      ].join("; ")
      shell.appendChild(clone)
      document.body.appendChild(shell)
      await new Promise((r) => setTimeout(r, 220)) // browser layout pass

      // ── 6. Convert cross-origin images → base64 ──────────────────────────
      await step("Processing images...", 46)
      await bakeImages(clone)

      // ── 7. Render entire page to a single canvas ─────────────────────────
      // html-to-image inlines computed styles (CSS variables resolved),
      // handles SVGs via foreignObject, no color-mix crash.
      await step("Rendering page to canvas...", 60)
      const canvas: HTMLCanvasElement = await hti.toCanvas(clone, {
        backgroundColor: "#ffffff",
        pixelRatio: 2,           // 2× for crisp text at A4 print resolution
        skipAutoScale: true,
        cacheBust: true,
      })

      // ── 8. Slice canvas into A4 pages ────────────────────────────────────
      await step("Paginating...", 76)

      const MM_MARGIN = 15
      const MM_PAGE_W = 210
      const MM_PAGE_H = 297
      const MM_CONTENT_W = MM_PAGE_W - 2 * MM_MARGIN   // 180 mm
      const MM_CONTENT_H = MM_PAGE_H - 2 * MM_MARGIN   // 267 mm

      const cw = canvas.width   // full canvas width in px (at pixelRatio:2)
      const ch = canvas.height  // full canvas height in px

      // How many canvas-px fit in one page's content height?
      const mmPerPx = MM_CONTENT_W / cw
      const pageHeightPx = Math.floor(MM_CONTENT_H / mmPerPx)
      const totalPages = Math.ceil(ch / pageHeightPx)

      const { jsPDF } = (window as any).jspdf
      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" })

      for (let pg = 0; pg < totalPages; pg++) {
        if (pg > 0) pdf.addPage()

        const srcY = pg * pageHeightPx
        const srcH = Math.min(pageHeightPx, ch - srcY)

        // Blit this horizontal slice into a temporary canvas
        const slice = document.createElement("canvas")
        slice.width = cw
        slice.height = srcH
        const ctx = slice.getContext("2d")!
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, cw, srcH)
        ctx.drawImage(canvas, 0, srcY, cw, srcH, 0, 0, cw, srcH)

        const dataUrl = slice.toDataURL("image/jpeg", 0.93)
        const sliceHeightMM = srcH * mmPerPx

        pdf.addImage(dataUrl, "JPEG", MM_MARGIN, MM_MARGIN, MM_CONTENT_W, sliceHeightMM)
      }

      // ── 9. PDF outline / bookmarks ───────────────────────────────────────
      await step("Building bookmarks...", 88)
      const noteTitle =
        document.querySelector("h1.article-title")?.textContent?.trim() || "note"
      const fileName = `${noteTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`

      // Snapshot the clone's bounding rect while it's still in the DOM.
      // All subsequent getBoundingClientRect() calls use this as the origin.
      const cloneRect = clone.getBoundingClientRect()
      const cloneTop  = cloneRect.top
      const cloneLeft = cloneRect.left

      const headings = Array.from(
        clone.querySelectorAll<HTMLElement>("article h1, article h2, article h3, article h4"),
      )

      if (headings.length > 0) {
        const rootItem = pdf.outline.add(null, noteTitle, { pageNumber: 1 })

        headings.forEach((h) => {
          const text = h.textContent?.replace(/[\u200B-\u200D\uFEFF]/g, "").trim()
          if (!text) return

          // pixelRatio:2 → 1 CSS px = 2 canvas px
          const cssRelY  = h.getBoundingClientRect().top - cloneTop
          const canvasPxY = cssRelY * 2
          let pageNum = Math.floor(canvasPxY / pageHeightPx) + 1
          if (!pageNum || pageNum < 1) pageNum = 1
          if (pageNum > totalPages) pageNum = totalPages

          pdf.outline.add(rootItem, text, { pageNumber: pageNum })
        })
      }

      // ── 10. Clickable link annotations ───────────────────────────────────
      // The PDF pages are JPEG images — text isn't selectable, but we can
      // overlay invisible link rectangles at the exact position of each <a>
      // using jsPDF's pdf.link(x, y, w, h, { url }) annotation API.
      await step("Adding clickable links...", 94)

      const PIXEL_RATIO = 2  // must match the pixelRatio passed to toCanvas()

      const anchors = Array.from(clone.querySelectorAll<HTMLAnchorElement>("a[href]"))
      for (const a of anchors) {
        const href = a.getAttribute("href") || ""
        // Skip empty, javascript:, mailto: without a destination, and pure
        // same-page fragment anchors (they don't translate to PDF pages).
        if (!href || href.startsWith("javascript:") || href === "#") continue

        const rect = a.getBoundingClientRect()
        // Skip zero-size elements (hidden, display:none, etc.)
        if (rect.width < 1 || rect.height < 1) continue

        // ── Map DOM rect → canvas pixel coordinates ──────────────────────
        const cssPxX = rect.left  - cloneLeft
        const cssPxY = rect.top   - cloneTop

        const canvasPxY = cssPxY * PIXEL_RATIO
        const canvasPxW = rect.width  * PIXEL_RATIO
        const canvasPxH = rect.height * PIXEL_RATIO

        // ── Determine which PDF page this link lives on ───────────────────
        const pageIndex = Math.floor(canvasPxY / pageHeightPx)  // 0-based
        if (pageIndex < 0 || pageIndex >= totalPages) continue

        // Y position within the current page's canvas slice
        const yWithinPagePx = canvasPxY - pageIndex * pageHeightPx

        // ── Convert canvas pixels → PDF mm ───────────────────────────────
        // mmPerPx = MM_CONTENT_W / cw  (already computed above)
        const xMM = MM_MARGIN + cssPxX * PIXEL_RATIO * mmPerPx
        const yMM = MM_MARGIN + yWithinPagePx * mmPerPx
        const wMM = canvasPxW * mmPerPx
        const hMM = canvasPxH * mmPerPx

        // Clamp to page content area so we don't place links outside margins
        if (xMM < MM_MARGIN || yMM < MM_MARGIN) continue
        if (xMM + wMM > MM_MARGIN + MM_CONTENT_W) continue

        // ── Place the invisible clickable rectangle on the correct page ───
        pdf.setPage(pageIndex + 1)  // jsPDF pages are 1-based
        pdf.link(xMM, yMM, wMM, hMM, { url: href })
      }

      // ── 11. Save ─────────────────────────────────────────────────────────
      await step("Saving...", 99)
      pdf.save(fileName)

    } catch (err: any) {
      console.error("[PDF] Generation failed:", err)
      alert("PDF generation failed:\n" + (err?.message || String(err)))
    } finally {
      document.documentElement.setAttribute("saved-theme", savedTheme)
      shell?.remove()
      overlay.classList.remove("active")
      setTimeout(() => overlay.remove(), 320)
      btn.innerHTML = savedHTML
      btn.disabled = false
    }
  }

  if (downloadBtn) {
    downloadBtn.addEventListener("click", handleDownloadClick)
    window.addCleanup(() => downloadBtn.removeEventListener("click", handleDownloadClick))
  }
})
