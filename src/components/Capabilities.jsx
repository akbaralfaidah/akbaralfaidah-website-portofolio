import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Layers,
  Server,
  Smartphone,
  Cpu,
  ArrowRight,
  Play,
  Check,
  Activity
} from 'lucide-react';
import TechLogoMarquee from './ui/TechLogoMarquee';
import { useTheme } from '../hooks/useTheme';
import { STUDIO_EASE } from '../lib/motion';

function ScrollWord({ word, progress, range, serif = false }) {
  const opacity = useTransform(progress, range, [0.24, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className={serif ? 'font-serif italic font-normal text-accent' : undefined}
    >
      {word}{' '}
    </motion.span>
  );
}

function KineticStatement({ isEn }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 85%', 'end 45%']
  });

  const words = isEn
    ? [
        { text: 'From', serif: false },
        { text: 'first', serif: false },
        { text: 'sketch', serif: true },
        { text: 'to', serif: false },
        { text: 'hardware', serif: false },
        { text: 'integration,', serif: false },
        { text: 'every', serif: false },
        { text: 'system', serif: false },
        { text: 'is', serif: false },
        { text: 'built', serif: false },
        { text: 'to run cleanly', serif: true },
        { text: 'in', serif: false },
        { text: 'production.', serif: false }
      ]
    : [
        { text: 'Dari', serif: false },
        { text: 'sketsa awal,', serif: true },
        { text: 'struktur', serif: false },
        { text: 'database,', serif: false },
        { text: 'koneksi', serif: false },
        { text: 'perangkat,', serif: false },
        { text: 'sampai', serif: false },
        { text: 'live stabil', serif: true },
        { text: 'di', serif: false },
        { text: 'server', serif: false },
        { text: 'produksi.', serif: false }
      ];

  return (
    <div ref={containerRef} className="py-10 sm:py-14 border-b border-line mb-14">
      <p className="font-display text-2xl sm:text-4xl lg:text-[2.75rem] font-semibold tracking-[-0.03em] leading-[1.2] text-ink max-w-4xl">
        {words.map((w, idx) => {
          const start = idx / words.length;
          const end = Math.min(1, start + 1.8 / words.length);
          return (
            <ScrollWord
              key={`${w.text}-${idx}`}
              word={w.text}
              serif={w.serif}
              progress={scrollYProgress}
              range={[start, end]}
            />
          );
        })}
      </p>
    </div>
  );
}

const SIMULATIONS = [
  {
    icon: Layers,
    badge: 'UI & Motion System',
    cmd: 'inspect design-tokens --viewports=375,768,1440',
    output: [
      '✓ Loaded Instrument Serif + Plus Jakarta Sans + Inter',
      '✓ Contrast Check: #0F172A on #FAFBFF → 17.4:1 (AAA)',
      '✓ GPU Compositor Layers: transform / opacity only (0ms jank)'
    ],
    latency: '12ms'
  },
  {
    icon: Server,
    badge: 'Full-Stack API & Auth',
    cmd: 'curl -X POST /api/v1/reports/export --auth role:admin',
    output: [
      '✓ Verified Supabase RLS policy: role = "kepegawaian"',
      '✓ Aggregated 54 active records across 6 unit kerja',
      '✓ Generated signed XLSX + PDF binary stream (200 OK)'
    ],
    latency: '24ms'
  },
  {
    icon: Smartphone,
    badge: 'Mobile Geofence & POS',
    cmd: 'siabsen gps-verify --lat -1.6101 --lng 103.6131',
    output: [
      '✓ Haversine Check: distance = 18.4m <= radius 50.0m (VALID)',
      '✓ Offline SQLite queue synced 14 pending invoices',
      '✓ ESC/POS 58mm thermal print buffer flushed cleanly'
    ],
    latency: '9ms'
  },
  {
    icon: Cpu,
    badge: 'Applied AI & Container CI',
    cmd: 'chattask parse-thread --model gemini-2.5-flash',
    output: [
      '✓ Extracted 3 tasks, priority weights, & deadlines from WA chat',
      '✓ Verified schema JSON output (confidence: 0.97)',
      '✓ Image built & rolled out behind Nginx HTTPS proxy'
    ],
    latency: '142ms'
  }
];

export default function Capabilities() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [runCount, setRunCount] = useState(1);

  const pillars = t('capabilities.pillars', { returnObjects: true }) || [];
  const serviceItems = t('services.items', { returnObjects: true }) || [];
  const activePillar = pillars[activeStep] || pillars[0];
  const sim = SIMULATIONS[activeStep] || SIMULATIONS[0];
  const SpecIcon = sim.icon;
  const isEn = i18n.language === 'en';
  const isDark = theme === 'dark';

  return (
    <section
      id="capabilities"
      className="relative py-20 sm:py-24 px-5 sm:px-6 bg-[#F1F5FA] dark:bg-[#080B12] text-ink border-b border-line overflow-hidden"
    >
      {/* Subtle luminous radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[420px] rounded-full blur-3xl opacity-75 dark:opacity-25"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(56,189,248,0.16) 0%, rgba(37,99,235,0.06) 50%, transparent 75%)'
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Scroll-Scrubbed Kinetic Serif Statement */}
        <KineticStatement isEn={isEn} />

        {/* Interactive Systems Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          <div
            className="lg:col-span-5 border-y border-line divide-y divide-line"
            role="tablist"
            aria-label="Engineering workflow steps"
          >
            {Array.isArray(pillars) &&
              pillars.map((item, idx) => {
                const isSelected = idx === activeStep;
                return (
                  <button
                    key={item.step}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => {
                      setActiveStep(idx);
                      setRunCount((c) => c + 1);
                    }}
                    className={`group relative w-full text-left py-5 px-4 transition-all rounded-r-lg ${
                      isSelected
                        ? 'text-ink bg-white/90 dark:bg-white/[0.04] shadow-sm'
                        : 'text-ink-muted hover:text-ink hover:bg-white/50 dark:hover:bg-white/[0.02]'
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="workbench-active-bar"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-full bg-accent"
                      />
                    )}
                    <div className="flex items-start gap-4">
                      <span
                        className={`font-mono text-xs font-semibold pt-1 ${
                          isSelected ? 'text-accent' : 'text-ink-muted'
                        }`}
                      >
                        {item.step}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-lg sm:text-xl font-semibold text-ink mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-ink-muted leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>

          <div className="lg:col-span-7 lg:sticky lg:top-24">
            <div className="rounded-2xl bg-white dark:bg-[#0D1017] border border-slate-200/90 dark:border-white/15 overflow-hidden shadow-[0_22px_55px_-16px_rgba(37,99,235,0.14),0_8px_24px_-10px_rgba(15,23,42,0.06)] dark:shadow-2xl dark:shadow-black/50">
              <div className="px-5 py-3.5 bg-slate-50/90 dark:bg-[#121620] border-b border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 font-mono text-xs font-medium text-ink">
                  <SpecIcon size={15} className="text-accent" aria-hidden="true" />
                  <span>{sim.badge}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <Activity size={13} aria-hidden="true" />
                    <span>{sim.latency}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setRunCount((c) => c + 1)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-accent/10 hover:bg-accent text-accent hover:text-white dark:bg-white/10 dark:hover:bg-white/20 dark:text-white font-mono text-xs font-medium transition-colors"
                  >
                    <Play size={11} aria-hidden="true" />
                    <span>{isEn ? 'Re-run trace' : 'Uji Simulasi'}</span>
                  </button>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider font-semibold text-accent">
                    Step {activePillar?.step}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold text-ink mt-1 mb-2">
                    {activePillar?.title}
                  </h3>
                  <p className="text-base text-ink-muted leading-relaxed">{activePillar?.desc}</p>
                </div>

                {/* Live Animated Signal Execution Terminal */}
                <div className="rounded-xl bg-slate-50 dark:bg-[#07090F] border border-slate-200 dark:border-white/10 p-4 sm:p-5 font-mono text-xs sm:text-sm space-y-3">
                  <div className="flex items-center gap-2 text-ink-muted pb-2.5 border-b border-slate-200 dark:border-white/10 overflow-x-auto">
                    <span className="text-accent font-bold shrink-0">$</span>
                    <span className="text-ink whitespace-nowrap">{sim.cmd}</span>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${activeStep}-${runCount}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2"
                    >
                      {sim.output.map((line, lineIdx) => (
                        <motion.p
                          key={line}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.25,
                            delay: lineIdx * 0.09,
                            ease: STUDIO_EASE
                          }}
                          className="text-emerald-700 dark:text-emerald-300/95 leading-relaxed"
                        >
                          {line}
                        </motion.p>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Scopes Hairline Table */}
        <div id="services" className="scroll-mt-24 pt-12 border-t border-line">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent mb-2">
                {isEn ? '02 / Engagement Scope' : '02 / Cakupan Layanan'}
              </p>
              <h3 className="font-display text-2xl sm:text-4xl font-semibold text-ink">
                {t('services.heading')}
              </h3>
            </div>
            <p className="text-sm sm:text-base text-ink-muted max-w-md">{t('services.subheading')}</p>
          </div>

          <div className="border-y border-line divide-y divide-line">
            {Array.isArray(serviceItems) &&
              serviceItems.map((service) => (
                <div
                  key={service.id}
                  className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start"
                >
                  <div className="lg:col-span-4 space-y-1">
                    <span className="font-mono text-xs font-medium text-accent">{service.timeline}</span>
                    <h4 className="font-display text-xl font-semibold text-ink">
                      {service.title}
                    </h4>
                  </div>

                  <p className="lg:col-span-4 text-sm sm:text-base text-ink-muted leading-relaxed">
                    {service.desc}
                  </p>

                  <div className="lg:col-span-4 flex flex-col justify-between gap-4">
                    <ul className="space-y-1.5">
                      {Array.isArray(service.deliverables) &&
                        service.deliverables.map((line) => (
                          <li key={line} className="flex items-start gap-2 text-sm text-ink-muted">
                            <Check
                              size={15}
                              className="text-accent shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                            <span>{line}</span>
                          </li>
                        ))}
                    </ul>

                    <a
                      href="#contact"
                      className="group self-start inline-flex items-center gap-1.5 min-h-[36px] text-sm font-semibold text-ink hover:text-accent transition-colors"
                    >
                      <span>{t('services.book_cta')}</span>
                      <ArrowRight
                        size={15}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Stack Strip */}
        <div className="pt-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
              {t('capabilities.stack_eyebrow')}
            </span>
            <span className="font-mono text-xs text-ink-muted">Web · Mobile · AI · DevOps</span>
          </div>
          <TechLogoMarquee darkSurface={isDark} />
        </div>
      </div>
    </section>
  );
}
