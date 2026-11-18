import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { STUDIO_EASE } from '../../lib/motion';

export function ScrollProgressBar() {
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 32,
    restDelta: 0.001
  });

  if (prefersReduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-50 pointer-events-none bg-gradient-to-r from-sky-400 via-accent to-emerald-500"
    />
  );
}

/**
 * Multi-axis GPU scroll parallax container supporting vertical/horizontal shift,
 * 3D perspective tilt (rotateX), zoom (scale), and fade without layout thrashing.
 */
const SPRING_SCROLL_CONFIG = { stiffness: 105, damping: 22, restDelta: 0.0005 };

export function ParallaxLayer({
  children,
  className = '',
  yRange = [48, -48],
  xRange = null,
  scaleRange = null,
  rotateRange = null,
  rotateXRange = null,
  offset = ['start end', 'end start'],
  as = 'div'
}) {
  const ref = useRef(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset
  });
  const smoothProgress = useSpring(scrollYProgress, SPRING_SCROLL_CONFIG);

  const y = useTransform(smoothProgress, [0, 1], yRange || [0, 0]);
  const x = useTransform(smoothProgress, [0, 1], xRange || [0, 0]);
  const scale = useTransform(smoothProgress, [0, 1], scaleRange || [1, 1]);
  const rotate = useTransform(smoothProgress, [0, 1], rotateRange || [0, 0]);
  const rotateX = useTransform(smoothProgress, [0, 1], rotateXRange || [0, 0]);

  const Component = motion[as] || motion.div;

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Component
      ref={ref}
      style={{
        y: yRange ? y : undefined,
        x: xRange ? x : undefined,
        scale: scaleRange ? scale : undefined,
        rotate: rotateRange ? rotate : undefined,
        rotateX: rotateXRange ? rotateX : undefined,
        transformPerspective: rotateXRange ? 1200 : undefined
      }}
      className={className}
    >
      {children}
    </Component>
  );
}

/**
 * Scroll-linked horizontal kinetic marquee band. Moves left/right strictly tied
 * to vertical scrollwheel position for immediate parallax feedback.
 */
export function ParallaxRibbon({ items = [], direction = 1, className = '' }) {
  const ref = useRef(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });
  const smoothProgress = useSpring(scrollYProgress, SPRING_SCROLL_CONFIG);

  const x = useTransform(
    smoothProgress,
    [0, 1],
    direction > 0 ? [-420, 420] : [420, -420]
  );

  const repeated = [...items, ...items, ...items];

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`relative py-4 sm:py-5 border-b border-line bg-surface/95 overflow-hidden select-none ${className}`}
    >
      <motion.div
        style={prefersReduced ? undefined : { x }}
        className="flex items-center gap-6 sm:gap-10 w-max will-change-transform"
      >
        {repeated.map((label, idx) => (
          <div key={`${label}-${idx}`} className="inline-flex items-center gap-6 sm:gap-10 shrink-0">
            <span className="font-display text-sm sm:text-base font-semibold tracking-tight text-ink">
              {label}
            </span>
            <span className="w-2 h-2 rounded-full bg-accent/60" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/**
 * Ambient ghost typography drifting strongly horizontally across scroll.
 */
export function ParallaxWatermark({ text, className = '', direction = 1 }) {
  const ref = useRef(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });
  const smoothProgress = useSpring(scrollYProgress, SPRING_SCROLL_CONFIG);

  const x = useTransform(
    smoothProgress,
    [0, 1],
    direction > 0 ? [-320, 320] : [320, -320]
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none select-none overflow-hidden ${className}`}
    >
      <motion.div
        style={prefersReduced ? undefined : { x }}
        className="w-full will-change-transform"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 1200 130"
          className="w-full h-14 sm:h-24 lg:h-28 text-ink/[0.045] dark:text-white/[0.045]"
        >
          <text
            x="50%"
            y="102"
            textAnchor="middle"
            fill="currentColor"
            className="font-display font-bold uppercase tracking-[-0.04em]"
            style={{ fontSize: '108px' }}
          >
            {text}
          </text>
        </svg>
      </motion.div>
    </div>
  );
}

export function FadeUp({
  children,
  delay = 0,
  y = 14,
  duration = 0.55,
  className = '',
  as = 'div'
}) {
  const Component = motion[as] || motion.div;
  return (
    <Component
      initial={{ opacity: 0.96, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration, delay, ease: STUDIO_EASE }}
      className={className}
    >
      {children}
    </Component>
  );
}

export function StaggerGroup({ children, className = '', delayChildren = 0.02, staggerChildren = 0.06 }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.01 }}
      variants={{
        hidden: {},
        show: {
          transition: {
            delayChildren,
            staggerChildren
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '', y = 18 }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0.96, y },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: STUDIO_EASE }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
