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
import ShaderCanvas from './ui/ShaderCanvas';
import Magnetic from './ui/Magnetic';
import { STUDIO_EASE } from '../lib/motion';

function MaskedLine({ children, delay = 0, className = '' }) {
  return (
    <span className="block overflow-hidden pb-1 -mb-1">
      <motion.span
        initial={{ y: '105%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        transition={{ duration: 0.72, delay, ease: STUDIO_EASE }}
        className={`block ${className}`}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  const { t, i18n } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [stageMode, setStageMode] = useState('preview');
  const [isPaused, setIsPaused] = useState(false);

  const cardRef = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const smoothX = useSpring(mx, { stiffness: 180, damping: 24 });
  const smoothY = useSpring(my, { stiffness: 180, damping: 24 });
  const rotateY = useTransform(smoothX, [0, 1], [-4.5, 4.5]);
  const rotateX = useTransform(smoothY, [0, 1], [3.5, -3.5]);

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
    }, 5200);

    return () => window.clearInterval(timer);
  }, [isPaused, stageMode]);

  const handleStageMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      const rx = (e.clientX - rect.left) / rect.width;
      const ry = (e.clientY - rect.top) / rect.height;
      mx.set(rx);
      my.set(ry);
      el.style.setProperty('--gx', `${rx * 100}%`);
      el.style.setProperty('--gy', `${ry * 100}%`);
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
      className="relative min-h-[100svh] flex items-center bg-paper text-ink pt-24 pb-12 sm:pt-28 sm:pb-14 border-b border-line overflow-hidden"
    >
      {/* Live WebGL2 Optical Silk-Prism Shader Backdrop */}
      <ShaderCanvas />

      <div className="relative z-10 max-w-6xl w-full mx-auto px-5 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left: Sculptural Editorial Typography */}
        <div className="lg:col-span-6 flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: STUDIO_EASE }}
            className="inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.12em] text-ink-muted mb-6"
          >
            <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span>{t('hero.badge')} · Jambi / Remote</span>
          </motion.div>

          <h1 className="font-display text-[2.5rem] sm:text-[3.6rem] lg:text-[4.15rem] font-semibold tracking-[-0.035em] leading-[1.03] text-ink mb-6">
            {isEn ? (
              <>
                <MaskedLine delay={0.04}>Engineering Web,</MaskedLine>
                <MaskedLine delay={0.12}>
                  Mobile <span className="font-serif italic font-normal text-accent">&amp; Applied AI</span>
                </MaskedLine>
                <MaskedLine delay={0.2}>Built to Ship.</MaskedLine>
              </>
            ) : (
              <>
                <MaskedLine delay={0.04}>Website, Aplikasi</MaskedLine>
                <MaskedLine delay={0.12}>
                  <span className="font-serif italic font-normal text-accent">&amp; Sistem AI</span> yang
                </MaskedLine>
                <MaskedLine delay={0.2}>Siap Pakai.</MaskedLine>
              </>
            )}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease: STUDIO_EASE }}
            className="text-base sm:text-lg text-ink-muted leading-relaxed max-w-xl mb-8"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, delay: 0.3, ease: STUDIO_EASE }}
            className="flex flex-wrap items-center gap-3.5 mb-10 w-full sm:w-auto"
          >
            <Magnetic strength={0.25} className="w-full sm:w-auto">
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
            </Magnetic>

            <Button
              as={Link}
              to="/projects"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto bg-paper/40 backdrop-blur-md"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.36 }}
            className="w-full grid grid-cols-3 gap-4 pt-6 border-t border-line"
          >
            {Array.isArray(facts) &&
              facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-ink-muted mb-1">
                    {fact.label}
                  </dt>
                  <dd className="text-sm sm:text-base font-medium text-ink">{fact.value}</dd>
                </div>
              ))}
          </motion.dl>
        </div>

        {/* Right: 3D Spring-Tilted Glass Hardware Stage */}
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.16, ease: STUDIO_EASE }}
          style={{ rotateX, rotateY, transformPerspective: 1200 }}
          onMouseMove={handleStageMove}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            setIsPaused(false);
            mx.set(0.5);
            my.set(0.5);
          }}
          className="lg:col-span-6 relative group/stage"
        >
          <div className="relative rounded-xl bg-[#0B0D12]/90 backdrop-blur-xl text-slate-100 border border-white/15 shadow-[0_32px_90px_rgba(0,0,0,0.65)] overflow-hidden">
            {/* Specular dynamic sheen reacting to cursor */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 group-hover/stage:opacity-100 transition-opacity duration-300 z-20"
              style={{
                background:
                  'radial-gradient(460px circle at var(--gx, 50%) var(--gy, 40%), rgba(255,255,255,0.08), transparent 60%)'
              }}
            />

            {!isPaused && stageMode === 'preview' && (
              <div
                key={`progress-${activeProject.slug}`}
                className="h-[2px] w-full bg-blue-400 animate-stage-progress relative z-30"
                aria-hidden="true"
              />
            )}

            {/* Studio Control Bar */}
            <div className="relative z-10 px-3.5 sm:px-5 py-3 border-b border-white/10 flex items-center justify-between gap-2 bg-[#0F1118]/90">
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
                        ? 'bg-white text-[#050608]'
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
                        ? 'bg-white text-[#050608]'
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
                  className="min-w-[34px] min-h-[34px] flex items-center justify-center rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Previous project preview"
                >
                  <ChevronLeft size={16} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="min-w-[34px] min-h-[34px] flex items-center justify-center rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Next project preview"
                >
                  <ChevronRight size={16} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* 16:9 Studio Real-UI Frame */}
            <div className="relative z-10 aspect-video bg-[#080A0F] overflow-hidden border-b border-white/10">
              <AnimatePresence initial={false}>
                {stageMode === 'preview' ? (
                  <motion.div
                    key={`img-${activeProject.slug}`}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.36, ease: STUDIO_EASE }}
                    className="absolute inset-0"
                  >
                    <Link
                      to={`/project/${activeProject.slug}`}
                      data-cursor={isEn ? 'Open Case ↗' : 'Buka Proyek ↗'}
                      className="group block w-full h-full"
                    >
                      <img
                        src={activeProject.src}
                        alt={`${activeProject.name} interface preview`}
                        width={1920}
                        height={1080}
                        decoding="async"
                        fetchPriority="high"
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.025]"
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
                    className="absolute inset-0 bg-[#0B0D13] p-6 sm:p-8 flex flex-col justify-between"
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

            {/* Meta Strip & Switcher */}
            <div className="relative z-10 p-4 sm:px-5 sm:py-4 bg-[#0F1118]/90 flex flex-col gap-3.5">
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
                  className="shrink-0 min-h-[38px] px-3.5 py-1.5 rounded-lg bg-white text-[#050608] hover:bg-slate-200 text-sm font-medium inline-flex items-center gap-1.5 transition-colors"
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
