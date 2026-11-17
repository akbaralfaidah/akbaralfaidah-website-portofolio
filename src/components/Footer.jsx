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
    <footer className="bg-[#EEF2F9] dark:bg-[#080B12] text-ink border-t border-line pt-16 sm:pt-20 pb-8 px-5 sm:px-6 overflow-hidden transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-line">
          <div className="md:col-span-5 flex flex-col gap-4">
            <Link
              to="/"
              className="inline-flex items-center min-h-[44px] self-start text-ink hover:opacity-85 transition-opacity"
            >
              <BrandLogo
                className="h-8 w-auto text-ink"
                showWordmark
                inverted={isDark}
              />
            </Link>
            <p className="text-base text-ink-muted max-w-sm leading-relaxed">
              {t("footer.tagline")}
            </p>
            <p className="inline-flex items-center gap-2 font-mono text-xs text-ink-muted pt-1">
              <MapPin
                size={14}
                className="text-accent shrink-0"
                aria-hidden="true"
              />
              <span>{t("footer.location")}</span>
            </p>
          </div>

          <div className="md:col-span-3">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-muted mb-3">
              {t("footer.nav_title")}
            </h3>
            <ul className="space-y-1">
              {FOOTER_SECTIONS.map((item) => (
                <li key={item.key}>
                  <a
                    href={item.href}
                    className="inline-flex items-center min-h-[38px] text-sm sm:text-base text-ink-muted hover:text-accent transition-colors"
                  >
                    {t(`nav.${item.key}`)}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  to="/projects"
                  className="inline-flex items-center min-h-[38px] text-sm sm:text-base text-ink-muted hover:text-accent transition-colors"
                >
                  {t("projects.back_projects")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-muted mb-3">
              {t("footer.connect_title")}
            </h3>
            <ul className="space-y-1">
              {EXTERNAL_LINKS.map((item) => {
                const isExternal = item.href.startsWith("http");
                return (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-1.5 min-h-[38px] text-sm sm:text-base text-ink-muted hover:text-accent transition-colors break-all"
                    >
                      <span>{item.label}</span>
                      {isExternal && (
                        <ArrowUpRight size={14} aria-hidden="true" />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-ink-muted">
          <p>
            © {year} Akbar Alfaidah - {t("footer.role")}.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-accent transition-colors"
          >
            <span>{isEn ? "Back to top" : "Kembali ke atas"}</span>
            <ArrowUp size={14} aria-hidden="true" />
          </button>
        </div>

        {/* Monumental Architectural Wordmark Floor with Curtain Parallax Rise */}
        <div
          className="pt-6 border-t border-line select-none overflow-hidden"
          aria-hidden="true"
        >
          <ParallaxLayer yRange={[78, -6]} scaleRange={[0.92, 1]}>
            <p className="font-display font-semibold tracking-[-0.045em] leading-[0.86] text-[clamp(2.4rem,10.8vw,8.6rem)] text-ink/[0.045] dark:text-white/[0.06] whitespace-nowrap">
              AKBAR ALFAIDAH
            </p>
          </ParallaxLayer>
        </div>
      </div>
    </footer>
  );
}
