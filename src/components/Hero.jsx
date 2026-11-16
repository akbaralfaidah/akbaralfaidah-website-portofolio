import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Layers,
  Monitor
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { heroProjects } from '../data/projects';
import { Button } from './ui/Button';
import { MeshGradient } from './ui/MeshGradient';
import { STUDIO_EASE } from '../lib/motion';

export default function Hero() {
  const { t, i18n } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [stageMode, setStageMode] = useState('preview');
  const [isPaused, setIsPaused] = useState(false);

  const facts = t('hero.facts', { returnObjects: true }) || [];
  const activeProject = heroProjects[activeIndex] || heroProjects[0];
  const isEn = i18n.language === 'en';

  useEffect(() => {
    if (isPaused || stageMode !== 'preview') return undefined;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroProjects.length);
    }, 4800);

    return () => window.clearInterval(timer);
  }, [isPaused, stageMode]);

  const handleSelectProject = (index) => {
    setActiveIndex(index);
    setIsPaused(true);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + heroProjects.length) % heroProjects.length);
    setIsPaused(true);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % heroProjects.length);
    setIsPaused(true);
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative bg-paper text-ink pt-28 sm:pt-36 lg:pt-40 pb-20 sm:pb-24 px-6 border-b border-line overflow-hidden"
    >
      <MeshGradient />

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        {/* Left Column */}
        <div className="lg:col-span-7 flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: STUDIO_EASE }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-surface border border-line shadow-sm text-sm font-medium text-ink mb-7 whitespace-nowrap"
          >
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600 dark:bg-emerald-400" />
            </span>
            <span>{t('hero.badge')}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06, ease: STUDIO_EASE }}
            className="font-display text-[2.35rem] sm:text-[3.6rem] lg:text-[4.15rem] font-extrabold tracking-[-0.03em] leading-[1.04] text-ink mb-6"
          >
            {t('hero.headline')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14, ease: STUDIO_EASE }}
            className="text-lg sm:text-xl text-ink-muted leading-relaxed max-w-2xl mb-9"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22, ease: STUDIO_EASE }}
            className="flex flex-wrap items-center gap-4 mb-12 w-full sm:w-auto"
          >
            <Button
              variant="accent"
              size="lg"
              onClick={scrollToContact}
              className="w-full sm:w-auto"
            >
              <span>{t('hero.cta_primary')}</span>
              <ArrowRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Button>

            <Button
              as={Link}
              to="/projects"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <span>{t('hero.cta_secondary')}</span>
              <ArrowUpRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Button>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: STUDIO_EASE }}
            className="w-full grid grid-cols-2 sm:grid-cols-3 gap-6 pt-7 border-t border-line"
          >
            {Array.isArray(facts) &&
              facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-sm font-medium text-ink-muted mb-1">
                    {fact.label}
                  </dt>
                  <dd className="font-display text-lg sm:text-xl font-bold text-ink">
                    {fact.value}
                  </dd>
                </div>
              ))}
          </motion.dl>
        </div>

        {/* Right Column — Interactive Project Showcase Stage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.16, ease: STUDIO_EASE }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="lg:col-span-5"
        >
          <div className="relative rounded-2xl bg-surface border border-line shadow-xl shadow-ink/[0.06] dark:shadow-black/40 overflow-hidden">
            {!isPaused && stageMode === 'preview' && (
              <div
                key={`progress-${activeProject.slug}`}
                className="h-0.5 w-full bg-accent animate-stage-progress"
                aria-hidden="true"
              />
            )}

            {/* Stage Controls */}
            <div className="px-4 sm:px-5 py-3.5 border-b border-line flex items-center justify-between gap-2 bg-mist/50">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="font-mono text-sm font-semibold text-accent tabular-nums">
                  {String(activeIndex + 1).padStart(2, '0')} /{' '}
                  {String(heroProjects.length).padStart(2, '0')}
                </span>

                <div className="inline-flex items-center p-0.5 rounded-xl bg-surface border border-line">
                  <button
                    type="button"
                    onClick={() => setStageMode('preview')}
                    className={`relative min-h-[36px] px-3 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
                      stageMode === 'preview' ? 'text-on-accent' : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    {stageMode === 'preview' && (
                      <motion.span
                        layoutId="hero-stage-mode"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                        className="absolute inset-0 rounded-lg bg-accent-solid"
                      />
                    )}
                    <Monitor size={13} className="relative z-10" aria-hidden="true" />
                    <span className="relative z-10">UI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStageMode('spec')}
                    className={`relative min-h-[36px] px-3 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
                      stageMode === 'spec' ? 'text-on-accent' : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    {stageMode === 'spec' && (
                      <motion.span
                        layoutId="hero-stage-mode"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                        className="absolute inset-0 rounded-lg bg-accent-solid"
                      />
                    )}
                    <Layers size={13} className="relative z-10" aria-hidden="true" />
                    <span className="relative z-10">Spec</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsPaused((p) => !p)}
                  className="min-w-[40px] min-h-[40px] sm:min-w-[38px] sm:min-h-[38px] flex items-center justify-center rounded-lg border border-line bg-surface text-ink-muted hover:text-accent hover:border-accent transition-colors"
                  aria-label={isPaused ? 'Resume project showcase' : 'Pause project showcase'}
                >
                  {isPaused ? (
                    <Play size={14} aria-hidden="true" />
                  ) : (
                    <Pause size={14} aria-hidden="true" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="min-w-[44px] min-h-[44px] sm:min-w-[38px] sm:min-h-[38px] flex items-center justify-center rounded-lg border border-line bg-surface text-ink hover:border-accent hover:text-accent transition-colors"
                  aria-label="Previous project preview"
                >
                  <ChevronLeft size={16} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="min-w-[44px] min-h-[44px] sm:min-w-[38px] sm:min-h-[38px] flex items-center justify-center rounded-lg border border-line bg-surface text-ink hover:border-accent hover:text-accent transition-colors"
                  aria-label="Next project preview"
                >
                  <ChevronRight size={16} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Viewport */}
            <div className="relative aspect-[4/3] bg-mist overflow-hidden border-b border-line">
              <AnimatePresence mode="wait">
                {stageMode === 'preview' ? (
                  <motion.div
                    key={`img-${activeProject.slug}`}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.18, ease: STUDIO_EASE }}
                    className="w-full h-full"
                  >
                    <Link
                      to={`/project/${activeProject.slug}`}
                      className="group block w-full h-full"
                    >
                      <img
                        src={activeProject.src}
                        alt={`${activeProject.name} interface preview`}
                        width={800}
                        height={600}
                        decoding="async"
                        fetchPriority="high"
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`spec-${activeProject.slug}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.16, ease: STUDIO_EASE }}
                    className="w-full h-full bg-obsidian text-slate-100 p-6 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-blue-400">
                          {isEn ? 'Architecture Brief' : 'Ringkasan Arsitektur'}
                        </span>
                        <span className="font-mono text-sm text-slate-400">2026</span>
                      </div>
                      <div>
                        <h3 className="font-display text-2xl font-bold text-white mb-1.5">
                          {activeProject.name}
                        </h3>
                        <p className="text-base text-slate-300 leading-relaxed">
                          {activeProject.summary}
                        </p>
                      </div>
                      <div className="pt-3 border-t border-white/10">
                        <p className="text-sm text-slate-400 mb-0.5">
                          {t('projects.client_label')}
                        </p>
                        <p className="text-base font-medium text-white">{activeProject.client}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-slate-400 mb-2">Tech Stack</p>
                      <div className="flex flex-wrap gap-2">
                        {(activeProject.stack || []).map((item) => (
                          <span
                            key={item}
                            className="px-3 py-1 rounded-lg bg-white/10 border border-white/15 font-mono text-sm text-slate-100"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer & Tabs */}
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-accent mb-1">
                    {activeProject.category}
                  </p>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-ink truncate">
                    {activeProject.name}
                  </h2>
                  <p className="text-sm sm:text-base text-ink-muted line-clamp-2 mt-1">
                    {activeProject.summary}
                  </p>
                </div>

                <Link
                  to={`/project/${activeProject.slug}`}
                  className="shrink-0 min-h-[44px] px-4 py-2 rounded-xl border border-line bg-paper text-sm font-semibold text-ink hover:border-accent hover:text-accent inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>{t('hero.stage_action')}</span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </div>

              <div
                role="tablist"
                aria-label="Featured projects selector"
                className="flex flex-wrap gap-1.5 pt-3 border-t border-line"
              >
                {heroProjects.map((proj, idx) => {
                  const selected = idx === activeIndex;
                  return (
                    <button
                      key={proj.slug}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => handleSelectProject(idx)}
                      className={`relative min-h-[44px] sm:min-h-[38px] min-w-[44px] px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                        selected
                          ? 'text-on-accent font-semibold'
                          : 'bg-mist/60 text-ink-muted hover:text-ink hover:bg-mist'
                      }`}
                    >
                      {selected && (
                        <motion.span
                          layoutId="hero-tab-pill"
                          transition={{ type: 'spring', stiffness: 450, damping: 34 }}
                          className="absolute inset-0 rounded-lg bg-accent-solid"
                        />
                      )}
                      <span className="relative z-10">{proj.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
