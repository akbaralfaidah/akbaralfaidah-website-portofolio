import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { heroProjects } from '../data/projects';
import { Button } from './ui/Button';
import { MeshGradient } from './ui/MeshGradient';

export default function Hero() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const facts = t('hero.facts', { returnObjects: true }) || [];
  const activeProject = heroProjects[activeIndex] || heroProjects[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + heroProjects.length) % heroProjects.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % heroProjects.length);
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative bg-paper text-ink pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 px-6 border-b border-line overflow-hidden"
    >
      <MeshGradient />

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Column — Value Proposition */}
        <div className="lg:col-span-7 flex flex-col items-start">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-surface border border-line text-xs font-mono font-medium uppercase tracking-[0.12em] text-ink mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400" aria-hidden="true" />
            <span>{t('hero.badge')}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-[3.35rem] font-extrabold tracking-tight leading-[1.08] text-ink mb-5">
            {t('hero.headline')}
          </h1>

          <p className="text-base sm:text-lg text-ink-muted leading-relaxed max-w-2xl mb-8">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-wrap items-center gap-3.5 mb-10 w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              onClick={scrollToContact}
              className="w-full sm:w-auto"
            >
              <span>{t('hero.cta_primary')}</span>
              <ArrowRight size={17} aria-hidden="true" />
            </Button>

            <Button
              as={Link}
              to="/projects"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <span>{t('hero.cta_secondary')}</span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </Button>
          </div>

          <dl className="w-full grid grid-cols-2 sm:grid-cols-3 gap-5 pt-6 border-t border-line">
            {Array.isArray(facts) &&
              facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted mb-1">
                    {fact.label}
                  </dt>
                  <dd className="font-display text-sm sm:text-base font-bold text-ink">
                    {fact.value}
                  </dd>
                </div>
              ))}
          </dl>
        </div>

        {/* Right Column — Interactive Project Showcase Stage */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl bg-surface border border-line shadow-sm overflow-hidden">
            {/* Stage Header & Controls */}
            <div className="px-4 sm:px-5 py-3 border-b border-line flex items-center justify-between gap-2 bg-mist/40">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono text-xs font-semibold text-brass tabular-nums">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(heroProjects.length).padStart(2, '0')}
                </span>
                <span className="text-xs text-ink-muted truncate hidden sm:inline">
                  {t('hero.stage_label')}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg border border-line bg-surface text-ink hover:border-brass hover:text-brass transition-colors"
                  aria-label="Previous project preview"
                >
                  <ChevronLeft size={16} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg border border-line bg-surface text-ink hover:border-brass hover:text-brass transition-colors"
                  aria-label="Next project preview"
                >
                  <ChevronRight size={16} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Active Project Screenshot */}
            <Link
              to={`/project/${activeProject.slug}`}
              className="group block relative aspect-[4/3] bg-mist overflow-hidden border-b border-line"
            >
              <img
                src={activeProject.src}
                alt={`${activeProject.name} interface preview`}
                width={800}
                height={600}
                decoding="async"
                fetchPriority="high"
                className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </Link>

            {/* Stage Selector Tabs */}
            <div className="p-4 sm:p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-brass mb-1">
                    {activeProject.category}
                  </p>
                  <h2 className="font-display text-lg font-bold text-ink truncate">
                    {activeProject.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-ink-muted line-clamp-2 mt-0.5">
                    {activeProject.summary}
                  </p>
                </div>

                <Link
                  to={`/project/${activeProject.slug}`}
                  className="shrink-0 min-h-[44px] px-3.5 py-2 rounded-lg border border-line bg-paper text-xs font-medium text-ink hover:border-brass hover:text-brass inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>{t('hero.stage_action')}</span>
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </div>

              <div
                role="tablist"
                aria-label="Featured projects selector"
                className="flex flex-wrap sm:flex-nowrap gap-1.5 pt-2 border-t border-line"
              >
                {heroProjects.map((proj, idx) => {
                  const selected = idx === activeIndex;
                  return (
                    <button
                      key={proj.slug}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setActiveIndex(idx)}
                      className={`min-h-[44px] sm:min-h-[36px] min-w-[44px] px-2.5 py-1 rounded-md font-mono text-[11px] whitespace-nowrap transition-colors ${
                        selected
                          ? 'bg-ink text-on-ink font-semibold'
                          : 'bg-mist/70 text-ink-muted hover:text-ink hover:bg-mist'
                      }`}
                    >
                      {proj.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
