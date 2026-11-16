import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Layers,
  Server,
  Smartphone,
  Cpu,
  CheckCircle2,
  ArrowRight,
  Radio,
  Terminal
} from 'lucide-react';
import TechLogoMarquee from './ui/TechLogoMarquee';
import MeshGradient from './ui/MeshGradient';
import { FadeUp } from './ui/MotionPrimitives';
import { STUDIO_EASE } from '../lib/motion';

function StepVisualWidget({ stepIndex, isEn }) {
  if (stepIndex === 0) {
    return (
      <div className="rounded-xl bg-[#0B101B] border border-white/10 p-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Responsive Layout</span>
          <span className="text-blue-400 font-mono">375px · 768px · 1440px</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-white/[0.06] border border-white/10 p-3 space-y-1.5">
            <span className="block w-6 h-2 rounded bg-blue-500" />
            <span className="block w-full h-2 rounded bg-white/20" />
            <span className="block w-2/3 h-2 rounded bg-white/10" />
          </div>
          <div className="rounded-lg bg-white/[0.06] border border-white/10 p-3 space-y-1.5">
            <span className="block w-8 h-2 rounded bg-sky-400" />
            <span className="block w-full h-2 rounded bg-white/20" />
            <span className="block w-4/5 h-2 rounded bg-white/10" />
          </div>
          <div className="rounded-lg bg-white/[0.06] border border-white/10 p-3 space-y-1.5">
            <span className="block w-5 h-2 rounded bg-amber-400" />
            <span className="block w-full h-2 rounded bg-white/20" />
            <span className="block w-1/2 h-2 rounded bg-white/10" />
          </div>
        </div>
      </div>
    );
  }

  if (stepIndex === 1) {
    return (
      <div className="rounded-xl bg-[#0B101B] border border-white/10 p-4 font-mono text-xs sm:text-sm space-y-2">
        <div className="flex items-center gap-2 text-slate-400 pb-2 border-b border-white/10">
          <Terminal size={14} className="text-blue-400" aria-hidden="true" />
          <span>api/v1/reports/export</span>
          <span className="ml-auto px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs">
            200 OK
          </span>
        </div>
        <p className="text-slate-300">
          <span className="text-blue-400">auth</span>: Role Guard + Row Security
        </p>
        <p className="text-slate-300">
          <span className="text-blue-400">output</span>: PDF / Excel Stream
        </p>
      </div>
    );
  }

  if (stepIndex === 2) {
    return (
      <div className="rounded-xl bg-[#0B101B] border border-white/10 p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-400">
            <Radio size={18} className="animate-pulse" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">GPS Geofence · Radius 50m</p>
            <p className="text-xs text-slate-400">
              {isEn ? 'Scanner & Thermal ESC/POS paired' : 'Scanner & Printer Struk terhubung'}
            </p>
          </div>
        </div>
        <span className="font-mono text-xs px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 shrink-0">
          Offline Ready
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[#0B101B] border border-white/10 p-4 space-y-2.5">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Build → Container → Live</span>
        <span className="text-emerald-300 font-semibold">HTTPS Active</span>
      </div>
      <div className="grid grid-cols-3 gap-2 font-mono text-xs text-center">
        <div className="rounded-lg bg-blue-500/15 border border-blue-400/30 py-2 text-blue-200">
          AI / NLP
        </div>
        <div className="rounded-lg bg-white/[0.06] border border-white/15 py-2 text-slate-200">
          Docker
        </div>
        <div className="rounded-lg bg-emerald-500/15 border border-emerald-400/30 py-2 text-emerald-200">
          Nginx Edge
        </div>
      </div>
    </div>
  );
}

const PIPELINE_SPECS = [
  {
    icon: Layers,
    badge: 'UI & Sistem Desain',
    badgeEn: 'UI & Design System',
    rows: [
      { key: 'Responsif', value: 'HP · Tablet · Desktop' },
      { key: 'Standar Baca', value: 'Kontras Tinggi & Mudah Dipakai' }
    ]
  },
  {
    icon: Server,
    badge: 'Web & Database',
    badgeEn: 'Web & Databases',
    rows: [
      { key: 'Stack Web', value: 'React · Next.js · Laravel' },
      { key: 'Keamanan', value: 'Role Guard & Database Terstruktur' }
    ]
  },
  {
    icon: Smartphone,
    badge: 'Mobile & Perangkat',
    badgeEn: 'Mobile & Hardware',
    rows: [
      { key: 'Platform', value: 'Flutter · React Native' },
      { key: 'Integrasi Alat', value: 'Barcode Scanner · Printer Thermal' }
    ]
  },
  {
    icon: Cpu,
    badge: 'AI & Cloud Server',
    badgeEn: 'AI & Cloud Server',
    rows: [
      { key: 'Fitur Pintar', value: 'Gemini API · NLP · OpenCV / YOLO' },
      { key: 'Server', value: 'Docker · CI/CD · SSL HTTPS' }
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
      <MeshGradient dark />

      <div className="relative z-10 max-w-6xl mx-auto">
        <FadeUp className="max-w-3xl mb-12 sm:mb-14">
          <h2 className="font-display text-3xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.08] text-white mb-4">
            {t('capabilities.heading')}
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed">
            {t('capabilities.subtitle')}
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start mb-14">
          {/* Left: Interactive 4-Step Tabs */}
          <div
            className="lg:col-span-6 space-y-3"
            role="tablist"
            aria-label="Engineering workflow steps"
          >
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
                    className={`relative w-full text-left rounded-2xl p-5 border transition-colors ${
                      isSelected
                        ? 'border-blue-400/50 text-white'
                        : 'border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06] hover:border-white/20'
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="capability-active-bg"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/25 to-sky-500/10 border border-blue-400/40 -z-0"
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
                            <ArrowRight
                              size={16}
                              className="text-blue-400 shrink-0"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                        <h3 className="font-display text-lg sm:text-xl font-bold text-white leading-snug mb-1">
                          {item.title}
                        </h3>
                        <p className="text-base text-slate-300 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>

          {/* Right: Compact Proportional Detail Card (NO empty dead vertical void!) */}
          <div className="lg:col-span-6 lg:sticky lg:top-28">
            <div className="w-full rounded-2xl bg-[#111827]/95 backdrop-blur-md border border-white/15 shadow-2xl p-6 sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`pipeline-panel-${activeStep}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22, ease: STUDIO_EASE }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/10">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400">
                      <SpecIcon size={17} aria-hidden="true" />
                      <span>{isEn ? activeSpec.badgeEn : activeSpec.badge}</span>
                    </span>
                    <span className="font-mono text-sm px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                      {activePillar?.step}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2.5">
                      {activePillar?.title}
                    </h3>
                    <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                      {activePillar?.desc}
                    </p>
                  </div>

                  <StepVisualWidget stepIndex={activeStep} isEn={isEn} />

                  <div className="space-y-2.5">
                    {activeSpec.rows.map((row) => (
                      <div
                        key={row.key}
                        className="rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5"
                      >
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                          <CheckCircle2
                            size={16}
                            className="text-blue-400 shrink-0"
                            aria-hidden="true"
                          />
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

        {/* Stack Marquee */}
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
