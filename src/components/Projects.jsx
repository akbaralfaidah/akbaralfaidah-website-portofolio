import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
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
  const [hoveredRowProject, setHoveredRowProject] = useState(null);

  const previewX = useMotionValue(0);
  const previewY = useMotionValue(0);
  const smoothX = useSpring(previewX, { stiffness: 260, damping: 28, mass: 0.6 });
  const smoothY = useSpring(previewY, { stiffness: 260, damping: 28, mass: 0.6 });

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
    const completed = projects.filter((p) => !p.status || p.status === 'selesai');
    if (selectedCategory === 'All') return completed;
    return completed.filter((p) => (p.categories || []).includes(selectedCategory));
  }, [projects, selectedCategory]);

  const isEn = i18n.language === 'en';

  const getLocalizedDesc = (project) => {
    const translated = t(`projects.${project.slug}_desc`, { defaultValue: '' });
    return (
      translated ||
      (isEn && project.shortDescriptionEn ? project.shortDescriptionEn : project.shortDescription)
    );
  };

  const leadProject = visibleProjects[0];
  const pairProjects = visibleProjects.slice(1, 3);
  const ledgerProjects = visibleProjects.slice(3, 8);

  const clampCoords = (clientX, clientY) => ({
    tx: typeof window !== 'undefined' ? Math.min(clientX + 24, window.innerWidth - 384) : clientX + 24,
    ty:
      typeof window !== 'undefined'
        ? Math.max(92, Math.min(clientY - 110, window.innerHeight - 250))
        : clientY - 110
  });

  const handleRowPointerEnter = (project, e) => {
    const { tx, ty } = clampCoords(e.clientX, e.clientY);
    if (!hoveredRowProject) {
      previewX.jump(tx);
      previewY.jump(ty);
      smoothX.jump(tx);
      smoothY.jump(ty);
    } else {
      previewX.set(tx);
      previewY.set(ty);
    }
    setHoveredRowProject(project);
  };

  const handleRowPointerMove = (e) => {
    const { tx, ty } = clampCoords(e.clientX, e.clientY);
    previewX.set(tx);
    previewY.set(ty);
  };

  return (
    <>
      <section
        id="projects"
        className="relative py-20 sm:py-28 px-5 sm:px-6 bg-paper text-ink border-b border-line"
      >
        <div className="max-w-6xl mx-auto">
          <FadeUp className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent mb-3">
                {isEn ? '01 / Selected Works' : '01 / Karya Pilihan'}
              </p>
              <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-[-0.035em] leading-[1.06] text-ink mb-3">
                {isEn ? (
                  <>
                    Shipped Products{' '}
                    <span className="font-serif italic font-normal text-accent">&amp; Systems</span>
                  </>
                ) : (
                  <>
                    Produk &amp; Sistem{' '}
                    <span className="font-serif italic font-normal text-accent">Terpasang.</span>
                  </>
                )}
              </h2>
              <p className="text-base sm:text-lg text-ink-muted leading-relaxed">
                {t('projects.subheading')}
              </p>
            </div>

            <Link
              to="/projects"
              className="group self-start md:self-auto inline-flex items-center gap-2 min-h-[44px] text-[15px] font-medium text-ink hover:text-accent transition-colors border-b border-line pb-1"
            >
              <span>{t('projects.bottom_cta')} ({projects.length})</span>
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </FadeUp>

          {/* Hairline Category Switcher */}
          <div
            role="tablist"
            aria-label="Filter showcase by discipline"
            className="flex flex-wrap gap-6 mb-12 border-b border-line"
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
                      className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-accent"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="space-y-8 animate-pulse">
              <div className="aspect-video rounded-xl bg-mist" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="aspect-video rounded-xl bg-mist" />
                <div className="aspect-video rounded-xl bg-mist" />
              </div>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Asymmetric Lead Exhibition Split */}
              {leadProject && (
                <motion.article
                  key={`lead-${leadProject.slug}`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: STUDIO_EASE }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
                >
                  <Link
                    to={`/project/${leadProject.slug}`}
                    data-cursor={isEn ? 'Inspect ↗' : 'Buka Proyek ↗'}
                    className="lg:col-span-7 group block relative aspect-video rounded-xl bg-[#090B10] border border-line overflow-hidden shadow-xl shadow-black/20"
                  >
                    <img
                      src={leadProject.src}
                      alt={`${leadProject.name} showcase`}
                      width={1920}
                      height={1080}
                      loading="eager"
                      decoding="async"
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </Link>

                  <div className="lg:col-span-5 space-y-5">
                    <div className="flex items-center justify-between font-mono text-xs text-ink-muted border-b border-line pb-3">
                      <span className="text-accent">01 · {(leadProject.categories || []).join(' / ')}</span>
                      <span>{leadProject.year}</span>
                    </div>

                    <h3 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-ink">
                      <Link
                        to={`/project/${leadProject.slug}`}
                        className="hover:text-accent transition-colors"
                      >
                        {leadProject.name}
                      </Link>
                    </h3>

                    <p className="text-base sm:text-lg text-ink-muted leading-relaxed">
                      {getLocalizedDesc(leadProject)}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {(leadProject.techStack || []).slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-md font-mono text-xs bg-surface border border-line text-ink-muted"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 flex items-center gap-5">
                      <Link
                        to={`/project/${leadProject.slug}`}
                        className="min-h-[42px] px-4 py-2 rounded-lg bg-ink text-on-ink hover:opacity-90 text-sm font-medium inline-flex items-center gap-2 transition-opacity"
                      >
                        <span>{t('projects.cta')}</span>
                        <ArrowRight size={15} aria-hidden="true" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => setQuickProject(leadProject)}
                        className="inline-flex items-center gap-1.5 min-h-[40px] text-sm text-ink-muted hover:text-ink transition-colors"
                      >
                        <Eye size={15} aria-hidden="true" />
                        <span>{isEn ? 'Quick View' : 'Ringkasan'}</span>
                      </button>
                    </div>
                  </div>
                </motion.article>
              )}

              {/* Pair Curated Exhibitions */}
              {pairProjects.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                  <AnimatePresence mode="popLayout">
                    {pairProjects.map((project, idx) => (
                      <motion.article
                        key={project.id || project.slug}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, transition: { duration: 0.14 } }}
                        transition={{ duration: 0.35, delay: idx * 0.05, ease: STUDIO_EASE }}
                        className="group flex flex-col"
                      >
                        <Link
                          to={`/project/${project.slug}`}
                          data-cursor={isEn ? 'Inspect ↗' : 'Buka Proyek ↗'}
                          className="block relative aspect-video rounded-xl bg-[#090B10] border border-line overflow-hidden"
                        >
                          <img
                            src={project.src}
                            alt={`${project.name} screenshot`}
                            width={1920}
                            height={1080}
                            loading="eager"
                            decoding="async"
                            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                          />
                        </Link>

                        <div className="pt-4 space-y-2">
                          <div className="flex items-center justify-between font-mono text-xs text-ink-muted">
                            <span>
                              0{idx + 2} · {(project.categories || []).join(' / ')}
                            </span>
                            <span>{project.year}</span>
                          </div>

                          <h3 className="font-display text-2xl font-semibold tracking-tight text-ink">
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
              )}

              {/* Cursor-Tracked Interactive Archive Index Ledger */}
              {ledgerProjects.length > 0 && (
                <div
                  className="pt-4 relative"
                  onMouseLeave={() => setHoveredRowProject(null)}
                >
                  <div className="flex items-center justify-between mb-4 font-mono text-xs uppercase tracking-wider text-ink-muted">
                    <span>{isEn ? 'Interactive Index' : 'Arsip Proyek Interaktif'}</span>
                    <span>{isEn ? 'Hover row to preview' : 'Arahkan kursor untuk pratinjau'}</span>
                  </div>

                  <div className="border-y border-line divide-y divide-line">
                    {ledgerProjects.map((project, idx) => (
                      <div
                        key={project.id || project.slug}
                        onMouseEnter={(e) => handleRowPointerEnter(project, e)}
                        onMouseMove={handleRowPointerMove}
                        className="group relative py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors hover:bg-surface/40 px-2 sm:px-3 -mx-2 sm:-mx-3 rounded-lg"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <span className="font-mono text-xs text-ink-muted w-6 shrink-0">
                            {String(idx + 4).padStart(2, '0')}
                          </span>
                          <Link
                            to={`/project/${project.slug}`}
                            className="font-display text-xl sm:text-2xl font-semibold text-ink group-hover:text-accent transition-colors truncate"
                          >
                            {project.name}
                          </Link>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-5 pl-10 sm:pl-0 shrink-0">
                          <span className="font-mono text-xs text-ink-muted">
                            {(project.categories || []).join(' · ')}
                          </span>
                          <span className="font-mono text-xs text-ink-muted hidden md:inline">
                            {project.year}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQuickProject(project)}
                            className="inline-flex items-center gap-1 text-xs font-mono text-ink-muted hover:text-ink transition-colors"
                            aria-label={`Quick view ${project.name}`}
                          >
                            <Eye size={14} aria-hidden="true" />
                            <span>{isEn ? 'Brief' : 'Info'}</span>
                          </button>
                          <Link
                            to={`/project/${project.slug}`}
                            aria-label={`Open ${project.name}`}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-line text-ink group-hover:bg-ink group-hover:text-on-ink group-hover:border-ink transition-all"
                          >
                            <ArrowUpRight size={15} aria-hidden="true" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Desktop Floating Cursor-Tracked Preview Card */}
      <AnimatePresence>
        {hoveredRowProject && (
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.18, ease: STUDIO_EASE }}
            style={{
              x: smoothX,
              y: smoothY
            }}
            className="pointer-events-none fixed top-0 left-0 z-50 hidden lg:block w-[360px] rounded-xl bg-[#090B10] border border-white/20 shadow-[0_28px_70px_rgba(0,0,0,0.65)] overflow-hidden"
          >
            <div className="aspect-video overflow-hidden">
              <img
                src={hoveredRowProject.src}
                alt=""
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="px-3.5 py-2.5 bg-[#0F1118] border-t border-white/10 flex items-center justify-between font-mono text-xs text-slate-300">
              <span className="truncate">{hoveredRowProject.name}</span>
              <span className="text-blue-400 shrink-0">View ↗</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center overflow-y-auto"
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
