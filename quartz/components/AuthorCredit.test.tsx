import test, { describe } from "node:test"
import assert from "node:assert"
import { render } from "preact-render-to-string"
import { h } from "preact"
import AuthorCreditConstructor from "./AuthorCredit"

const AuthorCredit = AuthorCreditConstructor()

// Minimal stub for QuartzComponentProps
function makeProps(frontmatter: Record<string, unknown> = {}): any {
  return {
    fileData: { frontmatter },
    cfg: {},
    ctx: {},
    externalResources: {},
    children: [],
    tree: {},
    allFiles: [],
  }
}

describe("AuthorCredit rendering logic", () => {
  // Requirements 1.2, 3.5 — default fallback when no author in frontmatter
  test("uses default author when no frontmatter author is set", () => {
    const html = render(h(AuthorCredit, makeProps()))
    assert.ok(html.includes("Vaibhav Rathod"), `Expected default author in: ${html}`)
  })

  // Requirement 1.3 — custom author overrides default
  test("uses custom author from frontmatter when set", () => {
    const html = render(h(AuthorCredit, makeProps({ author: "Jane Doe" })))
    assert.ok(html.includes("Jane Doe"), `Expected custom author in: ${html}`)
    assert.ok(!html.includes("Vaibhav Rathod"), `Default author should not appear in: ${html}`)
  })

  // Requirement 3.5 — empty string falls back to default
  test("falls back to default author when frontmatter author is empty string", () => {
    const html = render(h(AuthorCredit, makeProps({ author: "" })))
    assert.ok(html.includes("Vaibhav Rathod"), `Expected default author fallback in: ${html}`)
  })

  // Requirement 2.2 — plain text when no authorUrl
  test("renders author as plain text when no authorUrl is set", () => {
    const html = render(h(AuthorCredit, makeProps({ author: "Jane Doe" })))
    assert.ok(!html.includes("<a "), `Expected no anchor tag in: ${html}`)
    assert.ok(html.includes("Jane Doe"), `Expected author name in: ${html}`)
  })

  // Requirements 2.1, 2.3, 3.3 — hyperlink with correct target and rel when authorUrl is set
  test("renders author as hyperlink with target=_blank and rel=noopener noreferrer when authorUrl is set", () => {
    const html = render(
      h(AuthorCredit, makeProps({ author: "Jane Doe", authorUrl: "https://example.com" })),
    )
    assert.ok(html.includes('href="https://example.com"'), `Expected href in: ${html}`)
    assert.ok(html.includes('target="_blank"'), `Expected target=_blank in: ${html}`)
    assert.ok(
      html.includes('rel="noopener noreferrer"'),
      `Expected rel=noopener noreferrer in: ${html}`,
    )
    assert.ok(html.includes("Jane Doe"), `Expected author name in: ${html}`)
  })

  // Requirement 3.4 — custom author as plain text when only author is set (no authorUrl)
  test("renders custom author as plain text when only author is set without authorUrl", () => {
    const html = render(h(AuthorCredit, makeProps({ author: "Custom Author" })))
    assert.ok(html.includes("Custom Author"), `Expected custom author in: ${html}`)
    assert.ok(!html.includes("<a "), `Expected no anchor tag in: ${html}`)
  })
})
