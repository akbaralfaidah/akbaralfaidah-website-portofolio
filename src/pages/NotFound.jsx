import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, FolderKanban } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/Button';
import { usePageMeta } from '../hooks/usePageMeta';

export default function NotFound() {
  const { t } = useTranslation();

  usePageMeta({
    title: `${t('notFound.title')} | Akbar Alfaidah`,
    description: t('notFound.description'),
    path: '/404',
    robots: 'noindex,nofollow'
  });

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink transition-colors duration-300">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 pt-32 pb-20">
        <div className="max-w-xl w-full text-center border border-line bg-surface rounded-2xl p-8 sm:p-12 shadow-sm">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brass mb-3">
            404 — Not Found
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink mb-4">
            {t('notFound.title')}
          </h1>
          <p className="text-sm sm:text-base text-ink-muted leading-relaxed mb-8">
            {t('notFound.description')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button as={Link} to="/" variant="primary" size="md">
              <ArrowLeft size={16} />
              <span>{t('notFound.backHome')}</span>
            </Button>
            <Button as={Link} to="/projects" variant="outline" size="md">
              <FolderKanban size={16} />
              <span>{t('notFound.browseProjects')}</span>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
