import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fetchProjects } from '../data/projects';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/ui/BackToTop';
import MeshGradient from '../components/ui/MeshGradient';
import { Button } from '../components/ui/Button';
import { FadeUp } from '../components/ui/MotionPrimitives';
import { STUDIO_EASE } from '../lib/motion';
import SpotlightCard from '../components/ui/SpotlightCard';
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
    <div className="relative min-h-screen flex flex-col bg-paper text-ink transition-colors duration-300 overflow-hidden">
      <MeshGradient />
      <Navbar />

      <main id="main-content" className="relative z-10 flex-1 pt-28 sm:pt-36 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 min-h-[44px] text-base font-medium text-ink-muted hover:text-accent transition-colors"
            >
              <ArrowLeft size={17} aria-hidden="true" />
              <span>{t('projects.back_home')}</span>
            </Link>
          </div>

          <FadeUp className="mb-10 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.06] text-ink mb-4">
                {t('projects.archive_heading')}
              </h1>
              <p className="text-lg sm:text-xl text-ink-muted max-w-2xl leading-relaxed">
                {t('projects.archive_subheading')}
              </p>
            </div>

            {!loading && (
              <div className="inline-flex items-baseline gap-2 px-4 py-2.5 rounded-xl bg-surface/90 border border-line shadow-sm self-start md:self-auto">
                <span className="font-display text-2xl font-extrabold text-accent tabular-nums">
                  {filteredProjects.length}
                </span>
                <span className="text-sm font-medium text-ink-muted">
                  {isEn ? 'Projects' : 'Proyek'}
                </span>
              </div>
            )}
          </FadeUp>

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
                  className={`relative min-h-[44px] px-4 py-2 rounded-xl text-[15px] font-medium transition-colors border ${
                    active
                      ? 'text-on-accent border-transparent'
                      : 'bg-surface text-ink-muted border-line hover:text-ink hover:border-accent/40'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="archive-projects-filter"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 rounded-xl bg-accent-solid shadow-sm"
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-surface border border-line overflow-hidden animate-pulse"
                >
                  <div className="aspect-video bg-mist" />
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
              <h2 className="font-display text-2xl font-bold text-ink">
                {t('projects.empty_title')}
              </h2>
              <p className="text-base text-ink-muted">{t('projects.empty_desc')}</p>
              <Button variant="outline" size="md" onClick={() => setSelectedCategory('All')}>
                {t('projects.filter_all')}
              </Button>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, idx) => {
                  const translatedDesc = t(`projects.${project.slug}_desc`, { defaultValue: '' });
                  const desc =
                    translatedDesc ||
                    (isEn && project.shortDescriptionEn
                      ? project.shortDescriptionEn
                      : project.shortDescription);
                  const isInDevelopment = project.status && project.status !== 'selesai';

                  return (
                    <motion.div
                      key={project.id || project.slug}
                      layout
                      initial={{ opacity: 0, scale: 0.97, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.14 } }}
                      transition={{
                        duration: 0.25,
                        delay: Math.min(idx * 0.03, 0.18),
                        ease: STUDIO_EASE
                      }}
                      className="flex"
                    >
                      <SpotlightCard
                        as="article"
                        tilt
                        className="w-full overflow-hidden flex flex-col justify-between group"
                      >
                        <div>
                          <Link
                            to={`/project/${project.slug}`}
                            className="block relative aspect-video bg-mist overflow-hidden border-b border-line"
                            aria-label={`${project.name} — ${t('projects.cta')}`}
                          >
                            {isInDevelopment ? (
                              <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-mist text-ink-muted p-6">
                                <Wrench size={26} className="text-accent" aria-hidden="true" />
                                <span className="text-sm font-semibold">In Development</span>
                              </div>
                            ) : (
                              <img
                                src={project.src}
                                alt={`${project.name} screenshot`}
                                width={1920}
                                height={1080}
                                loading={idx < 3 ? 'eager' : 'lazy'}
                                decoding="async"
                                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
                              />
                            )}
                          </Link>

                          <div className="p-6 pb-4">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                              <div className="flex flex-wrap gap-1.5">
                                {(project.categories || []).map((cat) => (
                                  <span
                                    key={cat}
                                    className="px-3 py-1 rounded-md text-xs sm:text-sm font-medium bg-mist text-ink border border-line"
                                  >
                                    {cat}
                                  </span>
                                ))}
                              </div>
                              <span className="font-mono text-sm text-ink-muted tabular-nums">
                                {project.year}
                              </span>
                            </div>

                            <h2 className="font-display text-2xl font-bold tracking-tight text-ink mb-2">
                              <Link
                                to={`/project/${project.slug}`}
                                className="hover:text-accent transition-colors"
                              >
                                {project.name}
                              </Link>
                            </h2>

                            <p className="text-base text-ink-muted leading-relaxed line-clamp-2">
                              {desc}
                            </p>
                          </div>
                        </div>

                        <div className="px-6 py-4 border-t border-line flex items-center justify-between gap-3">
                          <span className="text-sm font-medium text-ink-muted truncate">
                            {project.client}
                          </span>
                          <Link
                            to={`/project/${project.slug}`}
                            className="min-h-[44px] inline-flex items-center gap-1.5 text-[15px] font-semibold text-accent hover:text-accent-hover shrink-0 transition-colors"
                          >
                            <span>{t('projects.cta')}</span>
                            <ArrowRight
                              size={16}
                              className="transition-transform duration-200 group-hover:translate-x-0.5"
                              aria-hidden="true"
                            />
                          </Link>
                        </div>
                      </SpotlightCard>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
