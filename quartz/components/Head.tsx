import { i18n } from "../i18n"
import { FullSlug, getFileExtension, joinSegments, pathToRoot, simplifySlug } from "../util/path"
import { CSSResourceToStyleElement, JSResourceToScriptElement } from "../util/resources"
import { googleFontHref, googleFontSubsetHref } from "../util/theme"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { unescapeHTML } from "../util/escape"
import { CustomOgImagesEmitterName } from "../plugins/emitters/ogImage"

// ── Author / site identity (E-E-A-T signals) ─────────────────────────────────
const AUTHOR = {
  name: "Vaibhav Rathod",
  url: "https://github.com/VR-Rathod",
  sameAs: [
    "https://github.com/VR-Rathod",
    "https://code-note-vr.vercel.app",
  ],
}

// ── Build BreadcrumbList JSON-LD ──────────────────────────────────────────────
function buildBreadcrumbLd(baseUrl: string, slug: string, title: string) {
  if (!slug || slug === "index" || slug === "404") return null
  const parts = slug.split("/").filter(Boolean)
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `https://${baseUrl}`,
    },
  ]
  parts.forEach((part, i) => {
    const href = `https://${baseUrl}/${parts.slice(0, i + 1).join("/")}`
    const name = i === parts.length - 1
      ? title
      : part.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    items.push({ "@type": "ListItem", position: i + 2, name, item: href })
  })
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  }
}

// ── Build main page JSON-LD ───────────────────────────────────────────────────
function buildJsonLd(
  cfg: QuartzComponentProps["cfg"],
  fileData: QuartzComponentProps["fileData"],
  pageUrl: string,
  description: string,
  title: string,
  ogImage: string,
) {
  const baseUrl = `https://${cfg.baseUrl}`
  const author = {
    "@type": "Person",
    name: AUTHOR.name,
    url: AUTHOR.url,
    sameAs: AUTHOR.sameAs,
    jobTitle: "Fullstack and Game Developer",
    description: "Fullstack and Game developer and technical writer specializing in DSA, Game Dev, and DevOps.",
  }

  // ── Index page: WebSite and Person schema ──────────────────────────────────
  if (fileData.slug === "index") {
    return [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: cfg.pageTitle,
        url: baseUrl,
        description,
        author,
        publisher: author,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${baseUrl}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${baseUrl}/#person`,
        name: AUTHOR.name,
        url: AUTHOR.url,
        sameAs: AUTHOR.sameAs,
        jobTitle: "Fullstack and Game Developer",
        knowsAbout: [
          "Programming", "Software Development", "Data Structures",
          "Algorithms", "Game Development", "Web Development", "DevOps",
          "Cybersecurity", "Linux Internals", "Graphics Programming",
        ],
        description: "Vaibhav Rathod is a fullstack and game developer creating comprehensive programming references and code notes for developers.",
      },
    ]
  }

  // ── Content pages: TechArticle schema ──────────────────────────────────────
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    name: title,
    url: pageUrl,
    description,
    author: {
      "@type": "Person",
      "@id": `${baseUrl}/#person`,
    },
    publisher: {
      "@type": "Person",
      "@id": `${baseUrl}/#person`,
      name: AUTHOR.name,
    },
    image: {
      "@type": "ImageObject",
      url: ogImage,
      width: 1200,
      height: 630,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    // Speakable — helps Google Assistant / voice search cite your content
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["article h1", "article h2", "article p"],
    },
    inLanguage: "en-US",
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
  }

  if (fileData.dates?.created) {
    try { ld.datePublished = fileData.dates.created.toISOString() } catch (_) { }
  }
  if (fileData.dates?.modified) {
    try { ld.dateModified = fileData.dates.modified.toISOString() } catch (_) { }
  }

  return ld
}

export default (() => {
  const Head: QuartzComponent = ({
    cfg,
    fileData,
    externalResources,
    ctx,
  }: QuartzComponentProps) => {
    const titleSuffix = cfg.pageTitleSuffix ?? ""
    const rawTitle =
      (fileData.frontmatter?.seoTitle as string | undefined) ??
      fileData.frontmatter?.title ??
      i18n(cfg.locale).propertyDefaults.title
    const title = rawTitle + titleSuffix

    const description =
      (fileData.frontmatter?.socialDescription as string | undefined) ??
      (fileData.frontmatter?.description as string | undefined) ??
      unescapeHTML(fileData.description?.trim() ?? i18n(cfg.locale).propertyDefaults.description)

    const keywords =
      (fileData.frontmatter?.keywords as string | undefined) ??
      "programming notes, coding reference, DSA, algorithms, data structures, Python, JavaScript, Java, C++, web development, game development, Godot, free coding notes"

    const { css, js, additionalHead } = externalResources

    const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
    const path = url.pathname as FullSlug
    const baseDir = fileData.slug === "404" ? path : pathToRoot(fileData.slug!)
    const iconPath = joinSegments(baseDir, "static/icon.png")

    const socialUrl =
      fileData.slug === "404"
        ? url.toString()
        : joinSegments(url.toString(), simplifySlug(fileData.slug!))

    const canonicalHref =
      (fileData.frontmatter?.canonicalUrl as string | undefined) ?? socialUrl

    const usesCustomOgImage = ctx.cfg.plugins.emitters.some(
      (e) => e.name === CustomOgImagesEmitterName,
    )
    const ogImageDefaultPath = `https://${cfg.baseUrl}/static/og-image.png`
    const noindex = fileData.frontmatter?.noindex === true

    // Build JSON-LD blocks
    const mainLd = fileData.slug !== "404" && cfg.baseUrl
      ? buildJsonLd(cfg, fileData, canonicalHref, description, rawTitle as string, ogImageDefaultPath)
      : null

    const breadcrumbLd = fileData.slug && cfg.baseUrl
      ? buildBreadcrumbLd(cfg.baseUrl, fileData.slug, rawTitle as string)
      : null

    // Determine og:type — article for content pages, website for index
    const ogType = fileData.slug === "index" ? "website" : "article"

    return (
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* ── Resource hints ─────────────────────────────────────────────── */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

        {cfg.theme.cdnCaching && cfg.theme.fontOrigin === "googleFonts" && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="preload" href={googleFontHref(cfg.theme)} as="style" />
            <link rel="stylesheet" href={googleFontHref(cfg.theme)} />
            {cfg.theme.typography.title && (
              <link rel="stylesheet" href={googleFontSubsetHref(cfg.theme, cfg.pageTitle)} />
            )}
          </>
        )}

        {/* ── Core meta ──────────────────────────────────────────────────── */}
        <meta name="description" content={description} />
        <meta name="google-site-verification" content="_MkAeUbJlNRBEVoHeWrmpu8JiP2EcKy2u7ZPXT8iyy8" />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={AUTHOR.name} />
        <meta name="theme-color" content={cfg.theme.colors.lightMode.light} />
        <meta name="color-scheme" content="light dark" />
        <meta name="generator" content="Quartz" />

        {/* ── Robots ─────────────────────────────────────────────────────── */}
        {noindex
          ? <meta name="robots" content="noindex, nofollow" />
          : <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        }
        {/* Googlebot-specific — allow full snippet and image preview */}
        {!noindex && (
          <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large" />
        )}

        {/* ── Canonical ──────────────────────────────────────────────────── */}
        {fileData.slug !== "404" && <link rel="canonical" href={canonicalHref} />}

        {/* ── Open Graph ─────────────────────────────────────────────────── */}
        <meta property="og:site_name" content={cfg.pageTitle} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={ogType} />
        <meta property="og:locale" content="en_US" />
        {cfg.baseUrl && <meta property="og:url" content={socialUrl} />}

        {!usesCustomOgImage && (
          <>
            <meta property="og:image" content={ogImageDefaultPath} />
            <meta property="og:image:url" content={ogImageDefaultPath} />
            <meta property="og:image:secure_url" content={ogImageDefaultPath} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={title} />
            <meta
              property="og:image:type"
              content={`image/${getFileExtension(ogImageDefaultPath) ?? "png"}`}
            />
          </>
        )}

        {/* Article-specific OG tags for content pages */}
        {ogType === "article" && fileData.dates?.modified && (
          <>
            <meta property="article:modified_time" content={fileData.dates.modified.toISOString()} />
            {fileData.dates?.created && (
              <meta property="article:published_time" content={fileData.dates.created.toISOString()} />
            )}
            <meta property="article:author" content={AUTHOR.url} />
          </>
        )}

        {/* ── Twitter / X Card ───────────────────────────────────────────── */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {cfg.baseUrl && <meta name="twitter:domain" content={cfg.baseUrl} />}
        {cfg.baseUrl && <meta name="twitter:url" content={socialUrl} />}
        {!usesCustomOgImage && (
          <meta name="twitter:image" content={ogImageDefaultPath} />
        )}

        {/* ── Icons ──────────────────────────────────────────────────────── */}
        <link rel="icon" href={iconPath} />
        <link rel="apple-touch-icon" href={iconPath} />

        {/* ── RSS autodiscovery ──────────────────────────────────────────── */}
        {cfg.baseUrl && (
          <link
            rel="alternate"
            type="application/rss+xml"
            title={`${cfg.pageTitle} RSS Feed`}
            href={`https://${cfg.baseUrl}/index.xml`}
          />
        )}

        {/* ── JSON-LD: Main schema (WebSite / TechArticle) ───────────────── */}
        {mainLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(mainLd),
            }}
          />
        )}

        {/* ── JSON-LD: BreadcrumbList ─────────────────────────────────────── */}
        {breadcrumbLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(breadcrumbLd),
            }}
          />
        )}

        {/* ── Vercel Speed Insights ──────────────────────────────────────── */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
          if (location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
            const script = document.createElement('script');
            script.src = 'https://va.vercel-scripts.com/v1/speed-insights/script.js';
            script.defer = true;
            script.setAttribute('data-endpoint', '/_vercel/speed-insights/vitals');
            document.head.appendChild(script);
          }
        `,
          }}
        />

        {css.map((resource) => CSSResourceToStyleElement(resource, true))}
        {js
          .filter((resource) => resource.loadTime === "beforeDOMReady")
          .map((res) => JSResourceToScriptElement(res, true))}
        {additionalHead.map((resource) => {
          if (typeof resource === "function") {
            return resource(fileData)
          } else {
            return resource
          }
        })}
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor
