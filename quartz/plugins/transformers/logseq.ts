import { QuartzTransformerPlugin } from "../types"
import { PluggableList } from "unified"
import { visit } from "unist-util-visit"
import { Root, List, ListItem, Paragraph, Text } from "mdast"
import { BuildVisitor } from "unist-util-visit"

/**
 * Cleans up Logseq-flavored markdown for Quartz rendering:
 * - Removes empty bullet points (bare `- ` lines)
 * - Removes Logseq block property lines (e.g. `id:: ...`, `collapsed:: true`)
 */
export const LogseqFlavoredMarkdown: QuartzTransformerPlugin = () => {
  return {
    name: "LogseqFlavoredMarkdown",
    markdownPlugins(): PluggableList {
      return [
        () => (tree: Root) => {
          // Remove empty list items (bare `-` lines from Logseq)
          visit(tree, "list", ((node: List, index: number, parent: Root | List | null) => {
            node.children = node.children.filter((item: ListItem) => {
              // Keep item if it has non-empty content or nested children
              const hasNestedList = item.children.some((child) => child.type === "list")
              if (hasNestedList) return true

              const para = item.children.find((c) => c.type === "paragraph") as
                | Paragraph
                | undefined
              if (!para) return false

              const text = para.children
                .map((c) => (c.type === "text" ? (c as Text).value : "x"))
                .join("")
                .trim()

              return text.length > 0
            })

            // If the list is now empty, remove it from parent
            if (node.children.length === 0 && parent && index !== undefined) {
              ;(parent.children as Root["children"]).splice(index, 1)
            }
          }) as BuildVisitor<Root, "list">)

          // Remove Logseq block property lines like `id:: ...`, `collapsed:: true`
          visit(tree, "paragraph", ((node: Paragraph, index: number, parent: Root | null) => {
            if (!parent || index === undefined) return
            const text = node.children
              .map((c) => (c.type === "text" ? (c as Text).value : ""))
              .join("")
            if (/^\s*\S+::\s/.test(text)) {
              ;(parent.children as Root["children"]).splice(index, 1)
            }
          }) as BuildVisitor<Root, "paragraph">)
        },
      ]
    },
  }
}
