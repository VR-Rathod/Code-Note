import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/donation.scss"
// @ts-ignore
import script from "./scripts/donation.inline"
import { classNames } from "../util/lang"

// --- PREMIUM DONATION CONFIGURATION ---
// The user can easily customize these values here!
const DONATION_CONFIG = {
  upiId: "vaibhavrathod2282-2@okaxis", // Change this to your actual UPI ID
  payeeName: "Vaibhav Rathod", // Your name associated with the UPI ID
  currentAmount: 0, // Total donations received so far (starting at 0)
  goalAmount: 25000, // Monthly goal target (scaled to 25k)
  currencySymbol: "₹",
  currencyCode: "INR",
  milestones: [
    {
      title: "Domain & Server Hosting",
      goal: 1500,
      desc: "Ensure the server stays online, ad-free and extremely fast for everyone.",
    },
    {
      title: "The Foundation: Ad-Free & Blazing Fast",
      goal: 3000,
      desc: "Keeping the servers running smoothly. No ads, no paywalls, just pure, uninterrupted learning with zero latency for everyone."
    },
    {
      title: "The Polyglot Upgrade: Multi-Language Snippets",
      goal: 5000,
      desc: "Learn the logic once, read it in your favorite language. I will upgrade all notes to include toggleable code snippets (C++, Python, Java, JavaScript, etc.)."
    }, {
      title: "Cybersec Walkthroughs & Lab Notes",
      goal: 8000,
      desc: "Writing hands-on penetration testing guides, CTF writeups, and network security cheatsheets.",
    },
    {
      title: "Interactive Quizzes & Flashcards",
      goal: 12000,
      desc: "Building interactive flashcards, revision quiz modules, and DSA practice challenges directly in notes.",
    },
    {
      title: "System Design & Scale Architecture",
      goal: 18000,
      desc: "Expanding roadmap to cover microservices, caching, load balancers, and high-scale architecture guides.",
    },
    {
      title: "Full-Time Focus & Daily Notes Updates",
      goal: 25000,
      desc: "Enabling daily commits, custom student requests, personalized study guides, and direct support.",
    },
  ],
}

const Donation: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  const { upiId, payeeName, currentAmount, goalAmount, currencySymbol, currencyCode, milestones } = DONATION_CONFIG
  const progressPercent = Math.min(Math.round((currentAmount / goalAmount) * 100), 100)

  // Default deep link for UPI (Initial preset ₹100)
  const defaultAmount = 100
  const defaultNote = encodeURIComponent(`Donation to Code-Note - Support Vaibhav`)
  const defaultUpiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${defaultAmount}&cu=${currencyCode}&tn=${defaultNote}`
  const defaultQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(defaultUpiLink)}`

  return (
    <div class={classNames(displayClass, "donation-wrapper")}>
      {/* 1. Floating Action Button (FAB) */}
      <button
        class="donation-fab"
        id="donation-fab-btn"
        aria-label="Support Server Fund & Donate"
        title="Support Server Fund"
      >
        <span class="donation-fab-pulse"></span>
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
        <span class="donation-fab-text">Support Fund</span>
        <span class="donation-fab-progress-badge">{progressPercent}%</span>
      </button>

      {/* 2. Intelligent Bottom Scroll Slide-in Banner */}
      <div class="donation-toast" id="donation-scroll-toast" role="alert" aria-live="polite">
        <button class="donation-toast-close" id="donation-toast-close-btn" aria-label="Dismiss donation notification">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div class="donation-toast-content">
          <div class="donation-toast-header">
            <span class="donation-toast-badge">🚀 Server Fund</span>
            <h4>Enjoying the Notes?</h4>
          </div>
          <p>Help keep this knowledge base fast, ad-free, and expanding! We are currently at <strong>{progressPercent}%</strong> of our domain & hosting goal.</p>
          <div class="donation-toast-actions">
            <button class="donation-toast-btn-primary" id="donation-toast-open-modal-btn">
              View Goal & Support
            </button>
            <button class="donation-toast-btn-secondary" id="donation-toast-later-btn">
              Maybe Later
            </button>
          </div>
        </div>
      </div>

      {/* 3. Interactive Donation Hub Modal */}
      <div class="donation-modal" id="donation-hub-modal" role="dialog" aria-labelledby="donation-modal-title" aria-modal="true">
        <div class="donation-modal-backdrop" id="donation-modal-backdrop"></div>
        <div class="donation-modal-content">
          {/* Close Button */}
          <button class="donation-modal-close" id="donation-modal-close-btn" aria-label="Close donation modal">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Modal Header */}
          <div class="donation-modal-header">
            <div class="donation-modal-heart-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <h2 id="donation-modal-title">Server Fund & Donation Hub</h2>
            <p class="donation-modal-subtitle">Supporting Open-Source Notes by <strong>{payeeName}</strong></p>
          </div>

          <div class="donation-modal-body">
            {/* Left Side: Milestones and Goal Progress */}
            <div class="donation-modal-progress-section">
              <div class="donation-progress-header">
                <h3>Goal & Progress</h3>
                <span class="donation-progress-numbers">
                  <strong>{currencySymbol}{currentAmount.toLocaleString("en-IN")}</strong>
                  <span class="separator">/</span>
                  <span class="goal">{currencySymbol}{goalAmount.toLocaleString("en-IN")}</span>
                </span>
              </div>

              {/* Progress Bar Container */}
              <div class="donation-progressbar-container">
                <div class="donation-progressbar-track">
                  <div class="donation-progressbar-fill" style={{ width: `${progressPercent}%` }}>
                    <div class="donation-progressbar-glow"></div>
                  </div>
                </div>
                <div class="donation-progressbar-badge" style={{ left: `calc(${progressPercent}% - 20px)` }}>
                  {progressPercent}%
                </div>
              </div>

              {/* Milestones Steps */}
              <div class="donation-milestones">
                <h3>Milestone Roadmap</h3>
                <div class="milestones-list">
                  {milestones.map((milestone, idx) => {
                    // Calculate status dynamically based on currentAmount
                    const isCompleted = currentAmount >= milestone.goal
                    const isPriorCompleted = idx === 0 || milestones.slice(0, idx).every(m => currentAmount >= m.goal)
                    const isActive = !isCompleted && isPriorCompleted
                    const statusClass = isCompleted ? "completed" : (isActive ? "active" : "locked")

                    return (
                      <div class={`milestone-item ${statusClass}`} key={idx}>
                        <div class="milestone-status-indicator">
                          {isCompleted ? (
                            <div class="indicator-icon completed">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </div>
                          ) : isActive ? (
                            <div class="indicator-icon active">
                              <span class="milestone-pulse"></span>
                            </div>
                          ) : (
                            <div class="indicator-icon locked">
                              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                              </svg>
                            </div>
                          )}
                          {idx < milestones.length - 1 && <div class={`milestone-line ${isCompleted ? "completed" : ""}`}></div>}
                        </div>
                        <div class="milestone-text">
                          <div class="milestone-title-row">
                            <h4>{milestone.title}</h4>
                            <span class="milestone-goal-badge">{currencySymbol}{milestone.goal}</span>
                          </div>
                          <p>{milestone.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right Side: Interactive Payment Area */}
            <div class="donation-modal-payment-section">
              <h3>⚡ Donate via UPI</h3>
              <p class="payment-desc">Scan the QR code or pay using your preferred UPI app. 100% of the funds go directly towards Server & Content maintenance.</p>

              {/* Amount Preset Selector */}
              <div class="payment-presets">
                <label>Select Amount</label>
                <div class="presets-grid">
                  <button class="preset-btn" data-amount="50" aria-label="Donate ₹50">
                    <span>{currencySymbol}50</span>
                    <small>☕ Chai</small>
                  </button>
                  <button class="preset-btn active" data-amount="100" aria-label="Donate ₹100">
                    <span>{currencySymbol}100</span>
                    <small>☕ Coffee</small>
                  </button>
                  <button class="preset-btn" data-amount="200" aria-label="Donate ₹200">
                    <span>{currencySymbol}200</span>
                    <small>📚 Book</small>
                  </button>
                  <button class="preset-btn custom-preset-trigger" id="custom-preset-btn" aria-label="Enter custom amount">
                    <span>Custom</span>
                    <small>💬 Say Thanks</small>
                  </button>
                </div>

                {/* Custom Amount Input Container (Hidden by default) */}
                <div class="custom-amount-container" id="custom-amount-input-box" style={{ display: "none" }}>
                  <div class="custom-amount-input-wrapper">
                    <span class="input-currency">{currencySymbol}</span>
                    <input
                      type="number"
                      id="custom-amount-val"
                      min="1"
                      max="100000"
                      value="100"
                      placeholder="Enter amount..."
                      aria-label="Custom donation amount"
                    />
                  </div>
                  <button class="custom-amount-apply" id="custom-amount-apply-btn">Apply</button>
                </div>
              </div>

              {/* Interactive UPI Payment Display */}
              <div class="payment-box">
                {/* QR Code Container */}
                <div class="qrcode-wrapper">
                  <div class="qrcode-border">
                    <img
                      src={defaultQrUrl}
                      alt="UPI Scan to Pay QR Code"
                      id="donation-qr-code-img"
                      class="qrcode-img"
                    />
                    <div class="qrcode-scanner-line"></div>
                  </div>
                  <span class="qrcode-hint">Scan with GPay, PhonePe, Paytm, or BHIM</span>
                </div>

                {/* Mobile Launch UPI Apps Deep Link */}
                <div class="mobile-pay-wrapper">
                  <a
                    href={defaultUpiLink}
                    class="mobile-pay-btn"
                    id="mobile-upi-deep-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                    Pay via UPI App
                  </a>
                </div>

                {/* Copyable UPI ID section */}
                <div class="upi-id-copy-box">
                  <label for="upi-id-input">Or Copy UPI ID</label>
                  <div class="upi-input-group">
                    <input
                      type="text"
                      id="upi-id-input"
                      value={upiId}
                      readonly
                      aria-label="UPI ID"
                    />
                    <button
                      class="upi-copy-btn"
                      id="upi-id-copy-btn"
                      aria-label="Copy UPI ID to clipboard"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="copy-icon">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                      <span class="copy-btn-text">Copy</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div class="donation-modal-footer">
            <p>🔒 Safe & direct transfer. Only Indian banking apps support scanning UPI QR codes.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

Donation.css = style
Donation.afterDOMLoaded = script

export default (() => Donation) satisfies QuartzComponentConstructor
