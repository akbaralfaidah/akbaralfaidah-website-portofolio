import { useTheme } from '../hooks/useTheme';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();

  return (
    <footer className="bg-charcoal dark:bg-[#111113] text-[#F2F0E8]/70 py-10 px-6 transition-colors duration-300 border-t border-[#F2F0E8]/5">
      <div className="max-w-5xl mx-auto">
        {/* Top Row: 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-12">
          
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <img src="/img/unbackground.svg" alt="Akbar Alfaidah Logo" className="h-8 w-auto self-start" />
            <p className="text-sm leading-relaxed text-[#F2F0E8]/70 max-w-xs">
              {t('hero.headline_1')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold tracking-wide uppercase text-[#F2F0E8]/70 mb-1">Navigasi</h3>
            <a href="#about" className="text-sm text-[#F2F0E8]/60 hover:text-brass transition-colors">{t('nav.about')}</a>
            <a href="#projects" className="text-sm text-[#F2F0E8]/60 hover:text-brass transition-colors">{t('nav.projects')}</a>
            <a href="#experience" className="text-sm text-[#F2F0E8]/60 hover:text-brass transition-colors">{t('nav.experience')}</a>
            <a href="#contact" className="text-sm text-[#F2F0E8]/60 hover:text-brass transition-colors">{t('nav.contact')}</a>
          </div>

          {/* Social */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold tracking-wide uppercase text-[#F2F0E8]/70 mb-1">Connect</h3>
            <a href="https://github.com/akbaralfaidah" target="_blank" rel="noopener noreferrer" className="text-sm text-[#F2F0E8]/60 hover:text-brass transition-colors">GitHub</a>
            <a href="https://linkedin.com/in/akbaralfaidah" target="_blank" rel="noopener noreferrer" className="text-sm text-[#F2F0E8]/60 hover:text-brass transition-colors">LinkedIn</a>
            <a href="https://instagram.com/akbaralfaidah" target="_blank" rel="noopener noreferrer" className="text-sm text-[#F2F0E8]/60 hover:text-brass transition-colors">Instagram</a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#F2F0E8]/10 pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <span className="text-xs font-medium text-[#F2F0E8]/70">© {new Date().getFullYear()} Akbar Alfaidah. {i18n.language === 'id' ? 'Hak cipta dilindungi.' : 'All rights reserved.'}</span>
        </div>
      </div>
    </footer>
  );
}
