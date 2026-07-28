import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-10" id="home">
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          
          {/* Main Large Image Bento */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="md:col-span-2 row-span-2 relative rounded-[2rem] overflow-hidden group shadow-xl border border-charcoal/5 dark:border-paper/5 bg-mist/10 h-[60vh] md:h-[75vh]"
          >
            <img 
              src="/img/akbar-4.jpg" 
              alt="Akbar Alfaidah" 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full text-left">
              <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-3 leading-tight tracking-tight">
                Akbar Alfaidah
              </h1>
              <p className="text-gray-200 text-lg md:text-xl font-medium">Software Engineer • AI Specialist</p>
            </div>
          </motion.div>

          {/* Top Right Bento - Status */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-[2rem] p-8 flex flex-col justify-center bg-paper/60 backdrop-blur-md shadow-xl border border-charcoal/5 dark:border-paper/5 h-full"
          >
            <div className="flex items-center space-x-3 mb-6">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brass opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-brass"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-charcoal">Available for Work</span>
            </div>
            <h3 className="text-2xl font-display font-bold text-charcoal mb-6 leading-snug">
              Let's build something extraordinary together.
            </h3>
            <a href="#contact" className="inline-flex items-center text-brass font-bold hover:gap-3 transition-all mt-auto text-sm tracking-wider uppercase">
              Start a project <span className="ml-2">&rarr;</span>
            </a>
          </motion.div>

          {/* Bottom Right Bento - Mini Stats/Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="rounded-[2rem] p-8 bg-charcoal text-paper flex flex-col justify-center shadow-xl border border-charcoal/5"
          >
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-paper/10 pb-4">
                <span className="text-paper/60 font-mono text-sm uppercase tracking-widest">Based in</span>
                <span className="font-bold">Indonesia</span>
              </div>
              <div className="flex justify-between items-center border-b border-paper/10 pb-4">
                <span className="text-paper/60 font-mono text-sm uppercase tracking-widest">Experience</span>
                <span className="font-bold">3+ Years</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-paper/60 font-mono text-sm uppercase tracking-widest">Focus</span>
                <span className="font-bold">Web & AI</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
