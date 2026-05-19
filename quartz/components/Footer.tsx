import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"

interface Options {
  links: Record<string, string>
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    const links = opts?.links ?? {}

    // Categorized links for premium column layout
    const resourcesLinks = [
      { text: "💖 Supporters Wall", href: "/credits" },
      { text: "About Us", href: "/about" },
    ]

    const legalLinks = [
      { text: "Privacy Policy", href: "/privacy-policy" },
      { text: "Terms of Service", href: "/terms-of-service" },
      { text: "Cookie Policy", href: "/cookie-policy" },
    ]

    const professionalLinks = [
      { text: "GitHub", href: links.GitHub ?? "https://github.com/VR-Rathod" },
      { text: "LinkedIn", href: links.LinkedIn ?? "#" },
      { text: "Linktree", href: links.Linktree ?? "#" },
    ]

    const creativeLinks = [
      { text: "Medium", href: links.medium ?? "#" },
      { text: "Artstation", href: links.Artstation ?? "#" },
      { text: "Sketchfab", href: links.Sketchfab ?? "#" },
      { text: "Instagram", href: links.Instagram ?? "#" },
    ]

    return (
      <footer class={`${displayClass ?? ""}`}>
        <div class="footer-container">
          <div class="footer-brand-section">
            <div class="footer-logo-container">
              <span class="footer-logo-icon">📘</span>
              <span class="footer-logo-text">Free Code Notes</span>
            </div>
            <p class="footer-tagline">
              A free programming knowledge base for every developer.
            </p>
            <div class="footer-meta">
              <p class="footer-copy">
                © {year} <a href="https://github.com/VR-Rathod/" target="_blank" rel="noopener">Vaibhav Rathod</a>
              </p>
              <p class="footer-license">
                Licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener">CC BY-NC-SA 4.0</a>
              </p>
            </div>
          </div>

          <div class="footer-links-grid">
            <div class="footer-column">
              <h4 class="footer-column-title">Explore</h4>
              <ul class="footer-column-links">
                {resourcesLinks.map(link => (
                  <li>
                    <a href={link.href}>{link.text}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div class="footer-column">
              <h4 class="footer-column-title">Legal</h4>
              <ul class="footer-column-links">
                {legalLinks.map(link => (
                  <li>
                    <a href={link.href}>{link.text}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div class="footer-column">
              <h4 class="footer-column-title">Connect</h4>
              <ul class="footer-column-links">
                {professionalLinks.map(link => (
                  <li>
                    <a href={link.href} target="_blank" rel="noopener">{link.text}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div class="footer-column">
              <h4 class="footer-column-title">Creative</h4>
              <ul class="footer-column-links">
                {creativeLinks.map(link => (
                  <li>
                    <a href={link.href} target="_blank" rel="noopener">{link.text}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
