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
import { STUDIO_EASE } from '../lib/motion';

function ScrollWord({ word, progress, range, serif = false }) {
  const opacity = useTransform(progress, range, [0.22, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className={serif ? 'font-serif italic font-normal text-blue-400' : undefined}
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
    <div ref={containerRef} className="py-10 sm:py-14 border-b border-white/10 mb-14">
      <p className="font-display text-2xl sm:text-4xl lg:text-[2.75rem] font-semibold tracking-[-0.03em] leading-[1.2] text-white max-w-4xl">
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
      '✓ Contrast Check: #F4F4F0 on #050608 → 18.4:1 (AAA)',
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
  const [activeStep, setActiveStep] = useState(0);
  const [runCount, setRunCount] = useState(1);

  const pillars = t('capabilities.pillars', { returnObjects: true }) || [];
  const serviceItems = t('services.items', { returnObjects: true }) || [];
  const activePillar = pillars[activeStep] || pillars[0];
  const sim = SIMULATIONS[activeStep] || SIMULATIONS[0];
  const SpecIcon = sim.icon;
  const isEn = i18n.language === 'en';

  return (
    <section
      id="capabilities"
      className="relative py-20 sm:py-24 px-5 sm:px-6 bg-[#06070A] text-slate-100 border-b border-white/10 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Scroll-Scrubbed Kinetic Serif Statement */}
        <KineticStatement isEn={isEn} />

        {/* Interactive Systems Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          <div
            className="lg:col-span-5 border-y border-white/10 divide-y divide-white/10"
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
                    className={`group relative w-full text-left py-5 px-3 transition-colors ${
                      isSelected ? 'text-white bg-white/[0.03]' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="workbench-active-bar"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        className="absolute left-0 top-3 bottom-3 w-[2px] bg-blue-400"
                      />
                    )}
                    <div className="flex items-start gap-4">
                      <span
                        className={`font-mono text-xs font-semibold pt-1 ${
                          isSelected ? 'text-blue-400' : 'text-slate-500'
                        }`}
                      >
                        {item.step}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-lg sm:text-xl font-semibold text-white mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>

          <div className="lg:col-span-7 lg:sticky lg:top-24">
            <div className="rounded-xl bg-[#0D1017] border border-white/15 overflow-hidden shadow-2xl shadow-black/50">
              <div className="px-5 py-3.5 bg-[#121620] border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 font-mono text-xs text-slate-300">
                  <SpecIcon size={15} className="text-blue-400" aria-hidden="true" />
                  <span>{sim.badge}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-400">
                    <Activity size={13} aria-hidden="true" />
                    <span>{sim.latency}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setRunCount((c) => c + 1)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-medium transition-colors"
                  >
                    <Play size={11} aria-hidden="true" />
                    <span>{isEn ? 'Re-run trace' : 'Uji Simulasi'}</span>
                  </button>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-blue-400">
                    Step {activePillar?.step}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white mt-1 mb-2">
                    {activePillar?.title}
                  </h3>
                  <p className="text-base text-slate-300 leading-relaxed">{activePillar?.desc}</p>
                </div>

                {/* Live Animated Signal Execution Terminal */}
                <div className="rounded-lg bg-[#050608] border border-white/10 p-4 sm:p-5 font-mono text-xs sm:text-sm space-y-3">
                  <div className="flex items-center gap-2 text-slate-400 pb-2.5 border-b border-white/10 overflow-x-auto">
                    <span className="text-blue-400 shrink-0">$</span>
                    <span className="text-slate-200 whitespace-nowrap">{sim.cmd}</span>
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
                          className="text-emerald-300/95 leading-relaxed"
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
        <div id="services" className="scroll-mt-24 pt-12 border-t border-white/10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-blue-400 mb-2">
                {isEn ? '02 / Engagement Scope' : '02 / Cakupan Layanan'}
              </p>
              <h3 className="font-display text-2xl sm:text-4xl font-semibold text-white">
                {t('services.heading')}
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-400 max-w-md">{t('services.subheading')}</p>
          </div>

          <div className="border-y border-white/10 divide-y divide-white/10">
            {Array.isArray(serviceItems) &&
              serviceItems.map((service) => (
                <div
                  key={service.id}
                  className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start"
                >
                  <div className="lg:col-span-4 space-y-1">
                    <span className="font-mono text-xs text-blue-400">{service.timeline}</span>
                    <h4 className="font-display text-xl font-semibold text-white">
                      {service.title}
                    </h4>
                  </div>

                  <p className="lg:col-span-4 text-sm sm:text-base text-slate-300 leading-relaxed">
                    {service.desc}
                  </p>

                  <div className="lg:col-span-4 flex flex-col justify-between gap-4">
                    <ul className="space-y-1.5">
                      {Array.isArray(service.deliverables) &&
                        service.deliverables.map((line) => (
                          <li key={line} className="flex items-start gap-2 text-sm text-slate-300">
                            <Check
                              size={15}
                              className="text-blue-400 shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                            <span>{line}</span>
                          </li>
                        ))}
                    </ul>

                    <a
                      href="#contact"
                      className="group self-start inline-flex items-center gap-1.5 min-h-[36px] text-sm font-medium text-white hover:text-blue-400 transition-colors"
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
            <span className="font-mono text-xs uppercase tracking-wider text-slate-400">
              {t('capabilities.stack_eyebrow')}
            </span>
            <span className="font-mono text-xs text-slate-500">Web · Mobile · AI · DevOps</span>
          </div>
          <TechLogoMarquee darkSurface />
        </div>
      </div>
    </section>
  );
}
