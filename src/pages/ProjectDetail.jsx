import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { getProjectBySlug } from '../data/projects';
import Footer from '../components/Footer';

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const found = getProjectBySlug(slug);
    setProject(found || null);
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen bg-paper text-charcoal flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-display font-bold mb-4">Project Tidak Ditemukan</h1>
        <Link to="/" className="px-6 py-2 bg-charcoal text-paper rounded-full hover:bg-brass transition-colors">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  // Modern Stagger Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } }
  };

  return (
    <div className="bg-paper min-h-screen text-charcoal selection:bg-charcoal selection:text-paper flex flex-col">
      
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-2">
        
        {/* LEFT: Immersive Sticky Image */}
        <div className="relative w-full h-[60vh] lg:h-screen lg:sticky lg:top-0 bg-[#E8E8E8] overflow-hidden">
          {/* Minimalist Back Button */}
          <div className="absolute top-8 left-8 z-50">
            <button 
              onClick={() => navigate('/')} 
              className="flex items-center justify-center w-12 h-12 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:scale-110 transition-transform duration-300 group"
              aria-label="Kembali"
            >
              <FiArrowLeft className="text-charcoal group-hover:-translate-x-0.5 transition-transform" size={20} />
            </button>
          </div>

          <motion.img 
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            src={project.src} 
            alt={project.name} 
            className="w-full h-full object-cover object-center block"
          />
        </div>

        {/* RIGHT: Modern Typography & Content */}
        <div className="w-full p-8 lg:p-16 xl:p-24 flex flex-col justify-center min-h-screen">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl mx-auto lg:mx-0 w-full"
          >
            {/* Title */}
            <motion.h1 variants={itemVariants} className="text-6xl md:text-7xl xl:text-8xl font-display font-bold mb-12 tracking-tighter leading-none text-charcoal">
              {project.name}
            </motion.h1>

            {/* Sleek Metadata Grid (No boxy pills) */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 gap-8 pb-12 mb-12 border-b border-charcoal/10">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-charcoal/40 font-bold mb-2">Klien</p>
                <p className="text-lg font-medium text-charcoal">{project.client}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-charcoal/40 font-bold mb-2">Tahun</p>
                <p className="text-lg font-medium text-charcoal">{project.year}</p>
              </div>
              <div className="col-span-2 md:col-span-1">
                <p className="text-[11px] uppercase tracking-widest text-charcoal/40 font-bold mb-2">Peran</p>
                <p className="text-lg font-medium text-charcoal">{project.role}</p>
              </div>
            </motion.div>

            {/* Description / Story */}
            <motion.div variants={itemVariants} className="mb-16 space-y-10">
              <div>
                <h2 className="text-[11px] uppercase tracking-widest text-charcoal/40 font-bold mb-4">Tantangan</h2>
                <p className="text-xl md:text-2xl text-charcoal/80 leading-relaxed font-light">{project.challenge}</p>
              </div>
              <div>
                <h2 className="text-[11px] uppercase tracking-widest text-charcoal/40 font-bold mb-4">Solusi & Hasil</h2>
                <p className="text-xl md:text-2xl text-charcoal/80 leading-relaxed font-light">{project.solution}</p>
              </div>
            </motion.div>

            {/* Tech Stack - Outline Style */}
            <motion.div variants={itemVariants} className="mb-16">
              <h2 className="text-[11px] uppercase tracking-widest text-charcoal/40 font-bold mb-6">Teknologi</h2>
              <div className="flex flex-wrap gap-3">
                {project.techStack.map(tech => (
                  <span key={tech} className="px-5 py-2 border border-charcoal/20 rounded-full text-sm font-medium text-charcoal/80 hover:border-charcoal hover:text-charcoal transition-colors cursor-default">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Huge Interactive CTA Link */}
            <motion.div variants={itemVariants}>
              {project.url ? (
                <a 
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-between w-full p-6 bg-charcoal rounded-2xl overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-2xl"
                >
                  <div className="relative z-10 flex flex-col">
                    <span className="text-white/60 text-sm font-medium mb-1 uppercase tracking-wider">Kunjungi</span>
                    <span className="text-white text-2xl font-bold">Live Website</span>
                  </div>
                  <div className="relative z-10 w-14 h-14 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-charcoal text-white transition-colors duration-300">
                    <FiArrowRight size={24} className="group-hover:-rotate-45 transition-transform duration-300" />
                  </div>
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-brass/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </a>
              ) : (
                <div className="flex items-center justify-between w-full p-6 bg-charcoal/5 border border-charcoal/10 rounded-2xl cursor-not-allowed">
                  <div className="flex flex-col">
                    <span className="text-charcoal/40 text-sm font-medium mb-1 uppercase tracking-wider">Status</span>
                    <span className="text-charcoal/40 text-2xl font-bold">Sistem Internal</span>
                  </div>
                </div>
              )}
            </motion.div>

          </motion.div>
        </div>

      </main>
      
      <Footer />
    </div>
  );
}
