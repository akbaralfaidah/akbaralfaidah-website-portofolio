import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Layers, Server, Smartphone, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';
import TechLogoMarquee from './ui/TechLogoMarquee';
import { FadeUp } from './ui/MotionPrimitives';
import { STUDIO_EASE } from '../lib/motion';

const PIPELINE_SPECS = [
  {
    icon: Layers,
    badge: 'Figma → Tailwind Tokens',
    titleId: 'Token Sistem & Responsivitas',
    titleEn: 'Design Tokens & Responsive Matrix',
    rows: [
      { key: 'Viewports', value: '375px · 768px · 1440px (Tested)' },
      { key: 'Contrast Floor', value: 'WCAG AA 4.5:1+ Semantic Pair' },
      { key: 'Motion Layer', value: 'Transform / Opacity · Reduced-Motion Ready' }
    ]
  },
  {
    icon: Server,
    badge: 'REST · GraphQL · PostgreSQL',
    titleId: 'Alur API & Hak Akses RBAC',
    titleEn: 'API Endpoints & Role Guards',
    rows: [
      { key: 'Auth & Policy', value: 'JWT + Row-Level Security (RLS)' },
      { key: 'Reporting', value: 'Automated PDF / Excel Streams' },
      { key: 'Persistence', value: 'Indexed PostgreSQL / Supabase / Laravel' }
    ]
  },
  {
    icon: Smartphone,
    badge: 'Flutter · Hardware Bridge',
    titleId: 'Integrasi GPS, Barcode & Printer',
    titleEn: 'GPS Geofence & Hardware Bridge',
    rows: [
      { key: 'Offline Mode', value: 'Local SQLite Queue + Cloud Sync' },
      { key: 'Peripherals', value: 'Bluetooth ESC/POS Thermal & Scanner' },
      { key: 'Verification', value: '50m GPS Radius + Biometric Gate' }
    ]
  },
  {
    icon: Cpu,
    badge: 'Docker · FastAPI · Gemini',
    titleId: 'Pipeline AI & Container Produksi',
    titleEn: 'AI Inference & Production Containers',
    rows: [
      { key: 'AI Services', value: 'Gemini API · NLP Parsing · OpenCV / YOLO' },
      { key: 'Container', value: 'Multi-Stage Node Build → Nginx Alpine' },
      { key: 'Headers & Edge', value: 'CSP · HSTS · Cloudflare Turnstile' }
    ]
  }
];

export default function Capabilities() {
  const { t, i18n } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);

  const pillars = t('capabilities.pillars', { returnObjects: true }) || [];
  const activePillar = pillars[activeStep] || pillars[0];
  const activeSpec = PIPELINE_SPECS[activeStep] || PIPELINE_SPECS[0];
  const SpecIcon = activeSpec.icon;
  const isEn = i18n.language === 'en';

  return (
    <section className="relative py-20 sm:py-24 px-6 bg-obsidian text-slate-100 border-b border-white/10 overflow-hidden">
      <div className="absolute inset-0 bg-obsidian-grid pointer-events-none" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-1/4 w-[520px] h-[360px] rounded-full opacity-25 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(37, 99, 235, 0.55), transparent 70%)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <FadeUp className="max-w-3xl mb-12 sm:mb-14">
          <h2 className="font-display text-3xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.08] text-white mb-4">
            {t('capabilities.heading')}
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed">
            {t('capabilities.subtitle')}
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch mb-14">
          {/* Left: 4-Step Selector */}
          <div className="lg:col-span-6 space-y-3" role="tablist" aria-label="Engineering workflow steps">
            {Array.isArray(pillars) &&
              pillars.map((item, idx) => {
                const isSelected = idx === activeStep;
                const Icon = PIPELINE_SPECS[idx]?.icon || Layers;
                return (
                  <button
                    key={item.step}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveStep(idx)}
                    className={`relative w-full text-left rounded-2xl p-5 sm:p-6 border transition-colors ${
                      isSelected
                        ? 'border-blue-500/50 text-white'
                        : 'border-white/10 bg-white/[0.02] text-slate-300 hover:bg-white/[0.05] hover:border-white/20'
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="capability-active-bg"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/20 to-sky-500/5 border border-blue-400/40 -z-0"
                      />
                    )}
                    <div className="relative z-10 flex items-start gap-4">
                      <span
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-400/60'
                            : 'bg-white/5 text-blue-400 border-white/10'
                        }`}
                      >
                        <Icon size={20} aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-mono text-sm font-bold text-blue-400">
                            {item.step}
                          </span>
                          {isSelected && (
                            <ArrowRight size={16} className="text-blue-400 shrink-0" aria-hidden="true" />
                          )}
                        </div>
                        <h3 className="font-display text-lg sm:text-xl font-bold text-white leading-snug mb-1.5">
                          {item.title}
                        </h3>
                        <p className="text-base text-slate-300 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>

          {/* Right: Live Architecture Panel */}
          <div className="lg:col-span-6 flex">
            <div className="w-full rounded-2xl bg-[#111827] border border-white/15 shadow-2xl p-6 sm:p-8 flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`pipeline-panel-${activeStep}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22, ease: STUDIO_EASE }}
                  className="space-y-6 h-full flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/10">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400">
                        <SpecIcon size={16} aria-hidden="true" />
                        <span>{activeSpec.badge}</span>
                      </span>
                      <span className="font-mono text-sm px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                        Step {activePillar?.step}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2.5">
                        {isEn ? activeSpec.titleEn : activeSpec.titleId}
                      </h3>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                        {activePillar?.desc}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    {activeSpec.rows.map((row) => (
                      <div
                        key={row.key}
                        className="rounded-xl bg-white/[0.04] border border-white/10 px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5"
                      >
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                          <CheckCircle2 size={16} className="text-blue-400 shrink-0" aria-hidden="true" />
                          <span>{row.key}</span>
                        </div>
                        <span className="font-mono text-sm font-medium text-white">
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Daily Stack Marquee */}
        <div className="pt-8 border-t border-white/10">
          <p className="text-sm font-semibold text-slate-300 mb-4">
            {t('capabilities.stack_eyebrow')}
          </p>
          <TechLogoMarquee darkSurface />
        </div>
      </div>
    </section>
  );
}
