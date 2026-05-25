import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { SimpleSlug, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import style from "./styles/recentNotes.scss"
import { i18n } from "../i18n"
import { classNames } from "../util/lang"

interface Options {
  title?: string
  limit: number
  linkToMore: SimpleSlug | false
  showTags: boolean
  filter: (f: QuartzPluginData) => boolean
}

const defaultOptions = (): Options => ({
  limit: 5,
  linkToMore: false,
  showTags: false,
  filter: () => true,
})

function getRelativeTime(date: Date, locale: string = "en-US"): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.max(0, Math.floor(diffMs / 1000))
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)
  const diffDays = Math.floor(diffHr / 24)

  if (diffSec < 60) {
    return "Just now"
  } else if (diffMin < 60) {
    return `${diffMin}m ago`
  } else if (diffHr < 24) {
    return `${diffHr}h ago`
  } else if (diffDays === 1) {
    return "Yesterday"
  } else if (diffDays < 7) {
    return `${diffDays}d ago`
  } else {
    return date.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
    })
  }
}

function isRecent(date: Date): boolean {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  return diffMs > 0 && diffMs < 24 * 60 * 60 * 1000
}

function getCategory(slug: string): string | null {
  if (!slug || slug === "index") return null
  const parts = slug.split("/")
  if (parts.length > 1) {
    const category = parts[0]
    return category
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }
  return null
}

function getAuthorName(frontmatter: Record<string, unknown> | undefined): string {
  const author = frontmatter?.author
  if (typeof author === "string" && author.trim() !== "") {
    return author.trim()
  }
  const authors = frontmatter?.authors
  if (Array.isArray(authors) && authors.length > 0 && authors[0]?.name) {
    return authors[0].name.trim()
  }
  return "Vaibhav Rathod"
}


const sortModified = (f1: QuartzPluginData, f2: QuartzPluginData) => {
  const d1 = f1.dates?.modified?.getTime() ?? 0
  const d2 = f2.dates?.modified?.getTime() ?? 0
  if (d1 === d2) {
    return (f1.frontmatter?.title ?? "").localeCompare(f2.frontmatter?.title ?? "")
  }
  return d2 - d1
}

const sortCreated = (f1: QuartzPluginData, f2: QuartzPluginData) => {
  const d1 = f1.dates?.created?.getTime() ?? 0
  const d2 = f2.dates?.created?.getTime() ?? 0
  if (d1 === d2) {
    return (f1.frontmatter?.title ?? "").localeCompare(f2.frontmatter?.title ?? "")
  }
  return d2 - d1
}

export default ((userOpts?: Partial<Options>) => {
  const RecentNotes: QuartzComponent = ({
    allFiles,
    fileData,
    displayClass,
    cfg,
  }: QuartzComponentProps) => {
    const opts = { ...defaultOptions(), ...userOpts }
    
    const pages = allFiles.filter(opts.filter)
    const recentUpdates = [...pages].sort(sortModified).slice(0, opts.limit)
    const recentNew = [...pages].sort(sortCreated).slice(0, opts.limit)

    return (
      <div class={classNames(displayClass, "recent-notes-tabs")}>
        <h3>{opts.title ?? "Activity Feed"}</h3>
        
        <input type="radio" id="tab-recent-new" name="recent-notes-tabs" checked={true} class="tab-radio-input" />
        <input type="radio" id="tab-recent-updates" name="recent-notes-tabs" class="tab-radio-input" />
        
        <div class="tab-headers">
          <label for="tab-recent-new" class="tab-label label-new">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="tab-icon">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <span>New Notes</span>
          </label>
          <label for="tab-recent-updates" class="tab-label label-updates">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="tab-icon">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
            </svg>
            <span>Updates</span>
          </label>
        </div>
        
        <div class="tab-panels">
          <div class="tab-panel panel-new">
            <ul class="recent-ul">
              {recentNew.length === 0 ? (
                <li class="recent-li empty-state">No new notes</li>
              ) : (
                recentNew.map((page) => {
                  const title = page.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title
                  const date = page.dates?.created ?? new Date()
                  const relTime = getRelativeTime(date, cfg.locale)
                  const isPageRecent = isRecent(date)
                  const category = getCategory(page.slug!)
                  const authorName = getAuthorName(page.frontmatter)
                  const description = page.description ?? ""
                  const truncatedDesc = description.length > 70 ? description.slice(0, 68) + "..." : description

                  return (
                    <li class="recent-li">
                      <div class="section">
                        <div class="desc">
                          <h3>
                            <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal">
                              {title}
                            </a>
                          </h3>
                          {category && <span class="category-badge">{category}</span>}
                        </div>
                        
                        <div class="meta-row">
                          <span class="meta-author">{authorName}</span>
                          <span class="meta-dot">•</span>
                          <span class="meta-time" title={date.toLocaleString()}>
                            {isPageRecent && <span class="pulse-dot" />}
                            {relTime}
                          </span>
                        </div>
                        
                        {truncatedDesc && <p class="excerpt">{truncatedDesc}</p>}
                      </div>
                    </li>
                  )
                })
              )}
            </ul>
          </div>
          
          <div class="tab-panel panel-updates">
            <ul class="recent-ul">
              {recentUpdates.length === 0 ? (
                <li class="recent-li empty-state">No recent updates</li>
              ) : (
                recentUpdates.map((page) => {
                  const title = page.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title
                  const date = page.dates?.modified ?? new Date()
                  const relTime = getRelativeTime(date, cfg.locale)
                  const isPageRecent = isRecent(date)
                  const category = getCategory(page.slug!)
                  const authorName = getAuthorName(page.frontmatter)
                  const description = page.description ?? ""
                  const truncatedDesc = description.length > 70 ? description.slice(0, 68) + "..." : description

                  return (
                    <li class="recent-li">
                      <div class="section">
                        <div class="desc">
                          <h3>
                            <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal">
                              {title}
                            </a>
                          </h3>
                          {category && <span class="category-badge">{category}</span>}
                        </div>
                        
                        <div class="meta-row">
                          <span class="meta-author">{authorName}</span>
                          <span class="meta-dot">•</span>
                          <span class="meta-time" title={date.toLocaleString()}>
                            {isPageRecent && <span class="pulse-dot" />}
                            {relTime}
                          </span>
                        </div>
                        
                        {truncatedDesc && <p class="excerpt">{truncatedDesc}</p>}
                      </div>
                    </li>
                  )
                })
              )}
            </ul>
          </div>
        </div>
        
        {opts.linkToMore && (
          <p class="see-more">
            <a href={resolveRelative(fileData.slug!, opts.linkToMore)}>
              See all notes
            </a>
          </p>
        )}
      </div>
    )
  }

  RecentNotes.css = style
  return RecentNotes
}) satisfies QuartzComponentConstructor
