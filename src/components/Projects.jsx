import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const PROJECTS = [
  {
    title: "Sistem Manajemen UMKM",
    description: "Aplikasi berbasis web terintegrasi untuk membantu operasional UMKM secara digital dengan fitur Point of Sales dan inventory.",
    stack: ["React", "Node.js", "PostgreSQL"],
    link: "/project/sistem-manajemen-umkm",
    image: "/img/hero-section.png", // Fallback images for now
    color: "bg-charcoal text-paper"
  },
  {
    title: "AI Resume Analyzer",
    description: "Platform cerdas yang menggunakan NLP untuk menganalisis dan memberikan feedback otomatis terhadap CV pelamar.",
    stack: ["Python", "FastAPI", "React", "OpenAI"],
    link: "/project/ai-resume-analyzer",
    image: "/img/akbar-1.jpg",
    color: "bg-mist text-charcoal"
  },
  {
    title: "Wedding Planner App",
    description: "Aplikasi mobile cross-platform untuk calon pengantin mengatur jadwal, budget, dan vendor pernikahan.",
    stack: ["Flutter", "Firebase"],
    link: "/project/wedding-planner-app",
    image: "/img/akbar-4.jpg",
    color: "bg-brass text-paper"
  }
];

export default function Projects() {
  const { t } = useTranslation();

  return (
    <section id="projects" className="py-32 px-6 relative z-10">
      <div className="max-w-5xl mx-auto mb-20 text-center md:text-left">
        <h2 className="text-5xl md:text-7xl font-display font-bold text-charcoal mb-6 tracking-tight">
          Selected <span className="text-brass">Works.</span>
        </h2>
        <p className="text-charcoal/70 text-lg md:text-xl max-w-xl mx-auto md:mx-0">
          Koleksi karya digital yang memadukan desain estetis kelas dunia dengan rekayasa perangkat lunak presisi tinggi.
        </p>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-6 md:gap-24 pb-32">
        {PROJECTS.map((project, idx) => (
          <div 
            key={idx} 
            className="sticky w-full h-[70vh] md:h-[60vh] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row border-4 border-paper group"
            style={{ 
              top: `calc(10vh + ${idx * 40}px)`,
              zIndex: idx + 1
            }}
          >
            <div className={`w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-between ${project.color} backdrop-blur-xl`}>
              <div>
                <span className="font-mono text-sm opacity-60 tracking-widest uppercase mb-4 block">0{idx + 1}</span>
                <h3 className="text-3xl md:text-5xl font-display font-bold mb-6 leading-tight">{project.title}</h3>
                <p className="text-base md:text-lg opacity-80 leading-relaxed mb-8">{project.description}</p>
              </div>
              <div>
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.stack.map(tech => (
                    <span key={tech} className="px-4 py-2 bg-black/10 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                      {tech}
                    </span>
                  ))}
                </div>
                <Link to={project.link} className="inline-flex items-center font-bold tracking-widest uppercase text-sm hover:gap-3 transition-all border-b-2 border-current pb-1">
                  View Detail <span className="ml-2">&rarr;</span>
                </Link>
              </div>
            </div>
            <div className="w-full md:w-1/2 h-full bg-charcoal overflow-hidden relative">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
