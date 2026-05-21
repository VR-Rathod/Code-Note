import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/bookmarks.scss"
// @ts-ignore
import script from "./scripts/bookmarks.inline"
import { classNames } from "../util/lang"
import * as dotenv from "dotenv"
dotenv.config()

const Bookmarks: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  const supabaseUrl = process.env.SUPABASE_URL || ""
  const supabaseKey = process.env.SUPABASE_ANON_KEY || ""

  return (
    <div class={classNames(displayClass, "bookmarks-container")}>
      <script dangerouslySetInnerHTML={{ __html: `window.SUPABASE_URL = "${supabaseUrl}"; window.SUPABASE_ANON_KEY = "${supabaseKey}";` }}></script>

      <button
        class="bookmarks-toggle"
        id="bookmarks-toggle-btn"
        aria-label="Open profile and bookmarks menu"
        aria-expanded="false"
        aria-controls="bookmarks-menu"
        aria-haspopup="dialog"
        title="Profile & Bookmarks"
      >
        <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span class="bm-toggle-badge" aria-hidden="true"></span>
      </button>

      <div
        class="bookmarks-menu"
        id="bookmarks-menu"
        role="dialog"
        aria-label="Profile and bookmarks"
        aria-modal="false"
      >
        <div class="profile-section">
          <div class="profile-guest" role="region" aria-label="Guest mode">
            <div class="profile-avatar-placeholder" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <h4>Guest Mode</h4>
            <p>Sign in to sync bookmarks across devices</p>
            <button class="login-btn" aria-label="Sign in with GitHub to enable cloud bookmark sync">
              <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
              Sign In with GitHub
            </button>
            {/* <div class="bm-or-separator" aria-hidden="true">
              <span>OR</span>
            </div> */}
            {/* <div class="email-login-box">
              <input 
                type="email" 
                class="email-login-input" 
                placeholder="Enter email for Magic Link…" 
                aria-label="Enter your email to sign in" 
                autocomplete="email"
              />
              <button class="email-login-btn" aria-label="Get passwordless login magic link">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                Send Magic Link
              </button>
            </div> */}
          </div>

          <div class="profile-logged-in" style={{ display: "none" }} role="region" aria-label="User profile">
            <div class="profile-header">
              <div class="profile-avatar-container">
                <img src="" alt="" class="profile-avatar" style={{ display: "none" }} aria-hidden="true" />
                <div class="profile-avatar-letter" style={{ display: "none" }}>U</div>
                <div class="profile-avatar-glow"></div>
              </div>
              <div class="profile-info">
                <h4 class="profile-name">User</h4>
                <div class="profile-status-pill">
                  <span class="status-dot"></span>
                  <span class="profile-status" aria-live="polite">Sync Active</span>
                </div>
              </div>
            </div>

            <div class="giscus-connection-hint" aria-label="Connect to comments section">
              <div class="giscus-hint-text">
                <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                <span>For security, comments require a separate connection.</span>
              </div>
              <button class="jump-to-comments-btn" aria-label="Scroll to comments and connect Giscus">
                <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                Connect to Comments
              </button>
            </div>

            <div class="profile-actions">
              <button class="logout-btn" aria-label="Sign out of your account">
                <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Sign Out
              </button>
              <button class="delete-account-btn" aria-label="Permanently delete your account and all bookmarks">
                <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4h6v2"></path></svg>
                Delete My Data
              </button>
            </div>
          </div>

          {/* Roadmap & Features */}
          <div class="features-roadmap-section">
            <h5 class="roadmap-title">Roadmap & Features</h5>
            <div class="features-list">
              <a href="/binary-search" class="feature-item feature-item-link" aria-label="View Code Snippets Better Preview">
                <span class="feature-name">Code Snippets Better Preview</span>
                <span class="service-badge status-released">Released</span>
              </a>
              <div class="feature-item">
                <span class="feature-name">Flashcards & Quiz Mode</span>
                <span class="service-badge status-coming-soon">Coming Soon</span>
              </div>
              <div class="feature-item">
                <span class="feature-name">Multi-Theme Selector</span>
                <span class="service-badge status-unfunded" data-requires-funding="true" style={{ cursor: "pointer" }} title="Development paused due to lack of funds. Click to support!">No Funds ⚠️</span>
              </div>
              <div class="feature-item">
                <span class="feature-name">Flashcards & Quiz Mode (Adv)</span>
                <span class="service-badge status-unfunded" data-requires-funding="true" style={{ cursor: "pointer" }} title="Requires funding. Click to support!">No Funds ⚠️</span>
              </div>
              <div class="feature-item">
                <span class="feature-name">Code Snippets Playground</span>
                <span class="service-badge status-unfunded" data-requires-funding="true" style={{ cursor: "pointer" }} title="Requires funding. Click to support!">No Funds ⚠️</span>
              </div>
            </div>
          </div>
        </div>

        <details class="bookmarks-accordion" open>
          <summary>
            <h3>My Bookmarks</h3>
            <span class="service-badge status-released">Released</span>
            <svg aria-hidden="true" class="chevron" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </summary>
          <div class="bookmarks-list-wrapper" role="list" aria-label="Your saved bookmarks">
          </div>
        </details>
      </div>
    </div>
  )
}

Bookmarks.css = style
Bookmarks.afterDOMLoaded = script

export default (() => Bookmarks) satisfies QuartzComponentConstructor
