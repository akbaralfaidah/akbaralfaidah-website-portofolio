import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
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

const KINETIC_ITEMS_ID = [
  'Web Full-Stack',
  'Aplikasi Android & Flutter',
  'Integrasi AI & Vision',
  'Desain Antarmuka',
  'API & Database',
  'Deploy Cloud Server'
];

const KINETIC_ITEMS_EN = [
  'Full-Stack Web',
  'Android & Flutter',
  'Applied AI & Vision',
  'Interface Design',
  'APIs & Databases',
  'Cloud Deployment'
];

export default function Hero() {
  const { t, i18n } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [stageMode, setStageMode] = useState('preview');
  const [isPaused, setIsPaused] = useState(false);

  const stageRef = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const smoothX = useSpring(mx, { stiffness: 220, damping: 24 });
  const smoothY = useSpring(my, { stiffness: 220, damping: 24 });
  const rotateY = useTransform(smoothX, [0, 1], [-4, 4]);
  const rotateX = useTransform(smoothY, [0, 1], [3, -3]);

  const facts = t('hero.facts', { returnObjects: true }) || [];
  const activeProject = heroProjects[activeIndex] || heroProjects[0];
  const isEn = i18n.language === 'en';
  const ribbonItems = isEn ? KINETIC_ITEMS_EN : KINETIC_ITEMS_ID;

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

  const handleStageMove = (e) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      mx.set((e.clientX - rect.left) / rect.width);
      my.set((e.clientY - rect.top) / rect.height);
    }
  };

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
      className="relative bg-paper text-ink pt-28 sm:pt-36 lg:pt-40 pb-0 border-b border-line overflow-hidden"
    >
      <MeshGradient />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-16 sm:pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        {/* Left Column */}
        <div className="lg:col-span-6 flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: STUDIO_EASE }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-surface/90 backdrop-blur-md border border-line shadow-sm text-sm font-medium text-ink mb-7 whitespace-nowrap"
          >
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600 dark:bg-emerald-400" />
            </span>
            <span>{t('hero.badge')}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.58, delay: 0.06, ease: STUDIO_EASE }}
            className="font-display text-[2.45rem] sm:text-[3.5rem] lg:text-[3.95rem] font-extrabold tracking-[-0.03em] leading-[1.06] text-ink mb-6"
          >
            {t('hero.headline_start')}{' '}
            <span className="bg-gradient-to-r from-accent via-sky-500 to-amber-500 dark:from-blue-400 dark:via-sky-300 dark:to-amber-300 bg-clip-text text-transparent">
              {t('hero.headline_accent')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14, ease: STUDIO_EASE }}
            className="text-lg sm:text-xl text-ink-muted leading-relaxed max-w-xl mb-9"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22, ease: STUDIO_EASE }}
            className="flex flex-wrap items-center gap-4 mb-11 w-full sm:w-auto"
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
                  <dt className="text-sm font-medium text-ink-muted mb-1">{fact.label}</dt>
                  <dd className="font-display text-lg sm:text-xl font-bold text-ink">
                    {fact.value}
                  </dd>
                </div>
              ))}
          </motion.dl>
        </div>

        {/* Right Column — 3D Tilt Showcase Stage */}
        <motion.div
          ref={stageRef}
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16, ease: STUDIO_EASE }}
          style={{ rotateX, rotateY, transformPerspective: 1200 }}
          onMouseMove={handleStageMove}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            setIsPaused(false);
            mx.set(0.5);
            my.set(0.5);
          }}
          className="lg:col-span-6"
        >
          <div className="relative rounded-2xl bg-surface/95 backdrop-blur-md border border-line shadow-2xl shadow-accent/[0.08] dark:shadow-black/50 overflow-hidden">
            {!isPaused && stageMode === 'preview' && (
              <div
                key={`progress-${activeProject.slug}`}
                className="h-0.5 w-full bg-accent animate-stage-progress"
                aria-hidden="true"
              />
            )}

            {/* Top Controls */}
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

            {/* 16:9 HD Viewport */}
            <div className="relative aspect-video bg-mist overflow-hidden border-b border-line">
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
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`spec-${activeProject.slug}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: STUDIO_EASE }}
                    className="absolute inset-0 bg-obsidian text-slate-100 p-6 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-blue-400">
                          {activeProject.category}
                        </span>
                        <span className="font-mono text-sm text-slate-400">2026</span>
                      </div>
                      <div>
                        <h3 className="font-display text-2xl font-bold text-white mb-1">
                          {activeProject.name}
                        </h3>
                        <p className="text-base text-slate-300 leading-relaxed">
                          {activeProject.summary}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm text-slate-400">
                        {t('projects.client_label')}: <span className="text-white font-medium">{activeProject.client}</span>
                      </p>
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
                      className={`min-h-[44px] sm:min-h-[38px] min-w-[44px] px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                        selected
                          ? 'bg-accent-solid text-on-accent font-semibold shadow-sm'
                          : 'bg-mist/60 text-ink-muted hover:text-ink hover:bg-mist'
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

      {/* Artistic Kinetic Ticker Ribbon */}
      <div className="relative z-10 border-t border-line bg-surface/75 backdrop-blur-md py-4 overflow-hidden select-none">
        <div className="flex w-max animate-marquee gap-8 items-center">
          {[...ribbonItems, ...ribbonItems].map((label, idx) => (
            <div
              key={`${label}-${idx}`}
              aria-hidden={idx >= ribbonItems.length ? 'true' : undefined}
              className="flex items-center gap-8 shrink-0"
            >
              <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-ink">
                {label}
              </span>
              <span className="w-2 h-2 rounded-full bg-accent shrink-0" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
