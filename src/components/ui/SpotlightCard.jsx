import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '../../lib/utils';
import { STUDIO_EASE } from '../../lib/motion';

export function SpotlightCard({
  children,
  className = '',
  hoverLift = true,
  tilt = false,
  as = 'div',
  ...props
}) {
  const cardRef = useRef(null);
  const Component = motion[as] || motion.div;

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const smoothX = useSpring(mx, { stiffness: 260, damping: 24 });
  const smoothY = useSpring(my, { stiffness: 260, damping: 24 });
  const rotateY = useTransform(smoothX, [0, 1], [-2.5, 2.5]);
  const rotateX = useTransform(smoothY, [0, 1], [2.5, -2.5]);

  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    el.style.setProperty('--mx', `${px}px`);
    el.style.setProperty('--my', `${py}px`);

    if (tilt && rect.width > 0 && rect.height > 0) {
      mx.set(px / rect.width);
      my.set(py / rect.height);
    }
  };

  const handleMouseLeave = () => {
    if (tilt) {
      mx.set(0.5);
      my.set(0.5);
    }
  };

  return (
    <Component
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={tilt ? { rotateX, rotateY, transformPerspective: 1000 } : undefined}
      whileHover={hoverLift ? { y: -4 } : undefined}
      transition={{ duration: 0.22, ease: STUDIO_EASE }}
      className={cn(
        'spotlight-surface rounded-2xl bg-surface/90 backdrop-blur-sm border border-line hover:border-accent/50 hover:shadow-xl hover:shadow-accent/[0.06] dark:hover:shadow-black/40 transition-[border-color,box-shadow] duration-250',
        className
      )}
      {...props}
    >
      <div className="relative z-10 h-full">{children}</div>
    </Component>
  );
}

export default SpotlightCard;
