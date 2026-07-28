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

export default function Experience() {
  return (
    <section id="experience" className="py-32 px-6 bg-paper relative overflow-hidden">
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-4">Perjalanan Karier</h2>
        </div>
        
        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-mist before:to-transparent">
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
      </div>
    </section>
  );
}
