import { useState, useEffect, useMemo, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  GitCommitHorizontal,
  ArrowUpRight,
  Building2,
  Landmark,
  Rocket,
  Briefcase,
  Calendar,
  Sparkles,
} from "lucide-react";
import {
  FadeUp,
  ParallaxLayer,
  ParallaxWatermark,
} from "./ui/MotionPrimitives";
import { CountUp } from "./ui/CountUp";
import SpotlightCard from "./ui/SpotlightCard";
import { STUDIO_EASE } from "../lib/motion";

const GITHUB_USER = "AkbarAlfaidah";
const GITHUB_API_URL = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}`;

function getCellColorClass(level) {
  switch (level) {
    case 1:
      return "bg-blue-200 dark:bg-blue-950/85";
    case 2:
      return "bg-blue-400 dark:bg-blue-700";
    case 3:
      return "bg-blue-600 dark:bg-blue-500";
    case 4:
      return "bg-blue-800 dark:bg-blue-400";
    default:
      return "bg-mist border border-line/60";
  }
}

function enrichExperienceItem(item, isEn) {
  const company = item?.company || "";
  const period = item?.period || "";
  const isCurrent = /sekarang|present/i.test(period);

  if (company.includes("Balai Penegakan")) {
    return {
      sectorGroup: "institution",
      sectorLabel: isEn ? "Government Agency" : "Instansi Pemerintah",
      badgeClass:
        "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
      icon: Landmark,
      tags: [
        "BMN",
        isEn ? "Finance" : "Keuangan",
        isEn ? "Staffing" : "Kepegawaian",
        "4-in-1 Portal",
      ],
      isCurrent,
    };
  }
  if (company.includes("Telkomsel")) {
    return {
      sectorGroup: "institution",
      sectorLabel: isEn ? "Enterprise (SOE)" : "BUMN Telekomunikasi",
      badgeClass:
        "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30",
      icon: Building2,
      tags: ["GitLab CI/CD", "Dev–Staging–Prod", "IT Ops"],
      isCurrent,
    };
  }
  if (company.includes("PLN")) {
    return {
      sectorGroup: "institution",
      sectorLabel: isEn ? "Energy (SOE)" : "BUMN Energi",
      badgeClass:
        "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30",
      icon: Building2,
      tags: ["Internal Portal", "Company Profile", "Web App"],
      isCurrent,
    };
  }
  if (company.includes("Depot") || company.includes("Bos")) {
    return {
      sectorGroup: "client",
      sectorLabel: isEn ? "Retail Tech" : "Sistem Bisnis",
      badgeClass:
        "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
      icon: Briefcase,
      tags: ["Flutter", "Firebase", "POS & Gudang"],
      isCurrent,
    };
  }
  if (company.includes("Bidik Karier")) {
    return {
      sectorGroup: "client",
      sectorLabel: isEn ? "EdTech Platform" : "Platform Edukasi",
      badgeClass:
        "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30",
      icon: Briefcase,
      tags: ["LMS CPNS", "PHP", "MySQL"],
      isCurrent,
    };
  }
  if (company.includes("INOVASITUS")) {
    return {
      sectorGroup: "client",
      sectorLabel: isEn ? "SME Digitalization" : "Klien UMKM",
      badgeClass:
        "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/30",
      icon: Briefcase,
      tags: ["7+ Websites", "Responsive UI", "Production"],
      isCurrent,
    };
  }

  return {
    sectorGroup: "client",
    sectorLabel: isEn ? "Independent Agency" : "Agensi Independen",
    badgeClass:
      "bg-blue-50 text-accent border-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/30",
    icon: Rocket,
    tags: ["Web Platform", "Mobile Apps", "End-to-End"],
    isCurrent,
  };
}

export default function Experience() {
  const { t, i18n } = useTranslation();
  const [contribData, setContribData] = useState(null);
  const [chartFallbackError, setChartFallbackError] = useState(false);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [sectorFilter, setSectorFilter] = useState("all");
  const [activeCardIdx, setActiveCardIdx] = useState(0);

  const spineRef = useRef(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress: spineScroll } = useScroll({
    target: spineRef,
    offset: ["start 78%", "end 70%"],
  });
  const spineScaleY = useSpring(spineScroll, { stiffness: 200, damping: 28 });

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    fetch(GITHUB_API_URL, { signal: controller.signal })
      .then((res) =>
        res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`)),
      )
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
    const allTimeTotal = Object.values(totalByYear).reduce(
      (acc, n) => acc + Number(n || 0),
      0,
    );

    const allDays = contribData.contributions || [];
    const today = new Date();
    const cutoff = new Date(today);
    cutoff.setFullYear(cutoff.getFullYear() - 1);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    const todayStr = today.toISOString().slice(0, 10);
    const lastYearDays = allDays.filter(
      (d) => d.date >= cutoffStr && d.date <= todayStr,
    );

    const lastYearTotal = lastYearDays.reduce(
      (acc, d) => acc + (d.count || 0),
      0,
    );
    const currentYear = String(today.getFullYear());
    const activeDaysCurrentYear = allDays.filter(
      (d) => d.date.startsWith(`${currentYear}-`) && (d.count || 0) > 0,
    ).length;

    const weeks = [];
    if (lastYearDays.length > 0) {
      const firstDate = new Date(`${lastYearDays[0].date}T00:00:00Z`);
      const leadingBlanks = firstDate.getUTCDay();
      const padded = [
        ...Array.from({ length: leadingBlanks }, () => null),
        ...lastYearDays,
      ];
      for (let i = 0; i < padded.length; i += 7) {
        weeks.push(padded.slice(i, i + 7));
      }
    }

    return {
      allTimeTotal,
      lastYearTotal,
      activeDaysCurrentYear,
      weeks,
    };
  }, [contribData]);

  const rawItems = t("experience.items", { returnObjects: true });
  const isEn = i18n.language === "en";
  const locale = isEn ? "en-US" : "id-ID";

  const enrichedExperiences = useMemo(() => {
    const base = Array.isArray(rawItems) ? rawItems : [];
    return base.map((item) => ({
      ...item,
      meta: enrichExperienceItem(item, isEn),
    }));
  }, [rawItems, isEn]);

  const visibleExperiences = useMemo(() => {
    if (sectorFilter === "all") return enrichedExperiences;
    return enrichedExperiences.filter(
      (item) => item.meta.sectorGroup === sectorFilter,
    );
  }, [enrichedExperiences, sectorFilter]);

  const filterTabs = [
    {
      id: "all",
      label: isEn ? "All" : "Semua",
      count: enrichedExperiences.length,
    },
    {
      id: "institution",
      label: isEn ? "Gov & SOE" : "Instansi & BUMN",
      count: enrichedExperiences.filter(
        (e) => e.meta.sectorGroup === "institution",
      ).length,
    },
    {
      id: "client",
      label: isEn ? "Agency & Retail" : "Klien & Produk",
      count: enrichedExperiences.filter((e) => e.meta.sectorGroup === "client")
        .length,
    },
  ];

  return (
    <section
      id="experience"
      className="relative py-20 sm:py-28 px-5 sm:px-6 bg-gradient-to-b from-paper via-[#F3F7FD]/75 to-paper dark:from-paper dark:via-[#0B0F1A]/65 dark:to-paper text-ink border-b border-line overflow-x-clip"
    >
      {/* Parallax Ambient Glow & Watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-24 left-[-10%] w-[640px] h-[640px] rounded-full opacity-80 dark:opacity-25"
        style={{
          background:
            "radial-gradient(circle, rgba(37,99,235,0.12) 0%, rgba(16,185,129,0.06) 50%, transparent 74%)",
        }}
      />
      <ParallaxWatermark text="CAREER & CODE" direction={1} className="mb-4" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-20">
        {/* Interactive Split Sticky Career Track + Glowing Parallax Spine */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Sticky Left Control Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <ParallaxLayer yRange={[16, -16]}>
              <FadeUp className="space-y-4">
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent font-semibold">
                  {isEn ? "04 / Experience" : "04 / Rekam Jejak"}
                </p>
                <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-[-0.035em] leading-[1.06] text-ink">
                  {isEn ? (
                    <>
                      Hands-On{" "}
                      <span className="font-serif italic font-normal text-accent">
                        Track Record.
                      </span>
                    </>
                  ) : (
                    <>
                      Pengalaman{" "}
                      <span className="font-serif italic font-normal text-accent">
                        Kerja.
                      </span>
                    </>
                  )}
                </h2>
                <p className="text-base text-ink-muted leading-relaxed">
                  {t("experience.subheading")}
                </p>
              </FadeUp>
            </ParallaxLayer>

            {/* Interactive Sector Switcher Pills */}
            <div
              role="tablist"
              aria-label="Filter career sectors"
              className="flex flex-wrap gap-2"
            >
              {filterTabs.map((tab) => {
                const isSelected = sectorFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => {
                      setSectorFilter(tab.id);
                      setActiveCardIdx(0);
                    }}
                    className={`min-h-[38px] px-3.5 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5 border transition-all ${
                      isSelected
                        ? "bg-accent text-white border-accent shadow-sm shadow-blue-600/25"
                        : "bg-surface/90 text-ink-muted border-line hover:border-accent/50 hover:text-ink"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`font-mono text-[11px] px-1.5 rounded-full ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-mist text-ink-muted"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Compact Sector Coverage Snapshot */}
            <div className="rounded-2xl bg-white/90 dark:bg-surface border border-line p-4 space-y-2.5 shadow-sm">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-accent font-semibold">
                <Sparkles size={13} aria-hidden="true" />
                <span>{isEn ? "Sector Coverage" : "Lintas Sektor"}</span>
              </div>
              <p className="text-sm text-ink-muted leading-relaxed">
                {isEn
                  ? "Shipping production portals across government offices, national enterprises (SOEs), & fast-moving commercial builds."
                  : "Teruji membangun sistem untuk birokrasi instansi pemerintah, operasional BUMN, hingga aplikasi bisnis ritel & agensi."}
              </p>
            </div>
          </div>

          {/* Right: Glowing Scroll-Driven Parallax Timeline Spine */}
          <div ref={spineRef} className="lg:col-span-8 relative pl-6 sm:pl-9">
            {/* Background static spine track */}
            <div
              aria-hidden="true"
              className="absolute left-[7px] sm:left-[11px] top-3 bottom-3 w-[2px] bg-line rounded-full"
            />
            {/* Glowing active scroll-progress laser beam */}
            <motion.div
              aria-hidden="true"
              style={prefersReduced ? undefined : { scaleY: spineScaleY }}
              className="absolute left-[7px] sm:left-[11px] top-3 bottom-3 w-[2px] origin-top rounded-full bg-gradient-to-b from-sky-400 via-accent to-emerald-500"
            />

            <div className="space-y-5">
              <AnimatePresence mode="popLayout">
                {visibleExperiences.map((exp, idx) => {
                  const SectorIcon = exp.meta.icon;
                  const isFocused = idx === activeCardIdx;
                  const parallaxY = idx % 2 === 0 ? [34, -34] : [64, -64];

                  return (
                    <motion.div
                      key={`${exp.company}-${exp.period}`}
                      layout
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{
                        duration: 0.25,
                        delay: idx * 0.03,
                        ease: STUDIO_EASE,
                      }}
                      className="relative"
                    >
                      {/* Animated spine milestone node dot */}
                      <span
                        aria-hidden="true"
                        className={`absolute -left-[22px] sm:-left-[30px] top-7 w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${
                          exp.meta.isCurrent
                            ? "bg-emerald-500 border-white dark:border-[#0B0F1A] ring-4 ring-emerald-500/20"
                            : isFocused
                              ? "bg-accent border-white dark:border-[#0B0F1A] ring-4 ring-accent/20"
                              : "bg-surface border-accent/60"
                        }`}
                      />

                      <ParallaxLayer yRange={parallaxY}>
                        <SpotlightCard
                          onClick={() => setActiveCardIdx(idx)}
                          onMouseEnter={() => setActiveCardIdx(idx)}
                          className={`p-5 sm:p-6 cursor-pointer transition-all ${
                            isFocused
                              ? "border-accent/60 shadow-[0_20px_48px_-16px_rgba(37,99,235,0.14)]"
                              : "hover:border-accent/40 shadow-sm"
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[11px] font-semibold border ${exp.meta.badgeClass}`}
                            >
                              <SectorIcon size={12} aria-hidden="true" />
                              <span>{exp.meta.sectorLabel}</span>
                            </span>

                            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-muted">
                              {exp.meta.isCurrent && (
                                <span
                                  className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
                                  aria-hidden="true"
                                />
                              )}
                              <Calendar size={12} aria-hidden="true" />
                              <span>{exp.period}</span>
                            </span>
                          </div>

                          <div className="space-y-1.5 mb-4">
                            <h3 className="font-display text-lg sm:text-xl font-semibold text-ink">
                              {exp.role}
                            </h3>
                            <p className="text-sm sm:text-base font-semibold text-accent">
                              {exp.company}
                            </p>
                          </div>

                          <p className="text-sm sm:text-base text-ink-muted leading-relaxed mb-4">
                            {exp.description}
                          </p>

                          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-line/80">
                            {exp.meta.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2.5 py-0.5 rounded-md bg-mist text-ink-muted font-mono text-[11px] border border-line/70"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </SpotlightCard>
                      </ParallaxLayer>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Interactive GitHub Telemetry Matrix wrapped in Parallax Depth */}
        <ParallaxLayer yRange={[56, -48]} scaleRange={[0.96, 1.01]}>
          <div className="rounded-2xl bg-white/95 dark:bg-surface border border-line p-6 sm:p-8 space-y-6 shadow-[0_22px_55px_-18px_rgba(37,99,235,0.12)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-line">
              <div className="flex items-center gap-3">
                <GitCommitHorizontal
                  size={20}
                  className="text-accent shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="font-display text-xl font-semibold text-ink">
                    {t("experience.github_title")}
                  </h3>
                  <p className="font-mono text-xs text-ink-muted">
                    {t("experience.github_subtitle")}
                  </p>
                </div>
              </div>

              <a
                href={`https://github.com/${GITHUB_USER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start sm:self-auto min-h-[40px] px-4 py-2 rounded-lg border border-line bg-paper/70 hover:border-accent/60 hover:text-accent text-sm font-medium text-ink inline-flex items-center gap-1.5 transition-colors"
              >
                <span>{t("experience.github_cta")}</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>

            {stats ? (
              <div className="space-y-6">
                <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pb-5 border-b border-line">
                  <div>
                    <dt className="font-mono text-xs text-ink-muted mb-1">
                      {t("experience.github_total_all")}
                    </dt>
                    <dd className="font-display text-3xl sm:text-4xl font-semibold text-ink tabular-nums">
                      <CountUp value={stats.allTimeTotal} locale={locale} />
                    </dd>
                  </div>

                  <div>
                    <dt className="font-mono text-xs text-ink-muted mb-1">
                      {t("experience.github_last_year")}
                    </dt>
                    <dd className="font-display text-3xl sm:text-4xl font-semibold text-accent tabular-nums">
                      <CountUp value={stats.lastYearTotal} locale={locale} />
                    </dd>
                  </div>

                  <div>
                    <dt className="font-mono text-xs text-ink-muted mb-1">
                      {t("experience.github_active_days")}
                    </dt>
                    <dd className="font-display text-3xl sm:text-4xl font-semibold text-ink tabular-nums">
                      <CountUp
                        value={stats.activeDaysCurrentYear}
                        locale={locale}
                      />{" "}
                      <span className="text-sm font-normal text-ink-muted">
                        {isEn ? "days" : "hari"}
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
                      <div
                        key={wIdx}
                        className="flex flex-col gap-[3px] shrink-0"
                      >
                        {week.map((day, dIdx) =>
                          day ? (
                            <span
                              key={day.date}
                              onMouseEnter={() => setHoveredDay(day)}
                              title={`${day.date}: ${day.count} ${t("experience.github_contributions_unit")}`}
                              className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[2px] transition-transform hover:scale-125 cursor-crosshair ${getCellColorClass(
                                day.level,
                              )}`}
                            />
                          ) : (
                            <span
                              key={`blank-${wIdx}-${dIdx}`}
                              className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                            />
                          ),
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-ink-muted">
                  <span className="min-h-[20px]">
                    {hoveredDay
                      ? `${hoveredDay.date} - ${hoveredDay.count} ${t("experience.github_contributions_unit")}`
                      : isEn
                        ? "Hover any square to inspect daily commit activity"
                        : "Arahkan kursor ke kotak untuk melihat aktivitas harian"}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span>{t("experience.github_less")}</span>
                    {[0, 1, 2, 3, 4].map((lvl) => (
                      <span
                        key={lvl}
                        className={`w-3 h-3 rounded-[2px] ${getCellColorClass(lvl)}`}
                        aria-hidden="true"
                      />
                    ))}
                    <span>{t("experience.github_more")}</span>
                  </div>
                </div>
              </div>
            ) : chartFallbackError ? (
              <p className="text-sm text-ink-muted">
                {t("experience.github_fallback")}
              </p>
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
        </ParallaxLayer>
      </div>
    </section>
  );
}
