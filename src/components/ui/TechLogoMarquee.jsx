import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiReact,
  SiNextdotjs,
  SiVuedotjs,
  SiTailwindcss,
  SiFlutter,
  SiNodedotjs,
  SiExpress,
  SiNestjs,
  SiLaravel,
  SiCodeigniter,
  SiFastapi,
  SiGraphql,
  SiPostgresql,
  SiMongodb,
  SiSupabase,
  SiFirebase,
  SiDocker,
  SiKubernetes,
  SiGitlab,
  SiGithubactions,
  SiFigma
} from 'react-icons/si';

const STACK_LOGOS = [
  { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  { name: 'JavaScript', icon: SiJavascript, color: '#EAB308' },
  { name: 'Python', icon: SiPython, color: '#3B82F6' },
  { name: 'React', icon: SiReact, color: '#38BDF8' },
  { name: 'Next.js', icon: SiNextdotjs, color: 'currentColor' },
  { name: 'Vue.js', icon: SiVuedotjs, color: '#34D399' },
  { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#0EA5E9' },
  { name: 'Flutter', icon: SiFlutter, color: '#38BDF8' },
  { name: 'Node.js', icon: SiNodedotjs, color: '#22C55E' },
  { name: 'Express', icon: SiExpress, color: 'currentColor' },
  { name: 'NestJS', icon: SiNestjs, color: '#F43F5E' },
  { name: 'Laravel', icon: SiLaravel, color: '#EF4444' },
  { name: 'CodeIgniter', icon: SiCodeigniter, color: '#F97316' },
  { name: 'FastAPI', icon: SiFastapi, color: '#14B8A6' },
  { name: 'GraphQL', icon: SiGraphql, color: '#EC4899' },
  { name: 'PostgreSQL', icon: SiPostgresql, color: '#60A5FA' },
  { name: 'MongoDB', icon: SiMongodb, color: '#22C55E' },
  { name: 'Supabase', icon: SiSupabase, color: '#3ECF8E' },
  { name: 'Firebase', icon: SiFirebase, color: '#F59E0B' },
  { name: 'Docker', icon: SiDocker, color: '#38BDF8' },
  { name: 'Kubernetes', icon: SiKubernetes, color: '#60A5FA' },
  { name: 'GitLab CI', icon: SiGitlab, color: '#FB923C' },
  { name: 'GitHub Actions', icon: SiGithubactions, color: '#60A5FA' },
  { name: 'Figma', icon: SiFigma, color: '#F97316' }
];

function MarqueeTrack({ items, reverse = false, darkSurface = false }) {
  const repeated = [...items, ...items];

  return (
    <div
      className="relative overflow-hidden py-1"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)'
      }}
    >
      <div
        className="flex gap-3 w-max animate-marquee"
        style={reverse ? { animationDirection: 'reverse' } : undefined}
      >
        {repeated.map((item, idx) => {
          const Icon = item.icon;
          const isDuplicate = idx >= items.length;
          return (
            <div
              key={`${item.name}-${idx}`}
              aria-hidden={isDuplicate ? 'true' : undefined}
              className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border shrink-0 transition-colors ${
                darkSurface
                  ? 'bg-white/[0.04] border-white/10 text-slate-100 hover:border-blue-400/50'
                  : 'bg-surface border-line text-ink hover:border-accent/50'
              }`}
            >
              <Icon size={18} style={{ color: item.color }} aria-hidden="true" />
              <span className="font-mono text-sm font-medium tracking-tight whitespace-nowrap">
                {item.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TechLogoMarquee({ darkSurface = false }) {
  const rowOne = STACK_LOGOS.slice(0, 12);
  const rowTwo = STACK_LOGOS.slice(12);

  return (
    <div className="space-y-3 select-none">
      <MarqueeTrack items={rowOne} darkSurface={darkSurface} />
      <MarqueeTrack items={rowTwo} reverse darkSurface={darkSurface} />
    </div>
  );
}

export default TechLogoMarquee;
