import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-4 px-6 mx-auto mt-4 max-w-5xl bg-paper/80 backdrop-blur-md rounded-full shadow-sm border border-mist'
          : 'py-6 px-8 bg-paper'
      }`}
    >
      <div className={`flex items-center justify-between ${!scrolled ? 'max-w-6xl mx-auto' : ''}`}>
        <div className="font-display font-bold text-xl tracking-tight">
          AA.
        </div>
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <a href="#about" className="hover:text-brass transition-colors">Tentang Saya</a>
          <a href="#projects" className="hover:text-brass transition-colors">Projek</a>
          <a href="#experience" className="hover:text-brass transition-colors">Pengalaman</a>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Theme/Language Toggles will go here in Layer 2 */}
          <a 
            href="#contact" 
            className="px-5 py-2.5 bg-charcoal text-paper rounded-full text-sm font-medium hover:bg-brass transition-colors"
          >
            Mari Diskusi
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
