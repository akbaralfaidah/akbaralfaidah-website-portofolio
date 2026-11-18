import { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Plus,
  ChevronUp,
  ChevronDown,
  Play,
  Pause,
  Monitor,
  Smartphone,
  Sparkles,
  ArrowRight,
  Clock,
  Check,
} from "lucide-react";
import TechLogoMarquee from "./ui/TechLogoMarquee";
import { ParallaxLayer } from "./ui/MotionPrimitives";
import { useTheme } from "../hooks/useTheme";
import { STUDIO_EASE } from "../lib/motion";

const SPRING_SMOOTH = { stiffness: 110, damping: 24, restDelta: 0.0005 };

const HIGHLIGHT_SLIDES = [
  {
    src: "/img/banners/mpp.webp",
    alt: "Portal Web & Layanan Publik MPP Digital",
    tagId: "Web & Sistem",
    tagEn: "Web & Portals",
    titleId:
      "Portal web & sistem informasi cepat yang nyaman dipakai di HP maupun laptop.",
    titleEn:
      "Fast web portals & operational dashboards built cleanly for every screen.",
  },
  {
    src: "/img/banners/bosdepot.webp",
    alt: "Aplikasi Kasir & Gudang BosDepot",
    tagId: "Android & Alat Toko",
    tagEn: "Mobile & Hardware",
    titleId:
      "Aplikasi kasir & stok gudang offline yang langsung terhubung ke barcode, printer, & GPS.",
    titleEn:
      "Offline-resilient POS & inventory apps synced cleanly to barcode scanners, printers & GPS.",
  },
  {
    src: "/img/banners/chattask.webp",
    alt: "Integrasi AI & Ekstraksi Chat ChatTask",
    tagId: "Integrasi AI",
    tagEn: "Applied AI",
    titleId:
      "Fitur AI praktis yang merangkum pesan masuk menjadi daftar tugas terstruktur otomatis.",
    titleEn:
      "Practical AI workflows turning raw customer chats into structured actionable tasks.",
  },
  {
    src: "/img/banners/simppk.webp",
    alt: "Dashboard Hak Akses & Laporan SimPPK",
    tagId: "Siap Produksi",
    tagEn: "Production Ready",
    titleId:
      "Arsitektur lengkap dari database hak akses hingga server HTTPS yang stabil 24/7.",
    titleEn:
      "End-to-end engineering from granular permissions to rock-solid HTTPS deployment.",
  },
];

const VIEWER_BANNERS = [
  {
    src: "/img/banners/mpp.webp",
    tag: "UI / UX",
    alt: "Tampilan Web & Portal Rapi - MPP Digital",
  },
  {
    src: "/img/banners/simppk.webp",
    tag: "Full-Stack DB",
    alt: "Dashboard Hak Akses & Laporan - SimPPK",
  },
  {
    src: "/img/banners/bosdepot.webp",
    tag: "Android & POS",
    alt: "Aplikasi Kasir Android & Alat - BosDepot",
  },
  {
    src: "/img/banners/chattask.webp",
    tag: "AI & Cloud",
    alt: "Otomatisasi AI & Online - ChatTask",
  },
];

const SERVICE_BANNERS = [
  "/img/banners/mpp.webp",
  "/img/banners/bosdepot.webp",
  "/img/banners/chattask.webp",
];
const SERVICE_ICONS = [Monitor, Smartphone, Sparkles];

function scrollToSectionId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(el, { offset: -72, duration: 1.15 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

/**
 * Band 1: Apple "Keunggulan demi keunggulan." wide peek story carousel with
 * smooth spring slide translation and Apple's floating Play/Pause + Dot pill bar.
 */
function AppleHighlightsBand({ isEn, prefersReduced }) {
  const sectionRef = useRef(null);
  const firstCardRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const [stepPx, setStepPx] = useState(920);

  useEffect(() => {
    const updateStep = () => {
      if (firstCardRef.current) {
        setStepPx(firstCardRef.current.offsetWidth + 24);
      }
    };
    updateStep();

    let ro;
    if (typeof ResizeObserver !== "undefined" && firstCardRef.current) {
      ro = new ResizeObserver(updateStep);
      ro.observe(firstCardRef.current);
    } else {
      window.addEventListener("resize", updateStep);
    }

    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", updateStep);
    };
  }, []);

  useEffect(() => {
    if (!sectionRef.current || typeof IntersectionObserver === "undefined")
      return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setIsInView(Boolean(entry?.isIntersecting)),
      { threshold: 0.25 },
    );
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!isPlaying || !isInView || prefersReduced) return undefined;
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HIGHLIGHT_SLIDES.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [isPlaying, isInView, prefersReduced]);

  return (
    <div
      ref={sectionRef}
      className="pt-20 sm:pt-28 pb-16 sm:pb-24 overflow-x-clip"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
        <h2 className="font-display text-3xl sm:text-5xl lg:text-[3.5rem] font-semibold tracking-[-0.035em] leading-[1.06] text-ink">
          {isEn
            ? "Highlights across every build."
            : "Keunggulan demi keunggulan."}
        </h2>
        <button
          type="button"
          onClick={() => scrollToSectionId("projects")}
          className="inline-flex items-center gap-1.5 text-sm sm:text-base font-medium text-[#0066CC] dark:text-accent hover:underline self-start sm:self-auto"
        >
          <span>
            {isEn ? "Explore shipped works" : "Lihat karya terpasang"}
          </span>
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>

      {/* Carousel Container aligned to max-w-6xl so adjacent card peeks cleanly right */}
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <motion.div
          animate={{ x: -(activeSlide * stepPx) }}
          transition={
            prefersReduced
              ? { duration: 0 }
              : { type: "spring", stiffness: 140, damping: 24, mass: 0.9 }
          }
          className="flex items-stretch gap-6 will-change-transform"
        >
          {HIGHLIGHT_SLIDES.map((slide, idx) => {
            const isCurrent = idx === activeSlide;
            return (
              <div
                key={slide.src}
                ref={idx === 0 ? firstCardRef : undefined}
                onClick={() => {
                  if (!isCurrent) {
                    setActiveSlide(idx);
                    setIsPlaying(false);
                  }
                }}
                className={`w-[88vw] sm:w-[82vw] md:w-[86%] max-w-[980px] shrink-0 rounded-[28px] sm:rounded-[34px] bg-white dark:bg-[#111522] border shadow-[0_24px_60px_-24px_rgba(15,23,42,0.08)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center transition-all duration-300 ${
                  isCurrent
                    ? "border-black/[0.08] dark:border-white/15"
                    : "border-black/[0.04] dark:border-white/[0.06] hover:border-black/15 cursor-pointer"
                }`}
              >
                <div className="lg:col-span-5 p-7 sm:p-11 flex flex-col justify-between gap-6">
                  <span className="inline-flex w-fit px-3 py-1 rounded-full bg-[#F5F5F7] dark:bg-white/[0.08] font-mono text-[11px] font-semibold text-ink-muted uppercase tracking-[0.08em]">
                    {isEn ? slide.tagEn : slide.tagId}
                  </span>
                  <p className="font-display text-xl sm:text-2xl lg:text-[1.7rem] font-semibold tracking-[-0.025em] leading-[1.22] text-ink">
                    {isEn ? slide.titleEn : slide.titleId}
                  </p>
                </div>

                <div className="lg:col-span-7 p-4 sm:p-6 bg-[#F8FAFC] dark:bg-white/[0.03] h-full flex items-center justify-center">
                  <div className="w-full aspect-video rounded-2xl overflow-hidden bg-white dark:bg-[#0D1017] shadow-sm border border-black/[0.05] dark:border-white/10">
                    <img
                      src={slide.src}
                      alt={slide.alt}
                      width={1024}
                      height={576}
                      loading={idx === 0 ? "eager" : "lazy"}
                      decoding="async"
                      className={`w-full h-full object-cover object-center transition-opacity duration-300 ${
                        isCurrent ? "opacity-100" : "opacity-85"
                      }`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Apple Floating Control Pill Bar */}
      <div className="mt-8 flex items-center justify-center gap-3 px-5">
        <button
          type="button"
          onClick={() => setIsPlaying((prev) => !prev)}
          aria-label={
            isPlaying ? "Pause highlight slides" : "Play highlight slides"
          }
          className="w-11 h-11 rounded-full bg-white dark:bg-[#161B26] border border-black/[0.08] dark:border-white/15 shadow-sm flex items-center justify-center text-ink hover:scale-105 transition-transform"
        >
          {isPlaying ? (
            <Pause size={15} aria-hidden="true" />
          ) : (
            <Play size={15} className="translate-x-[1px]" aria-hidden="true" />
          )}
        </button>

        <div
          role="group"
          aria-label="Highlight slides"
          className="rounded-full bg-white dark:bg-[#161B26] border border-black/[0.08] dark:border-white/15 shadow-sm px-4 py-3.5 flex items-center gap-2.5"
        >
          {HIGHLIGHT_SLIDES.map((slide, idx) => {
            const active = idx === activeSlide;
            return (
              <button
                key={slide.src}
                type="button"
                aria-pressed={active}
                aria-label={`Slide ${idx + 1}: ${isEn ? slide.tagEn : slide.tagId}`}
                onClick={() => {
                  setActiveSlide(idx);
                  setIsPlaying(false);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  active
                    ? "w-7 bg-ink dark:bg-white"
                    : "w-2 bg-ink/25 dark:bg-white/30 hover:bg-ink/45"
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Band 3 top: Silky spring-smoothed pinned zoom showcase highlighting the single
 * flagship platform scaling smoothly into view as you scroll down to Services.
 */
function PinnedZoomStage({ isEn, prefersReduced }) {
  const runwayRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start 85%", "end 20%"],
  });
  const smoothProgress = useSpring(scrollYProgress, SPRING_SMOOTH);

  const stageScale = useTransform(
    smoothProgress,
    [0, 0.48, 1],
    [0.8, 1.03, 0.94],
  );
  const stageY = useTransform(smoothProgress, [0, 0.48, 1], [64, 0, -38]);
  const headingY = useTransform(smoothProgress, [0, 0.48], [42, -24]);
  const captionsOpacity = useTransform(
    smoothProgress,
    [0.08, 0.3, 1],
    [0, 1, 1],
  );

  return (
    <div
      ref={runwayRef}
      className="relative h-[135vh] sm:h-[150vh] border-t border-black/[0.08] dark:border-white/10"
    >
      <div className="sticky top-0 h-[100svh] flex flex-col justify-center items-center px-5 sm:px-6 overflow-x-clip">
        <div className="max-w-5xl w-full mx-auto flex flex-col items-center">
          <motion.div
            style={prefersReduced ? undefined : { y: headingY }}
            className="text-center max-w-3xl mb-6 sm:mb-9"
          >
            <p className="text-sm font-semibold text-accent mb-2">
              {isEn ? "Unified Architecture" : "Arsitektur Terpadu"}
            </p>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-[3.75rem] font-semibold tracking-[-0.04em] leading-[1.04] text-ink">
              {isEn
                ? "Built for scale. Tuned for daily use."
                : "Satu alur kerja. Tanpa hambatan."}
            </h2>
          </motion.div>

          <motion.div
            style={
              prefersReduced ? undefined : { scale: stageScale, y: stageY }
            }
            className="w-full max-w-[780px] aspect-video rounded-[24px] sm:rounded-[30px] p-2 sm:p-2.5 liquid-glass overflow-hidden will-change-transform"
          >
            <img
              src="/img/banners/bosdepot.webp"
              alt="Sistem Operasional & Kasir Terpadu BosDepot"
              width={1024}
              height={576}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center rounded-[18px] sm:rounded-[22px]"
            />
          </motion.div>

          <motion.div
            style={prefersReduced ? undefined : { opacity: captionsOpacity }}
            className="mt-7 sm:mt-9 grid grid-cols-3 gap-4 sm:gap-10 max-w-2xl w-full text-center"
          >
            <div>
              <p className="font-display text-sm sm:text-lg font-semibold text-ink">
                {isEn ? "Web & Portals" : "Web & Sistem"}
              </p>
              <p className="text-[11px] sm:text-xs text-ink-muted">
                {isEn ? "Institutions & SMEs" : "Instansi & UMKM"}
              </p>
            </div>
            <div>
              <p className="font-display text-sm sm:text-lg font-semibold text-accent">
                {isEn ? "Mobile POS & GPS" : "Android & Alat Toko"}
              </p>
              <p className="text-[11px] sm:text-xs text-ink-muted">
                {isEn ? "Barcode & Receipt" : "Printer, Barcode & GPS"}
              </p>
            </div>
            <div>
              <p className="font-display text-sm sm:text-lg font-semibold text-ink">
                {isEn ? "Applied AI" : "Otomatisasi AI"}
              </p>
              <p className="text-[11px] sm:text-xs text-ink-muted">
                {isEn ? "Structured Workflow" : "Cepat & Rapi"}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function Capabilities() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const prefersReduced = useReducedMotion();

  const rawPillars = t("capabilities.pillars", { returnObjects: true }) || [];
  const pillars = Array.isArray(rawPillars) ? rawPillars : [];
  const rawServiceItems = t("services.items", { returnObjects: true }) || [];
  const serviceItems = Array.isArray(rawServiceItems) ? rawServiceItems : [];
  const isEn = i18n.language === "en";
  const isDark = theme === "dark";
  const currentBanner = VIEWER_BANNERS[activeStep] || VIEWER_BANNERS[0];

  const handlePrevStep = () => {
    if (!pillars.length) return;
    setActiveStep((prev) => (prev - 1 + pillars.length) % pillars.length);
  };

  const handleNextStep = () => {
    if (!pillars.length) return;
    setActiveStep((prev) => (prev + 1) % pillars.length);
  };

  return (
    <section
      id="capabilities"
      className="relative bg-[#F5F5F7] dark:bg-[#080B12] text-ink border-b border-line overflow-x-clip"
    >
      {/* Band 1: Apple Highlights Horizontal Peek Carousel */}
      <AppleHighlightsBand isEn={isEn} prefersReduced={prefersReduced} />

      {/* Band 2: Apple Interactive (+) Capsule Pill Product-Viewer Canvas */}
      <div className="max-w-6xl mx-auto px-5 sm:px-6 pt-8 pb-20 sm:pb-28 space-y-10 sm:space-y-12">
        <div>
          <p className="text-sm sm:text-base font-semibold text-ink-muted mb-2">
            {isEn ? "Design & Architecture" : "Desain & Kualitas"}
          </p>
          <h2 className="font-display text-4xl sm:text-6xl lg:text-[4rem] font-semibold tracking-[-0.04em] leading-[1.03] text-ink">
            {isEn ? (
              <>
                One clean build.
                <br />
                Polished end to end.
              </>
            ) : (
              <>
                Karya terpadu.
                <br />
                Rapi sampai detail terkecil.
              </>
            )}
          </h2>
        </div>

        {/* Single Unified Rounded Cinema Viewer Canvas (matching Apple Product Viewer) */}
        <ParallaxLayer yRange={[54, -54]} scaleRange={[0.95, 1.02]}>
          <div className="relative rounded-[28px] sm:rounded-[36px] liquid-glass overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center min-h-[500px] lg:min-h-[580px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-28 -right-24 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.12),transparent_68%)]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 left-12 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.1),transparent_68%)]"
            />
            {/* Left Compact Apple Capsule (+) Pills + Up/Down Steppers */}
            <div className="lg:col-span-5 p-6 sm:p-10 lg:pl-11 flex items-center gap-3.5 sm:gap-5 relative z-20">
              <div className="hidden sm:flex flex-col items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  aria-label={isEn ? "Previous capability" : "Detail sebelumnya"}
                  className="w-9 h-9 rounded-full liquid-glass-pill hover:border-accent/45 text-ink flex items-center justify-center transition-all"
                >
                <ChevronUp size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                aria-label={isEn ? "Next capability" : "Detail berikutnya"}
                className="w-9 h-9 rounded-full bg-[#F5F5F7] dark:bg-white/[0.08] hover:bg-[#E8E8ED] dark:hover:bg-white/[0.15] text-ink flex items-center justify-center transition-colors"
              >
                <ChevronDown size={16} aria-hidden="true" />
              </button>
            </div>

            <div
              className="flex flex-col items-start gap-2.5 flex-1"
              role="region"
              aria-label="Detail pengerjaan sistem"
            >
              {pillars.map((item, idx) => {
                const isSelected = idx === activeStep;
                const panelId = `capability-detail-${item.step}`;
                if (isSelected) {
                  return (
                    <motion.div
                      key={item.step}
                      id={panelId}
                      layout={prefersReduced ? false : "position"}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 28,
                      }}
                      className="w-full max-w-[340px] rounded-[24px] bg-[#F5F5F7] dark:bg-white/[0.1] p-5 text-left"
                    >
                      <p className="text-sm sm:text-[15px] leading-relaxed text-ink-muted">
                        <strong className="font-semibold text-ink">
                          {item.title}.{" "}
                        </strong>
                        {item.desc}
                      </p>
                    </motion.div>
                  );
                }

                return (
                  <motion.button
                    key={item.step}
                    layout={prefersReduced ? false : "position"}
                    type="button"
                    aria-expanded={false}
                    aria-controls={panelId}
                    onClick={() => setActiveStep(idx)}
                    className="w-fit max-w-full rounded-full bg-[#F5F5F7] dark:bg-white/[0.08] hover:bg-[#EAEAF0] dark:hover:bg-white/[0.14] px-4 py-2.5 inline-flex items-center gap-2.5 text-left transition-colors"
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-ink/25 dark:border-white/30 flex items-center justify-center shrink-0 text-ink"
                      aria-hidden="true"
                    >
                      <Plus size={12} />
                    </span>
                    <span className="font-display text-sm font-semibold text-ink truncate">
                      {item.title}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Right Integrated Showcase Stage with Simultaneous Overlapping Crossfade */}
          <div className="lg:col-span-7 relative h-[280px] sm:h-[420px] lg:h-[580px] w-full flex items-center justify-center px-5 pt-5 pb-12 sm:p-8 lg:p-10 bg-gradient-to-br from-[#F8FAFC] via-[#EEF3FB] to-[#E6EEFB] dark:from-[#0C101A] dark:to-[#131B2E] overflow-hidden">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-[0_24px_55px_-18px_rgba(15,23,42,0.18)] bg-white dark:bg-[#0D1017]">
              <AnimatePresence initial={false}>
                <motion.img
                  key={currentBanner.src}
                  src={currentBanner.src}
                  alt={currentBanner.alt}
                  width={1024}
                  height={576}
                  initial={prefersReduced ? false : { opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={prefersReduced ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.42, ease: STUDIO_EASE }}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </AnimatePresence>
            </div>

            <div className="absolute bottom-4 right-5 px-3 py-1 rounded-full liquid-glass-pill font-mono text-[11px] font-medium text-ink">
              0{activeStep + 1} / 0{pillars.length || 4} · {currentBanner.tag}
            </div>
          </div>
          </div>
        </ParallaxLayer>
      </div>

      {/* Band 3A: Sticky Spring Scroll Zoom Stage */}
      <PinnedZoomStage isEn={isEn} prefersReduced={prefersReduced} />

      {/* Band 3B (#services): Apple Accessories Triptych + Open 3-Column Spec Pillars */}
      <div className="max-w-6xl mx-auto px-5 sm:px-6 pb-20 sm:pb-28 space-y-20">
        <div
          id="services"
          className="scroll-mt-24 pt-16 sm:pt-24 border-t border-black/[0.08] dark:border-white/10 space-y-14"
        >
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <p className="text-sm font-semibold text-accent">
              {isEn ? "02 / Custom Services" : "02 / Layanan Custom"}
            </p>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-[3.75rem] font-semibold tracking-[-0.04em] leading-[1.04] text-ink">
              {isEn
                ? "Pick what fits your business."
                : "Pilih Solusi Sesuai Bisnis Anda."}
            </h2>
            <p className="text-base sm:text-lg text-ink-muted leading-relaxed">
              {t("services.subheading")}
            </p>
          </div>

          {/* 3-Screen Clean Product Triptych */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-center">
            {SERVICE_BANNERS.map((imgSrc, idx) => (
              <ParallaxLayer
                key={imgSrc}
                yRange={
                  idx === 1 ? [76, -76] : idx === 0 ? [36, -36] : [56, -18]
                }
                scaleRange={[0.95, 1.03]}
                rotateRange={
                  idx === 0 ? [-1.5, 0.5] : idx === 2 ? [1.5, -0.5] : [0, 0]
                }
                className="rounded-[24px] liquid-glass p-2"
              >
                <div className="aspect-video rounded-[18px] overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <img
                    src={imgSrc}
                    alt={`Contoh sistem layanan ${idx + 1}`}
                    width={1024}
                    height={576}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </ParallaxLayer>
            ))}
          </div>

          {/* Open Architectural 3-Column Spec Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pt-4">
            {serviceItems.map((svc, idx) => {
              const Icon = SERVICE_ICONS[idx % SERVICE_ICONS.length];
              return (
                <ParallaxLayer
                  key={svc.title}
                  yRange={idx === 1 ? [44, -44] : [18, -18]}
                  className="liquid-glass rounded-3xl p-6 sm:p-7 flex flex-col"
                >
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="w-11 h-11 rounded-xl liquid-glass-pill text-ink flex items-center justify-center">
                      <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                    </div>
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-muted">
                      <Clock size={12} aria-hidden="true" />
                      {svc.timeline}
                    </span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-[-0.025em] text-ink">
                    {svc.title}
                  </h3>

                  <div className="w-full h-px bg-black/[0.09] dark:bg-white/10 my-4" />

                  <p className="text-sm sm:text-base text-ink-muted leading-relaxed mb-6">
                    {svc.desc}
                  </p>

                  {Array.isArray(svc.deliverables) && (
                    <ul className="space-y-2.5 mb-8 flex-1">
                      {svc.deliverables.map((feat) => (
                        <li
                          key={feat}
                          className="flex items-start gap-2.5 text-sm text-ink-muted leading-snug"
                        >
                          <Check
                            size={15}
                            className="text-accent shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => scrollToSectionId("contact")}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white px-5 py-2.5 text-sm font-medium shadow-sm transition-colors"
                    >
                      <span>{t("services.book_cta")}</span>
                      <ArrowRight size={15} aria-hidden="true" />
                    </button>
                  </div>
                </ParallaxLayer>
              );
            })}
          </div>
        </div>

        {/* Clean Stack Marquee */}
        <div className="pt-6 border-t border-black/[0.08] dark:border-white/10">
          <TechLogoMarquee
            isDark={isDark}
            label={
              isEn
                ? "Trusted stack shipped into production"
                : "Teknologi andalan yang dipakai di proyek"
            }
          />
        </div>
      </div>
    </section>
  );
}
