import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Eye, X, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fetchProjects } from '../data/projects';
import { Button } from './ui/Button';
import { FadeUp } from './ui/MotionPrimitives';
import { STUDIO_EASE } from '../lib/motion';
import SpotlightCard from './ui/SpotlightCard';

const FILTER_CATEGORIES = ['All', 'Website', 'Mobile Apps', 'Machine Learning'];

export default function Projects() {
  const { t, i18n } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [quickProject, setQuickProject] = useState(null);

  useEffect(() => {
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

  useEffect(() => {
    if (!quickProject) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setQuickProject(null);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [quickProject]);

  const visibleProjects = useMemo(() => {
    const filtered =
      selectedCategory === 'All'
        ? projects
        : projects.filter((p) => (p.categories || []).includes(selectedCategory));
    return filtered.slice(0, 6);
  }, [projects, selectedCategory]);

  const isEn = i18n.language === 'en';

  const getLocalizedDesc = (project) => {
    const translated = t(`projects.${project.slug}_desc`, { defaultValue: '' });
    return (
      translated ||
      (isEn && project.shortDescriptionEn ? project.shortDescriptionEn : project.shortDescription)
    );
  };

  return (
    <>
      <section id="projects" className="py-20 sm:py-24 px-6 bg-paper text-ink border-b border-line">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.08] text-ink mb-4">
                {t('projects.heading')}
              </h2>
              <p className="text-lg sm:text-xl text-ink-muted leading-relaxed">
                {t('projects.subheading')}
              </p>
            </div>

            <Button
              as={Link}
              to="/projects"
              variant="outline"
              size="md"
              className="self-start md:self-auto"
            >
              <span>{t('projects.bottom_cta')}</span>
              <ArrowRight size={17} aria-hidden="true" />
            </Button>
          </FadeUp>

          {/* Interactive Filter Tabs */}
          <div
            role="tablist"
            aria-label="Filter showcase by discipline"
            className="flex flex-wrap gap-2 mb-10 pb-6 border-b border-line"
          >
            {FILTER_CATEGORIES.map((category) => {
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
                      ? 'text-on-ink border-ink'
                      : 'bg-surface text-ink-muted border-line hover:text-ink hover:border-accent/40'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="home-projects-filter"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 rounded-xl bg-ink"
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
                  <div className="aspect-[4/3] bg-mist" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 w-24 bg-mist rounded" />
                    <div className="h-6 w-2/3 bg-mist rounded" />
                    <div className="h-12 w-full bg-mist rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {visibleProjects.map((project, idx) => (
                  <motion.div
                    key={project.id || project.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.97, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.14 } }}
                    transition={{
                      duration: 0.24,
                      delay: Math.min(idx * 0.03, 0.15),
                      ease: STUDIO_EASE
                    }}
                    className="flex"
                  >
                    <SpotlightCard
                      as="article"
                      className="w-full overflow-hidden flex flex-col justify-between group"
                    >
                      <div>
                        <Link
                          to={`/project/${project.slug}`}
                          className="block relative aspect-[4/3] bg-mist overflow-hidden border-b border-line"
                          aria-label={`${project.name} — ${t('projects.cta')}`}
                        >
                          <img
                            src={project.src}
                            alt={`${project.name} screenshot`}
                            width={800}
                            height={600}
                            loading={idx < 3 ? 'eager' : 'lazy'}
                            decoding="async"
                            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                          />
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

                          <h3 className="font-display text-2xl font-bold tracking-tight text-ink mb-2">
                            <Link
                              to={`/project/${project.slug}`}
                              className="hover:text-accent transition-colors"
                            >
                              {project.name}
                            </Link>
                          </h3>

                          <p className="text-base text-ink-muted leading-relaxed line-clamp-2">
                            {getLocalizedDesc(project)}
                          </p>
                        </div>
                      </div>

                      <div className="px-6 py-4 border-t border-line flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setQuickProject(project)}
                          className="min-h-[44px] px-3 py-1.5 rounded-lg text-sm font-medium text-ink-muted hover:text-ink hover:bg-mist inline-flex items-center gap-1.5 transition-colors"
                          aria-label={`Quick preview ${project.name}`}
                        >
                          <Eye size={15} aria-hidden="true" />
                          <span>{isEn ? 'Quick View' : 'Ringkasan'}</span>
                        </button>

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
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Quick Preview Modal */}
      <AnimatePresence>
        {quickProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center overflow-y-auto"
            onClick={() => setQuickProject(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="quick-modal-title"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.24, ease: STUDIO_EASE }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl rounded-2xl bg-surface text-ink border border-line shadow-2xl overflow-hidden my-auto"
            >
              <div className="px-6 py-4 border-b border-line flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-accent">
                    {(quickProject.categories || []).join(' • ')} · {quickProject.year}
                  </p>
                  <h3 id="quick-modal-title" className="font-display text-2xl font-bold text-ink">
                    {quickProject.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setQuickProject(null)}
                  className="min-w-[44px] min-h-[44px] rounded-xl border border-line bg-paper text-ink hover:border-accent hover:text-accent flex items-center justify-center transition-colors"
                  aria-label="Close modal"
                >
                  <X size={19} aria-hidden="true" />
                </button>
              </div>

              <div className="max-h-[75vh] overflow-y-auto p-6 space-y-6">
                <div className="aspect-[16/9] rounded-xl overflow-hidden bg-mist border border-line">
                  <img
                    src={quickProject.src}
                    alt={`${quickProject.name} showcase`}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <p className="text-base sm:text-lg text-ink-muted leading-relaxed">
                  {isEn && quickProject.solutionEn
                    ? quickProject.solutionEn
                    : quickProject.solution || getLocalizedDesc(quickProject)}
                </p>

                {Array.isArray(
                  isEn && quickProject.highlightsEn?.length
                    ? quickProject.highlightsEn
                    : quickProject.highlights
                ) &&
                  (isEn && quickProject.highlightsEn?.length
                    ? quickProject.highlightsEn
                    : quickProject.highlights
                  ).length > 0 && (
                    <div className="space-y-3 pt-2 border-t border-line">
                      <p className="text-sm font-semibold text-ink">
                        {t('projects.highlights_title')}
                      </p>
                      <ul className="space-y-2.5">
                        {(isEn && quickProject.highlightsEn?.length
                          ? quickProject.highlightsEn
                          : quickProject.highlights
                        ).map((pt) => (
                          <li key={pt} className="flex items-start gap-2.5 text-base text-ink">
                            <Check size={16} className="text-accent shrink-0 mt-1" aria-hidden="true" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                <div className="flex flex-wrap gap-2 pt-2">
                  {(quickProject.techStack || []).map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-lg font-mono text-sm bg-mist text-ink border border-line"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="px-6 py-4 border-t border-line bg-mist/40 flex flex-wrap items-center justify-between gap-3">
                {quickProject.url ? (
                  <a
                    href={quickProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] px-4 py-2 rounded-xl border border-line bg-surface text-sm font-medium text-ink hover:border-accent hover:text-accent inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>{t('projects.live_preview')}</span>
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                ) : (
                  <span className="text-sm font-medium text-ink-muted">{quickProject.client}</span>
                )}

                <Button
                  as={Link}
                  to={`/project/${quickProject.slug}`}
                  variant="accent"
                  size="md"
                >
                  <span>{t('projects.cta')}</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
