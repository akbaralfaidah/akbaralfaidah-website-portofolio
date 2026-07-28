import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20" id="home">
      {/* Background Monogram */}
      <div className="absolute -bottom-20 -right-20 text-[400px] font-display font-bold text-charcoal/5 select-none pointer-events-none">
        AA
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        
        {/* Asymmetrical Roles around the center */}
        <div className="relative w-full max-w-4xl flex flex-col items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute top-0 left-0 md:-left-12 text-sm font-mono tracking-widest uppercase text-brass rotate-[-15deg]"
          >
            Web Developer
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-paper shadow-2xl z-20 mb-8"
          >
            <img 
              src="/img/hero-section.png" 
              alt="Akbar Alfaidah" 
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-10 right-0 md:-right-12 text-sm font-mono tracking-widest uppercase text-brass rotate-[10deg]"
          >
            AI Engineer
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute top-1/2 -left-10 md:-left-20 text-sm font-mono tracking-widest uppercase text-brass -rotate-90 hidden md:block"
          >
            Mobile Developer
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-charcoal leading-tight mb-6"
          >
            Akbar Alfaidah
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-lg md:text-xl max-w-2xl text-charcoal/80 mb-10"
          >
            Membangun pengalaman digital yang presisi, interaktif, dan berdampak.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-center space-x-6"
          >
            <a 
              href="#projects" 
              className="px-8 py-4 bg-brass text-paper rounded-full font-medium hover:bg-charcoal transition-colors shadow-lg shadow-brass/20"
            >
              Lihat Project
            </a>
            <a 
              href="https://linkedin.com/in/akbaralfaidah" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-charcoal hover:text-brass transition-colors underline underline-offset-4"
            >
              LinkedIn
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
