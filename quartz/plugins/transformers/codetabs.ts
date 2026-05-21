import { QuartzTransformerPlugin } from "../types"
// @ts-ignore
import codetabsScript from "../../components/scripts/codetabs.inline"
// @ts-ignore
import codetabsStyle from "../../components/styles/codetabs.scss"

export const CodeTabs: QuartzTransformerPlugin = () => {
  return {
    name: "CodeTabs",
    textTransform(_ctx, src) {
      // Robust regex to handle leading indentation and optional Logseq/Markdown bullets
      return src.replace(
        /^([ \t]*)((?:- )?):::code-tabs\r?\n([\s\S]*?)\r?\n\1(?:- )?[ \t]*:::/gm,
        (_match, indent, bullet, content) => {
          return `${indent}${bullet}<span data-code-tabs-start="true">&#8203;</span>\n${content}\n${indent}${bullet ? "  " : ""}<span data-code-tabs-end="true">&#8203;</span>`
        },
      )
    },
    externalResources() {
      return {
        js: [
          {
            script: codetabsScript,
            loadTime: "afterDOMReady",
            contentType: "inline",
          },
        ],
        css: [
          {
            content: codetabsStyle,
            inline: true,
          },
        ],
      }
    },
  }
}
