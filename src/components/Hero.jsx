import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Radar,
  Sparkles,
  Layers,
  MapPin,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { heroProjects } from '../data/projects';
import { Button } from './ui/Button';
import HeroCanvas from './ui/HeroCanvas';
import Magnetic from './ui/Magnetic';
import { STUDIO_EASE } from '../lib/motion';

function MaskedLine({ children, delay = 0, className = '' }) {
  return (
    <span className="block overflow-hidden pb-1 -mb-1">
      <motion.span
        initial={{ y: '105%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        transition={{ duration: 0.72, delay, ease: STUDIO_EASE }}
        className={`block ${className}`}
      >
        {children}
      </motion.span>
    </span>
  );
}

function parseWhatsAppTask(text, isEn) {
  const clean = text.trim();
  if (!clean) {
    return {
      title: isEn ? 'Waiting for message input...' : 'Menunggu isi pesan...',
      module: 'General',
      deadline: 'TBD',
      priority: 'NORMAL'
    };
  }
  const lower = clean.toLowerCase();
  const isUrgent = /urgent|segera|penting|asap|besok|deadline|hari ini/.test(lower);
  const timeMatch = clean.match(/(jam\s*\d{1,2}[:.]?\d{0,2}|besok|hari ini|minggu depan|\d{1,2}\s*wib)/i);
  const moduleMatch =
    clean.match(/(bosdepot|siabsen|mpp|simppk|peka|siskamling|api|payment|dashboard|pdf|pos|gps)/i)?.[0] ||
    'Core System';
  const summaryTitle =
    clean.length > 52 ? `${clean.slice(0, 52).replace(/\s+\S*$/, '')}...` : clean;

  return {
    title: summaryTitle,
    module: moduleMatch.toUpperCase(),
    deadline: timeMatch ? timeMatch[0] : isEn ? 'This Week' : 'Minggu Ini',
    priority: isUrgent ? 'HIGH' : 'MEDIUM'
  };
}

const WA_PRESETS_ID = [
  'Mas tolong update modul kasir BosDepot besok jam 14:00, urgent ya!',
  'Siapkan laporan PDF SimPPK dan deploy ke server minggu ini'
];

const WA_PRESETS_EN = [
  'Hey, please deploy the BosDepot POS payment patch tomorrow 14:00, urgent!',
  'Generate verified PDF report stream for SimPPK this week'
];

export default function Hero() {
  const { t, i18n } = useTranslation();
  const [labTab, setLabTab] = useState('radar');
  const [activeSlide, setActiveSlide] = useState(0);

  // Interactive GPS Geofence state (normalized % from center: max +/- 44%)
  const radarRef = useRef(null);
  const [pinPos, setPinPos] = useState({ dx: 12, dy: -8 });
  const [draggingPin, setDraggingPin] = useState(false);

  // Interactive AI Parser state
  const isEn = i18n.language === 'en';
  const [chatInput, setChatInput] = useState(WA_PRESETS_ID[0]);

  const facts = t('hero.facts', { returnObjects: true }) || [];
  const activeProject = heroProjects[activeSlide] || heroProjects[0];

  // Calculate simulated meter distance where visual radius ring (34% box width) === 50.0m
  const pixelScaleMeters = 50 / 32;
  const distMeters = Math.round(Math.hypot(pinPos.dx, pinPos.dy) * pixelScaleMeters * 10) / 10;
  const isInsideRadius = distMeters <= 50;

  const updatePinFromPointer = (clientX, clientY) => {
    const el = radarRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = ((clientX - rect.left) / rect.width) * 100 - 50;
    const relY = ((clientY - rect.top) / rect.height) * 100 - 50;
    setPinPos({
      dx: Math.max(-44, Math.min(44, relX)),
      dy: Math.max(-42, Math.min(42, relY))
    });
  };

  const parsedTask = parseWhatsAppTask(chatInput, isEn);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex items-center bg-paper text-ink pt-24 pb-12 sm:pt-28 sm:pb-16 border-b border-line overflow-hidden"
    >
      {/* Crisp Geometric Constellation & Click-Ripple Field (NO blurry smoke) */}
      <HeroCanvas />

      <div className="relative z-10 max-w-6xl w-full mx-auto px-5 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left: Sculptural Editorial Claim */}
        <div className="lg:col-span-6 flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: STUDIO_EASE }}
            className="inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.12em] text-ink-muted mb-6"
          >
            <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span>{t('hero.badge')} · Jambi / Remote</span>
          </motion.div>

          <h1 className="font-display text-[2.45rem] sm:text-[3.5rem] lg:text-[4.1rem] font-semibold tracking-[-0.035em] leading-[1.03] text-ink mb-6">
            {isEn ? (
              <>
                <MaskedLine delay={0.04}>Engineering Web,</MaskedLine>
                <MaskedLine delay={0.12}>
                  Mobile <span className="font-serif italic font-normal text-accent">&amp; Applied AI</span>
                </MaskedLine>
                <MaskedLine delay={0.2}>Built to Ship.</MaskedLine>
              </>
            ) : (
              <>
                <MaskedLine delay={0.04}>Website, Aplikasi</MaskedLine>
                <MaskedLine delay={0.12}>
                  <span className="font-serif italic font-normal text-accent">&amp; Sistem AI</span> yang
                </MaskedLine>
                <MaskedLine delay={0.2}>Siap Pakai.</MaskedLine>
              </>
            )}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease: STUDIO_EASE }}
            className="text-base sm:text-lg text-ink-muted leading-relaxed max-w-xl mb-8"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, delay: 0.3, ease: STUDIO_EASE }}
            className="flex flex-wrap items-center gap-3.5 mb-10 w-full sm:w-auto"
          >
            <Magnetic strength={0.25} className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                onClick={scrollToContact}
                className="w-full sm:w-auto"
              >
                <span>{t('hero.cta_primary')}</span>
                <ArrowRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Button>
            </Magnetic>

            <Button
              as={Link}
              to="/projects"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto bg-paper/50 backdrop-blur-md"
            >
              <span>{t('hero.cta_secondary')}</span>
              <ArrowUpRight
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Button>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.36 }}
            className="w-full grid grid-cols-3 gap-4 pt-6 border-t border-line"
          >
            {Array.isArray(facts) &&
              facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-ink-muted mb-1">
                    {fact.label}
                  </dt>
                  <dd className="text-sm sm:text-base font-medium text-ink">{fact.value}</dd>
                </div>
              ))}
          </motion.dl>
        </div>

        {/* Right: Genuine Interactive Live Engineering Playground */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.14, ease: STUDIO_EASE }}
          className="lg:col-span-6"
        >
          <div className="rounded-xl bg-[#0A0C10]/90 backdrop-blur-xl text-slate-100 border border-white/15 shadow-[0_32px_90px_rgba(0,0,0,0.65)] overflow-hidden">
            {/* Interactive Mode Tabs */}
            <div className="px-3.5 sm:px-5 py-3 bg-[#10131A] border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
              <div className="flex w-full sm:w-auto items-center justify-between sm:justify-start gap-1 p-0.5 rounded-lg bg-white/[0.05] border border-white/10 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setLabTab('radar')}
                  className={`min-h-[32px] px-2 sm:px-3 rounded-md text-[11px] sm:text-xs font-medium whitespace-nowrap shrink-0 inline-flex items-center gap-1 sm:gap-1.5 transition-colors ${
                    labTab === 'radar' ? 'bg-white text-[#050608]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Radar size={13} aria-hidden="true" />
                  <span>{isEn ? 'GPS Radar' : 'Radar GPS'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLabTab('ai')}
                  className={`min-h-[32px] px-2 sm:px-3 rounded-md text-[11px] sm:text-xs font-medium whitespace-nowrap shrink-0 inline-flex items-center gap-1 sm:gap-1.5 transition-colors ${
                    labTab === 'ai' ? 'bg-white text-[#050608]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles size={13} aria-hidden="true" />
                  <span>{isEn ? 'AI Parser' : 'Parser AI'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLabTab('deck')}
                  className={`min-h-[32px] px-2 sm:px-3 rounded-md text-[11px] sm:text-xs font-medium whitespace-nowrap shrink-0 inline-flex items-center gap-1 sm:gap-1.5 transition-colors ${
                    labTab === 'deck' ? 'bg-white text-[#050608]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers size={13} aria-hidden="true" />
                  <span>{isEn ? 'Works (5)' : 'Karya (5)'}</span>
                </button>
              </div>

              <span className="font-mono text-[11px] uppercase tracking-wider text-blue-400 hidden sm:inline">
                Interactive Demo
              </span>
            </div>

            {/* Interactive Body Viewport */}
            <AnimatePresence mode="wait">
              {labTab === 'radar' && (
                <motion.div
                  key="tab-radar"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: STUDIO_EASE }}
                  className="p-4 sm:p-5 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-mono text-xs text-slate-400">
                        {isEn
                          ? 'Drag or click anywhere on the radar grid'
                          : 'Klik atau geser pin di area radar'}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-xs font-semibold border ${
                        isInsideRadius
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {isInsideRadius ? (
                        <CheckCircle2 size={13} aria-hidden="true" />
                      ) : (
                        <XCircle size={13} aria-hidden="true" />
                      )}
                      <span>
                        {distMeters.toFixed(1)}m ·{' '}
                        {isInsideRadius
                          ? isEn
                            ? 'VALID'
                            : 'SAH'
                          : isEn
                          ? 'OUT OF RANGE'
                          : 'DI LUAR 50m'}
                      </span>
                    </span>
                  </div>

                  {/* Interactive Drag Radar Surface */}
                  <div
                    ref={radarRef}
                    onPointerDown={(e) => {
                      setDraggingPin(true);
                      updatePinFromPointer(e.clientX, e.clientY);
                    }}
                    onPointerMove={(e) => {
                      if (draggingPin) updatePinFromPointer(e.clientX, e.clientY);
                    }}
                    onPointerUp={() => setDraggingPin(false)}
                    onPointerLeave={() => setDraggingPin(false)}
                    role="application"
                    aria-label="Interactive 50m GPS geofence validator"
                    className="relative h-[240px] sm:h-[260px] rounded-lg bg-[#050608] border border-white/10 overflow-hidden cursor-crosshair select-none touch-none"
                    style={{
                      backgroundImage:
                        'radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)',
                      backgroundSize: '20px 20px'
                    }}
                  >
                    {/* Centered 50m Geofence Ring */}
                    <div
                      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed transition-colors duration-200 pointer-events-none ${
                        isInsideRadius
                          ? 'border-emerald-400/60 bg-emerald-500/[0.06]'
                          : 'border-rose-400/60 bg-rose-500/[0.06]'
                      }`}
                      style={{ width: '64%', aspectRatio: '1 / 1' }}
                    />
                    <div
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 pointer-events-none"
                      style={{ width: '32%', aspectRatio: '1 / 1' }}
                    />

                    {/* Line connecting Anchor Target -> Live Pin */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <line
                        x1="50%"
                        y1="50%"
                        x2={`${50 + pinPos.dx}%`}
                        y2={`${50 + pinPos.dy}%`}
                        stroke={isInsideRadius ? '#34d399' : '#fb7185'}
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                      />
                    </svg>

                    {/* Center Target Anchor */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
                      <span className="w-3 h-3 rounded-full bg-blue-400 ring-4 ring-blue-500/25" />
                      <span className="font-mono text-[10px] text-slate-400 mt-1 bg-[#050608]/80 px-1.5 rounded">
                        50m Geofence
                      </span>
                    </div>

                    {/* Draggable User Pin */}
                    <motion.div
                      animate={{
                        left: `${50 + pinPos.dx}%`,
                        top: `${50 + pinPos.dy}%`
                      }}
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center"
                    >
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border ${
                          isInsideRadius
                            ? 'bg-emerald-500 text-[#050608] border-emerald-300'
                            : 'bg-rose-500 text-white border-rose-300'
                        }`}
                      >
                        <MapPin size={16} aria-hidden="true" />
                      </span>
                    </motion.div>
                  </div>

                  {/* Quick Test Presets + Link to SiAbsen Case Study */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPinPos({ dx: 8, dy: -6 })}
                        className="px-2.5 py-1 rounded bg-white/[0.06] hover:bg-white/15 font-mono text-xs text-slate-300 transition-colors"
                      >
                        {isEn ? 'Inside (16m)' : 'Dalam Kelas (16m)'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPinPos({ dx: -26, dy: 14 })}
                        className="px-2.5 py-1 rounded bg-white/[0.06] hover:bg-white/15 font-mono text-xs text-slate-300 transition-colors"
                      >
                        {isEn ? 'Edge (46m)' : 'Pinggir (46m)'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPinPos({ dx: 34, dy: -26 })}
                        className="px-2.5 py-1 rounded bg-white/[0.06] hover:bg-white/15 font-mono text-xs text-slate-300 transition-colors"
                      >
                        {isEn ? 'Outside (67m)' : 'Luar Radius (67m)'}
                      </button>
                    </div>

                    <Link
                      to="/project/siabsen"
                      className="inline-flex items-center gap-1 font-mono text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <span>SiAbsen App</span>
                      <ArrowUpRight size={13} aria-hidden="true" />
                    </Link>
                  </div>
                </motion.div>
              )}

              {labTab === 'ai' && (
                <motion.div
                  key="tab-ai"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: STUDIO_EASE }}
                  className="p-4 sm:p-5 space-y-4"
                >
                  <div>
                    <label
                      htmlFor="hero-ai-input"
                      className="block font-mono text-xs text-slate-400 mb-2"
                    >
                      {isEn
                        ? 'Type or pick a messy chat message to extract a structured task:'
                        : 'Ketik atau pilih pesan chat berantakan untuk diekstrak jadi tugas terstruktur:'}
                    </label>
                    <textarea
                      id="hero-ai-input"
                      rows={2}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="w-full rounded-lg bg-[#050608] border border-white/15 focus:border-blue-400 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none resize-none"
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {(isEn ? WA_PRESETS_EN : WA_PRESETS_ID).map((sample, i) => (
                      <button
                        key={sample}
                        type="button"
                        onClick={() => setChatInput(sample)}
                        className="px-2.5 py-1 rounded bg-white/[0.06] hover:bg-white/15 font-mono text-xs text-slate-300 transition-colors"
                      >
                        Sample #{i + 1}
                      </button>
                    ))}
                  </div>

                  <div className="rounded-lg bg-[#050608] border border-white/10 p-4 font-mono text-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-white/10">
                      <span>chattask-nlp-output.json</span>
                      <span
                        className={`px-2 py-0.5 rounded font-semibold ${
                          parsedTask.priority === 'HIGH'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}
                      >
                        PRIORITY: {parsedTask.priority}
                      </span>
                    </div>
                    <p className="text-slate-300">
                      <span className="text-blue-400">title</span>: &quot;{parsedTask.title}&quot;
                    </p>
                    <p className="text-slate-300">
                      <span className="text-blue-400">module</span>: &quot;{parsedTask.module}&quot;
                    </p>
                    <p className="text-slate-300">
                      <span className="text-blue-400">deadline</span>: &quot;{parsedTask.deadline}&quot;
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-mono text-xs text-slate-400">
                      Built with Next.js + Gemini / NLP
                    </span>
                    <Link
                      to="/project/chattask"
                      className="inline-flex items-center gap-1 font-mono text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <span>ChatTask Case</span>
                      <ArrowUpRight size={13} aria-hidden="true" />
                    </Link>
                  </div>
                </motion.div>
              )}

              {labTab === 'deck' && (
                <motion.div
                  key="tab-deck"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: STUDIO_EASE }}
                  className="p-4 sm:p-5 space-y-4"
                >
                  <div className="relative aspect-video rounded-lg bg-[#050608] border border-white/10 overflow-hidden">
                    <motion.div
                      key={activeProject.slug}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.45}
                      onDragEnd={(_, info) => {
                        if (info.offset.x < -45) {
                          setActiveSlide((prev) => (prev + 1) % heroProjects.length);
                        } else if (info.offset.x > 45) {
                          setActiveSlide((prev) => (prev - 1 + heroProjects.length) % heroProjects.length);
                        }
                      }}
                      className="w-full h-full cursor-grab active:cursor-grabbing"
                    >
                      <img
                        src={activeProject.src}
                        alt={`${activeProject.name} showcase`}
                        width={1920}
                        height={1080}
                        draggable={false}
                        className="w-full h-full object-cover object-center select-none pointer-events-none"
                      />
                    </motion.div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="font-display text-lg font-semibold text-white truncate">
                        {activeProject.name} ·{' '}
                        <span className="font-mono text-xs font-normal text-blue-400">
                          {activeProject.category}
                        </span>
                      </h2>
                      <p className="text-xs text-slate-400 truncate">{activeProject.summary}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveSlide((prev) => (prev - 1 + heroProjects.length) % heroProjects.length)
                        }
                        className="w-8 h-8 rounded-md bg-white/[0.06] hover:bg-white/15 flex items-center justify-center text-white transition-colors"
                        aria-label="Previous showcase"
                      >
                        <ChevronLeft size={15} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveSlide((prev) => (prev + 1) % heroProjects.length)}
                        className="w-8 h-8 rounded-md bg-white/[0.06] hover:bg-white/15 flex items-center justify-center text-white transition-colors"
                        aria-label="Next showcase"
                      >
                        <ChevronRight size={15} aria-hidden="true" />
                      </button>
                      <Link
                        to={`/project/${activeProject.slug}`}
                        className="ml-1 px-3 py-1.5 rounded-md bg-white text-[#050608] text-xs font-semibold hover:bg-slate-200 inline-flex items-center gap-1 transition-colors"
                      >
                        <span>{t('hero.stage_action')}</span>
                        <ArrowUpRight size={13} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
