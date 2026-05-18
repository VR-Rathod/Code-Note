// ─── Singleton global state ───────────────────────────────────────────────────
let isDonationInitialized = false
let selectedAmount = 100
let isToastShownThisSession = false
let scrollListener: (() => void) | null = null
let scrollTimeoutId: any = null

// Read values dynamically from DOM so that editing Donation.tsx automatically syncs here!
function getUpiConfig() {
  const upiInput = document.getElementById("upi-id-input") as HTMLInputElement | null
  const upiId = upiInput ? upiInput.value.trim() : "vaibhavrathod2282-2@okaxis"
  
  const payeeStrong = document.querySelector(".donation-modal-subtitle strong")
  const payeeName = payeeStrong ? payeeStrong.textContent?.trim() || "Vaibhav Rathod" : "Vaibhav Rathod"
  
  return { upiId, payeeName }
}

// ─── UPI URL Generator ────────────────────────────────────────────────────────
function generateUpiLinks(amount: number) {
  const { upiId, payeeName } = getUpiConfig()
  const note = encodeURIComponent(`Support Vaibhav - Code-Note`)
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${note}`
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`
  return { upiLink, qrUrl }
}

// ─── Update Payment UI ────────────────────────────────────────────────────────
function updatePaymentDetails(amount: number) {
  const { upiLink, qrUrl } = generateUpiLinks(amount)
  
  // Update QR Code Image
  const qrImg = document.getElementById("donation-qr-code-img") as HTMLImageElement | null
  if (qrImg) {
    qrImg.src = qrUrl
  }

  // Update Direct UPI App Button (Mobile Link)
  const mobileLink = document.getElementById("mobile-upi-deep-link") as HTMLAnchorElement | null
  if (mobileLink) {
    mobileLink.href = upiLink
  }
}

// ─── Update Progress & Milestones Dynamically ──────────────────────────────────
function updateProgressAndMilestones(currentAmount: number) {
  const wrapper = document.querySelector(".donation-wrapper") as HTMLElement | null
  if (!wrapper) return

  const goalAmount = parseInt(wrapper.getAttribute("data-goal-amount") || "35000", 10)
  const currencySymbol = wrapper.getAttribute("data-currency-symbol") || "₹"

  // 1. Calculate and update Progress Percent
  const progressPercent = Math.min(Math.round((currentAmount / goalAmount) * 100), 100)
  
  // Update FAB progress badge
  const fabBadge = document.querySelector(".donation-fab-progress-badge") as HTMLElement | null
  if (fabBadge) {
    fabBadge.textContent = `${progressPercent}%`
  }
  
  // Update main progress bar width
  const progressBarFill = document.querySelector(".donation-progressbar-fill") as HTMLElement | null
  if (progressBarFill) {
    progressBarFill.style.width = `${progressPercent}%`
  }
  
  // Update progress bar floating percentage badge
  const progressBadge = document.querySelector(".donation-progressbar-badge") as HTMLElement | null
  if (progressBadge) {
    progressBadge.textContent = `${progressPercent}%`
    progressBadge.style.left = `calc(${progressPercent}% - 20px)`
  }
  
  // Update text counter e.g. "₹5,000 raised"
  const currentAmtText = document.querySelector(".progress-text-left strong") as HTMLElement | null
  if (currentAmtText) {
    currentAmtText.textContent = `${currencySymbol}${currentAmount.toLocaleString("en-IN")}`
  }

  // 2. Loop and update all Milestone Steps Dynamically
  const milestoneItems = document.querySelectorAll(".milestone-item")
  let isFirstIncompleteFound = false

  milestoneItems.forEach((item) => {
    const goal = parseInt(item.getAttribute("data-goal") || "0", 10)
    const isCompleted = currentAmount >= goal
    
    // Remove current classes
    item.classList.remove("completed", "active", "locked")
    
    let statusClass = "locked"
    let isCompletedStatus = false
    let isActiveStatus = false

    if (isCompleted) {
      statusClass = "completed"
      isCompletedStatus = true
    } else if (!isFirstIncompleteFound) {
      statusClass = "active"
      isActiveStatus = true
      isFirstIncompleteFound = true
    }

    item.classList.add(statusClass)

    // Rebuild SVG Icon dynamically
    const indicatorWrapper = item.querySelector(".milestone-status-indicator") as HTMLElement | null
    if (indicatorWrapper) {
      const line = indicatorWrapper.querySelector(".milestone-line") as HTMLElement | null
      
      let iconHtml = ""
      if (isCompletedStatus) {
        iconHtml = `
          <div class="indicator-icon completed">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        `
      } else if (isActiveStatus) {
        iconHtml = `
          <div class="indicator-icon active">
            <span class="milestone-pulse"></span>
          </div>
        `
      } else {
        iconHtml = `
          <div class="indicator-icon locked">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
        `
      }

      indicatorWrapper.innerHTML = iconHtml
      if (line) {
        line.className = `milestone-line ${isCompletedStatus ? "completed" : ""}`
        indicatorWrapper.appendChild(line)
      }
    }
  })
}

// ─── Fetch Dynamic Fund amount ─────────────────────────────────────────────────
async function fetchDynamicFund() {
  const wrapper = document.querySelector(".donation-wrapper") as HTMLElement | null
  if (!wrapper) return

  // 1. Fetch dynamic local funding data first (guarantees instant, network-free render!)
  const localFundingUrl = wrapper.getAttribute("data-local-funding-url")?.trim()
  if (localFundingUrl) {
    try {
      const res = await fetch(localFundingUrl)
      if (res.ok) {
        const data = await res.json()
        if (data) {
          // Update progress bar
          if (typeof data.currentAmount === "number") {
            updateProgressAndMilestones(data.currentAmount)
          }
          // Update Sponsors List
          if (Array.isArray(data.sponsors)) {
            updateCreditsPageSponsors(data.sponsors)
          }
          // Update Note Contributors
          if (Array.isArray(data.contributors)) {
            updateCreditsPageContributors(data.contributors)
          }
        }
      }
    } catch (err) {
      console.warn("Failed to fetch local funding data:", err)
    }
  }

  // 2. Fetch remote live updates (when deployed on production)
  const fundUrl = wrapper.getAttribute("data-fund-url")?.trim()
  if (!fundUrl || fundUrl.includes("localhost") || fundUrl.includes("127.0.0.1")) return
  
  try {
    const res = await fetch(fundUrl)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    
    // Update Donation modal progress bar & milestones
    if (data && typeof data.currentAmount === "number") {
      updateProgressAndMilestones(data.currentAmount)
    }

    // Update Credits page Hall of Fame dynamically
    if (data && Array.isArray(data.sponsors)) {
      updateCreditsPageSponsors(data.sponsors)
    }

    // Update Credits page Note Contributors dynamically
    if (data && Array.isArray(data.contributors)) {
      updateCreditsPageContributors(data.contributors)
    }
  } catch (err) {
    console.warn("Failed to fetch dynamic remote donation updates from:", fundUrl, err)
  }
}


type Sponsor = { 
  name: string
  amount: number
  avatar?: string
  url?: string
}

type Contributor = {
  name: string
  url?: string
  count: number
}

function updateCreditsPageSponsors(sponsors: Sponsor[]) {
  const helperContainer = document.getElementById("members-helper")
  const yaarContainer = document.getElementById("members-yaar")
  const superContainer = document.getElementById("members-super")
  const gooderContainer = document.getElementById("members-gooder")
  
  // If we are not on the Credits page, exit early (prevents errors on other pages!)
  if (!helperContainer && !yaarContainer && !superContainer && !gooderContainer) {
    return
  }

  // Clear placeholders if containers exist
  if (helperContainer) helperContainer.innerHTML = ""
  if (yaarContainer) yaarContainer.innerHTML = ""
  if (superContainer) superContainer.innerHTML = ""
  if (gooderContainer) gooderContainer.innerHTML = ""

  sponsors.forEach((sponsor) => {
    if (!sponsor.name || typeof sponsor.amount !== "number") return

    const amount = sponsor.amount
    let targetContainer: HTMLElement | null = null
    let extraClass = ""
    let roleText = "Helper Bro"
    let descText = "Sponsoring chai and helping keep the server online! ☕"

    // 1. Classify into exact tiers dynamically based on transaction amount (INR)
    if (amount >= 1000) {
      targetContainer = gooderContainer
      extraClass = "tier-gooder-badge"
      roleText = "Goldy Bro"
      descText = "Ultimate patron speeding up note creation focus! 👑"
    } else if (amount >= 500) {
      targetContainer = superContainer
      extraClass = "tier-super-badge"
      roleText = "Super Bro"
      descText = "Supporting premium cheat sheets and DSA revisions! 🚀"
    } else if (amount >= 200) {
      targetContainer = yaarContainer
      extraClass = "tier-yaar-badge"
      roleText = "Yaar Bro"
      descText = "Sponsoring coffee and backing core note updates! ☕"
    } else {
      // Fallback for helper tier (guarantees testing values like ₹0 are visible!)
      targetContainer = helperContainer
      extraClass = "tier-helper-badge"
      roleText = "Helper Bro"
      descText = "Sponsoring chai and helping keep the server online! ☕"
    }

    if (!targetContainer) return

    // 2. Resolve sponsor avatar URL
    let resolvedAvatar = sponsor.avatar?.trim() || ""
    let githubUsername = ""
    if (sponsor.url && sponsor.url.includes("github.com/")) {
      const parts = sponsor.url.split("github.com/")
      if (parts.length > 1) {
        const username = parts[1].split("/")[0].trim()
        if (username) {
          githubUsername = username
          if (!resolvedAvatar) {
            resolvedAvatar = `https://github.com/${username}.png`
          }
        }
      }
    }
    if (!resolvedAvatar) {
      resolvedAvatar = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(sponsor.name)}`
    }

    // 3. Build Sponsor Card
    const item = document.createElement("div")
    item.className = `sponsor-card-item ${extraClass}`

    // Avatar section
    const avatarWrapper = document.createElement("div")
    avatarWrapper.className = "sponsor-card-avatar"
    
    const img = document.createElement("img")
    img.src = resolvedAvatar
    img.alt = `${sponsor.name} Avatar`
    avatarWrapper.appendChild(img)

    const glow = document.createElement("div")
    glow.className = "sponsor-avatar-glow"
    avatarWrapper.appendChild(glow)

    item.appendChild(avatarWrapper)

    // Info section
    const info = document.createElement("div")
    info.className = "sponsor-card-info"

    const h4 = document.createElement("h4")
    h4.textContent = sponsor.name
    info.appendChild(h4)

    const levelBadge = document.createElement("span")
    levelBadge.className = "sponsor-level-badge"
    levelBadge.textContent = roleText
    info.appendChild(levelBadge)

    const desc = document.createElement("p")
    desc.textContent = descText
    info.appendChild(desc)

    if (sponsor.url) {
      const link = document.createElement("a")
      link.href = sponsor.url
      link.target = "_blank"
      link.rel = "noopener noreferrer"
      link.className = "sponsor-link"
      link.textContent = githubUsername ? `@${githubUsername}` : "Profile ➔"
      info.appendChild(link)
    }

    item.appendChild(info)
    targetContainer.appendChild(item)
  })

  // Set friendly placeholders for any currently empty tiers to encourage sponsorship
  const checkEmpty = (container: HTMLElement | null, tierName: string) => {
    if (container && container.children.length === 0) {
      const placeholder = document.createElement("span")
      placeholder.className = "member-badge-placeholder"
      placeholder.setAttribute("style", "font-style: italic; color: var(--gray); font-size: 0.8rem;")
      placeholder.textContent = `Waiting for our first ${tierName}! 💖`
      container.appendChild(placeholder)
    }
  }

  checkEmpty(helperContainer, "Helper")
  checkEmpty(yaarContainer, "Yaar")
  checkEmpty(superContainer, "Super")
  checkEmpty(gooderContainer, "Gooder")
}

function updateCreditsPageContributors(contributors: Contributor[]) {
  const container = document.getElementById("contributors-container")
  if (!container) return

  // Clear existing items to render dynamic list from scratch
  container.innerHTML = ""

  contributors.forEach((c) => {
    // 1. Resolve avatar & GitHub Username handle
    let avatarUrl = ""
    let githubUsername = ""
    if (c.url && c.url.includes("github.com/")) {
      const parts = c.url.split("github.com/")
      if (parts.length > 1) {
        const username = parts[1].split("/")[0].trim()
        if (username) {
          githubUsername = username
          avatarUrl = `https://github.com/${username}.png`
        }
      }
    }
    if (!avatarUrl) {
      if (c.name.toLowerCase() === "vaibhav rathod") {
        avatarUrl = "https://github.com/VR-Rathod.png"
      } else {
        avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(c.name)}`
      }
    }

    // 2. Build Card
    const item = document.createElement("div")
    item.className = "credits-contributor-item"

    // Avatar section
    const avatarWrapper = document.createElement("div")
    avatarWrapper.className = "credits-contributor-avatar"
    
    const img = document.createElement("img")
    img.src = avatarUrl
    img.alt = `${c.name} Avatar`
    avatarWrapper.appendChild(img)

    const glow = document.createElement("div")
    glow.className = "credits-avatar-glow"
    avatarWrapper.appendChild(glow)

    item.appendChild(avatarWrapper)

    // Info section
    const info = document.createElement("div")
    info.className = "credits-contributor-info"

    const h4 = document.createElement("h4")
    h4.textContent = c.name
    info.appendChild(h4)

    const roleBadge = document.createElement("span")
    const isLead = c.name.toLowerCase() === "vaibhav rathod"
    roleBadge.className = `contributor-role-badge ${isLead ? "lead" : ""}`
    roleBadge.textContent = isLead ? "Lead Author" : "Note Contributor"
    info.appendChild(roleBadge)

    const desc = document.createElement("p")
    if (isLead) {
      desc.textContent = "Developer & creator of Free Code Notes. Passionate about CS, Cybersec, and Systems."
    } else {
      desc.textContent = `Contributed to ${c.count} ${c.count === 1 ? "note page" : "note pages"} on Free Code Notes!`
    }
    info.appendChild(desc)

    if (c.url) {
      const link = document.createElement("a")
      link.href = c.url
      link.target = "_blank"
      link.rel = "noopener noreferrer"
      link.className = "contributor-link"
      link.textContent = githubUsername ? `@${githubUsername}` : "Profile ➔"
      info.appendChild(link)
    }

    item.appendChild(info)
    container.appendChild(item)
  })
}

// ─── Copy to Clipboard Helper ─────────────────────────────────────────────────
async function copyToClipboard(text: string, button: HTMLButtonElement) {
  try {
    await navigator.clipboard.writeText(text)
    
    // Success UI Feedback
    const origHtml = button.innerHTML
    button.classList.add("copied")
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span class="copy-btn-text">Copied!</span>
    `
    
    setTimeout(() => {
      button.classList.remove("copied")
      button.innerHTML = origHtml
    }, 2000)
  } catch (err) {
    console.error("Failed to copy UPI ID: ", err)
  }
}

// ─── Show/Hide Modal Helpers ──────────────────────────────────────────────────
function openDonationModal() {
  const modal = document.getElementById("donation-hub-modal")
  if (modal) {
    modal.classList.add("show")
    document.body.style.overflow = "hidden" // Prevent page scroll when modal is open
    
    // Trigger progress bar animation by resetting the width style (so it animates on load)
    const progressBarFill = modal.querySelector(".donation-progressbar-fill") as HTMLElement | null
    if (progressBarFill) {
      const originalWidth = progressBarFill.style.width
      progressBarFill.style.width = "0%"
      setTimeout(() => {
        progressBarFill.style.width = originalWidth
      }, 50)
    }
  }
  
  // Hide scroll toast if it was open
  hideScrollToast()
}

function closeDonationModal() {
  const modal = document.getElementById("donation-hub-modal")
  if (modal) {
    modal.classList.remove("show")
    document.body.style.overflow = "" // Re-enable page scroll
  }
}

// ─── Toast Banner Management ──────────────────────────────────────────────────
function checkShouldShowToast(): boolean {
  // If already shown in this active page session or dismissed globally
  if (isToastShownThisSession) return false
  
  const dismissedUntilStr = localStorage.getItem("donation-toast-dismissed-until")
  if (dismissedUntilStr) {
    const dismissedUntil = parseInt(dismissedUntilStr, 10)
    const currentTime = Date.now()
    if (currentTime < dismissedUntil) {
      return false // Dismissed recently, within active threshold
    }
  }
  return true
}

function showScrollToast() {
  const toast = document.getElementById("donation-scroll-toast")
  if (toast && checkShouldShowToast()) {
    toast.classList.add("show")
    isToastShownThisSession = true
    cleanupScrollListeners() // Only show once per page load
  }
}

function hideScrollToast() {
  const toast = document.getElementById("donation-scroll-toast")
  if (toast) {
    toast.classList.remove("show")
  }
}

function permanentlyDismissToast(days: number = 3) {
  const expiryTime = Date.now() + days * 24 * 60 * 60 * 1000
  localStorage.setItem("donation-toast-dismissed-until", expiryTime.toString())
  hideScrollToast()
  cleanupScrollListeners()
}

function cleanupScrollListeners() {
  if (scrollListener) {
    window.removeEventListener("scroll", scrollListener)
    scrollListener = null
  }
  if (scrollTimeoutId) {
    clearTimeout(scrollTimeoutId)
    scrollTimeoutId = null
  }
}

function initScrollDetection() {
  cleanupScrollListeners()
  
  // Always fetch dynamic donation progress on page load / SPA navigation
  fetchDynamicFund()
  
  if (!checkShouldShowToast()) return

  // Trigger A: Show on scroll past 30% of content
  scrollListener = () => {
    const scrolled = window.scrollY
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight
    if (totalHeight > 0 && scrolled / totalHeight > 0.3) {
      showScrollToast()
    }
  }
  window.addEventListener("scroll", scrollListener)

  // Trigger B: Show after reading for 20 seconds
  scrollTimeoutId = setTimeout(() => {
    showScrollToast()
  }, 20000)
}

// ─── GLOBAL EVENT DELEGATION ──────────────────────────────────────────────────
if (!isDonationInitialized) {
  isDonationInitialized = true

  // Escape key → close modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDonationModal()
    }
  })

  // Register single global click delegator on document (SPA proof!)
  document.addEventListener("click", (e) => {
    const t = e.target as HTMLElement
    
    // 1. Open Modal (from FAB or Scroll Toast)
    if (t.closest(".donation-fab") || t.closest("#donation-toast-open-modal-btn")) {
      e.preventDefault(); e.stopPropagation()
      openDonationModal()
      return
    }

    // 2. Close Modal
    if (t.closest("#donation-modal-close-btn") || t.id === "donation-modal-backdrop") {
      e.preventDefault(); e.stopPropagation()
      closeDonationModal()
      return
    }

    // 3. Dismiss Toast / Banner (Temporary or Permanent)
    if (t.closest("#donation-toast-close-btn") || t.closest("#donation-toast-later-btn")) {
      e.preventDefault(); e.stopPropagation()
      permanentlyDismissToast(3) // Hide for 3 days
      return
    }

    // 4. Amount Presets Selection
    const presetBtn = t.closest<HTMLButtonElement>(".preset-btn")
    if (presetBtn) {
      e.preventDefault(); e.stopPropagation()
      
      const allPresets = document.querySelectorAll(".payment-presets .preset-btn")
      allPresets.forEach(btn => btn.classList.remove("active"))
      presetBtn.classList.add("active")

      const customInputContainer = document.getElementById("custom-amount-input-box")
      
      // If Custom amount button was clicked
      if (presetBtn.classList.contains("custom-preset-trigger")) {
        if (customInputContainer) {
          customInputContainer.style.display = "flex"
          // Focus the custom input
          const customVal = document.getElementById("custom-amount-val") as HTMLInputElement | null
          if (customVal) customVal.focus()
        }
      } else {
        // Preset clicked (50, 100, 200)
        if (customInputContainer) {
          customInputContainer.style.display = "none"
        }
        const amtAttr = presetBtn.getAttribute("data-amount")
        if (amtAttr) {
          selectedAmount = parseInt(amtAttr, 10)
          updatePaymentDetails(selectedAmount)
        }
      }
      return
    }

    // 5. Custom Amount Apply Button
    if (t.closest("#custom-amount-apply-btn")) {
      e.preventDefault(); e.stopPropagation()
      const customVal = document.getElementById("custom-amount-val") as HTMLInputElement | null
      if (customVal) {
        const amt = parseInt(customVal.value, 10)
        if (!isNaN(amt) && amt > 0) {
          selectedAmount = amt
          updatePaymentDetails(selectedAmount)
          
          // Re-focus apply success or give border feedback
          const inputWrapper = document.querySelector(".custom-amount-input-wrapper") as HTMLElement | null
          if (inputWrapper) {
            inputWrapper.style.borderColor = "var(--tertiary)"
            setTimeout(() => {
              inputWrapper.style.borderColor = ""
            }, 1000)
          }
        } else {
          customVal.style.borderColor = "var(--red, #ff5555)"
          setTimeout(() => {
            customVal.style.borderColor = ""
          }, 1000)
        }
      }
      return
    }

    // 6. Copy UPI ID Button
    const copyBtn = t.closest<HTMLButtonElement>("#upi-id-copy-btn")
    if (copyBtn) {
      e.preventDefault(); e.stopPropagation()
      const { upiId } = getUpiConfig()
      copyToClipboard(upiId, copyBtn)
      return
    }

    // 7. Payment Tab Switching (UPI vs Global GitHub Sponsors)
    const tabUpi = t.closest<HTMLButtonElement>("#tab-btn-upi")
    if (tabUpi) {
      e.preventDefault(); e.stopPropagation()
      const upiBtn = document.getElementById("tab-btn-upi")
      const globalBtn = document.getElementById("tab-btn-global")
      const upiPanel = document.getElementById("panel-upi")
      const globalPanel = document.getElementById("panel-global")
      if (upiBtn && globalBtn && upiPanel && globalPanel) {
        upiBtn.classList.add("active")
        globalBtn.classList.remove("active")
        upiPanel.style.display = "block"
        upiPanel.classList.add("active")
        globalPanel.style.display = "none"
        globalPanel.classList.remove("active")
      }
      return
    }

    const tabGlobal = t.closest<HTMLButtonElement>("#tab-btn-global")
    if (tabGlobal) {
      e.preventDefault(); e.stopPropagation()
      const upiBtn = document.getElementById("tab-btn-upi")
      const globalBtn = document.getElementById("tab-btn-global")
      const upiPanel = document.getElementById("panel-upi")
      const globalPanel = document.getElementById("panel-global")
      if (upiBtn && globalBtn && upiPanel && globalPanel) {
        globalBtn.classList.add("active")
        upiBtn.classList.remove("active")
        globalPanel.style.display = "block"
        globalPanel.classList.add("active")
        upiPanel.style.display = "none"
        upiPanel.classList.remove("active")
      }
      return
    }
  })

  // Enter key press in custom amount input field
  document.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const activeEl = document.activeElement as HTMLElement | null
      if (activeEl && activeEl.id === "custom-amount-val") {
        const applyBtn = document.getElementById("custom-amount-apply-btn")
        if (applyBtn) {
          applyBtn.click()
        }
      }
    }
  })
}

function initSupportersSearch() {
  const searchInput = document.getElementById("supporter-search") as HTMLInputElement | null
  if (!searchInput) return

  searchInput.addEventListener("input", (e) => {
    const query = (e.target as HTMLInputElement).value.toLowerCase().trim()
    
    // 1. Filter sponsors
    const sponsorCards = document.querySelectorAll(".sponsor-card-item")
    sponsorCards.forEach((card) => {
      const name = card.querySelector("h4")?.textContent?.toLowerCase() || ""
      const desc = card.querySelector("p")?.textContent?.toLowerCase() || ""
      const match = name.includes(query) || desc.includes(query)
      const element = card as HTMLElement
      if (query === "" || match) {
        element.style.display = ""
        element.style.opacity = "1"
        element.style.transform = ""
      } else {
        element.style.opacity = "0"
        element.style.transform = "scale(0.95)"
        setTimeout(() => {
          if (element.style.opacity === "0") {
            element.style.display = "none"
          }
        }, 150)
      }
    })
    
    // 2. Filter contributors
    const contributorItems = document.querySelectorAll(".credits-contributor-item")
    contributorItems.forEach((card) => {
      const name = card.querySelector("h4")?.textContent?.toLowerCase() || ""
      const desc = card.querySelector("p")?.textContent?.toLowerCase() || ""
      const match = name.includes(query) || desc.includes(query)
      const element = card as HTMLElement
      if (query === "" || match) {
        element.style.display = ""
        element.style.opacity = "1"
        element.style.transform = ""
      } else {
        element.style.opacity = "0"
        element.style.transform = "scale(0.97)"
        setTimeout(() => {
          if (element.style.opacity === "0") {
            element.style.display = "none"
          }
        }, 150)
      }
    })
  })
}

// ─── INITIAL RUN AND SPA PAGE TRANSITION (NAV) ────────────────────────────────
// Triggered on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initScrollDetection()
    initSupportersSearch()
  })
} else {
  initScrollDetection()
  initSupportersSearch()
}

// Triggered during Quartz SPA page transitions
document.addEventListener("nav", () => {
  // Reset the temporary session flag so if they browse around, the slide-in is set up again
  // (unless permanently dismissed)
  isToastShownThisSession = false
  initScrollDetection()
  initSupportersSearch()
  
  // Make sure modal isn't locked open in the background after moving to a new page
  closeDonationModal()
})
