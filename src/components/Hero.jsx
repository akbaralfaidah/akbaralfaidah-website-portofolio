import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20" id="home">
      {/* Background Watermark - Fixed to be subtle and not break layout */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none z-0 overflow-hidden">
        <span className="font-display font-bold text-[30vw] md:text-[25vw] tracking-tighter text-charcoal leading-none">
          AA
        </span>
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        
        <div className="relative w-full max-w-5xl flex flex-col items-center">
          
          <div className="relative mb-12 mt-8 flex justify-center items-center w-full">
            {/* The Floating Titles */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="hidden md:block absolute left-[10%] top-[20%] text-xs md:text-sm font-mono tracking-[0.2em] uppercase text-charcoal/60"
            >
              Web<br/><span className="text-brass">Developer</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-56 h-56 md:w-72 md:h-72 rounded-[2.5rem] overflow-hidden shadow-2xl z-20 rotate-3 hover:rotate-0 transition-transform duration-500 border border-mist/50 bg-charcoal/5"
            >
              <img 
                src="/img/hero-section.png" 
                alt="Akbar Alfaidah" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-charcoal/10 pointer-events-none"></div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="hidden md:block absolute right-[10%] bottom-[20%] text-xs md:text-sm font-mono tracking-[0.2em] uppercase text-charcoal/60 text-right"
            >
              Mobile<br/><span className="text-brass">Developer</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="hidden md:block absolute right-[25%] -top-[10%] text-xs md:text-sm font-mono tracking-[0.2em] uppercase text-charcoal/60"
            >
              AI <span className="text-brass">Engineer</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-3 md:hidden mb-8"
          >
            <span className="text-xs font-mono tracking-widest text-charcoal/60 border border-mist/50 px-3 py-1 rounded-full">Web</span>
            <span className="text-xs font-mono tracking-widest text-charcoal/60 border border-mist/50 px-3 py-1 rounded-full">Mobile</span>
            <span className="text-xs font-mono tracking-widest text-brass border border-mist/50 px-3 py-1 rounded-full">AI</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-charcoal leading-[1.1] tracking-tight mb-6"
          >
            Akbar Alfaidah.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-lg md:text-xl max-w-2xl text-charcoal/70 mb-10 font-medium"
          >
            Membangun pengalaman digital yang presisi, interaktif, dan berdampak.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <a 
              href="#projects" 
              className="px-8 py-4 bg-charcoal text-paper rounded-full font-medium hover:bg-brass transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Lihat Karya
            </a>
            <a 
              href="https://linkedin.com/in/akbaralfaidah" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-charcoal hover:text-brass transition-colors underline underline-offset-8 decoration-mist hover:decoration-brass"
            >
              Profil LinkedIn
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
