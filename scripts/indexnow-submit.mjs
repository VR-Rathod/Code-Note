/**
 * IndexNow URL Submission Script
 * --------------------------------
 * Reads sitemap.xml from the built public/ directory and submits all URLs
 * to IndexNow (Bing, Yandex, etc.) in batches.
 *
 * Usage:
 *   node scripts/indexnow-submit.mjs
 *
 * Requirements:
 *   - Node 18+ (uses native fetch)
 *   - INDEXNOW_KEY set in .env (never commit this value)
 */

import { readFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"
import { config } from "dotenv"

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env from project root
config({ path: resolve(__dirname, "../.env") })

// ── Config ──────────────────────────────────────────────────────────────────
const KEY = process.env.INDEXNOW_KEY
const HOST = "code-note-vr.vercel.app"
const BATCH_SIZE = 10_000   // IndexNow max per request
const SITEMAP = resolve(__dirname, "../public/sitemap.xml")
// ────────────────────────────────────────────────────────────────────────────

if (!KEY) {
  console.error("❌ INDEXNOW_KEY is not set.")
  console.error("   Add it to your .env file:  INDEXNOW_KEY=your-key-here")
  console.error("   Then run: node scripts/indexnow-submit.mjs")
  process.exit(1)
}

const KEY_LOCATION = `https://${HOST}/${KEY}.txt`

function extractUrls(xml) {
  const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
  return matches.map((m) => m[1].trim()).filter(Boolean)
}

async function submitBatch(urls) {
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  }

  const res = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  })

  return { status: res.status, text: await res.text() }
}

async function main() {
  let xml
  try {
    xml = readFileSync(SITEMAP, "utf-8")
  } catch {
    console.error(`❌ Could not read sitemap at: ${SITEMAP}`)
    console.error("   Make sure you ran: npx quartz build")
    process.exit(1)
  }

  const urls = extractUrls(xml)
  if (urls.length === 0) {
    console.warn("⚠️  No URLs found in sitemap.xml")
    process.exit(0)
  }

  console.log(`📋 Found ${urls.length} URLs in sitemap`)

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE)
    const batchNum = Math.floor(i / BATCH_SIZE) + 1
    const totalBatches = Math.ceil(urls.length / BATCH_SIZE)

    process.stdout.write(`🚀 Submitting batch ${batchNum}/${totalBatches} (${batch.length} URLs)... `)

    try {
      const { status, text } = await submitBatch(batch)
      const icon = status === 200 || status === 202 ? "✅" : "❌"
      console.log(`${icon} HTTP ${status}${text ? ` — ${text}` : ""}`)
    } catch (err) {
      console.log(`❌ Network error: ${err.message}`)
    }
  }

  console.log("\n✔ IndexNow submission complete!")
}

main()
