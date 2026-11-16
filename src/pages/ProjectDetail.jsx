import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ArrowRight, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fetchProjectBySlug } from '../data/projects';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/ui/BackToTop';
import NotFound from './NotFound';
import { Button } from '../components/ui/Button';
import { FadeUp } from '../components/ui/MotionPrimitives';
import SpotlightCard from '../components/ui/SpotlightCard';
import { usePageMeta } from '../hooks/usePageMeta';

export default function ProjectDetail({ initialProject = null }) {
  const { token } = useParams();
  const { t, i18n } = useTranslation();

  const [project, setProject] = useState(initialProject);
  const [loading, setLoading] = useState(!initialProject);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (initialProject && initialProject.slug === token) {
      setProject(initialProject);
      setLoading(false);
      return undefined;
    }

    let isMounted = true;
    setLoading(true);
    fetchProjectBySlug(token).then((data) => {
      if (isMounted) {
        setProject(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [token, initialProject]);

  const isEn = i18n.language === 'en';
  const translatedSummary = project
    ? t(`projects.${project.slug}_desc`, { defaultValue: '' }) ||
      (isEn && project.shortDescriptionEn
        ? project.shortDescriptionEn
        : project.shortDescription)
    : '';

  usePageMeta({
    title: project ? `${project.name} — Case Study | Akbar Alfaidah` : 'Case Study | Akbar Alfaidah',
    description: translatedSummary || t('meta.projects_description'),
    path: token ? `/project/${token}` : '/projects',
    robots: project ? 'index,follow' : 'noindex,nofollow'
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-paper text-ink">
        <Navbar />
        <main className="flex-1 max-w-5xl w-full mx-auto px-6 pt-32 pb-20 animate-pulse space-y-8">
          <div className="h-5 w-32 bg-mist rounded" />
          <div className="h-12 w-2/3 bg-mist rounded" />
          <div className="aspect-[16/9] w-full bg-mist rounded-2xl" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return <NotFound />;
  }

  const challengeText =
    isEn && project.challengeEn ? project.challengeEn : project.challenge || translatedSummary;
  const solutionText =
    isEn && project.solutionEn ? project.solutionEn : project.solution || '';
  const highlightsList =
    isEn && Array.isArray(project.highlightsEn) && project.highlightsEn.length > 0
      ? project.highlightsEn
      : Array.isArray(project.highlights)
      ? project.highlights
      : [];

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink transition-colors duration-300">
      <Navbar />

      <main id="main-content" className="flex-1 pt-28 sm:pt-36 pb-20 px-6">
        <article className="max-w-5xl mx-auto space-y-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 min-h-[44px] text-base font-medium text-ink-muted hover:text-accent transition-colors"
            >
              <ArrowLeft size={17} aria-hidden="true" />
              <span>{t('projects.back_projects')}</span>
            </Link>

            {project.url && (
              <Button
                as="a"
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                size="sm"
              >
                <span>{t('projects.live_preview')}</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </Button>
            )}
          </div>

          <FadeUp className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {(project.categories || []).map((cat) => (
                <span
                  key={cat}
                  className="px-3.5 py-1 rounded-lg text-sm font-medium bg-mist text-ink border border-line"
                >
                  {cat}
                </span>
              ))}
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.06] text-ink">
              {project.name}
            </h1>

            <p className="text-lg sm:text-xl text-ink-muted max-w-3xl leading-relaxed">
              {translatedSummary}
            </p>
          </FadeUp>

          <dl className="grid grid-cols-2 md:grid-cols-4 gap-5 py-6 border-y border-line">
            <div>
              <dt className="text-sm font-medium text-ink-muted mb-1">
                {t('projects.client_label')}
              </dt>
              <dd className="text-base sm:text-lg font-semibold text-ink">{project.client}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-ink-muted mb-1">
                {t('projects.year_label')}
              </dt>
              <dd className="text-base sm:text-lg font-semibold text-ink tabular-nums">
                {project.year}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-ink-muted mb-1">
                {t('projects.role_label')}
              </dt>
              <dd className="text-base sm:text-lg font-semibold text-ink">{project.role}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-ink-muted mb-1">
                {t('projects.categories_label')}
              </dt>
              <dd className="text-base sm:text-lg font-semibold text-ink">
                {(project.categories || []).join(' / ')}
              </dd>
            </div>
          </dl>

          <FadeUp
            delay={0.08}
            className="rounded-2xl bg-surface border border-line p-2 sm:p-3 shadow-lg shadow-ink/[0.04] dark:shadow-black/30"
          >
            <div className="aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden bg-mist">
              <img
                src={project.src}
                alt={`${project.name} showcase`}
                width={1200}
                height={675}
                className="w-full h-full object-cover object-top"
              />
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SpotlightCard className="p-7 sm:p-8 space-y-3">
              <h2 className="font-display text-2xl font-bold text-ink">
                {t('projects.challenge_title')}
              </h2>
              <p className="text-base sm:text-[17px] text-ink-muted leading-relaxed">
                {challengeText}
              </p>
            </SpotlightCard>

            {solutionText && (
              <SpotlightCard className="p-7 sm:p-8 space-y-3">
                <h2 className="font-display text-2xl font-bold text-ink">
                  {t('projects.solution_title')}
                </h2>
                <p className="text-base sm:text-[17px] text-ink-muted leading-relaxed">
                  {solutionText}
                </p>
              </SpotlightCard>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {highlightsList.length > 0 && (
              <SpotlightCard className="md:col-span-7 p-7 sm:p-8 space-y-4">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">
                  {t('projects.highlights_title')}
                </h2>
                <ul className="space-y-3">
                  {highlightsList.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-base sm:text-[17px] text-ink">
                      <Check size={17} className="text-accent shrink-0 mt-1" aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            )}

            <SpotlightCard
              className={`${
                highlightsList.length > 0 ? 'md:col-span-5' : 'md:col-span-12'
              } p-7 sm:p-8 space-y-4`}
            >
              <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">
                {t('projects.tech_title')}
              </h2>
              <div className="flex flex-wrap gap-2">
                {(project.techStack || []).map((tech) => (
                  <span
                    key={tech}
                    className="px-3.5 py-1.5 rounded-lg font-mono text-sm font-medium bg-mist text-ink border border-line"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </SpotlightCard>
          </div>

          <SpotlightCard
            hoverLift={false}
            className="p-7 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
          >
            <div>
              <h2 className="font-display text-2xl font-bold text-ink mb-1">
                {t('projects.next_cta_title')}
              </h2>
              <p className="text-base text-ink-muted">{t('projects.next_cta_desc')}</p>
            </div>

            <Button as={Link} to="/#contact" variant="accent" size="md" className="shrink-0">
              <span>{t('projects.next_cta_button')}</span>
              <ArrowRight size={17} aria-hidden="true" />
            </Button>
          </SpotlightCard>
        </article>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
