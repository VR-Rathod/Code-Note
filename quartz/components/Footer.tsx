import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"

interface Options {
  links: Record<string, string>
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    const links = opts?.links ?? []
    return (
      <footer class={`${displayClass ?? ""}`}>
        <div class="footer-main">
          <div class="footer-brand">
            <span class="footer-logo">📘 Free Code Notes</span>
            <p class="footer-tagline">A free programming knowledge base for every developer.</p>
            <p class="footer-copy">
              © {year}{" "}
              <a href="https://github.com/VR-Rathod/" rel="noopener">Vaibhav Rathod</a>
              {" "}· Content licensed under{" "}
              <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" rel="license noopener" target="_blank">
                CC BY-NC-SA 4.0
              </a>
            </p>
          </div>
          <div class="footer-social">
            <p class="footer-social-label">Connect</p>
            <ul>
              {Object.entries(links).map(([text, link]) => (
                <li>
                  <a href={link} target="_blank" rel="noopener">{text}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div class="footer-legal-bar">
          <nav class="footer-legal-links" aria-label="Legal navigation">
            <a href="/about">About</a>
            <span class="footer-divider">·</span>
            <a href="/privacy-policy">Privacy Policy</a>
            <span class="footer-divider">·</span>
            <a href="/terms-of-service">Terms of Service</a>
            <span class="footer-divider">·</span>
            <a href="/cookie-policy">Cookie Policy</a>
          </nav>
        </div>
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor

