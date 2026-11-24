import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Cat,
  Radar,
  Layers,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Pause,
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
      aria-label={isEn ? 'Activate interactive 3D cat' : 'Aktifkan kucing 3D interaktif'}
      className="group relative w-full h-full flex items-center justify-center rounded-3xl focus-visible:outline-accent"
    >
      <svg
        width="320"
        height="320"
        viewBox="0 0 320 320"
        fill="none"
        aria-hidden="true"
        className="w-[210px] sm:w-[260px] lg:w-[290px] h-auto transition-transform duration-500 group-hover:scale-105"
      >
        <defs>
          <radialGradient id="kittyStageGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.28" />
            <stop offset="65%" stopColor="#F59E42" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="160" cy="160" r="136" fill="url(#kittyStageGlow)" />
        <ellipse cx="160" cy="248" rx="92" ry="18" fill="#E2E8F0" fillOpacity="0.55" stroke="#2563EB" strokeOpacity="0.38" strokeWidth="1.5" />
        {/* Cat ears */}
        <polygon points="104,116 118,62 146,98" fill="#F59E42" />
        <polygon points="113,108 122,74 139,98" fill="#FDA4AF" />
        <polygon points="216,116 202,62 174,98" fill="#F59E42" />
        <polygon points="207,108 198,74 181,98" fill="#FDA4AF" />
        {/* Tail curl */}
        <path d="M204 218 C242 214, 246 172, 224 164" stroke="#F59E42" strokeWidth="16" strokeLinecap="round" />
        <circle cx="222" cy="164" r="9" fill="#FFFDF7" />
        {/* Body */}
        <ellipse cx="160" cy="204" rx="50" ry="44" fill="#F59E42" />
        <ellipse cx="160" cy="210" rx="28" ry="30" fill="#FFFDF7" />
        {/* Cobalt collar + bell */}
        <path d="M124 176 Q160 190 196 176" stroke="#2563EB" strokeWidth="10" strokeLinecap="round" />
        <circle cx="160" cy="187" r="7" fill="#FBBF24" />
        {/* Head */}
        <ellipse cx="160" cy="134" rx="54" ry="45" fill="#F59E42" />
        {/* Muzzle */}
        <ellipse cx="149" cy="147" rx="14" ry="11" fill="#FFFDF7" />
        <ellipse cx="171" cy="147" rx="14" ry="11" fill="#FFFDF7" />
        {/* Eyes + sparkles */}
        <circle cx="137" cy="128" r="7.5" fill="#0F172A" />
        <circle cx="134.5" cy="125.5" r="2.8" fill="#FFFFFF" />
        <circle cx="183" cy="128" r="7.5" fill="#0F172A" />
        <circle cx="180.5" cy="125.5" r="2.8" fill="#FFFFFF" />
        {/* Cheeks & pink nose */}
        <ellipse cx="122" cy="142" rx="7" ry="4" fill="#FDA4AF" fillOpacity="0.85" />
        <ellipse cx="198" cy="142" rx="7" ry="4" fill="#FDA4AF" fillOpacity="0.85" />
        <polygon points="155,139 165,139 160,145" fill="#F472B6" />
        {/* Orbit sparkles */}
        <circle cx="72" cy="112" r="5" fill="#2563EB" fillOpacity="0.7" />
        <circle cx="252" cy="96" r="4" fill="#10B981" fillOpacity="0.7" />
      </svg>
    </button>
  );
}

const RADAR_PRESETS = [
  { id: 'inside', x: 0.42, z: -0.22, labelId: 'Kelas (17m)', labelEn: 'Class (17m)' },
  { id: 'edge', x: -1.05, z: 0.62, labelId: 'Pinggir (45m)', labelEn: 'Edge (45m)' },
  { id: 'outside', x: 1.55, z: -0.95, labelId: 'Luar (67m)', labelEn: 'Outside (67m)' }
];

const ROLE_CYCLE_ID = [
  'FULL-STACK WEB ARCHITECTURE',
  'ANDROID POS & GPS FLUTTER',
  'GEMINI AI & COMPUTER VISION',
  'DOCKER & SERVER PRODUKSI'
];

const ROLE_CYCLE_EN = [
  'FULL-STACK WEB ARCHITECTURE',
  'ANDROID POS & GPS FLUTTER',
  'GEMINI AI & COMPUTER VISION',
  'CLOUD & PRODUCTION DEPLOY'
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
  const [roleIndex, setRoleIndex] = useState(0);

  const heroRef = useRef(null);
  const hero2Ref = useRef(null);
  const bgLayerRef = useRef(null);
  const centerTiltRef = useRef(null);
  const titleTopRef = useRef(null);
  const titleBotRef = useRef(null);
  const heroCueRef = useRef(null);
  const scrollDropRef = useRef(null);
  const satTLRef = useRef(null);
  const satTRRef = useRef(null);
  const satBLRef = useRef(null);
  const satBRRef = useRef(null);
  const textLayerRef = useRef(null);
  const stageLayerRef = useRef(null);

  useEffect(() => {
    const id = window.setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLE_CYCLE_ID.length);
    }, 2600);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const activate = () => setMount3D(true);
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
    if (isDesktop) {
      window.addEventListener('pointermove', activate, { once: true, passive: true });
    }
    const timer = window.setTimeout(activate, isDesktop ? 2200 : 3200);

    let io;
    if (hero2Ref.current && typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            activate();
          }
        },
        { rootMargin: '120px 0px', threshold: 0.02 }
      );
      io.observe(hero2Ref.current);
    }

    return () => {
      window.removeEventListener('pointermove', activate);
      window.clearTimeout(timer);
      if (io) io.disconnect();
    };
  }, []);

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return undefined;

    const pointer = { tx: 0, ty: 0, cx: 0, cy: 0 };
    let rafId = 0;

    const onPointerMove = (e) => {
      const vw = window.innerWidth || 1440;
      const vh = window.innerHeight || 900;
      pointer.tx = (e.clientX / vw - 0.5) * 2;
      pointer.ty = (e.clientY / vh - 0.5) * 2;
    };

    const tick = () => {
      rafId = window.requestAnimationFrame(tick);

      pointer.cx += (pointer.tx - pointer.cx) * 0.08;
      pointer.cy += (pointer.ty - pointer.cy) * 0.08;

      const heroEl = heroRef.current;
      if (heroEl) {
        const runway = Math.max(1, heroEl.offsetHeight - (window.innerHeight || 900));
        const progress = Math.min(1, Math.max(0, window.scrollY / runway));

        if (bgLayerRef.current) {
          const bgScale = (1 + progress * 0.24).toFixed(3);
          bgLayerRef.current.style.transform = `translate3d(${(-pointer.cx * 18).toFixed(1)}px, ${(
            -pointer.cy * 14 +
            progress * 60
          ).toFixed(1)}px, 0) scale(${bgScale})`;
        }

        if (centerTiltRef.current) {
          const rx = (-pointer.cy * 3.6).toFixed(2);
          const ry = (pointer.cx * 4.4).toFixed(2);
          centerTiltRef.current.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        }

        if (titleTopRef.current) {
          const s = (1 + progress * 0.44).toFixed(3);
          const tx = (-progress * 38).toFixed(2);
          const ty = (-progress * 10).toFixed(2);
          const rot = (-progress * 5).toFixed(2);
          titleTopRef.current.style.transform = `translate3d(${tx}vw, ${ty}vh, 0) scale(${s}) rotate(${rot}deg)`;
          titleTopRef.current.style.opacity = `${Math.max(0, 1 - progress * 1.15).toFixed(3)}`;
        }

        if (titleBotRef.current) {
          const s = (1 + progress * 0.44).toFixed(3);
          const tx = (progress * 38).toFixed(2);
          const ty = (-progress * 10).toFixed(2);
          const rot = (progress * 5).toFixed(2);
          titleBotRef.current.style.transform = `translate3d(${tx}vw, ${ty}vh, 0) scale(${s}) rotate(${rot}deg)`;
          titleBotRef.current.style.opacity = `${Math.max(0, 1 - progress * 1.12).toFixed(3)}`;
        }

        if (heroCueRef.current) {
          const s = (1 - progress * 0.16).toFixed(3);
          heroCueRef.current.style.transform = `translate3d(0, ${(-progress * 36).toFixed(1)}px, 0) scale(${s})`;
          heroCueRef.current.style.opacity = `${Math.max(0, 1 - progress * 1.45).toFixed(3)}`;
        }

        if (scrollDropRef.current) {
          scrollDropRef.current.style.opacity = `${Math.max(0, 1 - progress * 2.5).toFixed(3)}`;
        }

        const scatter = (el, sx, sy, multX, multY) => {
          if (!el) return;
          const x = (-pointer.cx * multX + progress * sx).toFixed(1);
          const y = (-pointer.cy * multY + progress * sy).toFixed(1);
          const s = (1 + progress * 0.28).toFixed(3);
          el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s})`;
          el.style.opacity = `${Math.max(0, 1 - progress * 1.35).toFixed(3)}`;
        };

        scatter(satTLRef.current, -260, -170, 26, 22);
        scatter(satTRRef.current, 260, -170, -22, 24);
        scatter(satBLRef.current, -260, 170, 20, -24);
        scatter(satBRRef.current, 260, 170, -28, -20);
      }

      const hero2El = hero2Ref.current;
      if (hero2El) {
        const r2 = hero2El.getBoundingClientRect();
        const vh = window.innerHeight || 900;
        const norm = Math.max(-1, Math.min(1, (r2.top + r2.height / 2 - vh / 2) / vh));
        if (textLayerRef.current) {
          textLayerRef.current.style.transform = `translate3d(${(norm * -42).toFixed(1)}px, ${(norm * 82).toFixed(1)}px, 0)`;
        }
        if (stageLayerRef.current) {
          const s = (1 - Math.abs(norm) * 0.12).toFixed(3);
          const tiltDeg = (norm * -3.5).toFixed(2);
          stageLayerRef.current.style.transform = `translate3d(${(norm * 52).toFixed(1)}px, ${(-norm * 92).toFixed(1)}px, 0) scale(${s}) rotate(${tiltDeg}deg)`;
        }
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    tick();

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const isEn = i18n.language === 'en';
  const isDark = theme === 'dark';
  const facts = t('hero.facts', { returnObjects: true }) || [];
  const activeProject = heroProjects[activeSlide] || heroProjects[0];
  const currentRole = (isEn ? ROLE_CYCLE_EN : ROLE_CYCLE_ID)[roleIndex];

  const scrollToStage = () => {
    setMount3D(true);
    const targetEl = hero2Ref.current || document.getElementById('hero-stage');
    if (!targetEl) return;
    if (window.__lenis) {
      window.__lenis.scrollTo(targetEl, { offset: 0, duration: 1.1 });
    } else {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
    <>
      {/* HERO 1: Pinned Sticky Spatial Portal — SOFTWARE ENGINEER. */}
      <section
        ref={heroRef}
        id="hero"
        className="relative h-[160vh] md:h-[185vh] bg-paper text-ink border-b border-line overflow-x-clip"
      >
        <div className="sticky top-0 h-[100svh] flex flex-col justify-center pt-16 pb-10 px-5 sm:px-6 overflow-hidden">
          {/* Parallax Depth Layer 1: Luminous Daylight Radial Atmosphere + Vector Ribbons */}
          <div
            ref={bgLayerRef}
            className="pointer-events-none absolute -inset-6 will-change-transform"
          >
            <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
              <div
                className="animate-aurora absolute -top-28 right-[-6%] w-[720px] h-[720px] rounded-full opacity-95 dark:opacity-35"
                style={{
                  background:
                    'radial-gradient(circle, rgba(56,189,248,0.24) 0%, rgba(37,99,235,0.09) 45%, transparent 72%)'
                }}
              />
              <div
                className="animate-aurora absolute -bottom-32 left-[-6%] w-[600px] h-[600px] rounded-full opacity-90 dark:opacity-30"
                style={{
                  background:
                    'radial-gradient(circle, rgba(16,185,129,0.16) 0%, rgba(14,165,233,0.07) 48%, transparent 74%)'
                }}
              />
            </div>

            {/* Dual Opposing Continuous Ambient Typography Ribbons (alive while idle) */}
            <div
              aria-hidden="true"
              className="pointer-events-none select-none absolute top-[18%] left-0 right-0 overflow-hidden opacity-[0.045] dark:opacity-[0.06]"
            >
              <div className="animate-marquee-ltr flex w-max whitespace-nowrap font-display font-bold uppercase tracking-[0.14em] text-2xl sm:text-4xl text-ink">
                <span className="pr-12">
                  SYSTEM ARCHITECTURE · FULL-STACK WEB · ANDROID POS · COMPUTER VISION · APPLIED AI ·
                </span>
                <span className="pr-12">
                  SYSTEM ARCHITECTURE · FULL-STACK WEB · ANDROID POS · COMPUTER VISION · APPLIED AI ·
                </span>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none select-none absolute bottom-[14%] left-0 right-0 overflow-hidden opacity-[0.045] dark:opacity-[0.06]"
            >
              <div className="animate-marquee-rtl flex w-max whitespace-nowrap font-display font-bold uppercase tracking-[0.14em] text-2xl sm:text-4xl text-accent">
                <span className="pr-12">
                  NEXT.JS · FLUTTER · LARAVEL · GEMINI AI · DOCKER · NGINX · ZERO DOWNTIME ·
                </span>
                <span className="pr-12">
                  NEXT.JS · FLUTTER · LARAVEL · GEMINI AI · DOCKER · NGINX · ZERO DOWNTIME ·
                </span>
              </div>
            </div>

            <HeroCanvas />
          </div>

          {/* 4 Orbiting Levitating Liquid Glass Satellites (idle motion + mouse + radial scatter parallax) */}
          <div
            ref={satTLRef}
            aria-hidden="true"
            className="hidden md:flex pointer-events-none absolute left-[6%] lg:left-[8%] top-[21%] z-20 will-change-transform"
          >
            <div className="animate-float-a liquid-glass-pill rounded-2xl px-4 py-2.5 font-mono text-[11px] font-semibold text-ink flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>Next.js · React · Laravel</span>
            </div>
          </div>

          <div
            ref={satTRRef}
            aria-hidden="true"
            className="hidden md:flex pointer-events-none absolute right-[6%] lg:right-[8%] top-[23%] z-20 will-change-transform"
          >
            <div className="animate-float-b liquid-glass-pill rounded-2xl px-4 py-2.5 font-mono text-[11px] font-semibold text-ink flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Flutter · Android POS</span>
            </div>
          </div>

          <div
            ref={satBLRef}
            aria-hidden="true"
            className="hidden md:flex pointer-events-none absolute left-[7%] lg:left-[9%] bottom-[17%] z-20 will-change-transform"
          >
            <div className="animate-float-b liquid-glass-pill rounded-2xl px-4 py-2.5 font-mono text-[11px] font-semibold text-ink flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              <span>Gemini AI · OpenCV Vision</span>
            </div>
          </div>

          <div
            ref={satBRRef}
            aria-hidden="true"
            className="hidden md:flex pointer-events-none absolute right-[7%] lg:right-[9%] bottom-[19%] z-20 will-change-transform"
          >
            <div className="animate-float-a liquid-glass-pill rounded-2xl px-4 py-2.5 font-mono text-[11px] font-semibold text-ink flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>10+ Live Systems Shipped</span>
            </div>
          </div>

          {/* Center Spatial Tilt Monolith */}
          <div
            ref={centerTiltRef}
            className="relative z-10 max-w-6xl w-full mx-auto text-center flex flex-col items-center will-change-transform"
          >
            <div className="flex flex-wrap items-center justify-center gap-2.5 mb-5 sm:mb-7">
              <div className="inline-flex items-center gap-2 sm:gap-2.5 px-3.5 py-1.5 rounded-full liquid-glass-pill font-mono text-[10px] sm:text-xs uppercase tracking-[0.06em] sm:tracking-[0.12em] whitespace-nowrap max-w-full text-ink-muted">
                <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>{t('hero.badge')} · Jambi / Remote</span>
              </div>

              <span className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-pill font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted">
                Web · Mobile · Applied AI
              </span>
            </div>

            <h1 className="w-full flex items-baseline justify-center gap-x-[0.22em] whitespace-nowrap font-display font-bold uppercase tracking-[-0.045em] leading-[0.95] select-none mb-6 sm:mb-8">
              <span
                ref={titleTopRef}
                className="inline-block text-[clamp(1.75rem,7.15vw,6.65rem)] text-ink will-change-transform"
              >
                AKBAR
              </span>
              <span
                ref={titleBotRef}
                className="inline-block text-[clamp(1.8rem,7.3vw,6.85rem)] font-serif italic font-normal hero-shimmer-text pr-[0.06em] will-change-transform"
              >
                ALFAIDAH.
              </span>
            </h1>

            <div ref={heroCueRef} className="max-w-2xl mx-auto space-y-4 will-change-transform">
              {/* Live Cycling Role Micro-Ticker */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full liquid-glass-pill font-mono text-[11px] uppercase tracking-[0.14em] text-accent font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" aria-hidden="true" />
                <span>{currentRole}</span>
              </div>

              <p className="font-sans text-base sm:text-lg text-ink-muted leading-relaxed">
                {isEn
                  ? 'Designing and shipping fast websites, field-ready mobile apps, and applied AI systems from scratch.'
                  : 'Merancang website, aplikasi mobile lapangan, dan integrasi AI dari nol hingga berjalan stabil di server produksi.'}
              </p>
            </div>
          </div>

          {/* Minimal Animated Scroll Mouse Capsule (zero text clutter) */}
          <div
            ref={scrollDropRef}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 will-change-transform"
          >
            <button
              type="button"
              onClick={scrollToStage}
              aria-label={isEn ? 'Scroll down to Studio 3D' : 'Gulir ke bawah ke Studio 3D'}
              className="w-7 h-11 rounded-full liquid-glass-pill flex items-start justify-center p-2 hover:border-accent/60 transition-colors"
            >
              <span className="w-1.5 h-2.5 rounded-full bg-accent animate-scroll-drop" />
            </button>
          </div>
        </div>
      </section>

      {/* HERO 2: Interactive 3D Cat Stage & Engineering Pitch (Second Full-Screen Section) */}
      <section
        ref={hero2Ref}
        id="hero-stage"
        className="relative min-h-[100svh] flex items-center bg-[#F6F8FE] dark:bg-[#0A0E18] text-ink py-20 sm:py-24 px-5 sm:px-6 border-b border-line overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-[-10%] w-[560px] h-[560px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.09),transparent_68%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 left-[-10%] w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.09),transparent_68%)]"
        />

        <div className="relative z-10 max-w-6xl w-full mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Parallax Depth Layer 2: Editorial Pitch & CTA */}
            <div
              ref={textLayerRef}
              className="lg:col-span-5 flex flex-col items-start will-change-transform"
            >
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent font-semibold mb-3">
                {isEn ? 'Interactive Studio' : 'Studio Interaktif'}
              </p>

              <h2 className="font-display text-2xl sm:text-4xl lg:text-[2.65rem] font-semibold tracking-[-0.03em] leading-[1.08] text-ink mb-4">
                {isEn ? (
                  <>
                    Websites, Mobile Apps &amp;{' '}
                    <span className="font-serif italic font-normal text-accent">Applied AI</span>{' '}
                    Built to Ship.
                  </>
                ) : (
                  <>
                    Website, Aplikasi Mobile &amp;{' '}
                    <span className="font-serif italic font-normal text-accent">Sistem AI</span>{' '}
                    yang Siap Pakai.
                  </>
                )}
              </h2>

              <p className="text-sm sm:text-base text-ink-muted leading-relaxed max-w-lg mb-7">
                {t('hero.subtitle')}
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-8 w-full sm:w-auto">
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

              <dl className="w-full grid grid-cols-3 gap-3 sm:gap-4 pt-5 border-t border-line">
                {Array.isArray(facts) &&
                  facts.map((fact) => (
                    <div key={fact.label}>
                      <dt className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-ink-muted mb-1">
                        {fact.label}
                      </dt>
                      <dd className="text-xs sm:text-sm font-semibold text-ink">{fact.value}</dd>
                    </div>
                  ))}
              </dl>
            </div>

            {/* Parallax Depth Layer 3: Full-Space Interactive 3D Cat Stage */}
            <div
              ref={stageLayerRef}
              onPointerEnter={() => setMount3D(true)}
              className="lg:col-span-7 relative h-[380px] sm:h-[460px] lg:h-[530px] flex flex-col justify-between will-change-transform"
            >
            {/* Floating Top Mode Switcher + Contextual Status Pill */}
            <div className="relative z-20 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1 p-1 rounded-full liquid-glass-pill">
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
                  <Cat size={13} aria-hidden="true" />
                  <span>{isEn ? '3D Cat' : 'Kucing 3D'}</span>
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full liquid-glass-pill font-mono text-[11px] font-medium text-ink hover:border-accent/50 hover:text-accent transition-all"
                >
                  {exploded ? (
                    <Pause size={12} aria-hidden="true" />
                  ) : (
                    <Sparkles size={12} aria-hidden="true" />
                  )}
                  <span>
                    {sceneMode === 'core'
                      ? exploded
                        ? isEn
                          ? 'Chill'
                          : 'Istirahat'
                        : isEn
                        ? 'Play!'
                        : 'Main!'
                      : exploded
                      ? isEn
                        ? 'Assemble'
                        : 'Rapatkan'
                      : isEn
                      ? 'Spread'
                      : 'Lebarkan'}
                  </span>
                </button>
              )}
            </div>

            {/* Open Daylight 3D Viewport */}
            <div className="relative flex-1 w-full min-h-[240px]">
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
            <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl liquid-glass">
              {sceneMode === 'core' && (
                <div className="w-full flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-mono text-xs text-ink-muted">
                    <Rotate3d size={14} className="text-accent shrink-0" aria-hidden="true" />
                    <span>
                      {isEn
                        ? 'Drag 360° · Click kitty to play!'
                        : 'Seret 360° · Klik kucing untuk main!'}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-accent shrink-0">
                    Kucing 3D · WebGL
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
        </div>
      </section>
    </>
  );
}
