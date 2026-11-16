import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Layers,
  Server,
  Smartphone,
  Cpu,
  ArrowRight,
  Radio,
  Terminal,
  Check
} from 'lucide-react';
import TechLogoMarquee from './ui/TechLogoMarquee';
import MeshGradient from './ui/MeshGradient';
import { FadeUp } from './ui/MotionPrimitives';
import { STUDIO_EASE } from '../lib/motion';

function StepVisualWidget({ stepIndex, isEn }) {
  if (stepIndex === 0) {
    return (
      <div className="rounded-lg bg-[#090A0D] border border-white/10 p-4 font-mono text-xs space-y-2.5">
        <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-white/10">
          <span>design-tokens.css</span>
          <span className="text-slate-300">375 · 768 · 1440px</span>
        </div>
        <div className="space-y-1 text-slate-300">
          <p>
            <span className="text-blue-400">--font-display</span>: &apos;Plus Jakarta Sans&apos;;
          </p>
          <p>
            <span className="text-blue-400">--font-sans</span>: &apos;Inter&apos;;
          </p>
          <p>
            <span className="text-blue-400">--contrast-ink</span>: 14.2:1 (AAA);
          </p>
        </div>
      </div>
    );
  }

  if (stepIndex === 1) {
    return (
      <div className="rounded-lg bg-[#090A0D] border border-white/10 p-4 font-mono text-xs sm:text-sm space-y-2">
        <div className="flex items-center gap-2 text-slate-400 pb-2 border-b border-white/10">
          <Terminal size={14} className="text-blue-400" aria-hidden="true" />
          <span>POST /api/v1/reports/export</span>
          <span className="ml-auto px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 text-xs">
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
      <div className="rounded-lg bg-[#090A0D] border border-white/10 p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 border border-blue-400/25 text-blue-400">
            <Radio size={17} aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-medium text-white">GPS Geofence · Radius 50m</p>
            <p className="text-xs text-slate-400">
              {isEn ? 'Scanner & Thermal ESC/POS paired' : 'Scanner Barcode & Printer Thermal'}
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
    <div className="rounded-lg bg-[#090A0D] border border-white/10 p-4 font-mono text-xs space-y-2.5">
      <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-white/10">
        <span>docker-compose.prod.yml</span>
        <span className="text-emerald-300">HTTPS · Nginx</span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-slate-200">
        <div className="rounded bg-white/[0.04] border border-white/10 py-1.5">AI / NLP</div>
        <div className="rounded bg-white/[0.04] border border-white/10 py-1.5">Docker</div>
        <div className="rounded bg-white/[0.04] border border-white/10 py-1.5">Coolify CI</div>
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
      { key: 'Standar Baca', value: 'Kontras Tinggi & Bersih' }
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
  const serviceItems = t('services.items', { returnObjects: true }) || [];
  const activePillar = pillars[activeStep] || pillars[0];
  const activeSpec = PIPELINE_SPECS[activeStep] || PIPELINE_SPECS[0];
  const SpecIcon = activeSpec.icon;
  const isEn = i18n.language === 'en';

  return (
    <section
      id="capabilities"
      className="relative py-16 sm:py-20 px-5 sm:px-6 bg-[#0B0C10] text-slate-100 border-b border-white/10 overflow-hidden"
    >
      <MeshGradient dark />

      <div className="relative z-10 max-w-6xl mx-auto">
        <FadeUp className="max-w-3xl mb-12">
          <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-[-0.03em] leading-[1.08] text-white mb-4">
            {t('capabilities.heading')}
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            {t('capabilities.subtitle')}
          </p>
        </FadeUp>

        {/* Hairline Workflow Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          <div
            className="lg:col-span-6 border-y border-white/10 divide-y divide-white/10"
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
                    className={`group relative w-full text-left py-5 px-3 sm:px-4 transition-colors ${
                      isSelected ? 'text-white bg-white/[0.03]' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="capability-active-bar"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        className="absolute left-0 top-3 bottom-3 w-[2px] bg-blue-400"
                      />
                    )}
                    <div className="flex items-start gap-4">
                      <span
                        className={`font-mono text-sm font-semibold pt-0.5 transition-colors ${
                          isSelected ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'
                        }`}
                      >
                        {item.step}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="font-display text-lg sm:text-xl font-semibold text-white">
                            {item.title}
                          </h3>
                          <Icon
                            size={17}
                            className={isSelected ? 'text-blue-400 shrink-0' : 'text-slate-600 shrink-0'}
                            aria-hidden="true"
                          />
                        </div>
                        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>

          <div className="lg:col-span-6 lg:sticky lg:top-24">
            <div className="w-full rounded-xl bg-[#12141B] border border-white/15 p-6 sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`pipeline-panel-${activeStep}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: STUDIO_EASE }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/10">
                    <span className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm text-blue-400">
                      <SpecIcon size={16} aria-hidden="true" />
                      <span>{isEn ? activeSpec.badgeEn : activeSpec.badge}</span>
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      Step {activePillar?.step}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-2.5 leading-tight">
                      {activePillar?.title}
                    </h3>
                    <p className="text-base text-slate-300 leading-relaxed">
                      {activePillar?.desc}
                    </p>
                  </div>

                  <StepVisualWidget stepIndex={activeStep} isEn={isEn} />

                  <dl className="divide-y divide-white/10 border-t border-white/10">
                    {activeSpec.rows.map((row) => (
                      <div
                        key={row.key}
                        className="py-3 flex flex-wrap items-center justify-between gap-2 text-sm"
                      >
                        <dt className="text-slate-400">{row.key}</dt>
                        <dd className="font-mono text-slate-200 font-medium">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Hairline Service Scopes Ledger (Replaces SaaS pricing card boxes) */}
        <div id="services" className="scroll-mt-24 pt-12 border-t border-white/10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-2">
                {t('services.heading')}
              </h3>
              <p className="text-base text-slate-400 max-w-2xl">{t('services.subheading')}</p>
            </div>
          </div>

          <div className="border-y border-white/10 divide-y divide-white/10">
            {Array.isArray(serviceItems) &&
              serviceItems.map((service) => (
                <div
                  key={service.id}
                  className="py-6 sm:py-7 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start"
                >
                  <div className="lg:col-span-4 space-y-1.5">
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

        {/* Clean Borderless Technology Stack Marquee */}
        <div className="pt-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
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
