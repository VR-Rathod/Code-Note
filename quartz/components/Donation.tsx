import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/donation.scss"
// @ts-ignore
import script from "./scripts/donation.inline"
import { classNames } from "../util/lang"
import { pathToRoot, joinSegments } from "../util/path"
import fs from "fs"
import path from "path"

// Read the real amount from the root funding.json file at compile-time (static pre-rendering!)
let initialAmount = 0
try {
  const fundingPath = path.join(process.cwd(), "funding.json")
  if (fs.existsSync(fundingPath)) {
    const rawData = fs.readFileSync(fundingPath, "utf-8")
    const data = JSON.parse(rawData)
    if (data && typeof data.currentAmount === "number") {
      initialAmount = data.currentAmount
    }
  }
} catch (err) {
  // Silent fallback to 0 if file is missing or malformed
}

// --- PREMIUM DONATION CONFIGURATION ---
// The user can easily customize these values here!
const DONATION_CONFIG = {
  upiId: "codenotemanage@upi", // Change this to your actual UPI ID
  payeeName: "Vaibhav Rathod", // Your name associated with the UPI ID
  currentAmount: initialAmount, // Loaded dynamically from funding.json at compile-time!
  goalAmount: 96369, // Expanded monthly goal target (scaled to 35k)
  currencySymbol: "₹",
  currencyCode: "INR",
  // OPTIONAL: Paste a raw URL to a public JSON file (like a GitHub file or Gist) to load the donation amount dynamically!
  // The JSON should look like: { "currentAmount": 3510 }
  dynamicFundUrl: "https://raw.githubusercontent.com/VR-Rathod/Code-Note/Web-live/funding.json",
  milestones: [
    {
      title: "Custom Domain & CDN Routing",
      goal: 3000,
      desc: "Securing our custom domain (.com/.dev) and global CDN caching to ensure the notes are instantly accessible worldwide.",
    },
    {
      title: "Progressive Web App With Ofline Reading",
      goal: 4500,
      desc: "Developing a Progressive Web App (PWA) that enables offline reading, quick shortcuts, and instant access to notes without an internet connection.",
    },
    {
      title: "Learning Resources & Textbooks",
      goal: 7000,
      desc: "Purchasing premium reference books, advanced research papers, and technical documentations to compile and write highly accurate notes.",
    },
    {
      title: "Interactive Visual Roadmaps",
      goal: 12000,
      desc: "Creating interactive, scroll-based visual roadmaps for each programming track that explain concepts step-by-step with diagrams and code examples.",
    },
    {
      title: "Cheat-Sheet",
      goal: 15000,
      desc: "Able to make Pdf and high quality printable pdfs.",
    },
    {
      title: "Study Motivation (Chai & Fuel)",
      goal: 20000,
      desc: "Fueling late-night writing and research sessions with tea/coffee, devoting hours every evening to expanding programming guides.",
    },
    {
      title: "Community Custom Note Requests",
      goal: 25000,
      desc: "Devoting prioritized time to write detailed note pages, debugging walkthroughs, and technical deep-dives specifically requested by you.",
    },
    {
      title: "Premium Offline PDF Exports",
      goal: 30000,
      desc: "Designing and formatting beautiful, offline-friendly downloadable PDF cheatsheets of entire folders (DSA, Systems, Cybersec) for student access.",
    },
    {
      title: "Full-Time Dedicated Note Focus",
      goal: 35000,
      desc: "Unlocking absolute speed! Devoting full-time hours to researching, summarizing, and publishing daily, high-quality, ad-free programming pages.",
    },
    {
      title: "AI Roadmap and Guide ",
      goal: 45000,
      goalText: "₹45,000",
      desc: "AI Roadmap and Guide to develop provide special page and Tracking systeam for students",
    },
    {
      title: "Coming More Features 🚀",
      goal: 45001,
      goalText: "₹45,000+",
      desc: "Interactive visual cheat sheets, community study syllabus plans, and even faster search pipelines!",
    },
  ],
}

const Donation: QuartzComponent = ({ displayClass, fileData }: QuartzComponentProps) => {
  const { upiId, payeeName, currentAmount, goalAmount, currencySymbol, currencyCode, milestones } = DONATION_CONFIG
  const progressPercent = Math.min(Math.round((currentAmount / goalAmount) * 100), 100)

  // Default deep link for UPI (Initial preset ₹100)
  const defaultAmount = 100
  const defaultNote = encodeURIComponent(`Donation to Code-Note - Support Vaibhav`)
  const defaultUpiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${defaultAmount}&cu=${currencyCode}&tn=${defaultNote}`
  const defaultQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(defaultUpiLink)}`

  const baseDir = pathToRoot(fileData.slug!)
  const localFundingUrl = joinSegments(baseDir, "static/funding.json")

  return (
    <div 
      class={classNames(displayClass, "donation-wrapper")}
      data-goal-amount={goalAmount}
      data-currency-symbol={currencySymbol}
      data-fund-url={DONATION_CONFIG.dynamicFundUrl || ""}
      data-local-funding-url={localFundingUrl}
    >
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
            <div class="donation-modal-wall-link-wrapper">
              <a href="/credits" class="donation-modal-wall-link">
                🏆 View Supporters Wall of Fame ➔
              </a>
            </div>
          </div>

          <div class="donation-modal-body">
            {/* Left Side: Milestones and Goal Progress */}
            <div class="donation-modal-progress-section">
              <div class="donation-progress-header">
                <h3>Monthly Goal & Progress</h3>
                <span class="donation-progress-numbers">
                  <strong>{currencySymbol}{currentAmount.toLocaleString("en-IN")}</strong>
                  <span class="separator">/</span>
                  <span class="goal">
                    {currencySymbol}{goalAmount.toLocaleString("en-IN")}
                    <span class="goal-duration">/mo</span>
                  </span>
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
                      <div class={`milestone-item ${statusClass}`} data-goal={milestone.goal} key={idx}>
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
                            <span class="milestone-goal-badge">
                              {milestone.goalText ? milestone.goalText : `${currencySymbol}${milestone.goal.toLocaleString("en-IN")}`}
                            </span>
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
              {/* Donation Frequency Switcher */}
              <div class="donation-frequency-tabs">
                <button class="frequency-tab-btn active one-time-tab" aria-label="One-time Donation">
                  <span>One-time 💖</span>
                </button>
                <button class="frequency-tab-btn monthly-tab" aria-label="Monthly Donation">
                  <span>Monthly 🌟</span>
                </button>
              </div>

              {/* Sleek segment control tab switcher */}
              <div class="donation-payment-tabs">
                <button class="payment-tab-btn active tab-btn-upi" aria-label="Pay via UPI (INR)">
                  <span>🇮🇳 UPI (INR)</span>
                </button>
                <button class="payment-tab-btn tab-btn-global" aria-label="Pay via GitHub Sponsors (USD)">
                  <span>🌐 Global (USD)</span>
                </button>
              </div>

              {/* TAB 1: UPI PAYMENT PANEL */}
              <div class="payment-panel active panel-upi">
                <h3 class="upi-panel-title">⚡ Donate via UPI</h3>
                <p class="payment-desc upi-desc-text">Scan the QR code or pay using your preferred UPI app. 100% of the funds go directly towards Server & Content maintenance.</p>
                <div class="recurring-note-box upi-recurring-note" style={{ display: "none" }}>
                  <span>ℹ️ <strong>UPI Autopay Hint:</strong> Since UPI QR scans are one-time payments, you can enable recurring monthly transfers directly inside your UPI app (GPay, PhonePe, or BHIM) using our UPI ID, or use the <strong>Global (USD)</strong> tab to subscribe automatically!</span>
                </div>

                {/* Amount Preset Selector (One-time) */}
                <div class="payment-presets presets-one-time">
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
                    <button class="preset-btn custom-preset-trigger" aria-label="Enter custom amount">
                      <span>Custom</span>
                      <small>💬 Say Thanks</small>
                    </button>
                  </div>
                </div>

                {/* Amount Preset Selector (Monthly) */}
                <div class="payment-presets presets-monthly" style={{ display: "none" }}>
                  <label>Select Monthly Amount</label>
                  <div class="presets-grid">
                    <button class="preset-btn" data-amount="100" aria-label="Donate ₹100 monthly">
                      <span>{currencySymbol}100/mo</span>
                      <small>☕ Coffee</small>
                    </button>
                    <button class="preset-btn active" data-amount="200" aria-label="Donate ₹200 monthly">
                      <span>{currencySymbol}200/mo</span>
                      <small>📚 Book</small>
                    </button>
                    <button class="preset-btn" data-amount="500" aria-label="Donate ₹500 monthly">
                      <span>{currencySymbol}500/mo</span>
                      <small>🚀 Super Bro</small>
                    </button>
                    <button class="preset-btn custom-preset-trigger" aria-label="Enter custom amount">
                      <span>Custom</span>
                      <small>💬 Say Thanks</small>
                    </button>
                  </div>
                </div>

                  {/* Custom Amount Input Container (Hidden by default) */}
                  <div class="custom-amount-container custom-amount-input-box" style={{ display: "none" }}>
                    <div class="custom-amount-input-wrapper">
                      <span class="input-currency">{currencySymbol}</span>
                      <input
                        type="number"
                        class="custom-amount-val"
                        min="1"
                        max="100000"
                        value="100"
                        placeholder="Enter amount..."
                        aria-label="Custom donation amount"
                      />
                    </div>
                    <button class="custom-amount-apply custom-amount-apply-btn">Apply</button>
                  </div>

                {/* Interactive UPI Payment Display */}
                <div class="payment-box">
                  {/* QR Code Container */}
                  <div class="qrcode-wrapper">
                    <div class="qrcode-border">
                      <img
                        src={defaultQrUrl}
                        alt="UPI Scan to Pay QR Code"
                        class="qrcode-img donation-qr-code-img"
                      />
                      <div class="qrcode-scanner-line"></div>
                    </div>
                    <span class="qrcode-hint">Scan with GPay, PhonePe, Paytm, or BHIM</span>
                  </div>

                  {/* Mobile Launch UPI Apps Deep Link */}
                  <div class="mobile-pay-wrapper">
                    <a
                      href={defaultUpiLink}
                      class="mobile-pay-btn mobile-upi-deep-link"
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
                    <label>Or Copy UPI ID</label>
                    <div class="upi-input-group">
                      <input
                        type="text"
                        class="upi-id-input-field"
                        value={upiId}
                        readonly
                        aria-label="UPI ID"
                      />
                      <button
                        class="upi-copy-btn upi-id-copy-btn"
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

              {/* TAB 2: GLOBAL SPONSORS PANEL */}
              <div class="payment-panel panel-global" style={{ display: "none" }}>
                <div class="github-sponsors-native-card">
                  {/* Glowing header badge */}
                  <div class="gh-native-header">
                    <svg class="gh-icon" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                    <span class="gh-badge">GITHUB SPONSOR</span>
                  </div>

                  {/* Profile info with glowing avatar */}
                  <div class="gh-profile-box">
                    <div class="gh-avatar-wrapper">
                      <img src="https://github.com/VR-Rathod.png" alt="Vaibhav Rathod Avatar" class="gh-avatar-img" />
                      <div class="gh-avatar-glow"></div>
                    </div>
                    <div class="gh-profile-details">
                      <h4>Vaibhav Rathod</h4>
                      <a href="https://github.com/VR-Rathod" target="_blank" rel="noopener noreferrer" class="gh-username">@VR-Rathod</a>
                    </div>
                  </div>

                  {/* Core description */}
                  <p class="gh-desc gh-desc-text">
                    If you are outside India, you can support my open-source work directly on GitHub using Credit Card or PayPal. Every dollar goes directly towards cloud VPS hosting and note creation!
                  </p>

                  {/* Sponsor Tier Pills */}
                  <div class="gh-tiers-section">
                    <span class="gh-tiers-title">Popular Tiers</span>
                    <div class="gh-tiers-grid">
                      <div class="gh-tier-pill">
                        <span class="tier-price">$2/mo</span>
                        <span class="tier-name">☕ Chai</span>
                      </div>
                      <div class="gh-tier-pill">
                        <span class="tier-price">$5/mo</span>
                        <span class="tier-name">☕ Coffee</span>
                      </div>
                      <div class="gh-tier-pill">
                        <span class="tier-price">$10/mo</span>
                        <span class="tier-name">📚 Student</span>
                      </div>
                      <div class="gh-tier-pill">
                        <span class="tier-price">$25/mo</span>
                        <span class="tier-name">🚀 Supporter</span>
                      </div>
                    </div>
                  </div>

                  {/* Vibrant Action Button */}
                  <div class="github-sponsors-actions">
                    <a 
                      href="https://github.com/sponsors/VR-Rathod" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      class="github-sponsor-direct-btn"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                      Become a GitHub Sponsor
                    </a>
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
