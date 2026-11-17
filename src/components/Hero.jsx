import { useState, useRef, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Box,
  Radar,
  Layers,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Rotate3d
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { heroProjects } from '../data/projects';
import { useTheme } from '../hooks/useTheme';
import { Button } from './ui/Button';
import HeroCanvas from './ui/HeroCanvas';
import Magnetic from './ui/Magnetic';
import { STUDIO_EASE } from '../lib/motion';

const Hero3DCanvas = lazy(() => import('./ui/Hero3DCanvas'));

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

const RADAR_PRESETS = [
  { id: 'inside', x: 0.42, z: -0.22, labelId: 'Kelas (17m)', labelEn: 'Class (17m)' },
  { id: 'edge', x: -1.05, z: 0.62, labelId: 'Pinggir (45m)', labelEn: 'Edge (45m)' },
  { id: 'outside', x: 1.55, z: -0.95, labelId: 'Luar (67m)', labelEn: 'Outside (67m)' }
];

export default function Hero() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const [sceneMode, setSceneMode] = useState('core');
  const [exploded, setExploded] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [radarMetrics, setRadarMetrics] = useState({ meters: 22.5, inside: true });
  const [radarTarget, setRadarTarget] = useState(null);

  const heroRef = useRef(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.0005 });
  const yBg = useTransform(smoothScroll, [0, 1], [0, 210]);
  const yText = useTransform(smoothScroll, [0, 1], [0, -105]);
  const yStage = useTransform(smoothScroll, [0, 1], [0, 125]);
  const scaleStage = useTransform(smoothScroll, [0, 1], [1, 0.88]);

  const isEn = i18n.language === 'en';
  const isDark = theme === 'dark';
  const facts = t('hero.facts', { returnObjects: true }) || [];
  const activeProject = heroProjects[activeSlide] || heroProjects[0];

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (!el) return;
    if (window.__lenis) {
      window.__lenis.scrollTo(el, { offset: -72, duration: 1.15 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-[100svh] flex items-center bg-paper text-ink pt-24 pb-12 sm:pt-28 sm:pb-14 border-b border-line overflow-hidden"
    >
      {/* Parallax Depth Layer 1: Luminous Daylight Radial Atmosphere + Vector Ribbons */}
      <motion.div
        style={prefersReduced ? undefined : { y: yBg }}
        className="pointer-events-none absolute inset-0"
      >
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-32 right-[-8%] w-[700px] h-[700px] rounded-full opacity-95 dark:opacity-35"
            style={{
              background:
                'radial-gradient(circle, rgba(56,189,248,0.20) 0%, rgba(37,99,235,0.08) 45%, transparent 72%)'
            }}
          />
          <div
            className="absolute -bottom-36 left-[-8%] w-[580px] h-[580px] rounded-full opacity-90 dark:opacity-30"
            style={{
              background:
                'radial-gradient(circle, rgba(16,185,129,0.14) 0%, rgba(14,165,233,0.06) 48%, transparent 74%)'
            }}
          />
        </div>

        <HeroCanvas />
      </motion.div>

      <div className="relative z-10 max-w-6xl w-full mx-auto px-5 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Parallax Depth Layer 2: Sculptural Editorial Claim */}
        <motion.div
          style={prefersReduced ? undefined : { y: yText }}
          className="lg:col-span-6 flex flex-col items-start"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: STUDIO_EASE }}
            className="inline-flex items-center gap-2 sm:gap-2.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-surface/90 border border-line shadow-sm font-mono text-[10px] sm:text-xs uppercase tracking-[0.06em] sm:tracking-[0.12em] whitespace-nowrap max-w-full text-ink-muted mb-6"
          >
            <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>{t('hero.badge')} · Jambi / Remote</span>
          </motion.div>

          <h1 className="font-display text-[2.45rem] sm:text-[3.5rem] lg:text-[4.1rem] font-semibold tracking-[-0.035em] leading-[1.03] text-ink mb-6">
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
                variant="accent"
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
              className="w-full sm:w-auto backdrop-blur-md"
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
                  <dd className="text-sm sm:text-base font-semibold text-ink">{fact.value}</dd>
                </div>
              ))}
          </motion.dl>
        </motion.div>

        {/* Parallax Depth Layer 3: Open Floating Interactive 3D Engineering Stage (Three.js) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          style={prefersReduced ? undefined : { y: yStage, scale: scaleStage }}
          transition={{ duration: 0.72, delay: 0.14, ease: STUDIO_EASE }}
          className="lg:col-span-6 relative h-[410px] sm:h-[480px] lg:h-[520px] flex flex-col justify-between"
        >
          {/* Floating Top Mode Switcher + Contextual Status Pill */}
          <div className="relative z-20 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1 p-1 rounded-full bg-white/90 dark:bg-[#0D1017]/90 backdrop-blur-xl border border-slate-200/90 dark:border-white/15 shadow-sm">
              <button
                type="button"
                onClick={() => setSceneMode('core')}
                className={`min-h-[32px] px-2.5 sm:px-3.5 rounded-full text-[11px] sm:text-xs font-medium whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 transition-all ${
                  sceneMode === 'core'
                    ? 'bg-accent text-white shadow-sm shadow-blue-600/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-ink'
                }`}
              >
                <Box size={13} aria-hidden="true" />
                <span>Core 3D</span>
              </button>

              <button
                type="button"
                onClick={() => setSceneMode('radar')}
                className={`min-h-[32px] px-2.5 sm:px-3.5 rounded-full text-[11px] sm:text-xs font-medium whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 transition-all ${
                  sceneMode === 'radar'
                    ? 'bg-accent text-white shadow-sm shadow-blue-600/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-ink'
                }`}
              >
                <Radar size={13} aria-hidden="true" />
                <span>Radar 3D</span>
              </button>

              <button
                type="button"
                onClick={() => setSceneMode('deck')}
                className={`min-h-[32px] px-2.5 sm:px-3.5 rounded-full text-[11px] sm:text-xs font-medium whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 transition-all ${
                  sceneMode === 'deck'
                    ? 'bg-accent text-white shadow-sm shadow-blue-600/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-ink'
                }`}
              >
                <Layers size={13} aria-hidden="true" />
                <span>{isEn ? '3D Gallery' : 'Galeri 3D'}</span>
              </button>
            </div>

            {sceneMode === 'radar' ? (
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs font-semibold border backdrop-blur-md shadow-sm ${
                  radarMetrics.inside
                    ? 'bg-emerald-50/95 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30'
                    : 'bg-rose-50/95 text-rose-700 border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30'
                }`}
              >
                {radarMetrics.inside ? (
                  <CheckCircle2 size={13} aria-hidden="true" />
                ) : (
                  <XCircle size={13} aria-hidden="true" />
                )}
                <span>
                  {radarMetrics.meters.toFixed(1)}m ·{' '}
                  {radarMetrics.inside
                    ? isEn
                      ? 'VALID'
                      : 'SAH'
                    : isEn
                    ? 'OUT 50m'
                    : 'LUAR 50m'}
                </span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setExploded((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-[#0D1017]/90 backdrop-blur-md border border-slate-200/90 dark:border-white/15 font-mono text-[11px] font-medium text-ink hover:border-accent/50 hover:text-accent transition-all shadow-sm"
              >
                {exploded ? (
                  <Minimize2 size={12} aria-hidden="true" />
                ) : (
                  <Maximize2 size={12} aria-hidden="true" />
                )}
                <span>{exploded ? (isEn ? 'Assemble' : 'Rapatkan') : isEn ? 'Explode' : 'Urai 3D'}</span>
              </button>
            )}
          </div>

          {/* Open Daylight 3D Viewport */}
          <div className="relative flex-1 w-full min-h-[280px]">
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-2 border-accent/25 border-t-accent animate-spin" />
                </div>
              }
            >
              <Hero3DCanvas
                mode={sceneMode}
                exploded={exploded}
                isDark={isDark}
                activeProjectIndex={activeSlide}
                radarTarget={radarTarget}
                onRadarMetrics={setRadarMetrics}
                onToggleExplode={() => setExploded((prev) => !prev)}
                onSelectProjectIndex={setActiveSlide}
              />
            </Suspense>
          </div>

          {/* Floating Bottom Control & Telemetry Dock */}
          <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-white/90 dark:bg-[#0D1017]/90 backdrop-blur-xl border border-slate-200/90 dark:border-white/15 shadow-[0_14px_35px_-12px_rgba(37,99,235,0.16)]">
            <AnimatePresence mode="wait">
              {sceneMode === 'core' && (
                <motion.div
                  key="dock-core"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.16 }}
                  className="w-full flex flex-wrap items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 font-mono text-xs text-ink-muted">
                    <Rotate3d size={14} className="text-accent shrink-0" aria-hidden="true" />
                    <span>
                      {isEn
                        ? 'Drag 360° · Click core to explode'
                        : 'Seret 360° · Klik objek untuk urai'}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-accent shrink-0">
                    WebGL 3D
                  </span>
                </motion.div>
              )}

              {sceneMode === 'radar' && (
                <motion.div
                  key="dock-radar"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.16 }}
                  className="w-full flex flex-wrap items-center justify-between gap-2"
                >
                  <div className="flex flex-wrap items-center gap-1.5">
                    {RADAR_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setRadarTarget({ x: preset.x, z: preset.z })}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-accent border border-slate-200/80 dark:bg-white/[0.06] dark:hover:bg-white/15 dark:text-slate-300 dark:border-white/10 font-mono text-[11px] font-medium transition-colors"
                      >
                        {isEn ? preset.labelEn : preset.labelId}
                      </button>
                    ))}
                  </div>
                  <Link
                    to="/project/siabsen"
                    className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-accent hover:underline ml-auto"
                  >
                    <span>SiAbsen</span>
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </Link>
                </motion.div>
              )}

              {sceneMode === 'deck' && (
                <motion.div
                  key="dock-deck"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.16 }}
                  className="w-full flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-display text-sm font-semibold text-ink truncate">
                      {activeProject.name}{' '}
                      <span className="font-mono text-[11px] font-normal text-accent">
                        · {activeProject.category}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveSlide((prev) => (prev - 1 + heroProjects.length) % heroProjects.length)
                      }
                      className="w-7 h-7 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/15 dark:border-white/10 flex items-center justify-center text-ink transition-colors"
                      aria-label="Previous 3D card"
                    >
                      <ChevronLeft size={14} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSlide((prev) => (prev + 1) % heroProjects.length)}
                      className="w-7 h-7 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/15 dark:border-white/10 flex items-center justify-center text-ink transition-colors"
                      aria-label="Next 3D card"
                    >
                      <ChevronRight size={14} aria-hidden="true" />
                    </button>
                    <Link
                      to={`/project/${activeProject.slug}`}
                      className="ml-1 px-2.5 py-1 rounded-md bg-accent hover:bg-accent-hover text-white text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                    >
                      <span>{t('hero.stage_action')}</span>
                      <ArrowUpRight size={12} aria-hidden="true" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
