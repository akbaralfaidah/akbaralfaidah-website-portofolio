import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiExternalLink, FiClock, FiUser, FiBriefcase } from 'react-icons/fi';
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

  // Framer Motion variants for stagger effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <div className="bg-paper min-h-screen text-charcoal selection:bg-brass selection:text-paper flex flex-col">
      
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 relative">
        
        {/* LEFT: Sticky Image */}
        <div className="relative w-full h-[50vh] lg:h-screen lg:sticky lg:top-0 bg-charcoal/5 overflow-hidden">
          {/* Back Button (Floating over image on mobile, or just standard) */}
          <div className="absolute top-6 left-6 z-50">
            <button 
              onClick={() => navigate('/')} 
              className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md rounded-full shadow-lg border border-charcoal/10 font-medium text-sm text-charcoal hover:bg-white transition-colors group"
            >
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Kembali
            </button>
          </div>

          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            src={project.src} 
            alt={project.name} 
            className="w-full h-full object-cover object-center block"
          />
          {/* Subtle gradient overlay for premium feel */}
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/10 to-transparent pointer-events-none" />
        </div>

        {/* RIGHT: Text Content (Scrollable) */}
        <div className="w-full p-8 lg:p-16 xl:p-24 flex flex-col justify-center min-h-screen">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-xl mx-auto lg:mx-0"
          >
            {/* Title */}
            <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-display font-bold mb-8 leading-tight">
              {project.name}
            </motion.h1>

            {/* Innovative Metadata Bento-style Pills */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mb-10">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-charcoal/10 rounded-xl shadow-sm text-sm font-medium">
                <FiUser className="text-brass" /> {project.client}
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-charcoal/10 rounded-xl shadow-sm text-sm font-medium">
                <FiClock className="text-brass" /> {project.year}
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-charcoal/10 rounded-xl shadow-sm text-sm font-medium">
                <FiBriefcase className="text-brass" /> {project.role}
              </div>
            </motion.div>

            {/* Description */}
            <motion.div variants={itemVariants} className="mb-10 space-y-6">
              <div>
                <h2 className="text-sm uppercase tracking-widest text-charcoal/50 font-bold mb-3">Tantangan</h2>
                <p className="text-lg text-charcoal/80 leading-relaxed">{project.challenge}</p>
              </div>
              <div>
                <h2 className="text-sm uppercase tracking-widest text-charcoal/50 font-bold mb-3">Solusi & Inovasi</h2>
                <p className="text-lg text-charcoal/80 leading-relaxed">{project.solution}</p>
              </div>
            </motion.div>

            {/* Tech Stack */}
            <motion.div variants={itemVariants} className="mb-12">
              <h2 className="text-sm uppercase tracking-widest text-charcoal/50 font-bold mb-4">Teknologi</h2>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map(tech => (
                  <span key={tech} className="px-4 py-1.5 bg-charcoal/5 rounded-full text-sm font-semibold text-charcoal">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* CTA Link */}
            <motion.div variants={itemVariants}>
              {project.url ? (
                <a 
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-charcoal text-paper font-semibold rounded-full hover:bg-brass transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
                >
                  Kunjungi Website 
                  <FiExternalLink className="group-hover:rotate-12 transition-transform" size={20} />
                </a>
              ) : (
                <div className="inline-flex items-center gap-3 px-8 py-4 bg-charcoal/5 text-charcoal/40 font-semibold rounded-full border border-charcoal/10 cursor-not-allowed">
                  Sistem Internal / Offline
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
