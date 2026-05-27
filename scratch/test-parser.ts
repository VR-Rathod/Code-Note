import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { unified } from "unified"
import remarkParse from "remark-parse"
import { LogseqFlavoredMarkdown } from "../quartz/plugins/transformers/logseq"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function run() {
  const contentDir = path.join(__dirname, "../content")
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith(".md"))

  console.log(`Found ${files.length} markdown files. Testing parser...`)

  const processor = unified()
    .use(remarkParse)
    .use((LogseqFlavoredMarkdown() as any).markdownPlugins()[0])

  for (const file of files) {
    const filePath = path.join(contentDir, file)
    const content = fs.readFileSync(filePath, "utf-8")
    
    // Print before processing to see where it gets stuck
    console.log(`Processing: ${file}`)
    const start = Date.now()
    
    try {
      const ast = processor.parse(content)
      await processor.run(ast)
      const duration = Date.now() - start
      if (duration > 100) {
        console.log(`[SLOW] ${file} took ${duration}ms`)
      }
    } catch (e: any) {
      console.error(`[ERROR] Failed to process ${file}:`, e.message)
    }
  }

  console.log("Finished testing all files successfully!")
}

run().catch(console.error)
