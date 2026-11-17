import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Plus, Minus, Monitor, Smartphone, Sparkles, ArrowRight, Clock, Check } from 'lucide-react';
import TechLogoMarquee from './ui/TechLogoMarquee';
import { ParallaxLayer } from './ui/MotionPrimitives';
import { useTheme } from '../hooks/useTheme';
import { STUDIO_EASE } from '../lib/motion';

function ScrollShowcaseBand({ isEn }) {
  const runwayRef = useRef(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ['start start', 'end end']
  });

  const headingY = useTransform(scrollYProgress, [0, 0.55], [0, -28]);
  const headingScale = useTransform(scrollYProgress, [0, 0.55], [1, 0.94]);

  const centerScale = useTransform(scrollYProgress, [0, 0.45, 1], [0.86, 1.02, 1]);
  const centerY = useTransform(scrollYProgress, [0, 0.5, 1], [32, 0, -10]);

  const leftX = useTransform(scrollYProgress, [0.05, 0.65], ['0%', '-50%']);
  const leftRotateY = useTransform(scrollYProgress, [0.05, 0.65], [0, 14]);
  const leftScale = useTransform(scrollYProgress, [0.05, 0.65], [0.72, 0.84]);
  const leftOpacity = useTransform(scrollYProgress, [0, 0.25, 0.7], [0, 0.6, 0.98]);

  const rightX = useTransform(scrollYProgress, [0.05, 0.65], ['0%', '50%']);
  const rightRotateY = useTransform(scrollYProgress, [0.05, 0.65], [0, -14]);
  const rightScale = useTransform(scrollYProgress, [0.05, 0.65], [0.72, 0.84]);
  const rightOpacity = useTransform(scrollYProgress, [0, 0.25, 0.7], [0, 0.6, 0.98]);

  const captionsOpacity = useTransform(scrollYProgress, [0.35, 0.72], [0, 1]);
  const captionsY = useTransform(scrollYProgress, [0.35, 0.72], [20, 0]);

  return (
    <div ref={runwayRef} className="relative h-[155vh] sm:h-[180vh] border-b border-line">
      <div className="sticky top-0 h-[100svh] flex flex-col justify-center items-center px-5 sm:px-6 overflow-x-clip">
        {/* Ambient ceramic daylight studio halo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[780px] h-[440px] rounded-full blur-3xl opacity-75 dark:opacity-25"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(56,189,248,0.18) 0%, rgba(37,99,235,0.08) 52%, transparent 76%)'
          }}
        />

        <div className="relative z-10 max-w-6xl w-full mx-auto flex flex-col items-center">
          {/* Giant Minimalist Apple-Grade Statement */}
          <motion.div
            style={prefersReduced ? undefined : { y: headingY, scale: headingScale }}
            className="text-center max-w-3xl mb-6 sm:mb-10"
          >
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent font-semibold mb-3">
              {isEn ? 'Built End-to-End' : 'Satu Alur Pengerjaan'}
            </p>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-[3.75rem] font-semibold tracking-[-0.035em] leading-[1.04] text-ink">
              {isEn ? (
                <>
                  One Unified Flow.{' '}
                  <span className="font-serif italic font-normal text-accent">Zero Gaps.</span>
                </>
              ) : (
                <>
                  Satu Alur Terpadu.{' '}
                  <span className="font-serif italic font-normal text-accent">Siap Dipakai.</span>
                </>
              )}
            </h2>
          </motion.div>

          {/* Sticky Fan-Out 3-Product Showcase Stage */}
          <div
            className="relative w-full h-[210px] sm:h-[340px] lg:h-[400px] flex items-center justify-center"
            style={{ perspective: '1500px' }}
          >
            {/* Left emerging frame */}
            <motion.div
              style={
                prefersReduced
                  ? { x: '-48%', scale: 0.84, rotateY: 12 }
                  : {
                      x: leftX,
                      rotateY: leftRotateY,
                      scale: leftScale,
                      opacity: leftOpacity
                    }
              }
              className="hidden sm:block absolute w-[56%] max-w-[580px] aspect-video rounded-2xl p-1.5 bg-white/95 dark:bg-slate-900 ring-1 ring-slate-200/90 dark:ring-white/15 shadow-2xl overflow-hidden z-10"
            >
              <img
                src="/img/banners/mpp.webp"
                alt="Portal Web Instansi MPP Digital"
                width={1024}
                height={576}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center rounded-xl"
              />
            </motion.div>

            {/* Right emerging frame */}
            <motion.div
              style={
                prefersReduced
                  ? { x: '48%', scale: 0.84, rotateY: -12 }
                  : {
                      x: rightX,
                      rotateY: rightRotateY,
                      scale: rightScale,
                      opacity: rightOpacity
                    }
              }
              className="hidden sm:block absolute w-[56%] max-w-[580px] aspect-video rounded-2xl p-1.5 bg-white/95 dark:bg-slate-900 ring-1 ring-slate-200/90 dark:ring-white/15 shadow-2xl overflow-hidden z-10"
            >
              <img
                src="/img/banners/peka.webp"
                alt="Integrasi AI PEKA"
                width={1024}
                height={576}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center rounded-xl"
              />
            </motion.div>

            {/* Center Zooming Hero Display */}
            <motion.div
              style={prefersReduced ? undefined : { scale: centerScale, y: centerY }}
              className="relative z-20 w-[94%] sm:w-[64%] max-w-[660px] aspect-video rounded-2xl p-1.5 sm:p-2 bg-white/95 dark:bg-slate-900 ring-1 ring-slate-200/90 dark:ring-white/20 shadow-[0_32px_70px_-16px_rgba(37,99,235,0.25),0_16px_38px_-14px_rgba(15,23,42,0.18)] overflow-hidden"
            >
              <img
                src="/img/banners/bosdepot.webp"
                alt="Aplikasi Kasir & Gudang BosDepot"
                width={1024}
                height={576}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center rounded-xl"
              />
            </motion.div>
          </div>

          {/* Crisp 3-Pillar Captions appearing once stage unfolds */}
          <motion.div
            style={prefersReduced ? undefined : { opacity: captionsOpacity, y: captionsY }}
            className="grid grid-cols-3 gap-4 sm:gap-10 max-w-3xl w-full text-center pt-6 sm:pt-8"
          >
            <div>
              <p className="font-display text-sm sm:text-lg font-semibold text-ink">
                {isEn ? 'Web & Portals' : 'Web & Sistem'}
              </p>
              <p className="text-[11px] sm:text-xs text-ink-muted">
                {isEn ? 'Institutions & SMEs' : 'Instansi & UMKM'}
              </p>
            </div>
            <div>
              <p className="font-display text-sm sm:text-lg font-semibold text-accent">
                {isEn ? 'Mobile POS & GPS' : 'Android & Alat Toko'}
              </p>
              <p className="text-[11px] sm:text-xs text-ink-muted">
                {isEn ? 'Barcode & Receipt Ready' : 'Printer, Barcode & GPS'}
              </p>
            </div>
            <div>
              <p className="font-display text-sm sm:text-lg font-semibold text-ink">
                {isEn ? 'Applied AI' : 'Otomatisasi AI'}
              </p>
              <p className="text-[11px] sm:text-xs text-ink-muted">
                {isEn ? 'Smart Workflow' : 'Cepat & Rapi'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const VIEWER_BANNERS = [
  { src: '/img/banners/mpp.webp', alt: 'Tampilan Web & Portal Rapi — MPP Digital' },
  { src: '/img/banners/simppk.webp', alt: 'Dashboard Hak Akses & Laporan — SimPPK' },
  { src: '/img/banners/bosdepot.webp', alt: 'Aplikasi Kasir Android & Alat — BosDepot' },
  { src: '/img/banners/chattask.webp', alt: 'Otomatisasi AI & Online — ChatTask' }
];

const SERVICE_BANNERS = ['/img/banners/mpp.webp', '/img/banners/bosdepot.webp', '/img/banners/chattask.webp'];
const SERVICE_ICONS = [Monitor, Smartphone, Sparkles];

export default function Capabilities() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const prefersReduced = useReducedMotion();

  const pillars = t('capabilities.pillars', { returnObjects: true }) || [];
  const serviceItems = t('services.items', { returnObjects: true }) || [];
  const isEn = i18n.language === 'en';
  const isDark = theme === 'dark';
  const currentBanner = VIEWER_BANNERS[activeStep] || VIEWER_BANNERS[0];

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="capabilities"
      className="relative bg-[#F3F6FB] dark:bg-[#080B12] text-ink border-b border-line overflow-x-clip"
    >
      {/* Band 1: Apple-Style Pinned Sticky Scroll Showcase Stage */}
      <ScrollShowcaseBand isEn={isEn} />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 py-20 sm:py-28 space-y-28">
        {/* Band 2: Apple Interactive (+) Pill Viewer + Large Real Product Visual */}
        <div className="space-y-12">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.14em] font-semibold text-accent mb-3">
              {isEn ? 'Craft & Capabilities' : 'Detail Pengerjaan'}
            </p>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-[3.25rem] font-semibold tracking-[-0.035em] leading-[1.06] text-ink">
              {isEn ? (
                <>
                  Built cleanly down to{' '}
                  <span className="font-serif italic font-normal text-accent">every feature.</span>
                </>
              ) : (
                <>
                  Dibangun rapi sampai{' '}
                  <span className="font-serif italic font-normal text-accent">detail terkecil.</span>
                </>
              )}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Apple-style Expandable Pills */}
            <div
              className="lg:col-span-5 space-y-3"
              role="tablist"
              aria-label="Detail pengerjaan sistem"
            >
              {Array.isArray(pillars) &&
                pillars.map((item, idx) => {
                  const isSelected = idx === activeStep;
                  return (
                    <div
                      key={item.step}
                      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                        isSelected
                          ? 'bg-white dark:bg-[#111522] border-accent/40 shadow-[0_14px_34px_-14px_rgba(37,99,235,0.16)]'
                          : 'bg-white/75 dark:bg-white/[0.04] border-line hover:bg-white dark:hover:bg-white/[0.07]'
                      }`}
                    >
                      <button
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        onClick={() => setActiveStep(idx)}
                        className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left"
                      >
                        <span className="font-display text-base sm:text-lg font-semibold text-ink">
                          {item.title}
                        </span>
                        <span
                          className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-accent text-white border-accent'
                              : 'border-line text-ink-muted'
                          }`}
                          aria-hidden="true"
                        >
                          {isSelected ? <Minus size={14} /> : <Plus size={14} />}
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isSelected && (
                          <motion.div
                            initial={prefersReduced ? false : { height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={prefersReduced ? undefined : { height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: STUDIO_EASE }}
                            className="overflow-hidden"
                          >
                            <p className="px-5 pb-5 text-sm sm:text-base text-ink-muted leading-relaxed">
                              {item.desc}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
            </div>

            {/* Right Clean Large Real Product Viewport (No fake small divs!) */}
            <ParallaxLayer yRange={[28, -28]} className="lg:col-span-7">
              <div className="rounded-3xl bg-white dark:bg-[#0D1017] p-2 sm:p-3 border border-slate-200/90 dark:border-white/15 shadow-[0_30px_70px_-18px_rgba(37,99,235,0.18),0_12px_30px_-12px_rgba(15,23,42,0.1)]">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentBanner.src}
                      src={currentBanner.src}
                      alt={currentBanner.alt}
                      width={1024}
                      height={576}
                      initial={prefersReduced ? false : { opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={prefersReduced ? undefined : { opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3, ease: STUDIO_EASE }}
                      className="w-full h-full object-cover object-center"
                    />
                  </AnimatePresence>
                </div>
              </div>
            </ParallaxLayer>
          </div>
        </div>

        {/* Band 3 (#services): Apple Accessories-Style Triptych + Open 3-Column Spec Pillars */}
        <div id="services" className="scroll-mt-24 pt-16 border-t border-line space-y-14">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <p className="font-mono text-xs uppercase tracking-[0.14em] font-semibold text-accent">
              {isEn ? '02 / Services' : '02 / Layanan Custom'}
            </p>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-[3.5rem] font-semibold tracking-[-0.035em] leading-[1.06] text-ink">
              {isEn ? (
                <>
                  Pick What Fits{' '}
                  <span className="font-serif italic font-normal text-accent">Your Business.</span>
                </>
              ) : (
                <>
                  Pilih Solusi{' '}
                  <span className="font-serif italic font-normal text-accent">Sesuai Bisnis Anda.</span>
                </>
              )}
            </h2>
            <p className="text-base sm:text-lg text-ink-muted leading-relaxed">
              {t('services.subheading')}
            </p>
          </div>

          {/* 3-Screen Real Product Triptych at Staggered Parallax Heights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-center">
            {SERVICE_BANNERS.map((imgSrc, idx) => (
              <ParallaxLayer
                key={imgSrc}
                yRange={idx === 1 ? [36, -36] : [18, -18]}
                className="rounded-2xl bg-white dark:bg-[#0D1017] p-2 border border-slate-200/90 dark:border-white/15 shadow-[0_22px_50px_-16px_rgba(37,99,235,0.14)]"
              >
                <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <img
                    src={imgSrc}
                    alt={`Contoh sistem layanan ${idx + 1}`}
                    width={1024}
                    height={576}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-[1.03]"
                  />
                </div>
              </ParallaxLayer>
            ))}
          </div>

          {/* Open Architectural 3-Column Specs (Clean Typography, Zero Boxed SaaS Clutter) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 pt-6 border-t border-line">
            {Array.isArray(serviceItems) &&
              serviceItems.map((service, idx) => {
                const Icon = SERVICE_ICONS[idx % SERVICE_ICONS.length];
                return (
                  <div key={service.id} className="flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="w-10 h-10 rounded-full bg-white dark:bg-white/10 border border-line flex items-center justify-center text-accent shadow-sm">
                          <Icon size={18} aria-hidden="true" />
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-muted">
                          <Clock size={12} className="text-accent" aria-hidden="true" />
                          <span>{service.timeline}</span>
                        </span>
                      </div>

                      <h3 className="font-display text-2xl font-semibold text-ink tracking-tight">
                        {service.title}
                      </h3>

                      <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                        {service.desc}
                      </p>

                      <ul className="space-y-2.5 pt-4 border-t border-line">
                        {Array.isArray(service.deliverables) &&
                          service.deliverables.map((line) => (
                            <li key={line} className="flex items-start gap-2.5 text-sm text-ink-muted">
                              <Check
                                size={15}
                                className="text-accent shrink-0 mt-0.5"
                                aria-hidden="true"
                              />
                              <span>{line}</span>
                            </li>
                          ))}
                      </ul>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={scrollToContact}
                        className="group inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
                      >
                        <span>{t('services.book_cta')}</span>
                        <ArrowRight
                          size={15}
                          className="transition-transform duration-200 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Stack Strip */}
        <div className="pt-10 border-t border-line">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
              {t('capabilities.stack_eyebrow')}
            </span>
            <span className="font-mono text-xs text-ink-muted">Web · Mobile · AI · DevOps</span>
          </div>
          <TechLogoMarquee darkSurface={isDark} />
        </div>
      </div>
    </section>
  );
}
