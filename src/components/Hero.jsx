import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
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
import { heroProjects } from '../data/heroProjects';
import { useTheme } from '../hooks/useTheme';
import { Button } from './ui/Button';
import HeroCanvas from './ui/HeroCanvas';
import Magnetic from './ui/Magnetic';

const Hero3DCanvas = lazy(() => import('./ui/Hero3DCanvas'));

function Hero3DStaticPreview({ isEn, onActivate }) {
  return (
    <button
      type="button"
      onClick={onActivate}
      aria-label={isEn ? 'Activate interactive 3D model' : 'Aktifkan tampilan 3D interaktif'}
      className="group relative w-full h-full flex items-center justify-center rounded-3xl focus-visible:outline-accent"
    >
      <svg
        width="340"
        height="340"
        viewBox="0 0 340 340"
        fill="none"
        aria-hidden="true"
        className="w-[240px] sm:w-[300px] lg:w-[340px] h-auto transition-transform duration-500 group-hover:scale-105"
      >
        <defs>
          <radialGradient id="coreGlowPreview" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#2563EB" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="coreGemPreview" x1="110" y1="100" x2="230" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="55%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
        </defs>
        <circle cx="170" cy="170" r="145" fill="url(#coreGlowPreview)" />
        <ellipse
          cx="170"
          cy="170"
          rx="128"
          ry="48"
          transform="rotate(-24 170 170)"
          stroke="#10B981"
          strokeOpacity="0.6"
          strokeWidth="3.2"
        />
        <ellipse
          cx="170"
          cy="170"
          rx="114"
          ry="44"
          transform="rotate(34 170 170)"
          stroke="#0EA5E9"
          strokeOpacity="0.7"
          strokeWidth="3.5"
        />
        <ellipse
          cx="170"
          cy="170"
          rx="96"
          ry="38"
          transform="rotate(-68 170 170)"
          stroke="#2563EB"
          strokeOpacity="0.78"
          strokeWidth="3.8"
        />
        <polygon
          points="170,112 220,141 220,199 170,228 120,199 120,141"
          fill="url(#coreGemPreview)"
          fillOpacity="0.92"
        />
        <polygon
          points="170,98 232,134 232,206 170,242 108,206 108,134"
          stroke="#38BDF8"
          strokeOpacity="0.75"
          strokeWidth="1.5"
        />
        <line x1="170" y1="98" x2="170" y2="242" stroke="#93C5FD" strokeOpacity="0.45" strokeWidth="1" />
        <line x1="108" y1="134" x2="232" y2="206" stroke="#93C5FD" strokeOpacity="0.45" strokeWidth="1" />
        <line x1="232" y1="134" x2="108" y2="206" stroke="#93C5FD" strokeOpacity="0.45" strokeWidth="1" />
        <rect x="242" y="92" width="46" height="30" rx="6" fill="#FFFFFF" stroke="#2563EB" strokeOpacity="0.55" strokeWidth="1.5" />
        <rect x="249" y="100" width="24" height="4" rx="2" fill="#2563EB" />
        <rect x="54" y="210" width="46" height="30" rx="6" fill="#E0F2FE" stroke="#0EA5E9" strokeOpacity="0.55" strokeWidth="1.5" />
        <rect x="61" y="218" width="24" height="4" rx="2" fill="#0EA5E9" />
      </svg>
    </button>
  );
}

function MaskedLine({ children, className = '' }) {
  return (
    <span className="block pb-1 -mb-1">
      <span className={`block ${className}`}>{children}</span>
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
  const [mount3D, setMount3D] = useState(false);

  const heroRef = useRef(null);
  const bgLayerRef = useRef(null);
  const textLayerRef = useRef(null);
  const stageLayerRef = useRef(null);

  useEffect(() => {
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
    if (!isDesktop) return undefined;

    const activate = () => setMount3D(true);
    window.addEventListener('pointermove', activate, { once: true, passive: true });
    const timer = window.setTimeout(activate, 3600);
    return () => {
      window.removeEventListener('pointermove', activate);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return undefined;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const heroEl = heroRef.current;
        if (!heroEl) return;
        const h = heroEl.offsetHeight || window.innerHeight || 900;
        const progress = Math.min(1, Math.max(0, window.scrollY / h));
        if (bgLayerRef.current) {
          bgLayerRef.current.style.transform = `translate3d(0, ${(progress * 180).toFixed(1)}px, 0)`;
        }
        if (textLayerRef.current) {
          textLayerRef.current.style.transform = `translate3d(0, ${(-progress * 90).toFixed(1)}px, 0)`;
        }
        if (stageLayerRef.current) {
          const s = (1 - progress * 0.1).toFixed(3);
          stageLayerRef.current.style.transform = `translate3d(0, ${(progress * 105).toFixed(1)}px, 0) scale(${s})`;
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  const isEn = i18n.language === 'en';
  const isDark = theme === 'dark';
  const facts = t('hero.facts', { returnObjects: true }) || [];
  const activeProject = heroProjects[activeSlide] || heroProjects[0];

  const scrollToContact = () => {
    window.dispatchEvent(new CustomEvent('app:preload-sections'));
    const doScroll = (el) => {
      if (window.__lenis) {
        window.__lenis.scrollTo(el, { offset: -72, duration: 1.15 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    };
    const immediate = document.getElementById('contact');
    if (immediate) {
      doScroll(immediate);
      return;
    }
    let tries = 0;
    const timer = window.setInterval(() => {
      tries += 1;
      const el = document.getElementById('contact');
      if (el) {
        window.clearInterval(timer);
        doScroll(el);
      } else if (tries >= 25) {
        window.clearInterval(timer);
      }
    }, 60);
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-[100svh] flex items-center bg-paper text-ink pt-24 pb-12 sm:pt-28 sm:pb-14 border-b border-line overflow-hidden"
    >
      {/* Parallax Depth Layer 1: Luminous Daylight Radial Atmosphere + Vector Ribbons */}
      <div
        ref={bgLayerRef}
        className="pointer-events-none absolute inset-0 will-change-transform"
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
      </div>

      <div className="relative z-10 max-w-6xl w-full mx-auto px-5 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Parallax Depth Layer 2: Sculptural Editorial Claim */}
        <div
          ref={textLayerRef}
          className="lg:col-span-6 flex flex-col items-start will-change-transform"
        >
          <div className="inline-flex items-center gap-2 sm:gap-2.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-surface/90 border border-line shadow-sm font-mono text-[10px] sm:text-xs uppercase tracking-[0.06em] sm:tracking-[0.12em] whitespace-nowrap max-w-full text-ink-muted mb-6">
            <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>{t('hero.badge')} · Jambi / Remote</span>
          </div>

          <h1 className="font-display text-[2.45rem] sm:text-[3.5rem] lg:text-[4.1rem] font-semibold tracking-[-0.035em] leading-[1.03] text-ink mb-6">
            {isEn ? (
              <>
                <MaskedLine>Engineering Web,</MaskedLine>
                <MaskedLine>
                  Mobile <span className="font-serif italic font-normal text-accent">&amp; Applied AI</span>
                </MaskedLine>
                <MaskedLine>Built to Ship.</MaskedLine>
              </>
            ) : (
              <>
                <MaskedLine>Website, Aplikasi</MaskedLine>
                <MaskedLine>
                  <span className="font-serif italic font-normal text-accent">&amp; Sistem AI</span> yang
                </MaskedLine>
                <MaskedLine>Siap Pakai.</MaskedLine>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-ink-muted leading-relaxed max-w-xl mb-8">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-wrap items-center gap-3.5 mb-10 w-full sm:w-auto">
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
              className="w-full sm:w-auto"
            >
              <span>{t('hero.cta_secondary')}</span>
              <ArrowUpRight
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Button>
          </div>

          <dl className="w-full grid grid-cols-3 gap-4 pt-6 border-t border-line">
            {Array.isArray(facts) &&
              facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-ink-muted mb-1">
                    {fact.label}
                  </dt>
                  <dd className="text-sm sm:text-base font-semibold text-ink">{fact.value}</dd>
                </div>
              ))}
          </dl>
        </div>

        {/* Parallax Depth Layer 3: Open Floating Interactive 3D Engineering Stage (Three.js) */}
        <div
          ref={stageLayerRef}
          onPointerEnter={() => setMount3D(true)}
          className="lg:col-span-6 relative h-[410px] sm:h-[480px] lg:h-[520px] flex flex-col justify-between will-change-transform"
        >
          {/* Floating Top Mode Switcher + Contextual Status Pill */}
          <div className="relative z-20 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1 p-1 rounded-full bg-white/95 dark:bg-[#0D1017]/95 border border-slate-200/90 dark:border-white/15 shadow-sm">
              <button
                type="button"
                onClick={() => {
                  setMount3D(true);
                  setSceneMode('core');
                }}
                className={`min-h-[32px] px-2.5 sm:px-3.5 rounded-full text-[11px] sm:text-xs font-medium whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 transition-all ${
                  sceneMode === 'core'
                    ? 'bg-accent text-white shadow-sm shadow-blue-600/25'
                    : 'text-slate-700 dark:text-slate-300 hover:text-ink'
                }`}
              >
                <Box size={13} aria-hidden="true" />
                <span>Core 3D</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMount3D(true);
                  setSceneMode('radar');
                }}
                className={`min-h-[32px] px-2.5 sm:px-3.5 rounded-full text-[11px] sm:text-xs font-medium whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 transition-all ${
                  sceneMode === 'radar'
                    ? 'bg-accent text-white shadow-sm shadow-blue-600/25'
                    : 'text-slate-700 dark:text-slate-300 hover:text-ink'
                }`}
              >
                <Radar size={13} aria-hidden="true" />
                <span>Radar 3D</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMount3D(true);
                  setSceneMode('deck');
                }}
                className={`min-h-[32px] px-2.5 sm:px-3.5 rounded-full text-[11px] sm:text-xs font-medium whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 transition-all ${
                  sceneMode === 'deck'
                    ? 'bg-accent text-white shadow-sm shadow-blue-600/25'
                    : 'text-slate-700 dark:text-slate-300 hover:text-ink'
                }`}
              >
                <Layers size={13} aria-hidden="true" />
                <span>{isEn ? '3D Gallery' : 'Galeri 3D'}</span>
              </button>
            </div>

            {sceneMode === 'radar' ? (
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs font-semibold border shadow-sm ${
                  radarMetrics.inside
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30'
                    : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30'
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
                onClick={() => {
                  setMount3D(true);
                  setExploded((prev) => !prev);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 dark:bg-[#0D1017]/95 border border-slate-200/90 dark:border-white/15 font-mono text-[11px] font-medium text-ink hover:border-accent/50 hover:text-accent transition-all shadow-sm"
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
            {mount3D ? (
              <Suspense fallback={<Hero3DStaticPreview isEn={isEn} onActivate={() => setMount3D(true)} />}>
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
            ) : (
              <Hero3DStaticPreview isEn={isEn} onActivate={() => setMount3D(true)} />
            )}
          </div>

          {/* Floating Bottom Control & Telemetry Dock */}
          <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-white/95 dark:bg-[#0D1017]/95 border border-slate-200/90 dark:border-white/15 shadow-[0_14px_35px_-12px_rgba(37,99,235,0.16)]">
            {sceneMode === 'core' && (
              <div className="w-full flex flex-wrap items-center justify-between gap-2">
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
              </div>
            )}

            {sceneMode === 'radar' && (
              <div className="w-full flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {RADAR_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setMount3D(true);
                        setRadarTarget({ x: preset.x, z: preset.z });
                      }}
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
              </div>
            )}

            {sceneMode === 'deck' && (
              <div className="w-full flex items-center justify-between gap-3">
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
                    onClick={() => {
                      setMount3D(true);
                      setActiveSlide((prev) => (prev - 1 + heroProjects.length) % heroProjects.length);
                    }}
                    className="w-7 h-7 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/15 dark:border-white/10 flex items-center justify-center text-ink transition-colors"
                    aria-label="Previous 3D card"
                  >
                    <ChevronLeft size={14} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMount3D(true);
                      setActiveSlide((prev) => (prev + 1) % heroProjects.length);
                    }}
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
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
