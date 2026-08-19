import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowUpRight, FiGlobe } from 'react-icons/fi';
import { FaGooglePlay } from 'react-icons/fa';
import AnimatedButton from './ui/AnimatedButton';
import { fetchProjects } from '../data/projects';

/**
 * Fix #5: Projects section now uses fetchProjects() from Supabase (single source of truth)
 * instead of a hardcoded PROJECTS array. Featured projects are filtered by slug.
 */
const FEATURED_SLUGS = ['bosdepot', 'siabsen', 'peka', 'chattask'];

function ProjectCard({ project, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation();

  const category = project.categories?.[0] || 'Website';
  const platform = project.categories?.includes('Mobile Apps') ? 'playstore' : 'website';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col h-full"
    >
      <div className="rounded-2xl overflow-hidden mb-6 aspect-[16/10] bg-mist dark:bg-[#3A3C41] shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-500 relative">
        <motion.img
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          src={project.src}
          alt={project.name}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <div className="flex flex-col flex-grow px-2">
        <div className="flex items-center gap-3 mb-3">
          <span className="flex items-center gap-1.5 text-[12px] font-mono font-bold tracking-[0.2em] uppercase text-brass bg-brass/10 px-2.5 py-1 rounded-full">
            {platform === 'playstore' ? <FaGooglePlay size={10} /> : <FiGlobe size={11} />}
            {category.toUpperCase()}
          </span>
          <span className="text-[13px] font-mono font-medium text-charcoal/40 dark:text-[#F2F0E8]/40">
            {project.year}
          </span>
        </div>

        <h3 className="text-2xl font-display font-bold text-charcoal dark:text-[#F2F0E8] tracking-tight mb-2 group-hover:text-brass transition-colors duration-300">
          {project.name}
        </h3>

        <p className="text-sm md:text-[0.95rem] text-charcoal/70 dark:text-paper/70 leading-relaxed mb-6 font-medium">
          {t(`projects.${project.slug}_desc`)}
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {(project.techStack || []).map((tech, i) => (
            <span key={i} className="text-[12px] font-mono text-charcoal/60 dark:text-[#F2F0E8]/60 border border-charcoal/10 dark:border-[#F2F0E8]/10 bg-mist/50 dark:bg-[#3A3C41]/50 px-2 py-1 rounded-md">
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-4">
          <AnimatedButton
            to={`/project/${project.slug}`}
            className="px-6 h-10 text-xs tracking-wide"
          >
            <span className="font-semibold text-sm tracking-wide">
              {t('projects.cta')}
            </span>
            <FiArrowUpRight size={18} className="transform transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
          </AnimatedButton>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const { t } = useTranslation();
  const [allProjects, setAllProjects] = useState([]);

  useEffect(() => {
    fetchProjects().then(setAllProjects);
  }, []);

  // Filter to featured projects only, preserve display order
  const featured = useMemo(() => {
    return FEATURED_SLUGS
      .map(slug => allProjects.find(p => p.slug === slug))
      .filter(Boolean);
  }, [allProjects]);

  return (
    <section id="projects" className="py-8 md:py-12 lg:py-14 relative z-10 bg-paper text-charcoal overflow-hidden dark:bg-[#1A1A1C] dark:text-[#F2F0E8]">

      {/* Header */}
      <div className="max-w-5xl mx-auto px-6 mb-12 md:mb-16 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-display font-bold text-charcoal dark:text-[#F2F0E8] mb-5 tracking-tight"
        >
          {t('projects.heading')}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-charcoal/60 dark:text-[#F2F0E8]/60 text-base md:text-lg max-w-2xl mx-auto"
        >
          {t('projects.subheading')}
        </motion.p>
      </div>

      {/* Projects Grid */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16">
          {featured.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>

      {/* View All */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="max-w-5xl mx-auto px-6 mt-20 text-center"
      >
        <AnimatedButton
          to="/projects"
          className="px-8 h-14 text-sm tracking-wide"
        >
          {t('projects.bottom_cta')}
          <FiArrowUpRight className="ml-1" size={16} />
        </AnimatedButton>
      </motion.div>
    </section>
  );
}
