import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fetchProjects } from '../data/projects';
import { Button } from './ui/Button';

export default function Projects() {
  const { t, i18n } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchProjects().then((data) => {
      if (isMounted) {
        setProjects(data.slice(0, 6));
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const isEn = i18n.language === 'en';

  return (
    <section id="projects" className="py-16 sm:py-24 px-6 bg-paper text-ink border-b border-line">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-14">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-brass mb-3">
              {t('projects.eyebrow')}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink mb-3">
              {t('projects.heading')}
            </h2>
            <p className="text-base sm:text-lg text-ink-muted leading-relaxed">
              {t('projects.subheading')}
            </p>
          </div>

          <Button as={Link} to="/projects" variant="outline" size="md" className="self-start md:self-auto">
            <span>{t('projects.bottom_cta')}</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-surface border border-line overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] bg-mist" />
                <div className="p-6 space-y-3">
                  <div className="h-4 w-24 bg-mist rounded" />
                  <div className="h-6 w-2/3 bg-mist rounded" />
                  <div className="h-12 w-full bg-mist rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, idx) => {
              const translatedDesc = t(`projects.${project.slug}_desc`, {
                defaultValue: ''
              });
              const desc =
                translatedDesc ||
                (isEn && project.shortDescriptionEn
                  ? project.shortDescriptionEn
                  : project.shortDescription);

              return (
                <article
                  key={project.id || project.slug}
                  className="group rounded-2xl bg-surface border border-line overflow-hidden flex flex-col justify-between hover:border-brass/70 transition-colors shadow-sm"
                >
                  <div>
                    <Link
                      to={`/project/${project.slug}`}
                      className="block relative aspect-[4/3] bg-mist overflow-hidden border-b border-line"
                      aria-label={`${project.name} — ${t('projects.cta')}`}
                    >
                      <img
                        src={project.src}
                        alt={`${project.name} screenshot`}
                        width={800}
                        height={600}
                        loading={idx < 3 ? 'eager' : 'lazy'}
                        decoding="async"
                        className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </Link>

                    <div className="p-6 pb-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex flex-wrap gap-1.5">
                          {(project.categories || []).map((cat) => (
                            <span
                              key={cat}
                              className="px-2.5 py-0.5 rounded-md font-mono text-[11px] font-medium bg-mist text-ink border border-line"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                        <span className="font-mono text-xs text-ink-muted tabular-nums">
                          {project.year}
                        </span>
                      </div>

                      <h3 className="font-display text-xl font-bold tracking-tight text-ink mb-2">
                        <Link
                          to={`/project/${project.slug}`}
                          className="hover:text-brass transition-colors"
                        >
                          {project.name}
                        </Link>
                      </h3>

                      <p className="text-sm text-ink-muted leading-relaxed line-clamp-2">
                        {desc}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-line flex items-center justify-between gap-3">
                    <span className="font-mono text-xs text-ink-muted truncate">
                      {project.client}
                    </span>
                    <Link
                      to={`/project/${project.slug}`}
                      className="min-h-[44px] inline-flex items-center gap-1.5 text-sm font-semibold text-brass hover:text-brass-hover shrink-0 transition-colors"
                    >
                      <span>{t('projects.cta')}</span>
                      <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
