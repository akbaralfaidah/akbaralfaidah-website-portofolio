import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiArrowUpRight, FiGlobe, FiSmartphone, FiCpu, FiPlay } from 'react-icons/fi';
import { fetchProjects } from '../data/projects';
import Footer from '../components/Footer';

const CATEGORIES = ['All', 'Website', 'Mobile Apps', 'Machine Learning'];

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProjects().then((data) => {
      setAllProjects(data);
      setLoading(false);
    });
  }, []);

  let filteredProjects = activeCategory === 'All' 
    ? allProjects 
    : allProjects.filter(p => p.categories && p.categories.includes(activeCategory));

  // Sort: On Progress (not 'selesai') first, then 'selesai'
  filteredProjects.sort((a, b) => {
    const isASelesai = a.status === 'selesai';
    const isBSelesai = b.status === 'selesai';
    if (isASelesai === isBSelesai) return 0;
    return isASelesai ? 1 : -1;
  });


  // Helper to render the right icon for the primary category
  const getCategoryIcon = (categories) => {
    if (!categories || categories.length === 0) return <FiGlobe />;
    if (categories.includes('Mobile Apps')) return <FiPlay />;
    if (categories.includes('Machine Learning')) return <FiCpu />;
    return <FiGlobe />;
  };

  // Helper to get the primary category label
  const getPrimaryCategoryLabel = (categories) => {
    if (!categories || categories.length === 0) return 'Website';
    if (categories.includes('Mobile Apps')) return 'Mobile App';
    return categories[0];
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-charcoal">
      
      {/* Header Area */}
      <header className="pt-24 pb-12 px-6 md:px-12 max-w-7xl mx-auto">
        <button 
          onClick={() => navigate('/')} 
          className="inline-flex items-center gap-2 px-5 py-2 mb-8 rounded-full border border-charcoal/20 text-sm font-medium hover:bg-charcoal hover:text-white transition-all duration-300"
        >
          <FiArrowLeft /> Kembali ke Beranda
        </button>

        <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight mb-8">
          Katalog Proyek
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                activeCategory === cat 
                  ? 'bg-charcoal text-white border-charcoal' 
                  : 'bg-white text-charcoal/70 border-charcoal/10 hover:border-charcoal/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Projects Grid */}
      <main className="px-6 md:px-12 pb-24 max-w-7xl mx-auto min-h-[50vh]">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm border border-charcoal/5 animate-pulse">
                <div className="w-full pt-[65%] bg-charcoal/10" />
                <div className="p-6 md:p-8 space-y-4">
                  <div className="h-3 w-24 bg-charcoal/10 rounded-full" />
                  <div className="h-6 w-40 bg-charcoal/10 rounded-full" />
                  <div className="h-3 w-full bg-charcoal/10 rounded-full" />
                  <div className="h-3 w-3/4 bg-charcoal/10 rounded-full" />
                  <div className="flex gap-2 pt-2">
                    <div className="h-6 w-16 bg-charcoal/10 rounded-md" />
                    <div className="h-6 w-16 bg-charcoal/10 rounded-md" />
                    <div className="h-6 w-16 bg-charcoal/10 rounded-md" />
                  </div>
                  <div className="h-10 w-32 bg-charcoal/10 rounded-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={project.id}
                className="flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm border border-charcoal/5 group"
              >
                {/* Image Container */}
                <Link to={`/project/${project.slug}`} className="block relative w-full pt-[65%] bg-charcoal/5 overflow-hidden">
                  <img 
                    src={project.status !== 'selesai' ? '/on_development.gif' : project.src} 
                    alt={project.name} 
                    className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  {project.status !== 'selesai' && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-md z-10 animate-pulse">
                      ON PROGRESS
                    </div>
                  )}
                </Link>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  
                  {/* Meta: Icon + Category + Year */}
                  <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-[#B5915F] mb-4">
                    <div className="flex items-center gap-1.5">
                      {getCategoryIcon(project.categories)}
                      <span>{getPrimaryCategoryLabel(project.categories)}</span>
                    </div>
                    <span className="text-charcoal/40">{project.year}</span>
                  </div>

                  {/* Title */}
                  <Link to={`/project/${project.slug}`}>
                    <h2 className="text-2xl font-display font-bold mb-3 group-hover:text-[#B5915F] transition-colors">
                      {project.name}
                    </h2>
                  </Link>

                  {/* Description */}
                  <p className="text-charcoal/70 text-sm leading-relaxed mb-6 flex-grow">
                    {project.shortDescription}
                  </p>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.techStack.map(tech => (
                      <span key={tech} className="px-3 py-1 bg-white border border-charcoal/10 rounded-md text-[11px] font-medium text-charcoal/60 whitespace-nowrap">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Button */}
                  <Link 
                    to={`/project/${project.slug}`}
                    className="inline-flex items-center justify-center gap-2 w-max px-6 py-3 bg-[#2D2E32] text-white text-sm font-semibold rounded-full hover:bg-black transition-colors mt-auto"
                  >
                    Lihat Detail <FiArrowUpRight size={16} />
                  </Link>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        )}

        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-20 text-charcoal/50">
            Tidak ada proyek dalam kategori ini.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
