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
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [stageMode, setStageMode] = useState('preview');
  const [isPaused, setIsPaused] = useState(false);

  const facts = t('hero.facts', { returnObjects: true }) || [];
  const activeProject = heroProjects[activeIndex] || heroProjects[0];

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
      className="relative bg-paper text-ink pt-28 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 lg:pb-20 border-b border-line overflow-hidden"
    >
      <MeshGradient />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Editorial Claim (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: STUDIO_EASE }}
            className="inline-flex items-center gap-2.5 text-sm font-mono text-ink-muted mb-6"
          >
            <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>{t('hero.badge')}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, delay: 0.05, ease: STUDIO_EASE }}
            className="font-display text-[2.25rem] sm:text-5xl lg:text-[3.35rem] font-semibold tracking-[-0.035em] leading-[1.06] text-ink mb-5"
          >
            {t('hero.headline_start')} {t('hero.headline_accent')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, delay: 0.12, ease: STUDIO_EASE }}
            className="text-base sm:text-lg text-ink-muted leading-relaxed mb-8"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18, ease: STUDIO_EASE }}
            className="flex flex-wrap items-center gap-3 mb-10 w-full sm:w-auto"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={scrollToContact}
              className="w-full sm:w-auto"
            >
              <span>{t('hero.cta_primary')}</span>
              <ArrowRight
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-1"
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
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Button>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.24, ease: STUDIO_EASE }}
            className="w-full grid grid-cols-3 gap-4 pt-6 border-t border-line"
          >
            {Array.isArray(facts) &&
              facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="font-mono text-xs text-ink-muted mb-1">{fact.label}</dt>
                  <dd className="text-sm sm:text-base font-semibold text-ink">{fact.value}</dd>
                </div>
              ))}
          </motion.dl>
        </div>

        {/* Right Architectural Exhibition Stage (7 cols, Unified Obsidian Hardware Frame) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.14, ease: STUDIO_EASE }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="lg:col-span-7"
        >
          <div className="relative rounded-xl bg-[#0B0C10] text-slate-100 border border-line dark:border-white/15 shadow-2xl shadow-black/20 dark:shadow-black/60 overflow-hidden">
            {!isPaused && stageMode === 'preview' && (
              <div
                key={`progress-${activeProject.slug}`}
                className="h-[2px] w-full bg-blue-500 animate-stage-progress"
                aria-hidden="true"
              />
            )}

            {/* Minimal Studio Chrome */}
            <div className="px-3.5 sm:px-5 py-3 border-b border-white/10 flex items-center justify-between gap-2 bg-[#111319]">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <span className="font-mono text-xs font-medium text-slate-400 tabular-nums whitespace-nowrap shrink-0">
                  {String(activeIndex + 1).padStart(2, '0')} /{' '}
                  {String(heroProjects.length).padStart(2, '0')}
                </span>

                <div className="inline-flex items-center p-0.5 rounded-md bg-white/[0.06] border border-white/10 shrink-0">
                  <button
                    type="button"
                    onClick={() => setStageMode('preview')}
                    className={`min-h-[28px] px-2 sm:px-2.5 rounded text-xs font-medium inline-flex items-center gap-1 transition-colors ${
                      stageMode === 'preview'
                        ? 'bg-white text-[#0B0C10]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Monitor size={12} aria-hidden="true" />
                    <span>UI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStageMode('spec')}
                    className={`min-h-[28px] px-2 sm:px-2.5 rounded text-xs font-medium inline-flex items-center gap-1 transition-colors ${
                      stageMode === 'spec'
                        ? 'bg-white text-[#0B0C10]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Layers size={12} aria-hidden="true" />
                    <span>Spec</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsPaused((p) => !p)}
                  className="hidden sm:flex min-w-[34px] min-h-[34px] items-center justify-center rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
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
                  className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Previous project preview"
                >
                  <ChevronLeft size={16} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Next project preview"
                >
                  <ChevronRight size={16} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* 16:9 Studio Real-UI Frame */}
            <div className="relative aspect-video bg-[#0B0C10] overflow-hidden border-b border-white/10">
              <AnimatePresence initial={false}>
                {stageMode === 'preview' ? (
                  <motion.div
                    key={`img-${activeProject.slug}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: STUDIO_EASE }}
                    className="absolute inset-0"
                  >
                    <Link
                      to={`/project/${activeProject.slug}`}
                      className="group block w-full h-full"
                    >
                      <img
                        src={activeProject.src}
                        alt={`${activeProject.name} interface preview`}
                        width={1920}
                        height={1080}
                        decoding="async"
                        fetchPriority="high"
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`spec-${activeProject.slug}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: STUDIO_EASE }}
                    className="absolute inset-0 bg-[#0D0F15] p-6 sm:p-8 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs uppercase tracking-wider text-blue-400">
                          {activeProject.category}
                        </span>
                        <span className="font-mono text-xs text-slate-400">2026</span>
                      </div>
                      <div>
                        <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-2">
                          {activeProject.name}
                        </h3>
                        <p className="text-base text-slate-300 leading-relaxed max-w-xl">
                          {activeProject.summary}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-white/10">
                      <p className="text-sm text-slate-400">
                        {t('projects.client_label')}:{' '}
                        <span className="text-white font-medium">{activeProject.client}</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(activeProject.stack || []).map((item) => (
                          <span
                            key={item}
                            className="px-3 py-1 rounded-md bg-white/[0.06] border border-white/10 font-mono text-xs text-slate-200"
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

            {/* Clean Meta Strip & Minimal Project Switcher */}
            <div className="p-4 sm:px-5 sm:py-4 bg-[#111319] flex flex-col gap-3.5">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <h2 className="font-display text-lg sm:text-xl font-semibold text-white truncate">
                      {activeProject.name}
                    </h2>
                    <span className="font-mono text-xs text-slate-400 hidden sm:inline">
                      · {activeProject.category}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 truncate mt-0.5">{activeProject.summary}</p>
                </div>

                <Link
                  to={`/project/${activeProject.slug}`}
                  className="shrink-0 min-h-[38px] px-3.5 py-1.5 rounded-lg bg-white text-[#0B0C10] hover:bg-slate-200 text-sm font-medium inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>{t('hero.stage_action')}</span>
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </div>

              <div
                role="tablist"
                aria-label="Featured projects selector"
                className="flex flex-wrap gap-1 pt-3 border-t border-white/10"
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
                      className={`min-h-[36px] px-3 py-1 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                        selected
                          ? 'bg-white/15 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                      }`}
                    >
                      {proj.name}
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
