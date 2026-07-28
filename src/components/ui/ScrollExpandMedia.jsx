import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const ScrollExpandMedia = ({ src, alt }) => {
  const containerRef = useRef(null);
  
  // Track scroll within this specific container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const width = useTransform(scrollYProgress, [0, 0.5], ["70%", "100%"]);
  const borderRadius = useTransform(scrollYProgress, [0, 0.5], ["2rem", "0rem"]);
  
  return (
    <div ref={containerRef} className="h-screen w-full flex items-center justify-center sticky top-0 overflow-hidden bg-charcoal">
      <motion.div
        style={{
          width,
          borderRadius,
        }}
        className="h-[60vh] md:h-[80vh] overflow-hidden relative shadow-2xl"
      >
        <img 
          src={src}
          alt={alt}
          className="w-full h-full object-cover object-top"
        />
      </motion.div>
    </div>
  );
}
