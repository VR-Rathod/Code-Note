import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import breadcrumbsStyle from "./styles/breadcrumbs.scss"
import { FullSlug, resolveRelative } from "../util/path"
import { classNames } from "../util/lang"

type CrumbData = {
  displayName: string
  path: string
}

interface BreadcrumbOptions {
  /**
   * Symbol between crumbs
   */
  spacerSymbol: string
  /**
   * Name of first crumb
   */
  rootName: string
  /**
   * Whether to look up frontmatter title for folders (could cause performance problems with big vaults)
   */
  resolveFrontmatterTitle: boolean
  /**
   * Whether to display the current page in the breadcrumbs.
   */
  showCurrentPage: boolean
}

const defaultOptions: BreadcrumbOptions = {
  spacerSymbol: "❯",
  rootName: "Home",
  resolveFrontmatterTitle: true,
  showCurrentPage: true,
}

export default ((opts?: Partial<BreadcrumbOptions>) => {
  const options: BreadcrumbOptions = { ...defaultOptions, ...opts }
  const Breadcrumbs: QuartzComponent = ({
    fileData,
    allFiles,
    displayClass,
  }: QuartzComponentProps) => {
    if (fileData.slug === "index") {
      return null
    }

    const title = fileData.frontmatter?.treeTitle || fileData.frontmatter?.title || fileData.slug!
    const segments = title.split(" - ").map((s) => s.trim())

    const findSlugForSegment = (segment: string) => {
      const match = allFiles.find((f) => {
        if (f.slug === "index") return false
        const fTitle = f.frontmatter?.title?.toLowerCase()
        const fTreeTitle = f.frontmatter?.treeTitle?.toLowerCase()

        if (fTitle === segment.toLowerCase()) return true

        if (fTreeTitle) {
          const parts = fTreeTitle.split(" - ").map((s) => s.trim().toLowerCase())
          if (parts[parts.length - 1] === segment.toLowerCase()) return true
        }

        return false
      })
      return match?.slug
    }

    const crumbs: CrumbData[] = [
      {
        displayName: options.rootName,
        path: resolveRelative(fileData.slug!, "index" as FullSlug),
      },
    ]

    for (let i = 0; i < segments.length - 1; i++) {
      const segment = segments[i]
      const matchedSlug = findSlugForSegment(segment)
      crumbs.push({
        displayName: segment.replaceAll("-", " "),
        path: matchedSlug ? resolveRelative(fileData.slug!, matchedSlug) : "",
      })
    }

    if (options.showCurrentPage) {
      crumbs.push({
        displayName: segments[segments.length - 1].replaceAll("-", " "),
        path: "",
      })
    }

    return (
      <nav class={classNames(displayClass, "breadcrumb-container")} aria-label="breadcrumbs">
        {crumbs.map((crumb, index) => (
          <div class="breadcrumb-element">
            {crumb.path ? (
              <a href={crumb.path}>{crumb.displayName}</a>
            ) : (
              <span>{crumb.displayName}</span>
            )}
            {index !== crumbs.length - 1 && <p>{` ${options.spacerSymbol} `}</p>}
          </div>
        ))}
      </nav>
    )
  }
  Breadcrumbs.css = breadcrumbsStyle

  return Breadcrumbs
}) satisfies QuartzComponentConstructor
