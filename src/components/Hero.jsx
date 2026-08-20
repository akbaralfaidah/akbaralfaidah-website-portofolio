import { motion } from 'framer-motion';
import { useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowRight } from 'react-icons/fi';
import AnimatedButton from './ui/AnimatedButton';
import { useLenis } from '../context/LenisContext';
import { useIsVisible } from '../hooks/useIsVisible';
import { TechLogoMarquee } from './ui/TechLogoMarquee';

import { heroProjects } from '../data/projects';

// Use all images from the catalog
const orbitProjects = heroProjects;

// We want exactly 3.5 images visible on the C-curve at any time to guarantee ZERO overlap
const VISIBLE_COUNT = 3.5;
const TOTAL_LENGTH = orbitProjects.length / VISIBLE_COUNT;
const OFFSETS = orbitProjects.map((_, i) => i / VISIBLE_COUNT);

// --- Config ---
const CARD_W = 460;
const CARD_H = 259; // 16:9
const SPEED = 0.0015; // Smooth, continuous premium floating speed

// Continuous C-curve path with a virtual backstage loop
function getTransform(globalProgress, containerH, containerW) {
  // Wrap progress around the total virtual length of the carousel
  const p = ((globalProgress % TOTAL_LENGTH) + TOTAL_LENGTH) % TOTAL_LENGTH;

  // If p > 1.0, the card is backstage (waiting its turn to enter)
  if (p > 1.0) {
    return { x: -1000, y: -1000, scale: 0, zIndex: 0, opacity: 0 };
  }

  // Map progress (0 to 1) to an angle from -90deg (top) to +90deg (bottom)
  const angle = -Math.PI / 2 + Math.PI * p;

  // X position: forms the belly of the 'C'
  const x = 500 * (1 - Math.cos(angle));

  // Y position: moves smoothly from top to bottom
  const y = 0.35 * containerH + (0.45 * containerH) * Math.sin(angle);

  // Scale: largest at the center
  const scale = 0.6 + 0.4 * Math.cos(angle);

  // Base center X for the image to be horizontally centered in the column
  const baseCenterX = (containerW - CARD_W * scale) / 2;

  // Opacity: fade in and out at the very edges (top and bottom)
  const opacity = Math.min(1, Math.cos(angle) * 1.5);

  return {
    x: baseCenterX + x,
    y: y,
    scale,
    zIndex: Math.round(scale * 100),
    opacity: Math.max(0, opacity),
  };
}

// --- Orbit Column ---
function OrbitColumn() {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const globalProgress = useRef(0);
  const isDragging = useRef(false);
  const lastPointerY = useRef(0);
  const velocity = useRef(0);
  const animFrame = useRef(null);
  const lastTime = useRef(performance.now());
  const { ref: visRef, isVisibleRef } = useIsVisible();

  const applyTransforms = useCallback(() => {
    const c = containerRef.current;
    if (!c) return;
    const ch = c.offsetHeight;
    const cw = c.offsetWidth;

    for (let i = 0; i < orbitProjects.length; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;

      const progress = globalProgress.current - OFFSETS[i];
      const { x, y, scale, zIndex, opacity } = getTransform(progress, ch, cw);

      el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      el.style.zIndex = zIndex;
      el.style.opacity = opacity.toFixed(3);
    }
  }, []);

  const animate = useCallback((now) => {
    // Fix #2: Skip calculations when offscreen to save CPU
    if (!isVisibleRef.current) {
      lastTime.current = now;
      animFrame.current = requestAnimationFrame(animate);
      return;
    }

    const dt = Math.min(now - lastTime.current, 50);
    lastTime.current = now;

    if (!isDragging.current) {
      velocity.current *= 0.93;
      if (Math.abs(velocity.current) < SPEED * 0.2) {
        velocity.current = 0;
        globalProgress.current += SPEED * (dt / 16.67);
      } else {
        globalProgress.current += velocity.current * (dt / 16.67);
      }
    }

    globalProgress.current = ((globalProgress.current % TOTAL_LENGTH) + TOTAL_LENGTH) % TOTAL_LENGTH;

    applyTransforms();
    animFrame.current = requestAnimationFrame(animate);
  }, [applyTransforms]);

  const onPointerDown = useCallback((e) => {
    isDragging.current = true;
    lastPointerY.current = e.clientY;
    velocity.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!isDragging.current) return;
    const c = containerRef.current;
    if (!c) return;
    const dy = e.clientY - lastPointerY.current;
    lastPointerY.current = e.clientY;
    // Drag DOWN = images move DOWN (progress increases)
    const delta = dy / c.offsetHeight * 0.5;
    globalProgress.current += delta;
    velocity.current = delta;
  }, []);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    lastTime.current = performance.now();
    animFrame.current = requestAnimationFrame(animate);
    return () => { if (animFrame.current) cancelAnimationFrame(animFrame.current); };
  }, [animate]);

  // Merge visibility ref with container ref
  const setRefs = useCallback((node) => {
    containerRef.current = node;
    visRef.current = node;
  }, [visRef]);

  return (
    <div
      ref={setRefs}
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none"
      style={{
        touchAction: 'none'
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {orbitProjects.map((p, i) => (
        <div
          key={p.name}
          ref={(el) => (cardRefs.current[i] = el)}
          className="absolute top-0 left-0 will-change-transform"
          style={{
            width: `${CARD_W}px`,
            height: `${CARD_H}px`,
            transformOrigin: 'top left',
          }}
        >
          <div className="block w-full h-full rounded-2xl overflow-hidden shadow-md border border-charcoal/6 dark:border-paper/6 bg-paper dark:bg-[#3A3C41] group">
            <img
              src={p.src}
              alt={p.name}
              loading="eager"
              fetchPriority={i === 0 ? 'high' : 'auto'}
              draggable="false"
              width="460" height="259"
              className="w-full h-full object-cover object-top block pointer-events-none select-none group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Mobile Carousel ---
function MobileCarousel() {
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const posRef = useRef(0);
  const autoSpeed = useRef(-0.6);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartPos = useRef(0);
  const velocityRef = useRef(0);
  const lastTouchX = useRef(0);
  const { ref: visRef, isVisibleRef } = useIsVisible();

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const animate = () => {
      if (isVisibleRef.current) {
        const half = track.scrollWidth / 2;

        if (!isDragging.current) {
          // Apply momentum after drag release
          if (Math.abs(velocityRef.current) > 0.5) {
            posRef.current += velocityRef.current;
            velocityRef.current *= 0.95; // Decelerate
          } else {
            // Resume auto-scroll when momentum is exhausted
            velocityRef.current = 0;
            posRef.current += autoSpeed.current;
          }
        }

        // Seamless loop
        if (Math.abs(posRef.current) >= half) {
          posRef.current = posRef.current % half;
        }
        if (posRef.current > 0) {
          posRef.current -= half;
        }

        track.style.transform = `translateX(${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  const onPointerDown = useCallback((e) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartPos.current = posRef.current;
    lastTouchX.current = e.clientX;
    velocityRef.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastTouchX.current;
    lastTouchX.current = e.clientX;
    posRef.current += dx;
    velocityRef.current = dx;
  }, []);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const items = [...heroProjects, ...heroProjects];

  return (
    <div
      ref={visRef}
      className="w-full overflow-hidden cursor-grab active:cursor-grabbing select-none"
      style={{ touchAction: 'pan-y' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div ref={trackRef} className="flex gap-4" style={{ willChange: 'transform' }}>
        {items.map((p, i) => (
          <div key={`${p.name}-${i}`} 
            className="block flex-shrink-0 rounded-2xl overflow-hidden shadow-sm border border-charcoal/6 dark:border-paper/6 bg-paper dark:bg-[#3A3C41] relative group"
            style={{ width: '300px', height: '169px' }}>
            <img src={p.src} alt={p.name} loading={i < 3 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : 'auto'} draggable="false"
              width="300" height="169"
              className="w-full h-full object-cover object-top block pointer-events-none group-hover:scale-105 transition-transform duration-500" />
          </div>
        ))}
      </div>
    </div>
  );
}


// --- Hero Section ---
export default function Hero() {
  const { t } = useTranslation();
  const heroRef = useRef(null);
  const lenis = useLenis();

  const handleScrollTo = (e, target) => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(target, { offset: -100, duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    } else {
      const el = document.querySelector(target);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative flex items-center"
      style={{ minHeight: '100dvh', paddingTop: '6rem', paddingBottom: '2rem' }}
      id="home"
    >
      <div className="max-w-[1400px] mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-6 items-center">

        {/* ===== LEFT: Text & Marquees ===== */}
        <motion.div
          className="relative flex flex-col gap-6 md:gap-8 z-10 max-w-xl"
        >

          {/* Content Wrapper */}
          <div className="relative z-10 flex flex-col gap-6">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/20 text-xs font-semibold text-emerald-700 dark:text-emerald-400 tracking-wide">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                {t('hero.badge')}
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08 }}
              className="font-display font-extrabold leading-[1.05] tracking-tight text-charcoal dark:text-[#FAF8ED]"
              style={{ fontSize: 'clamp(3.2rem, 6.5vw, 5.5rem)' }}
            >
              Akbar Alfaidah
            </motion.h1>



            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.28 }}
              className="text-base md:text-[1.2rem] leading-[1.7] text-charcoal/60 dark:text-paper/60 max-w-lg font-light"
            >
              {t('hero.headline_1')}<br />
              {t('hero.headline_2')}<br />
            </motion.p>

            {/* Buttons & Mobile Logos */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.38 }}
              className="flex flex-row items-center justify-between gap-4 mt-3"
            >
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <AnimatedButton
                  href="#contact"
                  onClick={(e) => handleScrollTo(e, '#contact')}
                  className="px-7 h-12 text-[0.9rem] tracking-wide"
                >
                  {t('hero.cta_primary')}
                  <FiArrowRight size={16} />
                </AnimatedButton>
                <AnimatedButton
                  to="/projects"
                  variant="brass"
                  className="px-7 h-12 text-[0.9rem] tracking-wide"
                >
                  {t('hero.cta_secondary')}
                  <FiArrowRight size={16} />
                </AnimatedButton>
              </div>

            </motion.div>
          </div>

          <div className="w-full mt-2">
            <TechLogoMarquee reverse={true} />
          </div>
        </motion.div>

        {/* ===== RIGHT: Orbit Carousel / Mobile Carousel ===== */}
        <motion.div
          className="relative z-0 w-full"
        >
          <div className="hidden md:block relative" style={{ height: '85vh', maxHeight: '750px', minHeight: '520px' }}>
            <OrbitColumn />
          </div>
          <div className="block md:hidden w-full overflow-hidden mt-4">
            <MobileCarousel />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
