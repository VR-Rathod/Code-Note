import fs from "fs"
import { execSync } from "child_process"
import { QuartzTransformerPlugin } from "../types"
import path from "path"
import { styleText } from "util"

export interface Options {
  priority: ("frontmatter" | "git" | "filesystem")[]
}

const defaultOptions: Options = {
  priority: ["frontmatter", "git", "filesystem"],
}

// YYYY-MM-DD
const iso8601DateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/

function coerceDate(fp: string, d: any): Date {
  // check ISO8601 date-only format
  // we treat this one as local midnight as the normal
  // js date ctor treats YYYY-MM-DD as UTC midnight
  if (typeof d === "string" && iso8601DateOnlyRegex.test(d)) {
    d = `${d}T00:00:00`
  }

  const dt = new Date(d)
  const invalidDate = isNaN(dt.getTime()) || dt.getTime() === 0
  if (invalidDate && d !== undefined) {
    console.log(
      styleText(
        "yellow",
        `\nWarning: found invalid date "${d}" in \`${fp}\`. Supported formats: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format`,
      ),
    )
  }

  return invalidDate ? new Date() : dt
}

type MaybeDate = undefined | string | number
export const CreatedModifiedDate: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }
  return {
    name: "CreatedModifiedDate",
    markdownPlugins(ctx) {
      return [
        () => {
          let repositoryWorkdir = ctx.argv.directory
          let oldestCommitDate: number | undefined = undefined

          const gitDatesCache = new Map<string, { created: number; modified: number }>()

          if (opts.priority.includes("git")) {
            try {
              const stdout = execSync("git rev-parse --show-toplevel", { encoding: "utf8" }).trim()
              if (stdout) {
                repositoryWorkdir = stdout

                // Get the oldest known commit date in the shallow clone to use as a fallback
                // This ensures files without history (due to shallow clone) don't jump to the top of recent notes
                try {
                  const logOut = execSync("git log --format=%aI", { cwd: repositoryWorkdir, encoding: "utf8" }).trim()
                  if (logOut) {
                    const lines = logOut.split('\n')
                    // Subtract 1 minute to ensure fake dates are strictly older than the oldest commit
                    oldestCommitDate = new Date(lines[lines.length - 1]).getTime() - 60000 
                  }
                } catch (e) {
                  // ignore
                }

                // Fetch full git history dates for all files in one go
                try {
                  const gitLogOut = execSync(
                    "git log --name-status --pretty=format:COMMIT:%aI",
                    { cwd: repositoryWorkdir, encoding: "utf8", maxBuffer: 20 * 1024 * 1024 }
                  )
                  const lines = gitLogOut.split("\n")
                  let currentCommitTime: number | null = null
                  for (const line of lines) {
                    const trimmed = line.trim()
                    if (!trimmed) continue
                    if (trimmed.startsWith("COMMIT:")) {
                      const commitTimeStr = trimmed.substring(7)
                      currentCommitTime = new Date(commitTimeStr).getTime()
                    } else if (currentCommitTime !== null) {
                      const parts = trimmed.split("\t")
                      if (parts.length >= 2) {
                        const filePath = parts[parts.length - 1]
                        const normPath = path.normalize(filePath).toLowerCase()
                        
                        let cached = gitDatesCache.get(normPath)
                        if (!cached) {
                          cached = { created: currentCommitTime, modified: currentCommitTime }
                          gitDatesCache.set(normPath, cached)
                        }
                        
                        cached.created = currentCommitTime
                      }
                    }
                  }
                } catch (e) {
                  // ignore or fall back
                }
              }
            } catch (e) {
              console.log(
                styleText(
                  "yellow",
                  `\nWarning: couldn't find git repository`,
                ),
              )
            }
          }

          return async (_tree, file) => {
            let created: MaybeDate = undefined
            let modified: MaybeDate = undefined
            let published: MaybeDate = undefined

            const fp = file.data.relativePath!
            const fullFp = file.data.filePath!
            for (const source of opts.priority) {
              if (source === "filesystem") {
                const st = await fs.promises.stat(fullFp)
                created ||= st.birthtimeMs
                modified ||= st.mtimeMs
              } else if (source === "frontmatter" && file.data.frontmatter) {
                created ||= file.data.frontmatter.created as MaybeDate
                modified ||= file.data.frontmatter.modified as MaybeDate
                published ||= file.data.frontmatter.published as MaybeDate
              } else if (source === "git") {
                if (repositoryWorkdir) {
                  const relativePath = path.relative(repositoryWorkdir, fullFp)
                  const normPath = path.normalize(relativePath).toLowerCase()
                  const cached = gitDatesCache.get(normPath)
                  if (cached) {
                    created ||= cached.created
                    modified ||= cached.modified
                  }
                }
                
                // Fallback to oldestCommitDate if git was specified but not found in cache
                if (!created && oldestCommitDate) {
                  created = oldestCommitDate
                }
                if (!modified && oldestCommitDate) {
                  modified = oldestCommitDate
                }
              }
            }

            file.data.dates = {
              created: coerceDate(fp, created),
              modified: coerceDate(fp, modified),
              published: coerceDate(fp, published),
            }
          }
        },
      ]
    },
  }
}

declare module "vfile" {
  interface DataMap {
    dates: {
      created: Date
      modified: Date
      published: Date
    }
  }
}
