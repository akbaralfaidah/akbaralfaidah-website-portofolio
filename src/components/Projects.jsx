import { useTranslation } from 'react-i18next';
import ProjectCard from './ProjectCard';
import { ContainerScroll } from './ui/ContainerScroll';

const PROJECTS = [
  {
    title: "Sistem Manajemen UMKM",
    description: "Aplikasi berbasis web terintegrasi untuk membantu operasional UMKM secara digital dengan fitur Point of Sales dan inventory.",
    stack: ["React", "Node.js", "PostgreSQL"],
    link: "#"
  },
  {
    title: "AI Resume Analyzer",
    description: "Platform cerdas yang menggunakan NLP untuk menganalisis dan memberikan feedback otomatis terhadap CV pelamar.",
    stack: ["Python", "FastAPI", "React", "OpenAI"],
    link: "#"
  },
  {
    title: "Wedding Planner App",
    description: "Aplikasi mobile cross-platform untuk calon pengantin mengatur jadwal, budget, dan vendor pernikahan.",
    stack: ["Flutter", "Firebase"],
    link: "#"
  }
];

export default function Projects() {
  const { t } = useTranslation();
  const featuredProject = PROJECTS[0];
  const otherProjects = PROJECTS.slice(1);

  return (
    <section id="projects" className="py-24 px-6 bg-paper relative overflow-hidden">
      
      {/* 3D Scroll Showcase for Featured Project */}
      <ContainerScroll
        titleComponent={
          <>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-charcoal mb-4">
              {t('nav.projects')} Unggulan
            </h2>
            <p className="text-charcoal/70 max-w-2xl mx-auto text-lg md:text-xl">
              Sebuah karya inovatif yang mendefinisikan ulang cara UMKM beroperasi.
            </p>
          </>
        }
      >
        <div className="absolute inset-0 w-full h-full bg-charcoal">
          <img 
            src="/img/hero-section.png" 
            alt={featuredProject.title}
            className="w-full h-full object-cover object-top opacity-50 group-hover:opacity-80 transition-opacity duration-500"
          />
          {/* Enhanced gradient for better readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
            <h3 className="text-3xl md:text-5xl font-display font-bold text-white mb-3">{featuredProject.title}</h3>
            <p className="text-gray-200 max-w-2xl mb-6 text-sm md:text-base leading-relaxed">{featuredProject.description}</p>
            <div className="flex flex-wrap gap-2">
              {featuredProject.stack.map(tech => (
                <span key={tech} className="px-4 py-1.5 bg-brass text-white text-xs md:text-sm font-mono rounded-full font-bold shadow-md">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </ContainerScroll>

      <div className="max-w-5xl mx-auto mt-10 md:mt-20">
        <h3 className="text-2xl font-display font-bold text-charcoal mb-8 border-b border-mist pb-4">Projek Lainnya</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {otherProjects.map((project, idx) => (
            <ProjectCard key={idx} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}
