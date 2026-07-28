import ProjectCard from './ProjectCard';

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
  return (
    <section id="projects" className="py-32 px-6 bg-paper relative">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-4">Projek Unggulan</h2>
          <p className="text-charcoal/70 max-w-2xl mx-auto">Beberapa karya terbaik yang merepresentasikan keahlian saya dalam memecahkan masalah melalui teknologi.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.map((project, idx) => (
            <ProjectCard key={idx} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}
