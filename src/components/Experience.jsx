import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  SiReact, SiNodedotjs, SiPython, SiFlutter, SiTailwindcss, SiJavascript, SiTypescript, SiPostgresql,
  SiNextdotjs, SiVuedotjs, SiExpress, SiNestjs, SiFastapi, SiMongodb, SiDocker, SiKubernetes, SiGitlab, SiGithub, SiGraphql, SiFirebase,
  SiLaravel, SiCodeigniter, SiSupabase, SiGithubactions
} from 'react-icons/si';
import { TbBrain } from 'react-icons/tb';

const EXPERIENCES = [
  {
    role: "Programmer",
    company: "Depot Kayu & Toko Bangunan Esa",
    period: "Januari 2026 - Sekarang",
    description: "Membangun POS & manajemen inventaris mobile (Flutter/Firebase), serta merancang logika backend kalkulasi stok."
  },
  {
    role: "Freelance Web & Mobile Developer",
    company: "Independent",
    period: "Januari 2024 - Sekarang",
    description: "Mengerjakan proyek web & aplikasi mobile independen untuk klien UMKM end-to-end."
  },
  {
    role: "Intern IT Operation",
    company: "PT Telkomsel Regional Sumbagsel",
    period: "Mei 2025 - Juni 2025",
    description: "Merancang prototipe CI/CD Pipeline (GitLab) dan alur kerja Dev-Staging-Production."
  },
  {
    role: "Full-Stack Web Developer",
    company: "Bidik Karier",
    period: "Agustus 2024 - November 2024",
    description: "Mengembangkan platform E-Learning (LMS) CPNS end-to-end (PHP/MySQL)."
  },
  {
    role: "Intern IT",
    company: "PT PLN UBP Indonesia Power",
    period: "Juni 2024 - Juli 2024",
    description: "Mengembangkan portal artikel digital dan profil perusahaan untuk efisiensi informasi internal."
  },
  {
    role: "Web Developer",
    company: "INOVASITUS",
    period: "Januari 2024 - Januari 2025",
    description: "Membangun 7+ website fungsional & responsif untuk klien UMKM (HTML/CSS/JS/Bootstrap)."
  }
];

const TECH_CATEGORIES = [
  {
    title: "Languages",
    maxWidth: "max-w-[500px]",
    skills: [
      { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
      { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
      { name: 'Python', icon: SiPython, color: '#3776AB' },
    ]
  },
  {
    title: "Frontend & Mobile",
    maxWidth: "max-w-[500px]", // Forces 3 on top, 2 on bottom
    skills: [
      { name: 'React', icon: SiReact, color: '#61DAFB' },
      { name: 'Next.js', icon: SiNextdotjs, color: '#A0A0A0' },
      { name: 'Vue.js', icon: SiVuedotjs, color: '#4FC08D' },
      { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
      { name: 'Flutter', icon: SiFlutter, color: '#02569B' },
    ]
  },
  {
    title: "Backend & API",
    maxWidth: "max-w-[650px]", // Forces 4 on top, 3 on bottom
    skills: [
      { name: 'Node.js', icon: SiNodedotjs, color: '#339933' },
      { name: 'Express', icon: SiExpress, color: '#A0A0A0' },
      { name: 'NestJS', icon: SiNestjs, color: '#E0234E' },
      { name: 'Laravel', icon: SiLaravel, color: '#FF2D20' },
      { name: 'CodeIgniter', icon: SiCodeigniter, color: '#EE4323' },
      { name: 'FastAPI', icon: SiFastapi, color: '#009688' },
      { name: 'GraphQL', icon: SiGraphql, color: '#E10098' },
    ]
  },
  {
    title: "Database & Cloud",
    maxWidth: "max-w-[340px]", // Forces 2 on top, 2 on bottom
    skills: [
      { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
      { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
      { name: 'Supabase', icon: SiSupabase, color: '#3ECF8E' },
      { name: 'Firebase', icon: SiFirebase, color: '#FFCA28' },
    ]
  },
  {
    title: "DevOps & Tools",
    maxWidth: "max-w-[480px]", // Forces 3 on top, 3 on bottom
    skills: [
      { name: 'Docker', icon: SiDocker, color: '#2496ED' },
      { name: 'Kubernetes', icon: SiKubernetes, color: '#326CE5' },
      { name: 'GitLab', icon: SiGitlab, color: '#FC6D26' },
      { name: 'CI/CD', icon: SiGithubactions, color: '#2088FF' },
      { name: 'GitHub', icon: SiGithub, color: '#A0A0A0' },
      { name: 'LLMs & AI', icon: TbBrain, color: '#74AA9C' },
    ]
  }
];

export default function Experience() {
  const { t } = useTranslation();
  const experiences = t('experience.items', { returnObjects: true });
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });
  
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const renderTechCard = (tech, key) => (
    <div 
      key={key} 
      className="relative flex flex-row items-center justify-center w-auto px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl bg-paper dark:bg-[#3A3C41] border border-mist/50 dark:border-[#F2F0E8]/10 shadow-sm hover:-translate-y-2 transition-all duration-300 group cursor-pointer gap-3 z-10 hover:z-20 overflow-hidden"
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 4px 12px -2px ${tech.color}40, 0 0 8px 0 ${tech.color}20 inset`;
        e.currentTarget.style.borderColor = tech.color;
        const icon = e.currentTarget.querySelector('.icon-svg');
        if (icon) {
          icon.style.filter = `drop-shadow(0 0 10px ${tech.color})`;
          icon.style.transform = 'scale(1.2) rotate(5deg)';
        }
        const bg = e.currentTarget.querySelector('.bg-glow');
        if (bg) {
          bg.style.opacity = '0.1';
          bg.style.backgroundColor = tech.color;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '';
        e.currentTarget.style.borderColor = '';
        const icon = e.currentTarget.querySelector('.icon-svg');
        if (icon) {
          icon.style.filter = '';
          icon.style.transform = '';
        }
        const bg = e.currentTarget.querySelector('.bg-glow');
        if (bg) {
          bg.style.opacity = '0';
          bg.style.backgroundColor = 'transparent';
        }
      }}
    >
      <div className="bg-glow absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none" />
      
      <div 
        className="transition-all duration-300 shrink-0 icon-svg relative z-10"
        style={{ color: tech.color }}
      >
        <tech.icon size={20} className="sm:w-7 sm:h-7" />
      </div>
      <span className="text-xs sm:text-sm font-display font-bold tracking-wide text-charcoal dark:text-[#F2F0E8] relative z-10">
        {tech.name}
      </span>
    </div>
  );

  return (
    <section id="experience" className="py-8 md:py-12 lg:py-14 px-6 bg-paper dark:bg-[#1A1A1C] relative overflow-hidden">

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-charcoal dark:text-[#F2F0E8] mb-4">{t('experience.heading')}</h2>
          <p className="text-charcoal/70 dark:text-[#F2F0E8]/70 max-w-2xl mx-auto">{t('experience.subheading')}</p>
        </div>
        
        <div ref={containerRef} className="space-y-8 md:space-y-12 relative mb-32">
          <div className="absolute inset-y-0 left-[20px] md:left-1/2 md:-ml-[3px] w-1.5 bg-charcoal/10 dark:bg-[#FAF8ED]/10 rounded-full" />
          
          <motion.div 
            style={{ height: lineHeight }}
            className="absolute top-0 left-[20px] md:left-1/2 md:-ml-[3px] w-1.5 bg-gradient-to-b from-brass via-brass to-transparent rounded-full origin-top z-0" 
          />

          {Array.isArray(experiences) && experiences.map((exp, idx) => (
            <div key={idx} className="relative flex flex-col md:flex-row items-start md:items-center justify-between group is-active">
              
              <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-[3px] border-paper bg-charcoal group-hover:bg-brass transition-all duration-500 shadow-xl shrink-0 z-10 group-hover:scale-125">
                <div className="w-2 h-2 rounded-full bg-paper" />
              </div>



              <div className={`w-[calc(100%-3.5rem)] ml-auto md:ml-0 md:w-[calc(50%-2.5rem)] p-5 md:p-6 bg-paper dark:bg-[#3A3C41] border border-mist dark:border-[#FAF8ED]/10 rounded-2xl shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1 ${idx % 2 === 0 ? 'md:order-2 md:text-left' : 'md:order-1 md:text-right'}`}>
                <div className={`mb-3`}>
                  <span className="font-mono text-xs md:text-sm text-brass font-bold whitespace-nowrap">{exp.period}</span>
                </div>
                
                <div className="flex flex-col mb-2.5">
                  <h3 className="font-display font-bold text-lg md:text-xl text-charcoal dark:text-[#F2F0E8] mb-1">{exp.role}</h3>
                  <span className="text-charcoal/60 dark:text-[#F2F0E8]/70 font-medium text-sm md:text-base">{exp.company}</span>
                </div>
                <p className="text-charcoal/80 dark:text-[#F2F0E8]/80 leading-relaxed text-sm">{exp.description}</p>
              </div>

              <div className={`hidden md:block w-[calc(50%-2.5rem)] ${idx % 2 === 0 ? 'order-1' : 'order-2'}`}>
                {/* Spacer to maintain timeline layout */}
              </div>
            </div>
          ))}
        </div>


        {/* GitHub Activity Section */}
        <div className="flex justify-center max-w-4xl mx-auto">
          <div className="w-full max-w-2xl bg-paper dark:bg-[#3A3C41] rounded-[2rem] p-6 sm:p-8 border border-mist dark:border-[#FAF8ED]/10 shadow-md hover:shadow-lg transition-all duration-500">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <SiGithub size={24} className="text-charcoal dark:text-[#F2F0E8]" />
                <h3 className="text-xl font-display font-bold text-charcoal dark:text-[#F2F0E8]">GitHub Contributions</h3>
              </div>
            </div>

            {/* Username Badge */}
            <a 
              href="https://github.com/akbaralfaidah" 
              target="_blank" 
              rel="noreferrer"
              className="group flex items-center justify-center gap-2 w-full py-3 mb-8 rounded-xl bg-mist/20 dark:bg-charcoal/30 hover:bg-mist/50 dark:hover:bg-charcoal/50 border border-mist/50 dark:border-[#FAF8ED]/5 transition-colors"
            >
              <span className="font-mono text-sm font-semibold text-charcoal/80 dark:text-[#F2F0E8]/80 group-hover:text-brass transition-colors">
                @akbaralfaidah
              </span>
              <span className="text-charcoal/60 group-hover:text-brass transition-all opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transform duration-300">
                ↗
              </span>
            </a>

            {/* Graph Container */}
            <div className="w-full overflow-x-auto overflow-y-hidden hide-scrollbar flex justify-center pb-2">
              <img 
                src="https://ghchart.rshah.org/akbaralfaidah" 
                alt="Akbar Alfaidah's GitHub Activity Graph" 
                className="min-w-[700px] opacity-90 hover:opacity-100 transition-opacity dark:invert dark:hue-rotate-180"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
