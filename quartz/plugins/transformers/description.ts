import { Root as HTMLRoot } from "hast"
import { toString } from "hast-util-to-string"
import { QuartzTransformerPlugin } from "../types"
import { escapeHTML } from "../../util/escape"

export interface Options {
  descriptionLength: number
  maxDescriptionLength: number
  replaceExternalLinks: boolean
}

const defaultOptions: Options = {
  descriptionLength: 150,
  maxDescriptionLength: 160, // Google truncates at ~160 chars
  replaceExternalLinks: true,
}

const urlRegex = new RegExp(
  /(https?:\/\/)?(?<domain>([\da-z\.-]+)\.([a-z\.]{2,6})(:\d+)?)(?<path>[\/\w\.-]*)(\?[\/\w\.=&;-]*)?/,
  "g",
)

// Patterns to skip — Logseq metadata, empty bullets, short fragments
const skipPatterns = [
  /^\s*\S+::\s*/,           // Logseq block properties (id::, collapsed::)
  /^[-*]\s*$/,              // bare bullet points
  /^\s*#\s/,                // headings only
  /^https?:\/\//,           // bare URLs
  /^\s*$/,                  // empty lines
]

function isUsableSentence(s: string): boolean {
  const trimmed = s.trim()
  if (trimmed.length < 20) return false
  return !skipPatterns.some((p) => p.test(trimmed))
}

export const Description: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }
  return {
    name: "Description",
    htmlPlugins() {
      return [
        () => {
          return async (tree: HTMLRoot, file) => {
            let frontMatterDescription = file.data.frontmatter?.description
            let text = escapeHTML(toString(tree))

            if (opts.replaceExternalLinks) {
              frontMatterDescription = frontMatterDescription?.replace(
                urlRegex,
                "$<domain>" + "$<path>",
              )
              text = text.replace(urlRegex, "$<domain>" + "$<path>")
            }

            // Frontmatter description takes priority — always use it if present
            if (frontMatterDescription) {
              file.data.description = frontMatterDescription
              file.data.text = text
              return
            }

            // Auto-generate from content — smarter extraction for Logseq files
            const cleaned = text.replace(/\s+/g, " ").trim()
            const sentences = cleaned.split(/(?<=[.!?])\s+/)

            let finalDesc = ""
            for (const sentence of sentences) {
              if (!isUsableSentence(sentence)) continue
              const candidate = sentence.trim()
              if (finalDesc.length === 0) {
                finalDesc = candidate
              } else if (finalDesc.length + candidate.length + 1 <= opts.descriptionLength) {
                finalDesc += " " + candidate
              } else {
                break
              }
              if (finalDesc.length >= opts.descriptionLength) break
            }

            // Truncate to max and ensure it ends cleanly
            if (finalDesc.length > opts.maxDescriptionLength) {
              finalDesc = finalDesc.slice(0, opts.maxDescriptionLength).replace(/\s+\S*$/, "") + "..."
            }

            file.data.description = finalDesc || cleaned.slice(0, opts.maxDescriptionLength)
            file.data.text = text
          }
        },
      ]
    },
  }
}

declare module "vfile" {
  interface DataMap {
    description: string
    text: string
  }
}
