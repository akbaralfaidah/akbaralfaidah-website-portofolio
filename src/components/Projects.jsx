import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Eye, X, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fetchProjects } from '../data/projects';
import { Button } from './ui/Button';
import { FadeUp } from './ui/MotionPrimitives';
import { STUDIO_EASE } from '../lib/motion';

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

  const flagship = visibleProjects.slice(0, 2);
  const secondary = visibleProjects.slice(2);

  return (
    <>
      <section
        id="projects"
        className="py-20 sm:py-24 px-5 sm:px-6 bg-paper text-ink border-b border-line"
      >
        <div className="max-w-6xl mx-auto">
          <FadeUp className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-[-0.03em] leading-[1.08] text-ink mb-3">
                {t('projects.heading')}
              </h2>
              <p className="text-base sm:text-lg text-ink-muted leading-relaxed">
                {t('projects.subheading')}
              </p>
            </div>

            <Link
              to="/projects"
              className="group self-start md:self-auto inline-flex items-center gap-2 min-h-[44px] text-[15px] font-medium text-ink hover:text-accent transition-colors border-b border-line pb-1"
            >
              <span>{t('projects.bottom_cta')}</span>
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </FadeUp>

          {/* Architectural Hairline Underline Tabs */}
          <div
            role="tablist"
            aria-label="Filter showcase by discipline"
            className="flex flex-wrap gap-6 mb-10 border-b border-line"
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
                  className={`relative min-h-[44px] pb-3 text-[15px] font-medium transition-colors ${
                    active ? 'text-ink' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  <span>{label}</span>
                  {active && (
                    <motion.span
                      layoutId="home-projects-underline"
                      transition={{ type: 'spring', stiffness: 440, damping: 34 }}
                      className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-ink"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[0, 1].map((idx) => (
                <div key={idx} className="space-y-4 animate-pulse">
                  <div className="aspect-video rounded-xl bg-mist" />
                  <div className="h-6 w-1/3 bg-mist rounded" />
                  <div className="h-4 w-2/3 bg-mist rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-12">
              {/* Row 1: Two Flagship Flush Editorial Frames */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                <AnimatePresence mode="popLayout">
                  {flagship.map((project, idx) => (
                    <motion.article
                      key={project.id || project.slug}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, transition: { duration: 0.14 } }}
                      transition={{
                        duration: 0.3,
                        delay: idx * 0.04,
                        ease: STUDIO_EASE
                      }}
                      className="group flex flex-col"
                    >
                      <Link
                        to={`/project/${project.slug}`}
                        className="block relative aspect-video rounded-xl bg-[#0B0C10] border border-line overflow-hidden"
                        aria-label={`${project.name} — ${t('projects.cta')}`}
                      >
                        <img
                          src={project.src}
                          alt={`${project.name} screenshot`}
                          width={1920}
                          height={1080}
                          loading="eager"
                          decoding="async"
                          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      </Link>

                      <div className="pt-4 flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-baseline gap-2.5 min-w-0">
                            <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-ink truncate">
                              <Link
                                to={`/project/${project.slug}`}
                                className="hover:text-accent transition-colors"
                              >
                                {project.name}
                              </Link>
                            </h3>
                            <span className="font-mono text-xs text-ink-muted shrink-0">
                              {(project.categories || []).join(' / ')}
                            </span>
                          </div>
                          <span className="font-mono text-xs text-ink-muted tabular-nums shrink-0">
                            {project.year}
                          </span>
                        </div>

                        <p className="text-base text-ink-muted leading-relaxed line-clamp-2">
                          {getLocalizedDesc(project)}
                        </p>

                        <div className="pt-1 flex items-center gap-5">
                          <Link
                            to={`/project/${project.slug}`}
                            className="inline-flex items-center gap-1.5 min-h-[36px] text-sm font-medium text-ink hover:text-accent transition-colors"
                          >
                            <span>{t('projects.cta')}</span>
                            <ArrowRight
                              size={15}
                              className="transition-transform duration-200 group-hover:translate-x-1"
                              aria-hidden="true"
                            />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setQuickProject(project)}
                            className="inline-flex items-center gap-1.5 min-h-[36px] text-sm text-ink-muted hover:text-ink transition-colors"
                            aria-label={`Quick preview ${project.name}`}
                          >
                            <Eye size={14} aria-hidden="true" />
                            <span>{isEn ? 'Quick View' : 'Ringkasan'}</span>
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>

              {/* Row 2: Hairline Exhibition Ledger for Remaining Works */}
              {secondary.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 border-t border-line">
                  <AnimatePresence mode="popLayout">
                    {secondary.map((project, idx) => (
                      <motion.article
                        key={project.id || project.slug}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, transition: { duration: 0.14 } }}
                        transition={{
                          duration: 0.28,
                          delay: Math.min(idx * 0.04, 0.16),
                          ease: STUDIO_EASE
                        }}
                        className={`group py-6 border-b border-line flex items-start gap-4 sm:gap-5 ${
                          idx % 2 === 0 ? 'md:pr-8 lg:border-r lg:border-line' : 'md:pl-8'
                        }`}
                      >
                        <Link
                          to={`/project/${project.slug}`}
                          className="shrink-0 w-36 sm:w-44 aspect-video rounded-lg bg-[#0B0C10] border border-line overflow-hidden"
                          aria-label={`${project.name} — ${t('projects.cta')}`}
                        >
                          <img
                            src={project.src}
                            alt={`${project.name} preview`}
                            width={1920}
                            height={1080}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        </Link>

                        <div className="min-w-0 flex-1 flex flex-col justify-between gap-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-display text-lg sm:text-xl font-semibold text-ink truncate">
                              <Link
                                to={`/project/${project.slug}`}
                                className="hover:text-accent transition-colors"
                              >
                                {project.name}
                              </Link>
                            </h3>
                            <span className="font-mono text-xs text-ink-muted shrink-0">
                              {project.year}
                            </span>
                          </div>

                          <p className="font-mono text-xs text-ink-muted">
                            {(project.categories || []).join(' · ')}
                          </p>

                          <p className="text-sm sm:text-[15px] text-ink-muted leading-snug line-clamp-2">
                            {getLocalizedDesc(project)}
                          </p>

                          <div className="pt-1 flex items-center gap-4">
                            <Link
                              to={`/project/${project.slug}`}
                              className="inline-flex items-center gap-1 text-sm font-medium text-ink hover:text-accent transition-colors"
                            >
                              <span>{t('projects.cta')}</span>
                              <ArrowUpRight size={14} aria-hidden="true" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => setQuickProject(project)}
                              className="inline-flex items-center gap-1 text-xs sm:text-sm text-ink-muted hover:text-ink transition-colors"
                            >
                              <Eye size={13} aria-hidden="true" />
                              <span>{isEn ? 'Quick View' : 'Ringkasan'}</span>
                            </button>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center overflow-y-auto"
            onClick={() => setQuickProject(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="quick-modal-title"
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              transition={{ duration: 0.22, ease: STUDIO_EASE }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl rounded-xl bg-surface text-ink border border-line shadow-2xl overflow-hidden my-auto"
            >
              <div className="px-6 py-4 border-b border-line flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-xs text-ink-muted">
                    {(quickProject.categories || []).join(' • ')} · {quickProject.year}
                  </p>
                  <h3 id="quick-modal-title" className="font-display text-2xl font-semibold text-ink">
                    {quickProject.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setQuickProject(null)}
                  className="min-w-[40px] min-h-[40px] rounded-lg border border-line text-ink hover:border-ink/40 flex items-center justify-center transition-colors"
                  aria-label="Close modal"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>

              <div className="max-h-[75vh] overflow-y-auto p-6 space-y-6">
                <div className="aspect-video rounded-lg overflow-hidden bg-[#0B0C10] border border-line">
                  <img
                    src={quickProject.src}
                    alt={`${quickProject.name} showcase`}
                    className="w-full h-full object-cover object-center"
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
                    <div className="space-y-3 pt-3 border-t border-line">
                      <p className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                        {t('projects.highlights_title')}
                      </p>
                      <ul className="space-y-2.5">
                        {(isEn && quickProject.highlightsEn?.length
                          ? quickProject.highlightsEn
                          : quickProject.highlights
                        ).map((pt) => (
                          <li key={pt} className="flex items-start gap-2.5 text-base text-ink">
                            <Check
                              size={16}
                              className="text-accent shrink-0 mt-1"
                              aria-hidden="true"
                            />
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
                      className="px-3 py-1 rounded-md font-mono text-xs bg-mist text-ink border border-line"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="px-6 py-4 border-t border-line flex flex-wrap items-center justify-between gap-3">
                {quickProject.url ? (
                  <a
                    href={quickProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[40px] px-4 py-2 rounded-lg border border-line text-sm font-medium text-ink hover:border-ink/40 inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>{t('projects.live_preview')}</span>
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                ) : (
                  <span className="text-sm font-medium text-ink-muted">{quickProject.client}</span>
                )}

                <Button as={Link} to={`/project/${quickProject.slug}`} variant="primary" size="md">
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
