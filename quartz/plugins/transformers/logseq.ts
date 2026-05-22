import { QuartzTransformerPlugin } from "../types"
import { PluggableList } from "unified"
import { visit, SKIP } from "unist-util-visit"
import { Root, List, ListItem, Paragraph, Text, Heading, Code, Table, BlockContent } from "mdast"
import { BuildVisitor } from "unist-util-visit"
import { toString } from "mdast-util-to-string"

/**
 * Cleans up Logseq-flavored markdown for Quartz rendering:
 * - Removes empty bullet points (bare `- ` lines)
 * - Removes Logseq block property lines (e.g. `id:: ...`, `collapsed:: true`)
 * - Unwraps list items that contain headings, code blocks, or tables into proper block elements
 */
export const LogseqFlavoredMarkdown: QuartzTransformerPlugin = () => {
  return {
    name: "LogseqFlavoredMarkdown",
    markdownPlugins(): PluggableList {
      return [
        () => (tree: Root) => {
          // ── Step 1: Strip Logseq block properties from list items ──────────
          // collapsed:: true, id:: abc123, etc. appear as paragraphs inside list items
          visit(tree, "listItem", ((node: ListItem) => {
            node.children = node.children.filter((child) => {
              if (child.type !== "paragraph") return true
              const para = child as Paragraph
              const text = para.children
                .map((c) => (c.type === "text" ? (c as Text).value : ""))
                .join("")
              return !/^\s*\S+::\s*\S*/.test(text)
            })
          }) as BuildVisitor<Root, "listItem">)

          // ── Step 2: Strip top-level block property paragraphs ───────────────
          visit(tree, "paragraph", ((
            node: Paragraph,
            index: number,
            parent: Root | List | ListItem | null,
          ) => {
            if (!parent || index === undefined) return
            const text = node.children
              .map((c) => (c.type === "text" ? (c as Text).value : ""))
              .join("")
            if (/^\s*\S+::\s*\S*/.test(text)) {
              ; (parent.children as Root["children"]).splice(index, 1)
              return [SKIP, index]
            }
          }) as BuildVisitor<Root, "paragraph">)

          // ── Step 3: Unwrap list items containing headings or code blocks ────
          // Logseq wraps headings (## Foo) and code blocks inside list items.
          // We need to hoist them out so they render as proper HTML elements.
          const isCodeTabsMarker = (child: ListItem["children"][number]): child is Paragraph => {
            if (child.type !== "paragraph") return false
            const para = child as Paragraph
            return para.children.some((c) => {
              if (c.type !== "html") return false
              const htmlVal = (c as any).value || ""
              return htmlVal.includes("data-code-tabs-start") || htmlVal.includes("data-code-tabs-end")
            })
          }

          const unwrapListItems = (nodes: Root["children"]): Root["children"] => {
            const result: Root["children"] = []

            for (const node of nodes) {
              if (node.type !== "list") {
                result.push(node)
                continue
              }

              const list = node as List
              const remainingItems: ListItem[] = []

              for (const item of list.children) {
                // Collect hoistable block-level children (headings, code blocks)
                // and keep the rest as list item content
                const hoistable: BlockContent[] = []
                const keepInList: ListItem["children"][number][] = []
                const nestedLists: List[] = []

                for (const child of item.children) {
                  if (child.type === "heading") {
                    hoistable.push(child as Heading)
                  } else if (child.type === "code") {
                    hoistable.push(child as Code)
                  } else if (child.type === "table") {
                    hoistable.push(child as Table)
                  } else if (child.type === "list") {
                    nestedLists.push(child as List)
                  } else if (isCodeTabsMarker(child)) {
                    hoistable.push(child)
                  } else {
                    keepInList.push(child)
                  }
                }

                const hasHoistable = hoistable.length > 0
                const hasContent = keepInList.length > 0

                if (!hasHoistable) {
                  // Nothing to hoist — keep item as-is (with nested lists processed)
                  item.children = [
                    ...keepInList,
                    ...unwrapListItems(nestedLists as Root["children"]) as ListItem["children"],
                  ]
                  if (item.children.length > 0) remainingItems.push(item)
                  continue
                }

                // Flush any accumulated list items before hoisting
                if (remainingItems.length > 0) {
                  result.push({ ...list, children: [...remainingItems] })
                  remainingItems.length = 0
                }

                // If the item also had non-heading content, keep it as a list item
                if (hasContent) {
                  result.push({
                    type: "list",
                    ordered: list.ordered,
                    spread: false,
                    children: [{ ...item, children: keepInList }],
                  } as List)
                }

                // Hoist headings and code blocks directly
                for (const h of hoistable) {
                  result.push(h)
                }

                // Recursively process nested lists under this item
                if (nestedLists.length > 0) {
                  const processed = unwrapListItems(nestedLists as Root["children"])
                  result.push(...processed)
                }
              }

              // Push any remaining list items
              if (remainingItems.length > 0) {
                result.push({ ...list, children: [...remainingItems] })
              }
            }

            return result
          }

          tree.children = unwrapListItems(tree.children) as Root["children"]

          // ── Step 4: Remove empty list items (bare `-` lines from Logseq) ───
          visit(tree, "list", ((node: List, index: number, parent: Root | List | null) => {
            node.children = node.children.filter((item: ListItem) => {
              if (item.children.length === 0) return false

              // Keep list items containing non-paragraph nodes (like nested lists, code blocks, html comments)
              const hasContentNode = item.children.some((child) => child.type !== "paragraph")
              if (hasContentNode) return true

              // If only paragraphs are present, verify that at least one is non-empty
              const paragraphs = item.children.filter((c) => c.type === "paragraph") as Paragraph[]
              const hasText = paragraphs.some((para) => {
                const text = toString(para).trim()
                return text.length > 0
              })

              return hasText
            })

            if (node.children.length === 0 && parent && index !== undefined) {
              ; (parent.children as Root["children"]).splice(index, 1)
            }
          }) as BuildVisitor<Root, "list">)
        },
      ]
    },
  }
}
