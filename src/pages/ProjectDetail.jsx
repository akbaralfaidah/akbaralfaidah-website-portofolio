import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiExternalLink, FiGlobe, FiInfo } from 'react-icons/fi';
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

  return (
    <div className="bg-paper min-h-screen text-charcoal selection:bg-charcoal selection:text-paper">
      
      {/* Top Navbar spacing is handled by App / Layout, assuming we need padding top */}
      <main className="pt-24 pb-20 px-6 md:px-12 max-w-6xl mx-auto">
        
        {/* Back Button */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-10"
        >
          <button 
            onClick={() => navigate('/')} 
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-charcoal/20 text-sm font-medium hover:bg-charcoal hover:text-white transition-all duration-300"
          >
            <FiArrowLeft /> Back to Portfolio
          </button>
        </motion.div>

        {/* Header (Role, Year, Title) */}
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-charcoal/50 mb-3">
            <span>{project.role}</span>
            <span>&bull;</span>
            <span>{project.year}</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight text-charcoal">
            {project.name}
          </h1>
        </motion.header>

        {/* Main Image */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16 md:mb-24"
        >
          <div className="w-full bg-[#F5F5F5] dark:bg-[#1A1A1A] rounded-3xl overflow-hidden shadow-sm border border-charcoal/5 relative">
            {/* The SVG images have built in frames usually, just show it */}
            <img 
              src={project.src} 
              alt={project.name} 
              className="w-full h-auto max-h-[80vh] object-cover object-top block"
            />
          </div>
        </motion.section>

        {/* Content Split (Left: Info, Right: Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* LEFT CONTENT */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-8 space-y-16"
          >
            {/* About */}
            <section>
              <h2 className="text-3xl font-display font-bold mb-6">About this project</h2>
              <div className="prose prose-lg text-charcoal/70">
                <p className="mb-4">{project.challenge}</p>
                <p>{project.solution}</p>
              </div>
            </section>

            {/* Role */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-charcoal/50 mb-4">My Role</h3>
              <div className="inline-flex px-5 py-2.5 rounded-full border border-charcoal/20 font-medium text-sm">
                {project.role}
              </div>
            </section>

            {/* Highlights (Using solution or challenge as bullet points if we want to innovate) */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-charcoal/50 mb-4">Key Details</h3>
              <div className="space-y-3">
                <div className="p-5 rounded-2xl bg-[#F0FDF4] dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200 text-sm md:text-base leading-relaxed">
                  &bull; Dibangun secara spesifik untuk klien <strong>{project.client}</strong>.
                </div>
                <div className="p-5 rounded-2xl bg-[#F0FDF4] dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200 text-sm md:text-base leading-relaxed">
                  &bull; Menjawab tantangan utama dengan pendekatan modern di tahun {project.year}.
                </div>
                <div className="p-5 rounded-2xl bg-[#F0FDF4] dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200 text-sm md:text-base leading-relaxed">
                  &bull; Fokus pada performa, aksesibilitas, dan User Experience (UX) yang optimal.
                </div>
              </div>
            </section>

          </motion.div>


          {/* RIGHT SIDEBAR */}
          <motion.aside 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-4 space-y-6"
          >
            {/* Tech Stack Card */}
            <div className="bg-[#FAFAFA] dark:bg-charcoal/10 rounded-3xl p-6 border border-charcoal/5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-charcoal/50 mb-4">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map(tech => (
                  <span key={tech} className="px-4 py-2 bg-white dark:bg-charcoal/40 border border-charcoal/10 rounded-full text-sm font-medium shadow-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Client / Platform Card */}
            <div className="bg-[#FAFAFA] dark:bg-charcoal/10 rounded-3xl p-6 border border-charcoal/5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-charcoal/50 mb-4">Client & Platform</h3>
              <div className="flex items-center gap-3 text-charcoal/80 mb-3">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-charcoal/40 border border-charcoal/10 flex items-center justify-center shadow-sm">
                  <FiGlobe />
                </div>
                <span className="font-medium">{project.client}</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              {project.url ? (
                <a 
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-full border border-charcoal text-charcoal font-semibold hover:bg-charcoal hover:text-white transition-all duration-300"
                >
                  <FiInfo /> Visit Live Site
                </a>
              ) : (
                <button disabled className="flex items-center justify-center gap-2 w-full py-4 rounded-full border border-charcoal/20 text-charcoal/40 font-semibold cursor-not-allowed">
                  <FiInfo /> Offline System
                </button>
              )}
            </div>
            
          </motion.aside>

        </div>
      </main>

      <Footer />
    </div>
  );
}
