import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CursorFollower() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState('');
  const [visible, setVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const smoothX = useSpring(mouseX, { stiffness: 520, damping: 38, mass: 0.4 });
  const smoothY = useSpring(mouseY, { stiffness: 520, damping: 38, mass: 0.4 });

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || isReduced) return undefined;

    setEnabled(true);

    const onMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setVisible(true);
      const target = e.target instanceof Element ? e.target.closest('[data-cursor]') : null;
      setLabel(target ? target.getAttribute('data-cursor') || '' : '');
    };

    const onLeave = () => setVisible(false);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [mouseX, mouseY]);

  if (!enabled || !visible) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%'
      }}
      className="pointer-events-none fixed top-0 left-0 z-[60] hidden lg:flex items-center justify-center"
    >
      <motion.div
        animate={{
          scale: label ? 1 : 0.85,
          opacity: label ? 1 : 0.45
        }}
        transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
        className={`rounded-full flex items-center justify-center transition-all duration-150 ${
          label
            ? 'px-3.5 py-1.5 bg-white text-[#050608] font-mono text-xs font-semibold shadow-2xl border border-black/10'
            : 'w-2.5 h-2.5 bg-ink/80 mix-blend-difference'
        }`}
      >
        {label}
      </motion.div>
    </motion.div>
  );
}

export default CursorFollower;
