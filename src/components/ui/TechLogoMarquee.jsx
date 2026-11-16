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
  { name: 'JavaScript', icon: SiJavascript, color: '#C5A300' },
  { name: 'Python', icon: SiPython, color: '#3776AB' },
  { name: 'React', icon: SiReact, color: '#087EA4' },
  { name: 'Next.js', icon: SiNextdotjs, color: 'currentColor' },
  { name: 'Vue.js', icon: SiVuedotjs, color: '#349E6E' },
  { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#0284C7' },
  { name: 'Flutter', icon: SiFlutter, color: '#02569B' },
  { name: 'Node.js', icon: SiNodedotjs, color: '#2F855A' },
  { name: 'Express', icon: SiExpress, color: 'currentColor' },
  { name: 'NestJS', icon: SiNestjs, color: '#E0234E' },
  { name: 'Laravel', icon: SiLaravel, color: '#E62E22' },
  { name: 'CodeIgniter', icon: SiCodeigniter, color: '#D93B1F' },
  { name: 'FastAPI', icon: SiFastapi, color: '#00897B' },
  { name: 'GraphQL', icon: SiGraphql, color: '#C5117B' },
  { name: 'PostgreSQL', icon: SiPostgresql, color: '#336791' },
  { name: 'MongoDB', icon: SiMongodb, color: '#2F855A' },
  { name: 'Supabase', icon: SiSupabase, color: '#1F9D68' },
  { name: 'Firebase', icon: SiFirebase, color: '#D97706' },
  { name: 'Docker', icon: SiDocker, color: '#1D72B8' },
  { name: 'Kubernetes', icon: SiKubernetes, color: '#326CE5' },
  { name: 'GitLab CI', icon: SiGitlab, color: '#E24329' },
  { name: 'GitHub Actions', icon: SiGithubactions, color: '#2088FF' },
  { name: 'Figma', icon: SiFigma, color: '#D9480F' }
];

function MarqueeTrack({ items, reverse = false }) {
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
              className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-surface border border-line text-ink shrink-0"
            >
              <Icon size={16} style={{ color: item.color }} aria-hidden="true" />
              <span className="font-mono text-xs font-medium tracking-tight text-ink whitespace-nowrap">
                {item.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TechLogoMarquee() {
  const rowOne = STACK_LOGOS.slice(0, 12);
  const rowTwo = STACK_LOGOS.slice(12);

  return (
    <div className="space-y-2.5 select-none">
      <MarqueeTrack items={rowOne} />
      <MarqueeTrack items={rowTwo} reverse />
    </div>
  );
}

export default TechLogoMarquee;
