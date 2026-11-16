import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, ArrowUpRight } from 'lucide-react';
import BrandLogo from './BrandLogo';

const FOOTER_SECTIONS = [
  { key: 'about', href: '/#about' },
  { key: 'services', href: '/#services' },
  { key: 'projects', href: '/#projects' },
  { key: 'experience', href: '/#experience' },
  { key: 'contact', href: '/#contact' }
];

const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'akbaralfaidah667@gmail.com';

const EXTERNAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/AkbarAlfaidah' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/akbar-alfaidah/' },
  { label: 'Instagram', href: 'https://www.instagram.com/akbralf._/' },
  { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` }
];

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-line py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-line">
          <div className="md:col-span-5 flex flex-col gap-4">
            <Link
              to="/"
              className="inline-flex items-center min-h-[44px] self-start hover:opacity-85 transition-opacity"
            >
              <BrandLogo className="h-8 w-auto text-ink" showWordmark />
            </Link>
            <p className="text-base text-ink-muted max-w-sm leading-relaxed">
              {t('footer.tagline')}
            </p>
            <p className="inline-flex items-center gap-2 text-sm text-ink-muted pt-1">
              <MapPin size={16} className="text-accent shrink-0" aria-hidden="true" />
              <span>{t('footer.location')}</span>
            </p>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-ink mb-4">
              {t('footer.nav_title')}
            </h3>
            <ul className="space-y-1">
              {FOOTER_SECTIONS.map((item) => (
                <li key={item.key}>
                  <a
                    href={item.href}
                    className="inline-flex items-center min-h-[44px] text-base text-ink-muted hover:text-accent transition-colors"
                  >
                    {t(`nav.${item.key}`)}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  to="/projects"
                  className="inline-flex items-center min-h-[44px] text-base text-ink-muted hover:text-accent transition-colors"
                >
                  {t('projects.back_projects')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-ink mb-4">
              {t('footer.connect_title')}
            </h3>
            <ul className="space-y-1">
              {EXTERNAL_LINKS.map((item) => {
                const isExternal = item.href.startsWith('http');
                return (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-1.5 min-h-[44px] text-base text-ink-muted hover:text-accent transition-colors break-all"
                    >
                      <span>{item.label}</span>
                      {isExternal && <ArrowUpRight size={15} aria-hidden="true" />}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm sm:text-base text-ink-muted">
          <p>
            © {year} Akbar Alfaidah — {t('footer.role')}.
          </p>
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
