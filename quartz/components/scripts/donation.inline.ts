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

// ─── INITIAL RUN AND SPA PAGE TRANSITION (NAV) ────────────────────────────────
// Triggered on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initScrollDetection()
  })
} else {
  initScrollDetection()
}

// Triggered during Quartz SPA page transitions
document.addEventListener("nav", () => {
  // Reset the temporary session flag so if they browse around, the slide-in is set up again
  // (unless permanently dismissed)
  isToastShownThisSession = false
  initScrollDetection()
  
  // Make sure modal isn't locked open in the background after moving to a new page
  closeDonationModal()
})
