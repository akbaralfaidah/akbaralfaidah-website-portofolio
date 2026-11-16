import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GitCommitHorizontal, ArrowUpRight } from 'lucide-react';

export default function Experience() {
  const { t } = useTranslation();
  const [chartError, setChartError] = useState(false);

  const rawItems = t('experience.items', { returnObjects: true });
  const experiences = Array.isArray(rawItems) ? rawItems : [];

  return (
    <section
      id="experience"
      className="py-16 sm:py-24 px-6 bg-paper text-ink border-b border-line"
    >
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Career Timeline */}
        <div>
          <div className="max-w-2xl mb-12 sm:mb-14">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-brass mb-3">
              {t('experience.eyebrow')}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink mb-3">
              {t('experience.heading')}
            </h2>
            <p className="text-base sm:text-lg text-ink-muted leading-relaxed">
              {t('experience.subheading')}
            </p>
          </div>

          <ol className="relative border-l border-line ml-2 sm:ml-3 space-y-6">
            {experiences.map((exp, index) => {
              const isCurrent = index === 0;
              return (
                <li key={`${exp.company}-${exp.period}`} className="relative pl-6 sm:pl-9">
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[6.5px] top-6 w-3 h-3 rounded-full border-2 border-paper ${
                      isCurrent ? 'bg-brass' : 'bg-ink/40'
                    }`}
                  />

                  <div className="rounded-2xl bg-surface border border-line p-5 sm:p-6 hover:border-brass/60 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-display text-lg sm:text-xl font-bold text-ink tracking-tight">
                          {exp.role}
                        </h3>
                        <p className="text-sm font-medium text-brass">{exp.company}</p>
                      </div>
                      <span className="self-start sm:self-center font-mono text-xs font-medium px-3 py-1 rounded-md bg-mist text-ink border border-line whitespace-nowrap">
                        {exp.period}
                      </span>
                    </div>

                    <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* GitHub Activity Card */}
        <div className="rounded-2xl bg-surface border border-line p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-line">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-mist border border-line flex items-center justify-center text-brass shrink-0">
                <GitCommitHorizontal size={20} aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-ink">
                  {t('experience.github_title')}
                </h3>
                <p className="text-sm text-ink-muted">{t('experience.github_subtitle')}</p>
              </div>
            </div>

            <a
              href="https://github.com/AkbarAlfaidah"
              target="_blank"
              rel="noopener noreferrer"
              className="self-start sm:self-auto min-h-[44px] px-4 py-2 rounded-lg border border-line bg-paper text-sm font-medium text-ink hover:border-brass hover:text-brass inline-flex items-center gap-1.5 transition-colors"
            >
              <span>{t('experience.github_cta')}</span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>

          {chartError ? (
            <div className="rounded-xl bg-mist/60 border border-line p-6 text-center text-sm text-ink-muted">
              {t('experience.github_fallback')}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <img
                src="https://ghchart.rshah.org/8A611C/AkbarAlfaidah"
                alt="GitHub commit activity chart for AkbarAlfaidah"
                width={892}
                height={112}
                loading="lazy"
                onError={() => setChartError(true)}
                className="w-full min-w-[600px] h-auto rounded-lg dark:brightness-95"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
