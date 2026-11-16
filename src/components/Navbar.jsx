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
    const handleScroll = () => setScrolled(window.scrollY > 32);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Close mobile menu cleanly when route changes
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
          const el = document.getElementById(targetId);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 120);
        return;
      }

      if (targetId === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const el = document.getElementById(targetId);
      el?.scrollIntoView({ behavior: 'smooth' });
    },
    [location.pathname, navigate]
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-40 pt-3 sm:pt-4 px-4 sm:px-6 flex flex-col items-center pointer-events-none">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:pointer-events-auto focus:mb-2 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-ink focus:text-on-ink focus:text-sm focus:font-medium shadow-md"
      >
        {currentLang === 'en' ? 'Skip to main content' : 'Langsung ke konten utama'}
      </a>

      <nav
        aria-label={currentLang === 'en' ? 'Primary navigation' : 'Navigasi utama'}
        className={`pointer-events-auto w-full max-w-5xl rounded-2xl transition-all duration-300 border ${
          scrolled
            ? 'bg-surface/95 dark:bg-surface/95 backdrop-blur-md border-line shadow-sm px-4 sm:px-6 py-2.5'
            : 'bg-paper/85 dark:bg-paper/85 backdrop-blur-md border-line/70 px-4 sm:px-6 py-3'
        } flex items-center justify-between gap-4`}
      >
        {/* Brand */}
        <Link
          to="/"
          onClick={(e) => {
            if (location.pathname === '/') {
              handleSectionLink(e, 'top');
            }
          }}
          className="flex items-center min-h-[44px] pr-2 text-ink hover:opacity-85 transition-opacity shrink-0"
          aria-label="Akbar Alfaidah — Home"
        >
          <BrandLogo className="h-7 sm:h-8 w-auto text-ink" showWordmark />
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((item) => (
            <a
              key={item.key}
              href={`/#${item.target}`}
              onClick={(e) => handleSectionLink(e, item.target)}
              className="px-3.5 py-2 min-h-[40px] inline-flex items-center text-sm font-medium text-ink-muted hover:text-ink transition-colors rounded-lg hover:bg-mist/70 whitespace-nowrap"
            >
              {t(`nav.${item.key}`)}
            </a>
          ))}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleLanguage}
            className="min-h-[44px] min-w-[44px] px-3 rounded-xl font-mono text-xs font-semibold uppercase tracking-wider text-ink border border-line bg-surface hover:border-brass hover:text-brass transition-colors whitespace-nowrap"
            aria-label={currentLang === 'id' ? 'Switch language to English' : 'Ganti bahasa ke Indonesia'}
          >
            {currentLang === 'id' ? 'ID' : 'EN'}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-ink border border-line bg-surface hover:border-brass hover:text-brass transition-colors"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          </button>

          <a
            href="/#contact"
            onClick={(e) => handleSectionLink(e, 'contact')}
            className="hidden sm:inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-xl text-sm font-medium bg-ink text-on-ink hover:bg-ink/90 transition-colors whitespace-nowrap"
          >
            <span>{t('nav.contact')}</span>
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-ink border border-line bg-surface hover:border-brass transition-colors"
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
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-auto lg:hidden mt-2 w-full max-w-5xl bg-surface border border-line rounded-2xl shadow-lg p-4 flex flex-col gap-1"
          >
            {NAV_LINKS.map((item) => (
              <a
                key={item.key}
                href={`/#${item.target}`}
                onClick={(e) => handleSectionLink(e, item.target)}
                className="min-h-[48px] px-4 py-3 rounded-xl text-base font-medium text-ink hover:bg-mist flex items-center justify-between transition-colors"
              >
                <span>{t(`nav.${item.key}`)}</span>
                <ArrowUpRight size={16} className="text-ink-muted" aria-hidden="true" />
              </a>
            ))}

            <div className="pt-2 mt-1 border-t border-line">
              <a
                href="/#contact"
                onClick={(e) => handleSectionLink(e, 'contact')}
                className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-ink text-on-ink font-medium text-base flex items-center justify-center gap-2 hover:bg-ink/90 transition-colors"
              >
                <span>{t('nav.contact')}</span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
