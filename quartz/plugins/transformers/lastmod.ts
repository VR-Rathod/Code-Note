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
            const relativePath = path.relative(repositoryWorkdir, fullFp)
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
                try {
                  // Get modified date
                  if (!modified) {
                    const modifiedOut = execSync(`git log -1 --format=%aI -- "${relativePath}"`, { 
                      cwd: repositoryWorkdir, 
                      encoding: "utf8" 
                    }).trim()
                    if (modifiedOut) {
                      modified = new Date(modifiedOut).getTime()
                    } else if (oldestCommitDate) {
                      modified = oldestCommitDate
                    }
                  }
                  
                  // Get creation date
                  if (!created) {
                    const createdOut = execSync(`git log --diff-filter=A --format=%aI -1 -- "${relativePath}"`, { 
                      cwd: repositoryWorkdir, 
                      encoding: "utf8" 
                    }).trim()
                    if (createdOut) {
                      created = new Date(createdOut).getTime()
                    } else if (oldestCommitDate) {
                      created = oldestCommitDate
                    }
                  }
                } catch {
                  console.log(
                    styleText(
                      "yellow",
                      `\nWarning: ${file.data.filePath!} isn't yet tracked by git, dates will be inaccurate`,
                    ),
                  )
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
