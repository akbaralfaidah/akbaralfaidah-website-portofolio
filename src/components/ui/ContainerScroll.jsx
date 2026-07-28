import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const ContainerScroll = ({ titleComponent, children }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.4], [25, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [0.85, 1]);
  const translateY = useTransform(scrollYProgress, [0, 0.4], [100, 0]);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center relative py-20 px-2 md:px-10 perspective-1000"
      style={{ perspective: "1200px" }}
    >
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center">
        <div className="w-full text-center mb-10 md:mb-16">
          {titleComponent}
        </div>
        
        <motion.div
          style={{
            rotateX,
            scale,
            y: translateY,
            transformOrigin: "top center",
          }}
          className="w-full bg-mist/20 dark:bg-charcoal/50 backdrop-blur-sm rounded-[2rem] p-4 shadow-2xl border border-mist/50 dark:border-mist/10 aspect-video overflow-hidden"
        >
          <div className="w-full h-full bg-charcoal rounded-xl overflow-hidden shadow-inner flex flex-col relative group">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
