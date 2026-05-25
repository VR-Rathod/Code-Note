---
date: 2026-05-21T13:09:49+05:30
lastmod: 2026-05-21T13:09:49+05:30

title: Cookie Policy
description: "Cookie Policy for Free Code Notes — how we use browser storage to save your session and bookmarks."
cssclasses:
  - legal-page
noindex: true
---

# Cookie Policy

**Last updated: May 18, 2026**

This Cookie Policy explains how **Free Code Notes** uses browser storage technologies when you visit our site.

---

## What We Use

We do **not** use traditional HTTP cookies for tracking or advertising. Instead, we use standard **browser `localStorage`** (local client-side storage) to deliver a seamless, personalized, and functional user experience. 

All storage keys we utilize are strictly necessary for the site's operations, authentication, user preferences, and offline functionality:

| Category | Key / Prefix | Technical Purpose | Lifetime / Cleared When |
|---|---|---|---|
| **Authentication** | `sb-*-auth-token` | Stores your encrypted Supabase/GitHub login session (JWT, refresh tokens, and basic profile metadata). | Until you sign out, or manually clear your browser site data. |
| **User Features** | `study-bookmarks` | Stores your page and section bookmarks locally (when you are not signed in). | Until you sign in (automatically synced to cloud and cleared), delete your bookmarks, or clear browser data. |
| **Checklists** | *Dynamic ID* (e.g., `check-*`) | Persists the checked/unchecked state of custom note checkboxes across reloads. | Retained indefinitely, or until manually cleared in your browser settings. |
| **Interface Preferences** | `theme` | Stores your selected display mode (`light` or `dark`). | Retained indefinitely to remember your theme choice across visits. |
| **Interface Preferences** | `locale` | Stores your preferred language setting. | Retained indefinitely to persist your translation switcher preference. |
| **UI Components** | `fileTree` | Caches the expanded/collapsed state of folders in the file explorer navigation sidebar. | Retained indefinitely for layout consistency. |
| **Network Graph** | `graph-visited` | Caches list of visited page slugs to visually highlight them in the interactive graph. | Retained indefinitely for visual navigation assistance. |
| **Notifications** | `donation-toast-dismissed-until` | Stores a timestamp to prevent showing the donation alert toast repeatedly. | Automatically expires and clears once the snooze duration has elapsed. |

---

## What We Do NOT Use

- ❌ No advertising or marketing cookies
- ❌ No third-party tracking pixels
- ❌ No cross-site tracking
- ❌ No Google Analytics or similar analytics cookies

---

## Third-Party Storage

**Giscus** (our comments widget, powered by GitHub) may set its own cookies when you interact with the comments section. These are governed by [GitHub's Privacy Policy](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement).

---

## How to Clear Your Data

You can clear all site data at any time:
1. **Sign out** using the profile button (clears your session token)
2. Or open **Browser DevTools → Application → Local Storage → Clear All**

---

## Contact

Questions? Contact us via GitHub: [github.com/VR-Rathod](https://github.com/VR-Rathod)
