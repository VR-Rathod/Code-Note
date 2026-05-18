import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const DEFAULT_AUTHOR = "Vaibhav Rathod"
const DEFAULT_AUTHOR_URL = "https://github.com/VR-Rathod"

type AuthorEntry = { name: string; url?: string }

function resolveAuthors(frontmatter: Record<string, unknown> | undefined): AuthorEntry[] {
  // Support `authors` array: [{ name, url }, ...]
  const raw = frontmatter?.authors
  if (Array.isArray(raw) && raw.length > 0) {
    return raw
      .filter((a) => a && typeof a.name === "string" && a.name.trim() !== "")
      .map((a) => ({ name: a.name.trim(), url: typeof a.url === "string" && a.url.trim() !== "" ? a.url.trim() : undefined }))
  }

  // Fall back to single author/authorUrl fields
  const name = frontmatter?.author
  const url = frontmatter?.authorUrl
  const resolvedName = typeof name === "string" && name.trim() !== "" ? name.trim() : DEFAULT_AUTHOR
  const resolvedUrl = typeof url === "string" && url.trim() !== "" ? url.trim() : DEFAULT_AUTHOR_URL
  return [{ name: resolvedName, url: resolvedUrl }]
}

function getAvatarUrl(name: string, url?: string): string {
  if (url && url.includes("github.com/")) {
    const parts = url.split("github.com/")
    if (parts.length > 1) {
      const username = parts[1].split("/")[0].trim()
      if (username) {
        return `https://github.com/${username}.png`
      }
    }
  }
  if (name.toLowerCase() === "vaibhav rathod") {
    return "https://github.com/VR-Rathod.png"
  }
  // Generic beautiful avatar fallback
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`
}

const AuthorCredit: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  // Don't render on homepages or folder indexes
  if (
    !fileData.frontmatter ||
    fileData.frontmatter.title === "Home" ||
    fileData.frontmatter.title === "Welcome" ||
    fileData.slug === "index"
  ) {
    return null
  }

  const authors = resolveAuthors(fileData.frontmatter)

  return (
    <div class={`author-credits-card ${displayClass ?? ""}`}>
      <div class="author-credits-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="credits-icon">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
        <span class="author-credits-title">Notes Contributors</span>
        <a href="/credits" class="credits-link-btn" title="View our Hall of Fame & Supporters list">
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="crown-icon">
            <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z" />
            <path d="M5 20h14" />
          </svg>
          Supporters Wall
        </a>
      </div>
      <div class="author-credits-list">
        {authors.map((a, i) => {
          const avatarUrl = getAvatarUrl(a.name, a.url)
          return (
            <div class="author-credit-item" key={i}>
              <div class="author-avatar-wrapper">
                <img src={avatarUrl} alt={`${a.name} avatar`} class="author-avatar-img" />
                <div class="author-avatar-glow"></div>
              </div>
              <div class="author-info-wrapper">
                <span class="author-badge">{a.name === "Vaibhav Rathod" ? "Lead Author" : "Contributor"}</span>
                {a.url ? (
                  <a href={a.url} target="_blank" rel="noopener noreferrer" class="author-name-link">
                    {a.name}
                  </a>
                ) : (
                  <span class="author-name-text">{a.name}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

AuthorCredit.css = `
.author-credits-card {
  margin: 2.5rem 0 1.5rem 0;
  padding: 1.25rem 1.5rem;
  background: var(--light);
  border: 1px solid var(--lightgray);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  box-sizing: border-box;
}

.author-credits-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--lightgray);
  padding-bottom: 0.5rem;
  position: relative;
}

.credits-icon {
  color: var(--secondary);
}

.author-credits-title {
  font-size: 0.82rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--gray);
}

.credits-link-btn {
  margin-left: auto;
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--secondary);
  background: var(--highlight);
  padding: 4px 10px;
  border-radius: 6px;
  text-decoration: none;
  border: 1px solid color-mix(in srgb, var(--secondary) 15%, transparent);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02);
}

.credits-link-btn:hover {
  background: var(--secondary);
  color: var(--light) !important;
  border-color: var(--secondary);
  transform: translateY(-1px);
  box-shadow: 0 4px 10px color-mix(in srgb, var(--secondary) 20%, transparent);
}


.author-credits-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.author-credit-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar-wrapper {
  position: relative;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: block;
  z-index: 1;
}

.author-avatar-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1.5px solid var(--secondary);
  object-fit: cover;
  z-index: 3;
  margin: 0 !important;
}

.author-avatar-glow {
  position: absolute;
  inset: -1px;
  border-radius: 50%;
  background: var(--secondary);
  opacity: 0.15;
  filter: blur(4px);
  z-index: 2;
}

.author-info-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.author-badge {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  color: var(--secondary);
  background: var(--highlight);
  padding: 1px 6px;
  border-radius: 4px;
  width: fit-content;
  text-transform: uppercase;
}

.author-name-link {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--dark);
  text-decoration: none;
  transition: all 0.2s ease;
}

.author-name-link:hover {
  color: var(--secondary);
  text-decoration: underline;
}

.author-name-text {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--dark);
}
`

export default (() => AuthorCredit) satisfies QuartzComponentConstructor
