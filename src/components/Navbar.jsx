import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import BrandLogo from './BrandLogo';

const NAV_LINKS = [
  { key: 'projects', target: 'projects' },
  { key: 'services', target: 'capabilities' },
  { key: 'about', target: 'about' },
  { key: 'experience', target: 'experience' }
];

export default function Navbar() {
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
      if (location.pathname !== '/') {
        setActiveSection(location.pathname.startsWith('/project') ? 'projects' : '');
        return;
      }

      const ids = ['projects', 'capabilities', 'about', 'experience', 'contact'];
      const offset = 160;
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
    <header className="fixed top-0 left-0 right-0 z-40 h-[72px] bg-paper/90 backdrop-blur-xl border-b border-line transition-colors">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-6 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-ink focus:text-on-ink focus:text-sm focus:font-medium"
      >
        {currentLang === 'en' ? 'Skip to main content' : 'Langsung ke konten utama'}
      </a>

      <nav
        aria-label={currentLang === 'en' ? 'Primary navigation' : 'Navigasi utama'}
        className="h-full max-w-6xl mx-auto px-5 sm:px-6 flex items-center justify-between gap-4"
      >
        {/* Brand */}
        <Link
          to="/"
          onClick={(e) => {
            if (location.pathname === '/') {
              handleSectionLink(e, 'top');
            }
          }}
          className="flex items-center min-h-[44px] pr-1 text-ink hover:opacity-80 transition-opacity shrink-0"
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
                className={`relative px-4 py-2 min-h-[44px] inline-flex items-center text-[15px] font-medium transition-colors whitespace-nowrap ${
                  isActive ? 'text-ink' : 'text-ink-muted hover:text-ink'
                }`}
              >
                <span>{t(`nav.${item.key}`)}</span>
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-indicator"
                    transition={{ type: 'spring', stiffness: 450, damping: 36 }}
                    className="absolute left-4 right-4 bottom-1.5 h-[1.5px] bg-ink"
                  />
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
            className="min-h-[40px] min-w-[40px] px-2.5 rounded-lg font-mono text-xs font-semibold uppercase text-ink border border-line hover:border-ink/40 transition-colors whitespace-nowrap"
            aria-label={currentLang === 'id' ? 'Switch language to English' : 'Ganti bahasa ke Indonesia'}
          >
            {currentLang === 'id' ? 'ID' : 'EN'}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-ink border border-line hover:border-ink/40 transition-colors overflow-hidden"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -25, opacity: 0, scale: 0.75 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 25, opacity: 0, scale: 0.75 }}
                transition={{ duration: 0.15 }}
              >
                {theme === 'dark' ? (
                  <Sun size={17} aria-hidden="true" />
                ) : (
                  <Moon size={17} aria-hidden="true" />
                )}
              </motion.span>
            </AnimatePresence>
          </button>

          <a
            href="/#contact"
            onClick={(e) => handleSectionLink(e, 'contact')}
            className="hidden sm:inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 rounded-lg text-sm font-medium bg-ink text-on-ink hover:opacity-85 transition-opacity whitespace-nowrap"
          >
            <span>{t('nav.contact')}</span>
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="lg:hidden min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-ink border border-line hover:border-ink/40 transition-colors"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
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
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden bg-paper border-b border-line px-5 py-4 flex flex-col divide-y divide-line"
          >
            {NAV_LINKS.map((item) => (
              <a
                key={item.key}
                href={`/#${item.target}`}
                onClick={(e) => handleSectionLink(e, item.target)}
                className="min-h-[48px] py-3 text-base font-medium text-ink hover:text-accent flex items-center justify-between transition-colors"
              >
                <span>{t(`nav.${item.key}`)}</span>
                <ArrowUpRight size={17} className="text-ink-muted" aria-hidden="true" />
              </a>
            ))}

            <div className="pt-4 mt-1">
              <a
                href="/#contact"
                onClick={(e) => handleSectionLink(e, 'contact')}
                className="w-full min-h-[48px] px-4 py-3 rounded-lg bg-ink text-on-ink font-medium text-base flex items-center justify-center gap-2 hover:opacity-85 transition-opacity"
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
