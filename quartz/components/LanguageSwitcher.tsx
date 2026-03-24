// @ts-ignore
import script from "./scripts/languageswitcher.inline"
import styles from "./styles/languageswitcher.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { TRANSLATIONS } from "../i18n"

function extractStrings(locale: string): Record<string, string> {
  const t = TRANSLATIONS[locale as keyof typeof TRANSLATIONS]
  if (!t) return {}
  return {
    explorer: t.components.explorer.title,
    search: t.components.search.title,
    searchBarPlaceholder: t.components.search.searchBarPlaceholder,
    tableOfContents: t.components.tableOfContents.title,
    backlinks: t.components.backlinks.title,
    noBacklinksFound: t.components.backlinks.noBacklinksFound,
    graph: t.components.graph.title,
    recentNotes: t.components.recentNotes.title,
    createdWith: t.components.footer.createdWith,
    lightMode: t.components.themeToggle.lightMode,
    darkMode: t.components.themeToggle.darkMode,
    readerMode: t.components.readerMode.title,
  }
}

interface Options {
  languages: { label: string; locale: string }[]
}

const defaultOptions: Options = {
  languages: [
    { label: "EN", locale: "en-US" },
    { label: "हि", locale: "hi-IN" },
  ],
}

export default ((userOpts?: Partial<Options>) => {
  const opts = { ...defaultOptions, ...userOpts }

  // Build the full translation map to embed in the page
  const translationMap: Record<string, Record<string, string>> = {}
  for (const { locale } of opts.languages) {
    translationMap[locale] = extractStrings(locale)
  }
  const translationsJson = JSON.stringify(translationMap)

  const LanguageSwitcher: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    return (
      <div class={`language-switcher ${displayClass ?? ""}`}>
        {opts.languages.map(({ label, locale }) => (
          <button class="lang-option" data-lang={locale} aria-label={`Switch to ${locale}`}>
            {label}
          </button>
        ))}
        {/* Embed translations once into the DOM for the inline script to read */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.dataset.translations = ${JSON.stringify(translationsJson)}`,
          }}
        />
      </div>
    )
  }

  LanguageSwitcher.afterDOMLoaded = script
  LanguageSwitcher.css = styles
  return LanguageSwitcher
}) satisfies QuartzComponentConstructor
