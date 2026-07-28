import { Link } from 'react-router-dom';

export default function ProjectCard({ title, description, stack, link }) {
  // Generate a simple slug from the title
  const slug = title.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <Link 
      to={`/project/${slug}`}
      className="group block bg-paper border border-mist p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 hover:border-brass transition-all duration-300"
    >
      <div className="flex flex-col h-full">
        <h3 className="text-2xl font-display font-bold text-charcoal mb-3 group-hover:text-brass transition-colors">
          {title}
        </h3>
        <p className="text-charcoal/70 mb-6 flex-grow">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {stack.map((tech, i) => (
            <span key={i} className="px-3 py-1 bg-mist/50 text-charcoal text-xs font-mono rounded-full">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
