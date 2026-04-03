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

const AuthorCredit: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const authors = resolveAuthors(fileData.frontmatter)

  return (
    <div class="author-credit">
      <span class="author-credit-label">Written by </span>
      {authors.map((a, i) => (
        <span key={i}>
          {a.url ? (
            <a href={a.url} target="_blank" rel="noopener noreferrer" class="author-credit-link">
              {a.name}
            </a>
          ) : (
            <span class="author-credit-name">{a.name}</span>
          )}
          {i < authors.length - 1 && <span class="author-credit-sep">, </span>}
        </span>
      ))}
    </div>
  )
}

AuthorCredit.css = `
.author-credit {
  border-top: 1px solid var(--gray);
  margin-top: 1.5rem;
  padding-top: 0.75rem;
  font-size: 0.9rem;
  color: var(--gray);
}

.author-credit-link {
  color: var(--gray);
}

.author-credit-link:hover {
  color: var(--secondary);
}
`

export default (() => AuthorCredit) satisfies QuartzComponentConstructor
