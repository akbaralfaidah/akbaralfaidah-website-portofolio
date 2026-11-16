import { useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { STUDIO_EASE } from '../../lib/motion';

export function SpotlightCard({ children, className = '', hoverLift = true, as = 'div', ...props }) {
  const cardRef = useRef(null);
  const Component = motion[as] || motion.div;

  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <Component
      ref={cardRef}
      onMouseMove={handleMouseMove}
      whileHover={hoverLift ? { y: -3 } : undefined}
      transition={{ duration: 0.22, ease: STUDIO_EASE }}
      className={cn(
        'spotlight-surface rounded-2xl bg-surface border border-line hover:border-accent/45 hover:shadow-lg hover:shadow-ink/[0.04] dark:hover:shadow-black/30 transition-[border-color,box-shadow] duration-200',
        className
      )}
      {...props}
    >
      <div className="relative z-10 h-full">{children}</div>
    </Component>
  );
}

export default SpotlightCard;
