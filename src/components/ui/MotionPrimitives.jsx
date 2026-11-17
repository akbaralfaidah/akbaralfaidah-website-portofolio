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
      className="fixed top-0 left-0 right-0 h-[2.5px] origin-left z-50 pointer-events-none bg-gradient-to-r from-sky-400 via-accent to-emerald-500"
    />
  );
}

/**
 * Multi-axis GPU scroll parallax container.
 * Gracefully disables displacement when user prefers reduced motion.
 */
export function ParallaxLayer({
  children,
  className = '',
  yRange = [32, -32],
  xRange = null,
  scaleRange = null,
  offset = ['start end', 'end start'],
  as = 'div'
}) {
  const ref = useRef(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset
  });

  const y = useTransform(scrollYProgress, [0, 1], yRange || [0, 0]);
  const x = useTransform(scrollYProgress, [0, 1], xRange || [0, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleRange || [1, 1]);

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
        scale: scaleRange ? scale : undefined
      }}
      className={className}
    >
      {children}
    </Component>
  );
}

/**
 * Ambient ghost typography drifting horizontally across scroll to emphasize optical depth.
 */
export function ParallaxWatermark({ text, className = '', direction = 1 }) {
  const ref = useRef(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    direction > 0 ? [-90, 90] : [90, -90]
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none select-none overflow-hidden ${className}`}
    >
      <motion.p
        style={prefersReduced ? undefined : { x }}
        className="font-display font-bold uppercase tracking-[-0.04em] whitespace-nowrap leading-none text-[clamp(4.5rem,13vw,11rem)] text-ink/[0.03] dark:text-white/[0.035]"
      >
        {text}
      </motion.p>
    </div>
  );
}

export function FadeUp({
  children,
  delay = 0,
  y = 18,
  duration = 0.5,
  className = '',
  as = 'div'
}) {
  const Component = motion[as] || motion.div;
  return (
    <Component
      initial={{ opacity: 0.96, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.01 }}
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
