import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { FiSun, FiMoon, FiGlobe } from 'react-icons/fi';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

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

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-4 px-6 mx-auto mt-4 max-w-5xl bg-paper/80 backdrop-blur-md rounded-full shadow-sm border border-mist'
          : 'py-6 px-8 bg-paper'
      }`}
    >
      <div className={`flex items-center justify-between ${!scrolled ? 'max-w-6xl mx-auto' : ''}`}>
        <div className="font-display font-bold text-xl tracking-tight text-charcoal">
          AA.
        </div>
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-charcoal">
          <a href="#about" className="hover:text-brass transition-colors">{t('nav.about')}</a>
          <a href="#projects" className="hover:text-brass transition-colors">{t('nav.projects')}</a>
          <a href="#experience" className="hover:text-brass transition-colors">{t('nav.experience')}</a>
        </div>
        
        <div className="flex items-center space-x-3 md:space-x-4">
          <button 
            onClick={toggleLanguage}
            className="p-2 text-charcoal hover:text-brass hover:bg-mist/50 rounded-full transition-colors flex items-center space-x-1"
            title="Toggle Language"
          >
            <FiGlobe size={18} />
            <span className="text-xs font-bold uppercase">{i18n.language || 'id'}</span>
          </button>
          
          <button 
            onClick={toggleTheme}
            className="p-2 text-charcoal hover:text-brass hover:bg-mist/50 rounded-full transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          <a 
            href="#contact" 
            className="hidden sm:inline-block px-5 py-2.5 bg-charcoal text-paper rounded-full text-sm font-medium hover:bg-brass transition-colors"
          >
            {t('nav.contact')}
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
