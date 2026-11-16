import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, ArrowRight, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fetchProjectBySlug, fetchProjects } from '../data/projects';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MeshGradient from '../components/ui/MeshGradient';
import NotFound from './NotFound';
import { Button } from '../components/ui/Button';
import { FadeUp } from '../components/ui/MotionPrimitives';
import { STUDIO_EASE } from '../lib/motion';
import SpotlightCard from '../components/ui/SpotlightCard';
import { usePageMeta } from '../hooks/usePageMeta';

export default function ProjectDetail({ initialProject = null }) {
  const { token } = useParams();
  const { t, i18n } = useTranslation();

  const [project, setProject] = useState(initialProject);
  const [nextProject, setNextProject] = useState(null);
  const [loading, setLoading] = useState(!initialProject);

  useEffect(() => {
    window.scrollTo(0, 0);
    let isMounted = true;

    const resolve = async () => {
      let current = initialProject && initialProject.slug === token ? initialProject : null;
      if (!current) {
        setLoading(true);
        current = await fetchProjectBySlug(token);
      }

      const all = await fetchProjects();
      if (!isMounted) return;

      setProject(current);
      setLoading(false);

      if (current && Array.isArray(all) && all.length > 1) {
        const idx = all.findIndex((p) => p.slug === current.slug);
        const nextIdx = idx >= 0 ? (idx + 1) % all.length : 0;
        if (all[nextIdx] && all[nextIdx].slug !== current.slug) {
          setNextProject(all[nextIdx]);
        }
      }
    };

    resolve();
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
    title: project ? `${project.name} | Akbar Alfaidah` : 'Proyek | Akbar Alfaidah',
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
          <div className="aspect-video w-full bg-mist rounded-2xl" />
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

      <main id="main-content" className="flex-1">
        {/* Atmospheric Dark Obsidian Exhibition Stage */}
        <section className="relative bg-[#0B0C10] text-slate-100 pt-28 sm:pt-36 pb-20 sm:pb-24 px-5 sm:px-6 border-b border-white/10 overflow-hidden">
          <MeshGradient dark />

          <div className="relative z-10 max-w-5xl mx-auto space-y-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 min-h-[44px] text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                <span>{t('projects.back_projects')}</span>
              </Link>

              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[40px] px-4 py-2 rounded-lg bg-white text-[#0B0C10] hover:bg-slate-200 text-sm font-medium inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>{t('projects.live_preview')}</span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: STUDIO_EASE }}
              className="space-y-4"
            >
              <div className="flex flex-wrap gap-3 font-mono text-xs uppercase tracking-wider text-blue-400">
                {(project.categories || []).join(' · ')}
              </div>

              <h1 className="font-display text-4xl sm:text-6xl font-semibold tracking-[-0.03em] leading-[1.04] text-white">
                {project.name}
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 max-w-3xl leading-relaxed">
                {translatedSummary}
              </p>
            </motion.div>

            {/* Metadata Strip */}
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-white/10">
              <div>
                <dt className="text-sm text-slate-400 mb-1">{t('projects.client_label')}</dt>
                <dd className="text-base sm:text-lg font-semibold text-white">{project.client}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-400 mb-1">{t('projects.year_label')}</dt>
                <dd className="text-base sm:text-lg font-semibold text-white tabular-nums">
                  {project.year}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate-400 mb-1">{t('projects.role_label')}</dt>
                <dd className="text-base sm:text-lg font-semibold text-white">{project.role}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-400 mb-1">{t('projects.categories_label')}</dt>
                <dd className="text-base sm:text-lg font-semibold text-white">
                  {(project.categories || []).join(' / ')}
                </dd>
              </div>
            </dl>

            {/* HD 1920x1080 Showcase Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.12, ease: STUDIO_EASE }}
              className="rounded-2xl bg-white/5 p-2 sm:p-3 border border-white/15 shadow-2xl"
            >
              <div className="aspect-video rounded-xl overflow-hidden bg-slate-900">
                <img
                  src={project.src}
                  alt={`${project.name} HD showcase`}
                  width={1920}
                  height={1080}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Open Editorial Narrative & Specs */}
        <section className="relative py-20 px-6 bg-paper overflow-hidden">
          <div className="film-grain pointer-events-none absolute inset-0" aria-hidden="true" />

          <div className="relative z-10 max-w-5xl mx-auto space-y-16">
            {/* 01 Challenge / 02 Solution Editorial Chapters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 pb-14 border-b border-line">
              <FadeUp className="border-l-2 border-accent pl-6 space-y-3">
                <span className="font-mono text-sm font-bold text-accent">01</span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                  {t('projects.challenge_title')}
                </h2>
                <p className="text-base sm:text-lg text-ink-muted leading-relaxed">
                  {challengeText}
                </p>
              </FadeUp>

              {solutionText && (
                <FadeUp delay={0.08} className="border-l-2 border-emerald-500 pl-6 space-y-3">
                  <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    02
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                    {t('projects.solution_title')}
                  </h2>
                  <p className="text-base sm:text-lg text-ink-muted leading-relaxed">
                    {solutionText}
                  </p>
                </FadeUp>
              )}
            </div>

            {/* Highlights & Stack */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {highlightsList.length > 0 && (
                <FadeUp className="md:col-span-7 space-y-5">
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                    {t('projects.highlights_title')}
                  </h2>
                  <ul className="space-y-4">
                    {highlightsList.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-3 text-base sm:text-lg text-ink"
                      >
                        <span className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 mt-0.5">
                          <Check size={16} aria-hidden="true" />
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </FadeUp>
              )}

              <FadeUp
                delay={0.08}
                className={`${
                  highlightsList.length > 0 ? 'md:col-span-5' : 'md:col-span-12'
                }`}
              >
                <SpotlightCard hoverLift={false} className="p-6 sm:p-8 space-y-4">
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
              </FadeUp>
            </div>

            {/* Interactive Next Project Teaser */}
            {nextProject && (
              <FadeUp>
                <Link
                  to={`/project/${nextProject.slug}`}
                  className="group block rounded-2xl bg-surface border border-line hover:border-accent/60 p-6 sm:p-8 shadow-sm hover:shadow-xl hover:shadow-accent/[0.06] transition-all"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-7 space-y-2">
                      <p className="text-sm font-semibold text-accent">
                        {t('projects.next_project_label')}
                      </p>
                      <h2 className="font-display text-2xl sm:text-4xl font-bold text-ink group-hover:text-accent transition-colors inline-flex items-center gap-3">
                        <span>{nextProject.name}</span>
                        <ArrowRight
                          size={24}
                          className="transition-transform duration-200 group-hover:translate-x-1.5"
                          aria-hidden="true"
                        />
                      </h2>
                      <p className="text-base text-ink-muted line-clamp-2">
                        {t(`projects.${nextProject.slug}_desc`, {
                          defaultValue: nextProject.shortDescription
                        })}
                      </p>
                    </div>

                    <div className="md:col-span-5 aspect-video rounded-xl overflow-hidden bg-mist border border-line">
                      <img
                        src={nextProject.src}
                        alt={`${nextProject.name} preview`}
                        width={1920}
                        height={1080}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    </div>
                  </div>
                </Link>
              </FadeUp>
            )}

            {/* Discussion CTA */}
            <SpotlightCard
              hoverLift={false}
              className="p-7 sm:p-9 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink mb-1.5">
                  {t('projects.next_cta_title')}
                </h2>
                <p className="text-base sm:text-lg text-ink-muted">
                  {t('projects.next_cta_desc')}
                </p>
              </div>

              <Button as={Link} to="/#contact" variant="accent" size="lg" className="shrink-0">
                <span>{t('projects.next_cta_button')}</span>
                <ArrowRight size={17} aria-hidden="true" />
              </Button>
            </SpotlightCard>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
