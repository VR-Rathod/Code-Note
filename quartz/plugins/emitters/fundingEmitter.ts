import { FilePath, FullSlug, joinSegments } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import { write } from "./helpers"
import fs from "fs"
import path from "path"

// Helper to recursively collect all .md files in the content directory
function getMarkdownFiles(dir: string): string[] {
  let results: string[] = []
  if (!fs.existsSync(dir)) return results
  const list = fs.readdirSync(dir)
  list.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat && stat.isDirectory()) {
      results = results.concat(getMarkdownFiles(filePath))
    } else if (file.endsWith(".md")) {
      results.push(filePath)
    }
  })
  return results
}

export const FundingEmitter: QuartzEmitterPlugin = () => {
  return {
    name: "FundingEmitter",
    async *emit(ctx, content) {
      // 1. Read funding.json from process.cwd() (the root)
      let fundingData: any = { currentAmount: 0, sponsors: [] }
      try {
        const fundingPath = path.join(process.cwd(), "funding.json")
        if (fs.existsSync(fundingPath)) {
          const rawData = fs.readFileSync(fundingPath, "utf-8")
          fundingData = JSON.parse(rawData)
        }
      } catch (err) {
        console.warn("FundingEmitter: Failed to read root funding.json:", err)
      }

      // 2. Scan note frontmatters for contributors dynamically!
      const contributorsMap = new Map<string, { name: string; url?: string; count: number }>()
      // Start with Lead Author Vaibhav Rathod pre-populated
      contributorsMap.set("vaibhav rathod", { name: "Vaibhav Rathod", url: "https://github.com/VR-Rathod", count: 350 })

      try {
        const contentDir = path.join(process.cwd(), "content")
        if (fs.existsSync(contentDir)) {
          const mdFiles = getMarkdownFiles(contentDir)
          mdFiles.forEach((file) => {
            const fileContent = fs.readFileSync(file, "utf-8")
            if (fileContent.startsWith("---")) {
              const endIdx = fileContent.indexOf("---", 3)
              if (endIdx !== -1) {
                const frontmatterStr = fileContent.substring(3, endIdx)
                let authorName = ""
                let authorUrl = ""
                let inAuthorsBlock = false
                let currentAuthorInBlock: any = null

                // Parse frontmatter lines to support both author/authorUrl and authors list
                frontmatterStr.split("\n").forEach((line) => {
                  const trimmed = line.trim()
                  if (!trimmed) return

                  // Detect starting authors array block
                  if (trimmed.startsWith("authors:")) {
                    inAuthorsBlock = true
                    return
                  }

                  // If in authors block and hit a new top-level key, exit authors block
                  if (inAuthorsBlock && !trimmed.startsWith("-") && trimmed.includes(":")) {
                    inAuthorsBlock = false
                  }

                  if (inAuthorsBlock) {
                    if (trimmed.startsWith("-")) {
                      // New author item in authors list
                      if (currentAuthorInBlock && currentAuthorInBlock.name) {
                        addOrUpdateContributor(currentAuthorInBlock.name, currentAuthorInBlock.url)
                      }
                      currentAuthorInBlock = { name: "", url: "" }
                      const rest = trimmed.replace("-", "").trim()
                      if (rest.startsWith("name:")) {
                        currentAuthorInBlock.name = rest.replace("name:", "").trim()
                      }
                    } else if (trimmed.startsWith("name:")) {
                      if (currentAuthorInBlock) {
                        currentAuthorInBlock.name = trimmed.replace("name:", "").trim()
                      }
                    } else if (trimmed.startsWith("url:")) {
                      if (currentAuthorInBlock) {
                        currentAuthorInBlock.url = trimmed.replace("url:", "").trim()
                      }
                    }
                  } else {
                    // Standard author/authorUrl fields
                    if (trimmed.startsWith("author:")) {
                      authorName = trimmed.replace("author:", "").trim()
                    } else if (trimmed.startsWith("authorUrl:")) {
                      authorUrl = trimmed.replace("authorUrl:", "").trim()
                    }
                  }
                })

                // Add any remaining authors list item
                if (currentAuthorInBlock && currentAuthorInBlock.name) {
                  addOrUpdateContributor(currentAuthorInBlock.name, currentAuthorInBlock.url)
                }

                // Add single author field
                if (authorName) {
                  addOrUpdateContributor(authorName, authorUrl)
                }
              }
            }
          })
        }
      } catch (scanErr) {
        console.warn("FundingEmitter: Failed to scan note contributors:", scanErr)
      }

      function addOrUpdateContributor(name: string, url?: string) {
        if (!name || name.toLowerCase().trim() === "vaibhav rathod") return
        const key = name.toLowerCase().trim()
        if (contributorsMap.has(key)) {
          contributorsMap.get(key)!.count += 1
        } else {
          contributorsMap.set(key, {
            name: name.trim(),
            url: url?.trim() || undefined,
            count: 1
          })
        }
      }

      const contributorsList = Array.from(contributorsMap.values()).sort((a, b) => b.count - a.count)

      // 3. Compile full dynamic payload
      const compiledData = {
        ...fundingData,
        contributors: contributorsList
      }

      // 4. Yield writing this file to static/funding.json
      const fp = joinSegments("static", "funding") as FullSlug
      yield write({
        ctx,
        content: JSON.stringify(compiledData),
        slug: fp,
        ext: ".json",
      })
    },
  }
}
