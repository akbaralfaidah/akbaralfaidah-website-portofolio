import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiExternalLink } from 'react-icons/fi';
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
    <div className="bg-paper min-h-screen text-charcoal">
      {/* Header & Back Button */}
      <header className="pt-8 px-6 md:px-12 max-w-5xl mx-auto">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 px-4 py-2 bg-charcoal/5 rounded-full text-sm font-medium hover:bg-charcoal/10 transition-colors mb-12"
        >
          <FiArrowLeft /> Kembali
        </button>

        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{project.name}</h1>
        
        {/* Simple Metadata */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-charcoal/70 mb-8">
          <p><strong className="text-charcoal font-semibold">Klien:</strong> {project.client}</p>
          <p><strong className="text-charcoal font-semibold">Tahun:</strong> {project.year}</p>
          <p><strong className="text-charcoal font-semibold">Peran:</strong> {project.role}</p>
        </div>
      </header>

      {/* Project Image */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto mb-12">
        <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-charcoal/10 bg-white">
          <img 
            src={project.src} 
            alt={project.name} 
            className="w-full h-auto object-cover max-h-[70vh] block"
          />
        </div>
      </section>

      {/* Info & Direct Link */}
      <section className="px-6 md:px-12 max-w-3xl mx-auto mb-32">
        <h2 className="text-2xl font-bold mb-4">Tentang Project</h2>
        <p className="text-lg text-charcoal/80 mb-6 leading-relaxed">
          {project.challenge}
        </p>
        <p className="text-lg text-charcoal/80 mb-10 leading-relaxed">
          {project.solution}
        </p>

        {/* Tech Stack */}
        <div className="mb-10">
          <h3 className="text-sm uppercase tracking-widest text-charcoal/50 mb-3 font-semibold">Teknologi yang Digunakan</h3>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map(tech => (
              <span key={tech} className="px-3 py-1 bg-charcoal/5 rounded-md text-sm font-medium">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Live URL Button */}
        {project.url ? (
          <a 
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brass text-white font-bold rounded-full hover:bg-charcoal transition-colors shadow-md hover:shadow-lg"
          >
            Kunjungi Website <FiExternalLink size={18} />
          </a>
        ) : (
          <button disabled className="inline-flex items-center gap-2 px-8 py-4 bg-charcoal/10 text-charcoal/40 font-bold rounded-full cursor-not-allowed">
            Website Internal / Offline
          </button>
        )}
      </section>

      <Footer />
    </div>
  );
}
