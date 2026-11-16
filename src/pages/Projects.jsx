import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fetchProjects } from '../data/projects';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/Button';
import { usePageMeta } from '../hooks/usePageMeta';

const CATEGORIES = ['All', 'Website', 'Mobile Apps', 'Machine Learning'];

export default function ProjectsPage() {
  const { t, i18n } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  usePageMeta({
    title: t('meta.projects_title'),
    description: t('meta.projects_description'),
    path: '/projects',
    robots: 'index,follow'
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    let isMounted = true;
    fetchProjects().then((data) => {
      if (isMounted) {
        setProjects(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return projects;
    return projects.filter((p) => (p.categories || []).includes(selectedCategory));
  }, [projects, selectedCategory]);

  const isEn = i18n.language === 'en';

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink transition-colors duration-300">
      <Navbar />

      <main id="main-content" className="flex-1 pt-28 sm:pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 min-h-[44px] text-sm font-medium text-ink-muted hover:text-brass transition-colors"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              <span>{t('projects.back_home')}</span>
            </Link>
          </div>

          <div className="mb-10 sm:mb-12">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-brass mb-3">
              {t('projects.eyebrow')}
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-ink mb-4">
              {t('projects.archive_heading')}
            </h1>
            <p className="text-base sm:text-lg text-ink-muted max-w-2xl leading-relaxed">
              {t('projects.archive_subheading')}
            </p>
          </div>

          {/* Filter Tabs */}
          <div
            role="tablist"
            aria-label="Filter projects by category"
            className="flex flex-wrap gap-2 mb-10 pb-6 border-b border-line"
          >
            {CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              const label = category === 'All' ? t('projects.filter_all') : category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(category)}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
                    active
                      ? 'bg-ink text-on-ink border-ink'
                      : 'bg-surface text-ink-muted border-line hover:text-ink hover:border-ink/40'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-surface border border-line overflow-hidden animate-pulse"
                >
                  <div className="aspect-[4/3] bg-mist" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 w-24 bg-mist rounded" />
                    <div className="h-6 w-2/3 bg-mist rounded" />
                    <div className="h-12 w-full bg-mist rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="rounded-2xl bg-surface border border-line p-12 text-center space-y-4">
              <h2 className="font-display text-xl font-bold text-ink">
                {t('projects.empty_title')}
              </h2>
              <p className="text-sm text-ink-muted">{t('projects.empty_desc')}</p>
              <Button variant="outline" size="md" onClick={() => setSelectedCategory('All')}>
                {t('projects.filter_all')}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, idx) => {
                const translatedDesc = t(`projects.${project.slug}_desc`, { defaultValue: '' });
                const desc =
                  translatedDesc ||
                  (isEn && project.shortDescriptionEn
                    ? project.shortDescriptionEn
                    : project.shortDescription);
                const isInDevelopment = project.status && project.status !== 'selesai';

                return (
                  <article
                    key={project.id || project.slug}
                    className="group rounded-2xl bg-surface border border-line overflow-hidden flex flex-col justify-between hover:border-brass/70 transition-colors shadow-sm"
                  >
                    <div>
                      <Link
                        to={`/project/${project.slug}`}
                        className="block relative aspect-[4/3] bg-mist overflow-hidden border-b border-line"
                        aria-label={`${project.name} — ${t('projects.cta')}`}
                      >
                        {isInDevelopment ? (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-mist text-ink-muted p-6">
                            <Wrench size={24} className="text-brass" aria-hidden="true" />
                            <span className="font-mono text-xs font-semibold uppercase tracking-widest">
                              In Development
                            </span>
                          </div>
                        ) : (
                          <img
                            src={project.src}
                            alt={`${project.name} screenshot`}
                            width={800}
                            height={600}
                            loading={idx < 3 ? 'eager' : 'lazy'}
                            decoding="async"
                            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                          />
                        )}
                      </Link>

                      <div className="p-6 pb-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <div className="flex flex-wrap gap-1.5">
                            {(project.categories || []).map((cat) => (
                              <span
                                key={cat}
                                className="px-2.5 py-0.5 rounded-md font-mono text-[11px] font-medium bg-mist text-ink border border-line"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                          <span className="font-mono text-xs text-ink-muted tabular-nums">
                            {project.year}
                          </span>
                        </div>

                        <h2 className="font-display text-xl font-bold tracking-tight text-ink mb-2">
                          <Link
                            to={`/project/${project.slug}`}
                            className="hover:text-brass transition-colors"
                          >
                            {project.name}
                          </Link>
                        </h2>

                        <p className="text-sm text-ink-muted leading-relaxed line-clamp-2">
                          {desc}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 py-4 border-t border-line flex items-center justify-between gap-3">
                      <span className="font-mono text-xs text-ink-muted truncate">
                        {project.client}
                      </span>
                      <Link
                        to={`/project/${project.slug}`}
                        className="min-h-[44px] inline-flex items-center gap-1.5 text-sm font-semibold text-brass hover:text-brass-hover shrink-0 transition-colors"
                      >
                        <span>{t('projects.cta')}</span>
                        <ArrowRight size={15} aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
