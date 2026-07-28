import { 
  SiReact, SiNodedotjs, SiPython, SiFlutter, SiTailwindcss, SiJavascript, SiTypescript, SiPostgresql 
} from 'react-icons/si';

const EXPERIENCES = [
  {
    role: "AI Engineer",
    company: "Tech Startup",
    period: "2024 - Sekarang",
    description: "Mengembangkan model machine learning untuk analisis data dan integrasi API AI generatif ke dalam produk inti."
  },
  {
    role: "Mobile Developer",
    company: "Freelance",
    period: "2023 - 2024",
    description: "Membangun berbagai aplikasi mobile cross-platform menggunakan Flutter dan React Native untuk klien UMKM."
  },
  {
    role: "Web Developer",
    company: "Digital Agency",
    period: "2022 - 2023",
    description: "Membuat website company profile dan e-commerce dengan performa tinggi dan desain responsif."
  }
];

const TECH_STACK = [
  { name: 'JavaScript', icon: SiJavascript },
  { name: 'TypeScript', icon: SiTypescript },
  { name: 'React', icon: SiReact },
  { name: 'Node.js', icon: SiNodedotjs },
  { name: 'Tailwind CSS', icon: SiTailwindcss },
  { name: 'Python', icon: SiPython },
  { name: 'Flutter', icon: SiFlutter },
  { name: 'PostgreSQL', icon: SiPostgresql },
];

export default function Experience() {
  return (
    <section id="experience" className="py-32 px-6 bg-paper relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-4">Perjalanan Karier</h2>
          <p className="text-charcoal/70 max-w-2xl mx-auto">Riwayat profesional dan teknologi yang saya kuasai.</p>
        </div>
        
        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-mist before:to-transparent mb-32">
          {EXPERIENCES.map((exp, idx) => (
            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-paper bg-charcoal group-hover:bg-brass transition-colors shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <div className="w-2 h-2 rounded-full bg-paper" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-paper border border-mist rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col mb-2">
                  <span className="font-mono text-sm text-brass mb-1">{exp.period}</span>
                  <h3 className="font-display font-bold text-xl text-charcoal">{exp.role}</h3>
                  <span className="text-charcoal/60 font-medium">{exp.company}</span>
                </div>
                <p className="text-charcoal/80 text-sm leading-relaxed">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tech Stack Section */}
        <div className="mb-24">
          <h3 className="text-2xl font-display font-bold text-charcoal mb-8 text-center">Tech Stack</h3>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {TECH_STACK.map((tech, idx) => (
              <div key={idx} className="flex flex-col items-center group">
                <div className="w-16 h-16 rounded-2xl bg-mist/20 flex items-center justify-center text-charcoal/60 group-hover:text-brass group-hover:bg-brass/10 transition-all duration-300 shadow-sm group-hover:shadow-md mb-3 group-hover:-translate-y-2">
                  <tech.icon size={32} />
                </div>
                <span className="text-sm font-mono text-charcoal/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* GitHub Activity Section */}
        <div className="bg-charcoal/5 rounded-3xl p-8 border border-mist/50">
          <h3 className="text-2xl font-display font-bold text-charcoal mb-6 text-center">GitHub Activity</h3>
          <div className="w-full overflow-x-auto overflow-y-hidden hide-scrollbar flex justify-center">
            {/* The URL for ghchart. Using a fallback styling to ensure it looks okay in dark/light mode */}
            <img 
              src="https://ghchart.rshah.org/akbaralfaidah" 
              alt="Akbar Alfaidah's GitHub Activity Graph" 
              className="min-w-[700px] opacity-80 hover:opacity-100 transition-opacity dark:invert dark:hue-rotate-180"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
