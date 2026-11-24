import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapPin, ArrowUpRight, ArrowUp } from "lucide-react";
import BrandLogo from "./BrandLogo";
import { useTheme } from "../hooks/useTheme";
import { ParallaxLayer } from "./ui/MotionPrimitives";

const FOOTER_SECTIONS = [
  { key: "projects", href: "/#projects" },
  { key: "services", href: "/#capabilities" },
  { key: "about", href: "/#about" },
  { key: "experience", href: "/#experience" },
  { key: "contact", href: "/#contact" },
];

const CONTACT_EMAIL =
  import.meta.env.VITE_CONTACT_EMAIL || "akbaralfaidah667@gmail.com";

const EXTERNAL_LINKS = [
  { label: "GitHub", href: "https://github.com/AkbarAlfaidah" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/akbar-alfaidah/" },
  { label: "Instagram", href: "https://www.instagram.com/akbralf._/" },
  { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
];

export default function Footer() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const year = new Date().getFullYear();
  const isEn = i18n.language === "en";
  const isDark = theme === "dark";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#EEF2F9] dark:bg-[#080B12] text-ink border-t border-line pt-12 sm:pt-20 pb-8 px-4 sm:px-6 overflow-hidden transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <ParallaxLayer yRange={[74, -22]}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 pb-10 sm:pb-12 border-b border-line">
            <div className="md:col-span-5 flex flex-col gap-3.5 sm:gap-4">
              <Link
                to="/"
                className="inline-flex items-center min-h-[44px] self-start text-ink hover:opacity-85 transition-opacity"
              >
                <BrandLogo
                  className="h-7 sm:h-8 w-auto text-ink"
                  showWordmark
                  inverted={isDark}
                />
              </Link>
              <p className="text-sm sm:text-base text-ink-muted max-w-sm leading-relaxed">
                {t("footer.tagline")}
              </p>
              <p className="inline-flex items-center gap-2 font-mono text-xs text-ink-muted pt-0.5">
                <MapPin
                  size={14}
                  className="text-accent shrink-0"
                  aria-hidden="true"
                />
                <span>{t("footer.location")}</span>
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="md:hidden inline-flex items-center font-mono text-xs font-medium text-ink hover:text-accent transition-colors self-start"
              >
                {CONTACT_EMAIL}
              </a>
            </div>

            <div className="grid grid-cols-2 gap-6 md:contents">
              <div className="md:col-span-3">
                <h3 className="font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2.5 sm:mb-3">
                  {t("footer.nav_title")}
                </h3>
                <ul className="space-y-0.5 sm:space-y-1">
                  {FOOTER_SECTIONS.map((item) => (
                    <li key={item.key}>
                      <a
                        href={item.href}
                        className="inline-flex items-center min-h-[36px] text-sm sm:text-base text-ink-muted hover:text-accent transition-colors"
                      >
                        {t(`nav.${item.key}`)}
                      </a>
                    </li>
                  ))}
                  <li>
                    <Link
                      to="/projects"
                      className="inline-flex items-center min-h-[36px] text-sm sm:text-base text-ink-muted hover:text-accent transition-colors"
                    >
                      {t("projects.back_projects")}
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="md:col-span-4">
                <h3 className="font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2.5 sm:mb-3">
                  {t("footer.connect_title")}
                </h3>
                <ul className="space-y-0.5 sm:space-y-1">
                  {EXTERNAL_LINKS.map((item) => {
                    const isExternal = item.href.startsWith("http");
                    const isEmail = item.href.startsWith("mailto:");
                    return (
                      <li key={item.label}>
                        <a
                          href={item.href}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noopener noreferrer" : undefined}
                          className="inline-flex items-center gap-1.5 min-h-[36px] text-sm sm:text-base text-ink-muted hover:text-accent transition-colors break-words"
                        >
                          {isEmail ? (
                            <>
                              <span className="md:hidden">Email</span>
                              <span className="hidden md:inline">{item.label}</span>
                            </>
                          ) : (
                            <span>{item.label}</span>
                          )}
                          {isExternal && (
                            <ArrowUpRight size={13} className="shrink-0" aria-hidden="true" />
                          )}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </ParallaxLayer>

        <div className="py-6 sm:py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs sm:text-sm text-ink-muted">
          <p>
            © {year} Akbar Alfaidah - {t("footer.role")}.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full liquid-glass-pill text-xs sm:text-sm font-medium text-ink hover:text-accent transition-colors"
          >
            <span>{isEn ? "Back to top" : "Kembali ke atas"}</span>
            <ArrowUp size={14} aria-hidden="true" />
          </button>
        </div>

        {/* Monumental Architectural Wordmark Floor with Curtain Parallax Rise */}
        <div
          className="pt-5 sm:pt-6 border-t border-line select-none overflow-hidden text-center md:text-left"
          aria-hidden="true"
        >
          <ParallaxLayer yRange={[155, -12]} scaleRange={[0.84, 1.04]}>
            <p className="font-display font-semibold tracking-[-0.045em] leading-[0.88] text-[clamp(2.1rem,10.2vw,8.6rem)] text-ink/[0.06] dark:text-white/[0.07] whitespace-nowrap">
              AKBAR ALFAIDAH
            </p>
          </ParallaxLayer>
        </div>
      </div>
    </footer>
  );
}
