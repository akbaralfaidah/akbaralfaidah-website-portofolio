import { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  Check,
  Sparkles
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fetchProjects } from '../data/projects';
import { Button } from './ui/Button';
import { FadeUp, ParallaxLayer, ParallaxWatermark } from './ui/MotionPrimitives';
import { STUDIO_EASE } from '../lib/motion';

const FILTER_CATEGORIES = ['All', 'Website', 'Mobile Apps', 'Machine Learning'];

function TiltCenterCard({ project, isEn, ctaLabel, onDragPrev, onDragNext }) {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const pointerDownPos = useRef({ x: 0, y: 0 });

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const smoothX = useSpring(mx, { stiffness: 280, damping: 24 });
  const smoothY = useSpring(my, { stiffness: 280, damping: 24 });

  const rotateY = useTransform(smoothX, [0, 1], [-8, 8]);
  const rotateX = useTransform(smoothY, [0, 1], [6, -6]);
  const gleamBg = useTransform(
    [smoothX, smoothY],
    ([x, y]) =>
      `radial-gradient(520px circle at ${(x * 100).toFixed(1)}% ${(y * 100).toFixed(
        1
      )}%, rgba(255,255,255,0.22), transparent 55%)`
  );

  const handlePointerMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    mx.set(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
    my.set(Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)));
  };

  const handlePointerLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={(e) => {
        pointerDownPos.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={(e) => {
        const dx = e.clientX - pointerDownPos.current.x;
        const dy = e.clientY - pointerDownPos.current.y;
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) {
          if (dx < 0) onDragNext();
          else onDragPrev();
          return;
        }
        if (Math.hypot(dx, dy) < 8) {
          navigate(`/project/${project.slug}`);
        }
      }}
      style={{ rotateX, rotateY, transformPerspective: 1200, transformStyle: 'preserve-3d' }}
      whileHover={{ scale: 1.018 }}
      transition={{ duration: 0.25, ease: STUDIO_EASE }}
      data-cursor={isEn ? 'Open Case ↗' : `${ctaLabel} ↗`}
      className="group relative w-full aspect-video rounded-2xl p-1.5 sm:p-2 liquid-glass shadow-[0_32px_70px_-16px_rgba(37,99,235,0.22),0_16px_36px_-14px_rgba(15,23,42,0.14)] cursor-pointer select-none overflow-hidden"
    >
      <div className="relative w-full h-full rounded-xl overflow-hidden bg-white dark:bg-slate-950">
        <img
          src={project.src}
          alt={`${project.name} showcase`}
          width={1920}
          height={1080}
          loading="eager"
          decoding="async"
          draggable={false}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
        />

        {/* Cursor-tracked specular gloss sheen */}
        <motion.div
          aria-hidden="true"
          style={{ background: gleamBg }}
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        {/* Subtle interactive corner prompt */}
        <div className="pointer-events-none absolute top-3.5 right-3.5 px-3 py-1.5 rounded-full liquid-glass-pill text-ink font-mono text-[11px] font-semibold opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 inline-flex items-center gap-1">
          <span>{isEn ? 'Explore 3D Case' : 'Buka Detail'}</span>
          <ArrowUpRight size={13} aria-hidden="true" />
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const { t, i18n } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeIndex, setActiveIndex] = useState(0);
  const [quickProject, setQuickProject] = useState(null);

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

  const count = visibleProjects.length;
  const safeIndex = count > 0 ? ((activeIndex % count) + count) % count : 0;
  const focusedProject = visibleProjects[safeIndex] || null;
  const isEn = i18n.language === 'en';

  const getLocalizedDesc = (project) => {
    if (!project) return '';
    const translated = t(`projects.${project.slug}_desc`, { defaultValue: '' });
    return (
      translated ||
      (isEn && project.shortDescriptionEn ? project.shortDescriptionEn : project.shortDescription)
    );
  };

  const goPrev = () => {
    if (count > 1) setActiveIndex((prev) => (prev - 1 + count) % count);
  };

  const goNext = () => {
    if (count > 1) setActiveIndex((prev) => (prev + 1) % count);
  };

  // Compute circular shortest offset [-floor(n/2) .. +floor(n/2)] for 3D Coverflow ring
  const getRelativeOffset = (idx) => {
    if (count <= 1) return 0;
    let diff = idx - safeIndex;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    return diff;
  };

  return (
    <>
      <section
        id="projects"
        className="relative py-14 sm:py-28 px-4 sm:px-6 bg-paper text-ink border-b border-line overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-28 left-1/2 -translate-x-1/2 w-[920px] h-[520px]"
        >
          <ParallaxLayer
            yRange={[-45, 45]}
            className="w-full h-full rounded-full opacity-55 sm:opacity-75 dark:opacity-25"
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(56,189,248,0.16) 0%, rgba(37,99,235,0.06) 52%, transparent 76%)'
              }}
            />
          </ParallaxLayer>
        </div>
        <ParallaxWatermark text="SELECTED WORKS" direction={-1} className="mb-2" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <FadeUp className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-10">
            <div className="max-w-2xl">
              <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.14em] text-accent font-semibold mb-2 sm:mb-3">
                {isEn ? '01 / Selected Works' : '01 / Karya Pilihan'}
              </p>
              <h2 className="font-display text-[1.8rem] sm:text-5xl font-semibold tracking-[-0.035em] leading-[1.08] text-ink mb-2.5 sm:mb-3">
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
              <p className="text-[15px] sm:text-lg text-ink-muted leading-relaxed">
                {t('projects.subheading')}
              </p>
            </div>

            <Link
              to="/projects"
              className="group self-start md:self-auto inline-flex items-center gap-2 min-h-[40px] sm:min-h-[44px] text-sm sm:text-[15px] font-medium text-ink hover:text-accent transition-colors border-b border-line pb-1"
            >
              <span>
                {t('projects.bottom_cta')} ({projects.length})
              </span>
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </FadeUp>

          {/* Swipeable Mobile Pill Tabs / Hairline Desktop Filter Tabs */}
          <div className="-mx-4 sm:mx-0 flex items-center justify-between gap-4 mb-6 sm:mb-10 sm:border-b sm:border-line">
            <div
              role="group"
              aria-label="Filter showcase by discipline"
              className="flex items-center gap-2 sm:gap-6 overflow-x-auto no-scrollbar px-4 sm:px-0 py-1 sm:py-0 w-full sm:w-auto"
            >
              {FILTER_CATEGORIES.map((category) => {
                const active = selectedCategory === category;
                const label = category === 'All' ? t('projects.filter_all') : category;
                return (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setSelectedCategory(category);
                      setActiveIndex(0);
                    }}
                    className={`relative min-h-[38px] sm:min-h-[44px] px-3.5 py-1.5 sm:px-0 sm:py-0 sm:pb-3 rounded-full sm:rounded-none text-xs sm:text-[15px] font-medium whitespace-nowrap shrink-0 border sm:border-0 transition-colors ${
                      active
                        ? 'bg-ink text-on-ink border-ink sm:bg-transparent sm:text-ink'
                        : 'bg-surface/85 text-ink-muted border-line sm:bg-transparent hover:text-ink'
                    }`}
                  >
                    <span>{label}</span>
                    {active && (
                      <motion.span
                        layoutId="home-projects-underline"
                        transition={{ type: 'spring', stiffness: 440, damping: 34 }}
                        className="hidden sm:block absolute left-0 right-0 -bottom-[1px] h-[2px] bg-accent"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs text-ink-muted pb-3 shrink-0">
              <Sparkles size={13} className="text-accent" aria-hidden="true" />
              <span>
                {isEn
                  ? '3D Spatial Deck · Drag, hover or click cards'
                  : 'Stage 3D Interaktif · Geser, arahkan kursor, atau klik karya'}
              </span>
            </span>
          </div>

          {loading || !focusedProject ? (
            <div className="space-y-6 sm:space-y-8 animate-pulse">
              <div className="aspect-video max-w-3xl mx-auto rounded-2xl bg-mist" />
              <div className="h-32 rounded-2xl bg-mist" />
            </div>
          ) : (
            <div className="space-y-5 sm:space-y-8">
              {/* Interactive 3D Spatial Coverflow Exhibition Stage with Deep Camera Unfold Parallax */}
              <ParallaxLayer
                yRange={[128, -98]}
                scaleRange={[0.78, 1.06]}
                rotateXRange={[22, -7]}
              >
                <div
                  className="relative sm:h-[360px] lg:h-[430px] flex items-center justify-center"
                  style={{ perspective: '1500px', transformStyle: 'preserve-3d' }}
                >
                {visibleProjects.map((project, idx) => {
                  const offset = getRelativeOffset(idx);
                  const absOffset = Math.abs(offset);
                  const isVisibleSide = absOffset <= 2;
                  const isCenter = offset === 0;

                  if (!isVisibleSide) return null;

                  // Desktop/tablet spatial coordinates
                  const translateX = offset * 48; // % of card width
                  const translateZ = -absOffset * 150;
                  const rotateYDeg = offset * -24;
                  const scaleVal = isCenter ? 1 : Math.max(0.68, 0.84 - (absOffset - 1) * 0.14);
                  const opacityVal = isCenter ? 1 : absOffset === 1 ? 0.72 : 0.34;
                  const zIndexVal = 30 - absOffset * 10;

                  return (
                    <motion.div
                      key={project.id || project.slug}
                      initial={false}
                      animate={{
                        x: `${translateX}%`,
                        z: translateZ,
                        rotateY: rotateYDeg,
                        scale: scaleVal,
                        opacity: opacityVal
                      }}
                      transition={{ type: 'spring', stiffness: 260, damping: 28, mass: 0.9 }}
                      style={{
                        zIndex: zIndexVal,
                        transformStyle: 'preserve-3d'
                      }}
                      className={`${
                        isCenter
                          ? 'relative sm:absolute block w-full sm:w-[70%] lg:w-[62%] max-w-[700px]'
                          : 'hidden sm:block sm:absolute sm:w-[70%] lg:w-[62%] max-w-[700px] cursor-pointer'
                      }`}
                      onClick={!isCenter ? () => setActiveIndex(idx) : undefined}
                    >
                      {isCenter ? (
                        <TiltCenterCard
                          project={project}
                          isEn={isEn}
                          ctaLabel={t('projects.cta')}
                          onDragPrev={goPrev}
                          onDragNext={goNext}
                        />
                      ) : (
                        <div className="aspect-video rounded-2xl p-1.5 liquid-glass shadow-xl overflow-hidden hover:border-accent/60 transition-all">
                          <img
                            src={project.src}
                            alt={`${project.name} preview`}
                            width={1920}
                            height={1080}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover object-center rounded-xl brightness-95 hover:brightness-100 transition-all"
                          />
                        </div>
                      )}
                    </motion.div>
                  );
                })}

                {/* Stage Prev / Next Spherical Controls (desktop/tablet; mobile uses inline console controls) */}
                {count > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={goPrev}
                      aria-label={isEn ? 'Previous project' : 'Proyek sebelumnya'}
                      className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-white/95 dark:bg-[#0D1017]/95 text-ink border border-line hover:border-accent hover:text-accent shadow-lg backdrop-blur-md items-center justify-center transition-all hover:scale-105"
                    >
                      <ChevronLeft size={19} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      aria-label={isEn ? 'Next project' : 'Proyek berikutnya'}
                      className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-white/95 dark:bg-[#0D1017]/95 text-ink border border-line hover:border-accent hover:text-accent shadow-lg backdrop-blur-md items-center justify-center transition-all hover:scale-105"
                    >
                      <ChevronRight size={19} aria-hidden="true" />
                    </button>
                  </>
                )}
                </div>
              </ParallaxLayer>

              {/* Integrated Live Active Project Spec Console */}
              <ParallaxLayer yRange={[68, -68]} scaleRange={[0.96, 1.01]}>
                <div className="liquid-glass rounded-2xl p-4 sm:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={focusedProject.slug}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: STUDIO_EASE }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-center"
                  >
                    <div className="lg:col-span-8 space-y-2.5 sm:space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] sm:text-xs text-ink-muted">
                          <span className="px-2.5 py-0.5 rounded-full bg-accent/10 text-accent font-semibold">
                            {String(safeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
                          </span>
                          <span>{(focusedProject.categories || [])[0]}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{focusedProject.year}</span>
                          <span className="hidden sm:inline" aria-hidden="true">·</span>
                          <span className="hidden sm:inline">{focusedProject.client}</span>
                        </div>

                        {/* Mobile compact Prev / Next buttons right in header row */}
                        {count > 1 && (
                          <div className="flex sm:hidden items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={goPrev}
                              aria-label={isEn ? 'Previous project' : 'Proyek sebelumnya'}
                              className="w-8 h-8 rounded-full border border-line bg-surface text-ink flex items-center justify-center active:scale-95 transition-transform"
                            >
                              <ChevronLeft size={16} aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              onClick={goNext}
                              aria-label={isEn ? 'Next project' : 'Proyek berikutnya'}
                              className="w-8 h-8 rounded-full border border-line bg-surface text-ink flex items-center justify-center active:scale-95 transition-transform"
                            >
                              <ChevronRight size={16} aria-hidden="true" />
                            </button>
                          </div>
                        )}
                      </div>

                      <h3 className="font-display text-xl sm:text-4xl font-semibold tracking-[-0.025em] text-ink">
                        <Link
                          to={`/project/${focusedProject.slug}`}
                          className="hover:text-accent transition-colors"
                        >
                          {focusedProject.name}
                        </Link>
                      </h3>

                      <p className="text-sm sm:text-lg text-ink-muted leading-relaxed">
                        {getLocalizedDesc(focusedProject)}
                      </p>

                      <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                        {(focusedProject.techStack || []).slice(0, 5).map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 rounded-md font-mono text-[11px] sm:text-xs bg-mist border border-line text-ink-muted"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-4 flex flex-col lg:items-end justify-start gap-2.5 sm:gap-3">
                      <Button
                        as={Link}
                        to={`/project/${focusedProject.slug}`}
                        variant="accent"
                        size="lg"
                        className="w-full rounded-xl"
                      >
                        <span>{t('projects.cta')}</span>
                        <ArrowRight size={16} aria-hidden="true" />
                      </Button>

                      <div className="flex items-center gap-2.5 w-full">
                        <button
                          type="button"
                          onClick={() => setQuickProject(focusedProject)}
                          className="flex-1 min-h-[42px] px-4 py-2 rounded-xl liquid-glass-pill hover:border-accent/50 hover:text-accent text-sm font-medium text-ink inline-flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Eye size={15} aria-hidden="true" />
                          <span>{isEn ? 'Quick View' : 'Ringkasan'}</span>
                        </button>

                        {focusedProject.url && (
                          <a
                            href={focusedProject.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="min-h-[42px] px-4 py-2 rounded-xl liquid-glass-pill hover:border-accent/50 hover:text-accent text-sm font-medium text-ink inline-flex items-center justify-center gap-1.5 transition-colors"
                            aria-label={`Open live ${focusedProject.name}`}
                          >
                            <span>Live</span>
                            <ArrowUpRight size={15} aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
                </div>
              </ParallaxLayer>

              {/* Interactive Visual Miniature Switcher Dock (Balanced Symmetrical Parallax Bento Grid) */}
              {count > 1 && (
                <div
                  className={`grid gap-3 sm:gap-5 pt-1 sm:pt-4 ${
                    count === 2
                      ? 'grid-cols-2 max-w-2xl mx-auto'
                      : count <= 4
                        ? 'grid-cols-2 md:grid-cols-4'
                        : 'grid-cols-2 md:grid-cols-3'
                  }`}
                >
                  {visibleProjects.map((proj, idx) => {
                    const isActive = idx === safeIndex;
                    const useThreeCol = count > 4;
                    const colY = useThreeCol
                      ? idx % 3 === 0
                        ? [34, -34]
                        : idx % 3 === 1
                          ? [-38, 38]
                          : [58, -58]
                      : idx % 2 === 0
                        ? [28, -28]
                        : [-32, 32];
                    return (
                      <ParallaxLayer
                        key={proj.id || proj.slug}
                        yRange={colY}
                      >
                        <div
                          className={`group relative rounded-xl sm:rounded-2xl liquid-glass p-2 sm:p-2.5 transition-all duration-200 ${
                            isActive
                              ? 'border-accent ring-2 ring-accent/25 shadow-md sm:shadow-lg'
                              : 'hover:border-accent/45 hover:-translate-y-0.5'
                          }`}
                        >
                        <button
                          type="button"
                          onClick={() => setActiveIndex(idx)}
                          className="w-full text-left focus:outline-none"
                          aria-pressed={isActive}
                          aria-label={`Inspect ${proj.name} in 3D deck`}
                        >
                          <div className="aspect-video rounded-lg overflow-hidden bg-white dark:bg-slate-900 mb-2 border border-line">
                            <img
                              src={proj.src}
                              alt={`${proj.name} thumbnail`}
                              width={640}
                              height={360}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <div className="flex items-center justify-between gap-1.5 px-0.5">
                            <div className="min-w-0">
                              <p
                                className={`font-display text-xs sm:text-sm font-semibold truncate ${
                                  isActive ? 'text-accent' : 'text-ink'
                                }`}
                              >
                                {proj.name}
                              </p>
                              <p className="font-mono text-[10px] sm:text-[11px] text-ink-muted truncate">
                                {(proj.categories || [])[0] || 'System'}
                              </p>
                            </div>
                            <span className="font-mono text-[10px] text-ink-muted shrink-0">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                          </div>
                        </button>

                        <Link
                          to={`/project/${proj.slug}`}
                          aria-label={`Open ${proj.name} detail`}
                          className="hidden sm:flex absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-white/95 text-slate-900 shadow-sm opacity-0 group-hover:opacity-100 hover:bg-accent hover:text-white items-center justify-center transition-all"
                        >
                          <ArrowUpRight size={13} aria-hidden="true" />
                        </Link>
                        </div>
                      </ParallaxLayer>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickProject && (
          <motion.div
            data-lenis-prevent
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
                <div className="aspect-video rounded-lg overflow-hidden bg-mist dark:bg-[#0D1017] border border-line">
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

                <Button as={Link} to={`/project/${quickProject.slug}`} variant="accent" size="md">
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
