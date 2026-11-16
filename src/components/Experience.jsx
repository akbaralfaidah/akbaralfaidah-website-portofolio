import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { GitCommitHorizontal, ArrowUpRight, ChevronDown } from 'lucide-react';
import { FadeUp } from './ui/MotionPrimitives';
import { CountUp } from './ui/CountUp';

const GITHUB_USER = 'AkbarAlfaidah';
const GITHUB_API_URL = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}`;

function getCellColorClass(level) {
  switch (level) {
    case 1:
      return 'bg-blue-200 dark:bg-blue-950/85';
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
  const [contribData, setContribData] = useState(null);
  const [chartFallbackError, setChartFallbackError] = useState(false);
  const [showAllRoles, setShowAllRoles] = useState(false);
  const [hoveredDay, setHoveredDay] = useState(null);

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
        // Fallback silently
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const stats = useMemo(() => {
    if (!contribData) return null;

    const totalByYear = contribData.total || {};
    const allTimeTotal = Object.values(totalByYear).reduce((acc, n) => acc + Number(n || 0), 0);

    const allDays = contribData.contributions || [];
    const today = new Date();
    const cutoff = new Date(today);
    cutoff.setFullYear(cutoff.getFullYear() - 1);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    const todayStr = today.toISOString().slice(0, 10);
    const lastYearDays = allDays.filter((d) => d.date >= cutoffStr && d.date <= todayStr);

    const lastYearTotal = lastYearDays.reduce((acc, d) => acc + (d.count || 0), 0);
    const currentYear = String(today.getFullYear());
    const activeDaysCurrentYear = allDays
      .filter((d) => d.date.startsWith(`${currentYear}-`) && (d.count || 0) > 0)
      .length;

    const weeks = [];
    if (lastYearDays.length > 0) {
      const firstDate = new Date(`${lastYearDays[0].date}T00:00:00Z`);
      const leadingBlanks = firstDate.getUTCDay();
      const padded = [
        ...Array.from({ length: leadingBlanks }, () => null),
        ...lastYearDays
      ];
      for (let i = 0; i < padded.length; i += 7) {
        weeks.push(padded.slice(i, i + 7));
      }
    }

    return {
      allTimeTotal,
      lastYearTotal,
      activeDaysCurrentYear,
      weeks
    };
  }, [contribData]);

  const rawItems = t('experience.items', { returnObjects: true });
  const experiences = Array.isArray(rawItems) ? rawItems : [];
  const visibleExperiences = showAllRoles ? experiences : experiences.slice(0, 4);
  const isEn = i18n.language === 'en';
  const locale = isEn ? 'en-US' : 'id-ID';

  return (
    <section
      id="experience"
      className="py-20 sm:py-28 px-5 sm:px-6 bg-paper text-ink border-b border-line"
    >
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Clean Swiss Hairline Ledger */}
        <div>
          <FadeUp className="max-w-2xl mb-10">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent mb-3">
              {isEn ? '04 / Experience' : '04 / Rekam Jejak'}
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-[-0.03em] leading-[1.08] text-ink mb-3">
              {t('experience.heading')}
            </h2>
            <p className="text-base sm:text-lg text-ink-muted leading-relaxed">
              {t('experience.subheading')}
            </p>
          </FadeUp>

          <ol className="border-y border-line divide-y divide-line">
            {visibleExperiences.map((exp) => (
              <li
                key={`${exp.company}-${exp.period}`}
                className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-8 items-start"
              >
                <div className="lg:col-span-4 space-y-1">
                  <h3 className="font-display text-lg sm:text-xl font-semibold text-ink">
                    {exp.role}
                  </h3>
                  <p className="text-sm sm:text-base font-medium text-accent">{exp.company}</p>
                </div>

                <p className="lg:col-span-6 text-base text-ink-muted leading-relaxed">
                  {exp.description}
                </p>

                <span className="lg:col-span-2 lg:text-right font-mono text-xs sm:text-sm text-ink-muted whitespace-nowrap">
                  {exp.period}
                </span>
              </li>
            ))}
          </ol>

          {experiences.length > 4 && (
            <div className="pt-5">
              <button
                type="button"
                onClick={() => setShowAllRoles((s) => !s)}
                className="inline-flex items-center gap-2 min-h-[40px] text-sm font-medium text-ink hover:text-accent transition-colors"
              >
                <span>
                  {showAllRoles
                    ? isEn
                      ? 'Show fewer'
                      : 'Tampilkan lebih sedikit'
                    : isEn
                    ? `Show all roles (${experiences.length})`
                    : `Lihat semua riwayat (${experiences.length})`}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${showAllRoles ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
            </div>
          )}
        </div>

        {/* Interactive GitHub Telemetry Matrix */}
        <FadeUp>
          <div className="rounded-xl bg-surface border border-line p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-line">
              <div className="flex items-center gap-3">
                <GitCommitHorizontal size={20} className="text-accent shrink-0" aria-hidden="true" />
                <div>
                  <h3 className="font-display text-xl font-semibold text-ink">
                    {t('experience.github_title')}
                  </h3>
                  <p className="font-mono text-xs text-ink-muted">
                    {t('experience.github_subtitle')}
                  </p>
                </div>
              </div>

              <a
                href={`https://github.com/${GITHUB_USER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start sm:self-auto min-h-[40px] px-4 py-2 rounded-lg border border-line text-sm font-medium text-ink hover:border-ink/40 inline-flex items-center gap-1.5 transition-colors"
              >
                <span>{t('experience.github_cta')}</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>

            {stats ? (
              <div className="space-y-6">
                <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pb-5 border-b border-line">
                  <div>
                    <dt className="font-mono text-xs text-ink-muted mb-1">
                      {t('experience.github_total_all')}
                    </dt>
                    <dd className="font-display text-3xl sm:text-4xl font-semibold text-ink tabular-nums">
                      <CountUp value={stats.allTimeTotal} locale={locale} />
                    </dd>
                  </div>

                  <div>
                    <dt className="font-mono text-xs text-ink-muted mb-1">
                      {t('experience.github_last_year')}
                    </dt>
                    <dd className="font-display text-3xl sm:text-4xl font-semibold text-accent tabular-nums">
                      <CountUp value={stats.lastYearTotal} locale={locale} />
                    </dd>
                  </div>

                  <div>
                    <dt className="font-mono text-xs text-ink-muted mb-1">
                      {t('experience.github_active_days')}
                    </dt>
                    <dd className="font-display text-3xl sm:text-4xl font-semibold text-ink tabular-nums">
                      <CountUp value={stats.activeDaysCurrentYear} locale={locale} />{' '}
                      <span className="text-sm font-normal text-ink-muted">
                        {isEn ? 'days' : 'hari'}
                      </span>
                    </dd>
                  </div>
                </dl>

                <div
                  className="overflow-x-auto pb-1"
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  <div
                    className="inline-flex gap-[3px] min-w-full justify-between"
                    role="img"
                    aria-label={`${stats.lastYearTotal} GitHub contributions over the last 12 months`}
                  >
                    {stats.weeks.map((week, wIdx) => (
                      <div key={wIdx} className="flex flex-col gap-[3px] shrink-0">
                        {week.map((day, dIdx) =>
                          day ? (
                            <span
                              key={day.date}
                              onMouseEnter={() => setHoveredDay(day)}
                              title={`${day.date}: ${day.count} ${t('experience.github_contributions_unit')}`}
                              className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[2px] transition-transform hover:scale-125 cursor-crosshair ${getCellColorClass(
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

                <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-ink-muted">
                  <span className="min-h-[20px]">
                    {hoveredDay
                      ? `${hoveredDay.date} — ${hoveredDay.count} ${t('experience.github_contributions_unit')}`
                      : isEn
                      ? 'Hover any square to inspect daily commit activity'
                      : 'Arahkan kursor ke kotak untuk melihat aktivitas harian'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span>{t('experience.github_less')}</span>
                    {[0, 1, 2, 3, 4].map((lvl) => (
                      <span
                        key={lvl}
                        className={`w-3 h-3 rounded-[2px] ${getCellColorClass(lvl)}`}
                        aria-hidden="true"
                      />
                    ))}
                    <span>{t('experience.github_more')}</span>
                  </div>
                </div>
              </div>
            ) : chartFallbackError ? (
              <p className="text-sm text-ink-muted">{t('experience.github_fallback')}</p>
            ) : (
              <div className="overflow-x-auto">
                <img
                  src={`https://ghchart.rshah.org/2563EB/${GITHUB_USER}`}
                  alt={`GitHub commit activity chart for ${GITHUB_USER}`}
                  width={892}
                  height={112}
                  loading="lazy"
                  onError={() => setChartFallbackError(true)}
                  className="w-full min-w-[600px] h-auto rounded-lg"
                />
              </div>
            )}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
