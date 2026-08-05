import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { FiMenu, FiX, FiArrowUp } from 'react-icons/fi';
import AnimatedButton from './ui/AnimatedButton';

const LanguageToggle = ({ language, toggleLanguage }) => {
  const isEn = language === 'en';
  return (
    <button
      onClick={toggleLanguage}
      className="relative w-16 h-8 rounded-full transition-colors flex items-center px-1 border bg-[#EFEFEF] dark:bg-[#2F3135] shadow-inner border-charcoal/10 dark:border-white/10 shrink-0"
      title="Toggle Language"
    >
      <div className="absolute inset-0 flex justify-between items-center px-2.5 text-[11px] font-bold text-charcoal/50 dark:text-white/40 pointer-events-none">
        <span className={`transition-opacity duration-300 ${!isEn ? "opacity-0" : "opacity-100"}`}>ID</span>
        <span className={`transition-opacity duration-300 ${isEn ? "opacity-0" : "opacity-100"}`}>EN</span>
      </div>
      <div 
        className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 shadow-sm relative z-10 overflow-hidden bg-white ${isEn ? 'translate-x-8' : 'translate-x-0'}`}
      >
        <img 
          src={isEn ? "https://flagcdn.com/w40/gb.png" : "https://flagcdn.com/w40/id.png"} 
          alt={isEn ? "EN" : "ID"} 
          className="w-full h-full object-cover scale-110" 
        />
      </div>
    </button>
  );
};

const ThemeToggle = ({ theme, toggleTheme }) => {
  const isDark = theme === 'dark';
  return (
    <button
      onClick={toggleTheme}
      className={`relative w-16 h-8 rounded-full transition-colors flex items-center px-1 shadow-inner border shrink-0 overflow-hidden ${isDark ? 'bg-[#1A1A24] border-white/10' : 'bg-[#55B3F3] border-black/10'}`}
      title="Toggle Theme"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {isDark ? (
          <>
            {/* Stars */}
            <div className="absolute top-1.5 left-2.5 w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_2px_white]"></div>
            <div className="absolute top-4 left-6 w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_2px_white]"></div>
            <div className="absolute bottom-2 left-3 w-[1.5px] h-[1.5px] bg-white/70 rounded-full"></div>
            {/* Dark background rings */}
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 blur-[1px]"></div>
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/5 blur-[1px]"></div>
          </>
        ) : (
          <>
            {/* Clouds */}
            <div className="absolute bottom-0 right-1 w-6 h-4 bg-white/90 rounded-t-full blur-[0.5px]"></div>
            <div className="absolute bottom-0 right-4 w-4 h-3 bg-white/90 rounded-t-full blur-[0.5px]"></div>
            <div className="absolute bottom-0 right-7 w-5 h-3 bg-white/90 rounded-t-full blur-[0.5px]"></div>
            {/* Light background rings */}
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 blur-[1px]"></div>
          </>
        )}
      </div>

      {/* Knob */}
      <div 
        className={`w-6 h-6 rounded-full transition-transform duration-300 shadow-md relative z-10 ${isDark ? 'translate-x-8 bg-[#E6E6EA]' : 'translate-x-0 bg-[#FFD700]'}`}
      >
        {isDark && (
          // Moon Craters
          <>
            <div className="absolute top-1 right-1.5 w-1.5 h-1.5 bg-black/15 rounded-full"></div>
            <div className="absolute bottom-1.5 left-1 w-2 h-2 bg-black/15 rounded-full"></div>
            <div className="absolute bottom-1 right-1 w-1 h-1 bg-black/15 rounded-full"></div>
          </>
        )}
      </div>
    </button>
  );
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'about', label: t('nav.about') },
    { id: 'projects', label: t('nav.projects') },
    { id: 'experience', label: t('nav.experience') },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'id' ? 'en' : 'id');
  };

  const handleNavClick = (e, target) => {
    e.preventDefault();
    if (window.lenis) {
      window.lenis.scrollTo(target, { offset: -100, duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    } else {
      if (target === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.querySelector(target);
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    }
    setIsMobileMenuOpen(false);
  };

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-300 ${scrolled
            ? 'py-4 px-6 mx-auto mt-4 max-w-5xl bg-[#F7F5EE]/70 dark:bg-[#1A1A1C]/70 backdrop-blur-lg rounded-full shadow-sm border border-charcoal/10 dark:border-[#F2F0E8]/10'
            : 'py-6 px-8 bg-transparent'
          }`}
      >
        <div className={`flex items-center justify-between ${!scrolled ? 'max-w-6xl mx-auto' : ''}`}>
          <div className="flex-shrink-0">
            <button onClick={(e) => handleNavClick(e, 'top')} className="hover:opacity-70 transition-opacity flex items-center outline-none">
              <img src="/img/unbackground.svg" alt="Akbar Alfaidah Logo" className="h-10 w-auto invert dark:invert-0" />
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-1 text-base font-medium text-charcoal dark:text-[#F2F0E8] bg-[#FAFAFA]/50 dark:bg-[#1A1A1C]/50 border border-charcoal/10 dark:border-white/10 px-3 py-1.5 rounded-full">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, `#${item.id}`)}
                className="px-4 py-1.5 rounded-full transition-all duration-300 text-charcoal/80 dark:text-[#F2F0E8]/80 hover:text-charcoal dark:hover:text-white hover:-translate-y-2 hover:bg-black/5 dark:hover:bg-white/10 hover:shadow-sm"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <LanguageToggle language={i18n.language} toggleLanguage={toggleLanguage} />
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>

            <AnimatedButton
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="hidden sm:inline-flex px-6 h-11 text-[15px]"
            >
              {t('nav.contact')}
            </AnimatedButton>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full transition-colors text-charcoal hover:text-brass hover:bg-mist/50"
            >
              {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 z-40 bg-paper dark:bg-[#1A1A1C] flex flex-col justify-center px-10 h-screen w-screen"
          >
            <div className="flex flex-col space-y-8">
              <div className="flex items-center">
                <a href="#projects" onClick={() => setIsMobileMenuOpen(false)} className={`text-4xl font-sans font-semibold tracking-wide leading-none ${theme === 'dark' ? 'text-[#F2F0E8]' : 'text-charcoal'} hover:text-brass transition-colors`}>{t('nav.projects')}</a>
              </div>
              <div className="flex items-center">
                <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className={`text-4xl font-sans font-semibold tracking-wide leading-none ${theme === 'dark' ? 'text-[#F2F0E8]' : 'text-charcoal'} hover:text-brass transition-colors`}>{t('nav.about')}</a>
              </div>
              <div className="flex items-center">
                <a href="#experience" onClick={() => setIsMobileMenuOpen(false)} className={`text-4xl font-sans font-semibold tracking-wide leading-none ${theme === 'dark' ? 'text-[#F2F0E8]' : 'text-charcoal'} hover:text-brass transition-colors`}>{t('nav.experience')}</a>
              </div>
              <div className="flex items-center">
                <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className={`text-4xl font-sans font-semibold tracking-wide leading-none ${theme === 'dark' ? 'text-[#F2F0E8]' : 'text-charcoal'} hover:text-brass transition-colors`}>{t('nav.contact')}</a>
              </div>
            </div>

            <div className="absolute bottom-24 left-10 flex items-center space-x-4">
              <LanguageToggle language={i18n.language} toggleLanguage={toggleLanguage} />
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>

            <div className={`absolute bottom-12 left-10 flex space-x-6 text-sm font-medium opacity-60 ${theme === 'dark' ? 'text-[#F2F0E8]' : 'text-charcoal'}`}>
              <a href="mailto:hello@akbaralfaidah.com" className="hover:text-brass transition-colors">Email</a>
              <a href="https://github.com/akbaralfaidah" target="_blank" rel="noopener noreferrer" className="hover:text-brass transition-colors">GitHub</a>
              <a href="https://linkedin.com/in/akbaralfaidah" target="_blank" rel="noopener noreferrer" className="hover:text-brass transition-colors">LinkedIn</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to Top FAB */}
      <AnimatePresence>
        {scrolled && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={(e) => handleNavClick(e, 'top')}
            className={`fixed bottom-6 right-6 md:bottom-8 md:right-10 z-[990] p-3 md:p-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border transition-all duration-300 hover:-translate-y-1 ${
              theme === 'dark' 
                ? 'bg-[#2C2E32]/90 backdrop-blur-md text-[#F2F0E8] border-white/10 hover:bg-[#F2F0E8] hover:text-charcoal' 
                : 'bg-white/90 backdrop-blur-md text-charcoal border-black/5 hover:bg-charcoal hover:text-white'
            }`}
            aria-label="Scroll to top"
          >
            <FiArrowUp size={22} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
