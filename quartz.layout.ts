import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/VR-Rathod/Code-Note",
    },
  }),
}

export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        { Component: Component.Search(), grow: true },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    Component.DesktopOnly(Component.Graph({
      localGraph: {
        drag: true, zoom: true, depth: 1,
        scale: 1.2, repelForce: 0.8, centerForce: 0.4,
        linkDistance: 50, fontSize: 0.45, opacityScale: 1, showTags: false,
      },
      globalGraph: {
        drag: true, zoom: true, depth: 2,
        scale: 0.7, repelForce: 0.6, centerForce: 0.3,
        linkDistance: 40, fontSize: 0.35, opacityScale: 0.8, showTags: false,
      },
    })),
    Component.Backlinks(),
    // Recently updated in right sidebar — compact, below backlinks
    Component.DesktopOnly(Component.RecentNotes({
      title: "Recently Updated",
      limit: 6,
      showTags: false,
      filter: (f) => f.slug !== "index" && !f.frontmatter?.noindex,
    })),
  ],
}

export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        { Component: Component.Search(), grow: true },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [],
}
