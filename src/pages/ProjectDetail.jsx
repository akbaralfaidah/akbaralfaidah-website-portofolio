import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { getProjectBySlug, projects } from '../data/projects';
import { ScrollExpandMedia } from '../components/ui/ScrollExpandMedia';
import Footer from '../components/Footer';

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [nextProject, setNextProject] = useState(null);

  useEffect(() => {
    // Scroll to top on mount or when slug changes
    window.scrollTo(0, 0);
    
    const found = getProjectBySlug(slug);
    if (found) {
      setProject(found);
      // Find next project
      const currentIndex = projects.findIndex(p => p.slug === slug);
      const nextIndex = (currentIndex + 1) % projects.length;
      setNextProject(projects[nextIndex]);
    } else {
      setProject(null);
    }
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen bg-paper text-charcoal flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">Project Not Found</h1>
        <p className="text-charcoal/60 mb-8">The project you are looking for does not exist or has been removed.</p>
        <Link to="/" className="px-8 py-3 bg-charcoal text-paper rounded-full hover:bg-brass transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-paper min-h-screen text-charcoal selection:bg-brass selection:text-paper">
      {/* Sticky Back Button */}
      <div className="fixed top-6 left-6 md:top-8 md:left-8 z-50">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 px-5 py-2.5 bg-paper/80 backdrop-blur-md rounded-full shadow-sm border border-charcoal/5 font-medium text-sm text-charcoal hover:bg-charcoal hover:text-paper transition-all group"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-48 md:pb-24 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-medium tracking-tight mb-8 md:mb-16 leading-[1.05]">
            {project.name}
          </h1>
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 border-t border-charcoal/10 pt-8 mt-12">
            <div>
              <p className="text-xs uppercase tracking-widest text-charcoal/50 mb-2">Client</p>
              <p className="font-medium">{project.client}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-charcoal/50 mb-2">Year</p>
              <p className="font-medium">{project.year}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-charcoal/50 mb-2">Role</p>
              <p className="font-medium">{project.role}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-charcoal/50 mb-2">Tech Stack</p>
              <p className="font-medium">{project.techStack.slice(0, 2).join(', ')}{project.techStack.length > 2 ? '...' : ''}</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Hero Media (Parallax Expand) */}
      <div className="h-[100vh] md:h-[130vh] relative mb-24 md:mb-40">
        <ScrollExpandMedia src={project.src} alt={project.name} />
      </div>

      {/* Challenge & Solution (Split Layout) */}
      <section className="max-w-7xl mx-auto px-6 mb-32 md:mb-48">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
          
          {/* Challenge */}
          <div className="col-span-1 md:col-span-12 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 mb-24">
            <div className="md:col-span-4">
              <h2 className="text-3xl md:text-4xl font-display font-medium">The Challenge</h2>
            </div>
            <div className="md:col-span-8 md:col-start-6">
              <p className="text-lg md:text-xl text-charcoal/80 leading-relaxed">
                {project.challenge}
              </p>
            </div>
          </div>

          {/* Solution */}
          <div className="col-span-1 md:col-span-12 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12">
            <div className="md:col-span-4">
              <h2 className="text-3xl md:text-4xl font-display font-medium">The Solution</h2>
            </div>
            <div className="md:col-span-8 md:col-start-6">
              <p className="text-lg md:text-xl text-charcoal/80 leading-relaxed mb-12">
                {project.solution}
              </p>
              
              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-3">
                {project.techStack.map(tech => (
                  <span key={tech} className="px-4 py-2 border border-charcoal/15 rounded-full text-sm font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Next Project CTA */}
      {nextProject && (
        <section className="border-t border-charcoal/10 bg-paper transition-colors duration-500 hover:bg-charcoal hover:text-paper group cursor-pointer" onClick={() => navigate(`/project/${nextProject.slug}`)}>
          <div className="max-w-7xl mx-auto px-6 py-24 md:py-40 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <p className="text-sm uppercase tracking-widest opacity-60 mb-4 transition-opacity group-hover:opacity-80">Next Project</p>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-medium tracking-tight">
                {nextProject.name}
              </h2>
            </div>
            <div className="hidden md:flex w-24 h-24 rounded-full border border-current items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <FiArrowRight size={32} />
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
