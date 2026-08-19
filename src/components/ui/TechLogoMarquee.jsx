import { motion, useMotionValue, useAnimationFrame, useMotionValueEvent } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useIsVisible } from '../../hooks/useIsVisible';
import { 
  SiJavascript, SiTypescript, SiPython, 
  SiReact, SiNextdotjs, SiVuedotjs, SiTailwindcss, SiFlutter,
  SiNodedotjs, SiExpress, SiNestjs, SiLaravel, SiCodeigniter, SiFastapi, SiGraphql,
  SiPostgresql, SiMongodb, SiSupabase, SiFirebase,
  SiDocker, SiKubernetes, SiGitlab, SiGithubactions,
  SiFigma, SiFramer
} from 'react-icons/si';

const BASE_LOGOS = [
  { icon: SiJavascript, color: '#F7DF1E' },
  { icon: SiTypescript, color: '#3178C6' },
  { icon: SiPython, color: '#3776AB' },
  { icon: SiReact, color: '#61DAFB' },
  { icon: SiNextdotjs, color: 'currentColor' },
  { icon: SiVuedotjs, color: '#4FC08D' },
  { icon: SiTailwindcss, color: '#06B6D4' },
  { icon: SiFlutter, color: '#02569B' },
  { icon: SiNodedotjs, color: '#339933' },
  { icon: SiExpress, color: 'currentColor' },
  { icon: SiNestjs, color: '#E0234E' },
  { icon: SiLaravel, color: '#FF2D20' },
  { icon: SiCodeigniter, color: '#EE4323' },
  { icon: SiFastapi, color: '#009688' },
  { icon: SiGraphql, color: '#E10098' },
  { icon: SiPostgresql, color: '#4169E1' },
  { icon: SiMongodb, color: '#47A248' },
  { icon: SiSupabase, color: '#3ECF8E' },
  { icon: SiFirebase, color: '#FFCA28' },
  { icon: SiDocker, color: '#2496ED' },
  { icon: SiKubernetes, color: '#326CE5' },
  { icon: SiGitlab, color: '#FC6D26' },
  { icon: SiGithubactions, color: '#2088FF' },
  { icon: SiFigma, color: '#F24E1E' },
  { icon: SiFramer, color: 'currentColor' },
];

const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const DraggableMarqueeRow = ({ items, direction = 1, speed = 40 }) => {
  const [width, setWidth] = useState(0);
  const x = useMotionValue(0);
  const firstItemRef = useRef(null);
  const firstDuplicateRef = useRef(null);
  const { ref: visRef, isVisibleRef } = useIsVisible();

  useEffect(() => {
    const measure = () => {
      if (firstItemRef.current && firstDuplicateRef.current) {
        setWidth(firstDuplicateRef.current.offsetLeft - firstItemRef.current.offsetLeft);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    setTimeout(measure, 500);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useAnimationFrame((t, delta) => {
    // Fix #2: Skip when offscreen
    if (width === 0 || !isVisibleRef.current) return;
    let moveBy = direction * speed * (delta / 1000);
    x.set(x.get() + moveBy);
  });

  useMotionValueEvent(x, "change", (latest) => {
    if (width === 0) return;
    const wrappedX = wrap(-2 * width, -width, latest);
    if (wrappedX !== latest) {
      x.set(wrappedX);
    }
  });

  const fourSets = [...items, ...items, ...items, ...items];

  return (
    <motion.div
      ref={visRef}
      className="flex gap-3 sm:gap-4 w-max cursor-grab active:cursor-grabbing"
      style={{ x }}
      drag="x"
    >
      {fourSets.map((LogoData, i) => (
        <div 
          key={i} 
          ref={i === 0 ? firstItemRef : i === items.length ? firstDuplicateRef : null}
          className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-[1rem] bg-white dark:bg-[#1E1E20] border border-charcoal/10 dark:border-white/10 flex items-center justify-center shadow-sm"
        >
          <LogoData.icon 
            className="w-6 h-6 sm:w-7 sm:h-7 pointer-events-none"
            style={{ color: LogoData.color === 'currentColor' ? 'inherit' : LogoData.color }} 
          />
        </div>
      ))}
    </motion.div>
  );
};

export const TechLogoMarquee = () => {
  const row1 = BASE_LOGOS.filter((_, i) => i % 2 === 0);
  const row2 = BASE_LOGOS.filter((_, i) => i % 2 !== 0);

  return (
    <div 
      className="w-full overflow-hidden py-2 select-none"
      style={{ 
        maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', 
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' 
      }}
    >
      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Top row goes right */}
        <div className="w-full">
          <DraggableMarqueeRow items={row1} direction={1} speed={40} />
        </div>
        
        {/* Bottom row goes left */}
        <div className="w-full ml-[1.5rem] sm:ml-[2rem]">
          <DraggableMarqueeRow items={row2} direction={-1} speed={40} />
        </div>
      </div>
    </div>
  );
};
