import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon, Menu, X, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../hooks/useTheme";
import BrandLogo from "./BrandLogo";
import Magnetic from "./ui/Magnetic";

const NAV_LINKS = [
  { key: "projects", target: "projects" },
  { key: "services", target: "capabilities" },
  { key: "about", target: "about" },
  { key: "experience", target: "experience" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const currentLang = i18n.language === "en" ? "en" : "id";

  const toggleLanguage = () => {
    const nextLang = currentLang === "id" ? "en" : "id";
    i18n.changeLanguage(nextLang);
    try {
      window.localStorage.setItem("lang", nextLang);
    } catch {
      // Ignore storage restriction
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 28);

      if (location.pathname !== "/") {
        setActiveSection(
          location.pathname.startsWith("/project") ? "projects" : "",
        );
        return;
      }

      const ids = [
        "projects",
        "capabilities",
        "about",
        "experience",
        "contact",
      ];
      const offset = 160;
      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= offset && rect.bottom > offset) {
          current = id;
          break;
        }
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  const handleSectionLink = useCallback(
    (e, targetId) => {
      e.preventDefault();
      setMobileMenuOpen(false);

      const scrollToEl = (el) => {
        const lenis = window.__lenis;
        if (lenis) {
          lenis.scrollTo(el, { offset: -72, duration: 1.15 });
        } else {
          el.scrollIntoView({ behavior: "smooth" });
        }
      };

      const scrollToTarget = () => {
        const lenis = window.__lenis;
        if (targetId === "top") {
          if (lenis) {
            lenis.scrollTo(0, { duration: 1.15 });
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          return;
        }
        window.dispatchEvent(new CustomEvent("app:preload-sections"));
        const immediate = document.getElementById(targetId);
        if (immediate) {
          scrollToEl(immediate);
          return;
        }
        let attempts = 0;
        const timer = window.setInterval(() => {
          attempts += 1;
          const lateEl = document.getElementById(targetId);
          if (lateEl) {
            window.clearInterval(timer);
            scrollToEl(lateEl);
          } else if (attempts >= 25) {
            window.clearInterval(timer);
          }
        }, 60);
      };

      if (location.pathname !== "/") {
        navigate(`/#${targetId}`);
        window.setTimeout(scrollToTarget, 140);
        return;
      }

      scrollToTarget();
    },
    [location.pathname, navigate],
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 h-[72px] transition-all duration-300 ${
        scrolled
          ? "liquid-glass border-x-0 border-t-0 border-b border-line/80"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-6 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-ink focus:text-on-ink focus:text-sm focus:font-medium"
      >
        {currentLang === "en"
          ? "Skip to main content"
          : "Langsung ke konten utama"}
      </a>

      <nav
        aria-label={
          currentLang === "en" ? "Primary navigation" : "Navigasi utama"
        }
        className="h-full max-w-6xl mx-auto px-5 sm:px-6 flex items-center justify-between gap-4"
      >
        <Link
          to="/"
          onClick={(e) => {
            if (location.pathname === "/") {
              handleSectionLink(e, "top");
            }
          }}
          className="flex items-center min-h-[44px] pr-1 text-ink hover:opacity-80 transition-opacity shrink-0"
          aria-label="Akbar Alfaidah - Home"
        >
          <BrandLogo className="h-7 sm:h-8 w-auto text-ink" showWordmark />
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((item) => {
            const isActive = activeSection === item.target;
            return (
              <a
                key={item.key}
                href={`/#${item.target}`}
                onClick={(e) => handleSectionLink(e, item.target)}
                aria-current={isActive ? "location" : undefined}
                className={`relative px-4 py-2 min-h-[44px] inline-flex items-center text-[15px] font-medium transition-colors whitespace-nowrap ${
                  isActive ? "text-ink" : "text-ink-muted hover:text-ink"
                }`}
              >
                <span>{t(`nav.${item.key}`)}</span>
                {isActive && (
                  <span className="absolute left-4 right-4 bottom-1.5 h-[1.5px] bg-accent transition-all duration-200" />
                )}
              </a>
            );
          })}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleLanguage}
            className="min-h-[38px] min-w-[38px] px-2.5 rounded-lg font-mono text-xs font-semibold uppercase text-ink border border-line bg-paper/40 backdrop-blur-sm hover:border-ink/40 transition-colors whitespace-nowrap"
            aria-label={
              currentLang === "id"
                ? "Switch language to English"
                : "Ganti bahasa ke Indonesia"
            }
          >
            {currentLang === "id" ? "ID" : "EN"}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-lg text-ink border border-line bg-paper/40 backdrop-blur-sm hover:border-ink/40 transition-colors overflow-hidden"
            aria-label={
              theme === "dark"
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
          >
            <span className="transition-transform duration-200">
              {theme === "dark" ? (
                <Sun size={16} aria-hidden="true" />
              ) : (
                <Moon size={16} aria-hidden="true" />
              )}
            </span>
          </button>

          <Magnetic strength={0.22} className="hidden sm:inline-block">
            <a
              href="/#contact"
              onClick={(e) => handleSectionLink(e, "contact")}
              className="inline-flex items-center gap-1.5 min-h-[38px] px-4 py-2 rounded-lg text-sm font-medium bg-ink text-on-ink hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              <span>{t("nav.contact")}</span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </Magnetic>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="lg:hidden min-h-[38px] min-w-[38px] flex items-center justify-center rounded-lg text-ink border border-line bg-paper/40 backdrop-blur-sm hover:border-ink/40 transition-colors"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={
              mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
          >
            {mobileMenuOpen ? (
              <X size={18} aria-hidden="true" />
            ) : (
              <Menu size={18} aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label={
            currentLang === "en" ? "Mobile navigation" : "Menu navigasi mobile"
          }
          className="lg:hidden bg-paper/95 backdrop-blur-xl border-b border-line px-5 py-4 flex flex-col divide-y divide-line"
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.key}
              href={`/#${item.target}`}
              onClick={(e) => handleSectionLink(e, item.target)}
              className="min-h-[48px] py-3 text-base font-medium text-ink hover:text-accent flex items-center justify-between transition-colors"
            >
              <span>{t(`nav.${item.key}`)}</span>
              <ArrowUpRight
                size={17}
                className="text-ink-muted"
                aria-hidden="true"
              />
            </a>
          ))}

          <div className="pt-4 mt-1">
            <a
              href="/#contact"
              onClick={(e) => handleSectionLink(e, "contact")}
              className="w-full min-h-[48px] px-4 py-3 rounded-lg bg-ink text-on-ink font-medium text-base flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <span>{t("nav.contact")}</span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
