import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import BrandLogo from './BrandLogo';

const NAV_LINKS = [
  { key: 'about', target: 'about' },
  { key: 'services', target: 'services' },
  { key: 'projects', target: 'projects' },
  { key: 'experience', target: 'experience' }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const currentLang = i18n.language === 'en' ? 'en' : 'id';

  const toggleLanguage = () => {
    const nextLang = currentLang === 'id' ? 'en' : 'id';
    i18n.changeLanguage(nextLang);
    try {
      window.localStorage.setItem('lang', nextLang);
    } catch {
      // Ignore storage restriction
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 32);

      if (location.pathname !== '/') {
        setActiveSection(location.pathname.startsWith('/project') ? 'projects' : '');
        return;
      }

      const ids = ['about', 'services', 'projects', 'experience', 'contact'];
      const offset = 180;
      let current = '';
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
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  const handleSectionLink = useCallback(
    (e, targetId) => {
      e.preventDefault();
      setMobileMenuOpen(false);

      if (location.pathname !== '/') {
        navigate(`/#${targetId}`);
        window.setTimeout(() => {
          document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
        }, 120);
        return;
      }

      if (targetId === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    },
    [location.pathname, navigate]
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-40 pt-3 sm:pt-4 px-4 sm:px-6 flex flex-col items-center pointer-events-none">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:pointer-events-auto focus:mb-2 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-accent-solid focus:text-on-accent focus:text-base focus:font-medium shadow-md"
      >
        {currentLang === 'en' ? 'Skip to main content' : 'Langsung ke konten utama'}
      </a>

      <nav
        aria-label={currentLang === 'en' ? 'Primary navigation' : 'Navigasi utama'}
        className={`pointer-events-auto w-full max-w-6xl rounded-2xl transition-all duration-300 border ${
          scrolled
            ? 'bg-surface/95 dark:bg-surface/95 backdrop-blur-xl border-line shadow-lg shadow-ink/[0.06] dark:shadow-black/40 px-3.5 sm:px-6 py-2.5'
            : 'bg-surface/85 dark:bg-surface/85 backdrop-blur-md border-line/80 px-3.5 sm:px-6 py-3'
        } flex items-center justify-between gap-2 sm:gap-4`}
      >
        {/* Brand */}
        <Link
          to="/"
          onClick={(e) => {
            if (location.pathname === '/') {
              handleSectionLink(e, 'top');
            }
          }}
          className="flex items-center min-h-[44px] pr-1 text-ink hover:opacity-85 transition-opacity shrink-0"
          aria-label="Akbar Alfaidah — Home"
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
                aria-current={isActive ? 'location' : undefined}
                className={`relative px-4 py-2 min-h-[44px] inline-flex items-center text-[15px] font-medium transition-colors rounded-xl whitespace-nowrap ${
                  isActive ? 'text-accent' : 'text-ink-muted hover:text-ink'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-indicator"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    className="absolute inset-0 rounded-xl bg-accent/10 border border-accent/20 -z-10"
                  />
                )}
                <span>{t(`nav.${item.key}`)}</span>
              </a>
            );
          })}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleLanguage}
            className="min-h-[44px] min-w-[44px] px-3 rounded-xl font-mono text-sm font-semibold uppercase text-ink border border-line bg-paper hover:border-accent hover:text-accent active:scale-95 transition-all whitespace-nowrap"
            aria-label={currentLang === 'id' ? 'Switch language to English' : 'Ganti bahasa ke Indonesia'}
          >
            {currentLang === 'id' ? 'ID' : 'EN'}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-ink border border-line bg-paper hover:border-accent hover:text-accent active:scale-95 transition-all overflow-hidden"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 30, opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.16 }}
              >
                {theme === 'dark' ? (
                  <Sun size={19} aria-hidden="true" />
                ) : (
                  <Moon size={19} aria-hidden="true" />
                )}
              </motion.span>
            </AnimatePresence>
          </button>

          <a
            href="/#contact"
            onClick={(e) => handleSectionLink(e, 'contact')}
            className="hidden sm:inline-flex items-center gap-1.5 min-h-[44px] px-5 py-2.5 rounded-xl text-[15px] font-semibold bg-accent-solid text-on-accent hover:bg-accent-hover shadow-sm shadow-accent/20 hover:-translate-y-0.5 active:translate-y-0 transition-all whitespace-nowrap"
          >
            <span>{t('nav.contact')}</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-ink border border-line bg-paper hover:border-accent active:scale-95 transition-all"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={currentLang === 'en' ? 'Mobile navigation' : 'Menu navigasi mobile'}
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto lg:hidden mt-2 w-full max-w-6xl bg-surface border border-line rounded-2xl shadow-xl p-4 flex flex-col gap-1"
          >
            {NAV_LINKS.map((item, idx) => (
              <motion.a
                key={item.key}
                href={`/#${item.target}`}
                onClick={(e) => handleSectionLink(e, item.target)}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.18 }}
                className="min-h-[48px] px-4 py-3 rounded-xl text-base font-medium text-ink hover:bg-mist hover:text-accent flex items-center justify-between transition-colors"
              >
                <span>{t(`nav.${item.key}`)}</span>
                <ArrowUpRight size={17} className="text-ink-muted" aria-hidden="true" />
              </motion.a>
            ))}

            <div className="pt-2 mt-1 border-t border-line">
              <a
                href="/#contact"
                onClick={(e) => handleSectionLink(e, 'contact')}
                className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-accent-solid text-on-accent font-semibold text-base flex items-center justify-center gap-2 hover:bg-accent-hover transition-colors"
              >
                <span>{t('nav.contact')}</span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
