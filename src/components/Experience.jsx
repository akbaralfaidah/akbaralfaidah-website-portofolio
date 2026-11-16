import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { GitCommitHorizontal, ArrowUpRight, Calendar, Flame } from 'lucide-react';
import { FadeUp } from './ui/MotionPrimitives';
import { STUDIO_EASE } from '../lib/motion';
import SpotlightCard from './ui/SpotlightCard';

const GITHUB_USER = 'AkbarAlfaidah';
const GITHUB_API_URL = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}`;

function getCellColorClass(level) {
  switch (level) {
    case 1:
      return 'bg-blue-200 dark:bg-blue-900/70';
    case 2:
      return 'bg-blue-400 dark:bg-blue-700';
    case 3:
      return 'bg-blue-600 dark:bg-blue-500';
    case 4:
      return 'bg-blue-800 dark:bg-blue-400';
    default:
      return 'bg-mist border border-line/60';
  }
}

export default function Experience() {
  const { t, i18n } = useTranslation();
  const timelineRef = useRef(null);

  const [contribData, setContribData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('last');
  const [chartFallbackError, setChartFallbackError] = useState(false);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 80%', 'end 65%']
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    fetch(GITHUB_API_URL, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data) => {
        if (isMounted && data?.total && Array.isArray(data?.contributions)) {
          setContribData(data);
        }
      })
      .catch(() => {
        // Silently degrade to ghchart SVG image if API unreachable
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const stats = useMemo(() => {
    if (!contribData) return null;

    const totalByYear = contribData.total || {};
    const years = Object.keys(totalByYear).sort((a, b) => Number(b) - Number(a));
    const allTimeTotal = Object.values(totalByYear).reduce((acc, n) => acc + Number(n || 0), 0);
    const currentYear = String(new Date().getFullYear());
    const currentYearTotal = totalByYear[currentYear] ?? totalByYear[years[0]] ?? 0;

    // Slice daily contributions for the selected period ('last' = trailing 365 days, or specific year)
    const allDays = contribData.contributions || [];
    let filteredDays = [];

    if (selectedPeriod === 'last') {
      const today = new Date();
      const cutoff = new Date(today);
      cutoff.setFullYear(cutoff.getFullYear() - 1);
      const cutoffStr = cutoff.toISOString().slice(0, 10);
      filteredDays = allDays.filter((d) => d.date >= cutoffStr && d.date <= today.toISOString().slice(0, 10));
    } else {
      filteredDays = allDays.filter((d) => d.date.startsWith(`${selectedPeriod}-`));
    }

    const periodTotal = filteredDays.reduce((acc, d) => acc + (d.count || 0), 0);
    const activeDays = filteredDays.filter((d) => (d.count || 0) > 0).length;

    // Group into columns of 7 days (Sunday..Saturday alignment)
    const weeks = [];
    if (filteredDays.length > 0) {
      const firstDate = new Date(`${filteredDays[0].date}T00:00:00Z`);
      const leadingBlanks = firstDate.getUTCDay();
      const padded = [
        ...Array.from({ length: leadingBlanks }, () => null),
        ...filteredDays
      ];
      for (let i = 0; i < padded.length; i += 7) {
        weeks.push(padded.slice(i, i + 7));
      }
    }

    return {
      years,
      allTimeTotal,
      currentYear,
      currentYearTotal,
      periodTotal,
      activeDays,
      weeks
    };
  }, [contribData, selectedPeriod]);

  const rawItems = t('experience.items', { returnObjects: true });
  const experiences = Array.isArray(rawItems) ? rawItems : [];
  const isEn = i18n.language === 'en';

  return (
    <section
      id="experience"
      className="py-20 sm:py-24 px-6 bg-paper text-ink border-b border-line"
    >
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Career Timeline */}
        <div>
          <FadeUp className="max-w-3xl mb-12 sm:mb-14">
            <h2 className="font-display text-3xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.08] text-ink mb-4">
              {t('experience.heading')}
            </h2>
            <p className="text-lg sm:text-xl text-ink-muted leading-relaxed">
              {t('experience.subheading')}
            </p>
          </FadeUp>

          <div ref={timelineRef} className="relative ml-2 sm:ml-3">
            <div
              aria-hidden="true"
              className="absolute left-0 top-2 bottom-2 w-0.5 bg-line rounded-full"
            />
            <motion.div
              aria-hidden="true"
              style={{ scaleY, originY: 0 }}
              className="absolute left-0 top-2 bottom-2 w-0.5 bg-gradient-to-b from-accent via-sky-500 to-accent/60 rounded-full"
            />

            <ol className="relative space-y-6">
              {experiences.map((exp, index) => {
                const isCurrent = index === 0;
                return (
                  <motion.li
                    key={`${exp.company}-${exp.period}`}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.42,
                      delay: Math.min(index * 0.05, 0.25),
                      ease: STUDIO_EASE
                    }}
                    className="relative pl-7 sm:pl-10"
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute -left-[5px] top-6 w-3 h-3 rounded-full border-2 border-paper transition-colors ${
                        isCurrent ? 'bg-accent ring-4 ring-accent/20' : 'bg-ink/40'
                      }`}
                    />

                    <SpotlightCard className="p-6 sm:p-7">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div>
                          <h3 className="font-display text-xl sm:text-2xl font-bold text-ink tracking-tight">
                            {exp.role}
                          </h3>
                          <p className="text-base font-medium text-accent mt-0.5">{exp.company}</p>
                        </div>
                        <span className="self-start sm:self-center font-mono text-sm font-medium px-3.5 py-1.5 rounded-lg bg-mist text-ink border border-line whitespace-nowrap">
                          {exp.period}
                        </span>
                      </div>

                      <p className="text-base sm:text-[17px] text-ink-muted leading-relaxed">
                        {exp.description}
                      </p>
                    </SpotlightCard>
                  </motion.li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* GitHub Contribution Telemetry Card */}
        <FadeUp>
          <SpotlightCard className="p-6 sm:p-8 lg:p-10 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-line">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                  <GitCommitHorizontal size={22} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-ink">
                    {t('experience.github_title')}
                  </h3>
                  <p className="text-base text-ink-muted mt-0.5">
                    {t('experience.github_subtitle')}
                  </p>
                </div>
              </div>

              <a
                href={`https://github.com/${GITHUB_USER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start md:self-auto min-h-[46px] px-5 py-2.5 rounded-xl border border-line bg-paper text-[15px] font-semibold text-ink hover:border-accent hover:text-accent inline-flex items-center gap-2 transition-colors"
              >
                <span>{t('experience.github_cta')}</span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>

            {/* Real Contribution Metrics */}
            {stats && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-xl bg-paper border border-line p-5">
                    <p className="text-sm font-medium text-ink-muted mb-1.5 flex items-center gap-2">
                      <GitCommitHorizontal size={15} className="text-accent" aria-hidden="true" />
                      <span>{t('experience.github_total_all')}</span>
                    </p>
                    <p className="font-display text-3xl sm:text-4xl font-extrabold text-ink tabular-nums">
                      {stats.allTimeTotal.toLocaleString(isEn ? 'en-US' : 'id-ID')}
                    </p>
                  </div>

                  <div className="rounded-xl bg-paper border border-line p-5">
                    <p className="text-sm font-medium text-ink-muted mb-1.5 flex items-center gap-2">
                      <Calendar size={15} className="text-accent" aria-hidden="true" />
                      <span>
                        {selectedPeriod === 'last'
                          ? t('experience.github_last_year')
                          : t('experience.github_this_year', { year: selectedPeriod })}
                      </span>
                    </p>
                    <p className="font-display text-3xl sm:text-4xl font-extrabold text-accent tabular-nums">
                      {stats.periodTotal.toLocaleString(isEn ? 'en-US' : 'id-ID')}
                    </p>
                  </div>

                  <div className="rounded-xl bg-paper border border-line p-5">
                    <p className="text-sm font-medium text-ink-muted mb-1.5 flex items-center gap-2">
                      <Flame size={15} className="text-accent" aria-hidden="true" />
                      <span>
                        {t('experience.github_active_days', {
                          year: selectedPeriod === 'last' ? stats.currentYear : selectedPeriod
                        })}
                      </span>
                    </p>
                    <p className="font-display text-3xl sm:text-4xl font-extrabold text-ink tabular-nums">
                      {stats.activeDays}{' '}
                      <span className="text-base font-medium text-ink-muted">
                        {isEn ? 'days' : 'hari'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Period Switcher */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2" role="tablist" aria-label="Select contribution year">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={selectedPeriod === 'last'}
                      onClick={() => setSelectedPeriod('last')}
                      className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                        selectedPeriod === 'last'
                          ? 'bg-accent-solid text-on-accent border-transparent'
                          : 'bg-paper text-ink-muted border-line hover:text-ink'
                      }`}
                    >
                      {t('experience.github_last_year')}
                    </button>
                    {stats.years.map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        role="tab"
                        aria-selected={selectedPeriod === yr}
                        onClick={() => setSelectedPeriod(yr)}
                        className={`min-h-[40px] px-3.5 py-1.5 rounded-lg font-mono text-sm font-medium transition-colors border ${
                          selectedPeriod === yr
                            ? 'bg-accent-solid text-on-accent border-transparent'
                            : 'bg-paper text-ink-muted border-line hover:text-ink'
                        }`}
                      >
                        {yr}
                      </button>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-1.5 text-sm text-ink-muted">
                    <span>{t('experience.github_less')}</span>
                    {[0, 1, 2, 3, 4].map((lvl) => (
                      <span
                        key={lvl}
                        className={`w-3.5 h-3.5 rounded-[3px] ${getCellColorClass(lvl)}`}
                        aria-hidden="true"
                      />
                    ))}
                    <span>{t('experience.github_more')}</span>
                  </div>
                </div>

                {/* Interactive Contribution Heatmap Grid */}
                <div className="overflow-x-auto pb-2">
                  <div
                    className="inline-flex gap-[3px] min-w-full justify-between"
                    role="img"
                    aria-label={`${stats.periodTotal} GitHub contributions in selected period`}
                  >
                    {stats.weeks.map((week, wIdx) => (
                      <div key={wIdx} className="flex flex-col gap-[3px] shrink-0">
                        {week.map((day, dIdx) =>
                          day ? (
                            <span
                              key={day.date}
                              title={`${day.date}: ${day.count} ${t('experience.github_contributions_unit')}`}
                              className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[3px] transition-transform hover:scale-125 ${getCellColorClass(
                                day.level
                              )}`}
                            />
                          ) : (
                            <span key={`blank-${wIdx}-${dIdx}`} className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          )
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Offline/API Fallback SVG Image */}
            {!stats && (
              chartFallbackError ? (
                <div className="rounded-xl bg-mist/60 border border-line p-6 text-center text-base text-ink-muted">
                  {t('experience.github_fallback')}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <img
                    src={`https://ghchart.rshah.org/2563EB/${GITHUB_USER}`}
                    alt={`GitHub commit activity chart for ${GITHUB_USER}`}
                    width={892}
                    height={112}
                    loading="lazy"
                    onError={() => setChartFallbackError(true)}
                    className="w-full min-w-[600px] h-auto rounded-lg dark:brightness-95"
                  />
                </div>
              )
            )}
          </SpotlightCard>
        </FadeUp>
      </div>
    </section>
  );
}
