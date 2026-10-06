import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiCheck,
  FiClock,
  FiCalendar,
  FiExternalLink,
  FiArrowLeft,
  FiAlertCircle,
  FiMessageSquare,
  FiRefreshCw,
  FiActivity,
  FiSun,
  FiMoon
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import { useTheme } from '../hooks/useTheme';

/**
 * Format timestamp into Indonesian locale date string
 * e.g., "6 Oktober 2026"
 */
function formatDate(dateString) {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Map status to visual metadata
 */
function getStageStatusMeta(status) {
  const norm = (status || '').toLowerCase().trim();
  if (['done', 'selesai', 'completed'].includes(norm)) {
    return {
      key: 'done',
      label: 'Selesai',
      badgeClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25',
      nodeBg: 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25',
      cardBorder: 'border-emerald-500/15 dark:border-emerald-500/20',
      isDone: true,
      isInProgress: false,
      isPending: false
    };
  }
  if (['in_progress', 'sedang berjalan', 'ongoing', 'proses', 'progress'].includes(norm)) {
    return {
      key: 'in_progress',
      label: 'Sedang Berjalan',
      badgeClass: 'bg-brass/15 text-brass dark:text-[#E0B566] border-brass/35 font-semibold',
      nodeBg: 'bg-gradient-to-br from-brass to-amber-600 text-white shadow-lg shadow-brass/35',
      cardBorder: 'border-brass/40 dark:border-brass/40 ring-1 ring-brass/25',
      isDone: false,
      isInProgress: true,
      isPending: false
    };
  }
  return {
    key: 'pending',
    label: 'Belum',
    badgeClass: 'bg-charcoal/5 dark:bg-white/5 text-charcoal/50 dark:text-[#F2F0E8]/50 border-charcoal/10 dark:border-white/10',
    nodeBg: 'bg-white dark:bg-[#222428] border-2 border-neutral-300 dark:border-zinc-700 text-charcoal/70 dark:text-white/60 font-semibold shadow-sm',
    cardBorder: 'border-charcoal/10 dark:border-white/10 opacity-85',
    isDone: false,
    isInProgress: false,
    isPending: true
  };
}

/**
 * Determine the visual state of the connector line between stage[idx] and stage[idx + 1]
 * Returns: 'completed' | 'active_flow' | 'pending'
 */
function getConnectorState(idx, stages) {
  const current = stages[idx];
  const next = stages[idx + 1];
  if (!next) return 'none';

  const isCurrentDone = ['done', 'selesai', 'completed'].includes((current.status || '').toLowerCase().trim());
  const isCurrentInProgress = ['in_progress', 'sedang berjalan', 'ongoing', 'proses', 'progress'].includes((current.status || '').toLowerCase().trim());
  const isNextDone = ['done', 'selesai', 'completed'].includes((next.status || '').toLowerCase().trim());
  const isNextInProgress = ['in_progress', 'sedang berjalan', 'ongoing', 'proses', 'progress'].includes((next.status || '').toLowerCase().trim());

  // 1. If current stage is in_progress, the line flowing to next stage is ACTIVE FLOW
  if (isCurrentInProgress) {
    return 'active_flow';
  }

  // 2. If both current and next are done (or next is in_progress), line is COMPLETED (solid green, no motion)
  if (isCurrentDone && (isNextDone || isNextInProgress)) {
    return 'completed';
  }

  // 3. If current is done and next is NOT done, but NO stage in the whole list is marked in_progress:
  // Then this transition is the leading edge of progress -> active flow
  const hasInProgress = stages.some(s =>
    ['in_progress', 'sedang berjalan', 'ongoing', 'proses', 'progress'].includes((s.status || '').toLowerCase().trim())
  );
  if (isCurrentDone && !isNextDone && !hasInProgress) {
    return 'active_flow';
  }

  // 4. In all other cases (e.g. stage 5 -> 6, 6 -> 7, ...), it's PENDING (solid gray, clearly visible)
  return 'pending';
}

export default function ProjectProgress({ fallbackComponent = null }) {
  const { token, slug } = useParams();
  const currentToken = token || slug;
  const { theme, toggleTheme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState(null);
  const [shouldFallback, setShouldFallback] = useState(false);

  // Set meta robots (noindex, nofollow) and referrer (no-referrer) exclusively for this page
  useEffect(() => {
    let robotsMeta = document.querySelector('meta[name="robots"]');
    const prevRobots = robotsMeta ? robotsMeta.getAttribute('content') : null;
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', 'noindex,nofollow');

    let referrerMeta = document.querySelector('meta[name="referrer"]');
    const prevReferrer = referrerMeta ? referrerMeta.getAttribute('content') : null;
    if (!referrerMeta) {
      referrerMeta = document.createElement('meta');
      referrerMeta.setAttribute('name', 'referrer');
      document.head.appendChild(referrerMeta);
    }
    referrerMeta.setAttribute('content', 'no-referrer');

    return () => {
      if (prevRobots) {
        robotsMeta.setAttribute('content', prevRobots);
      } else if (robotsMeta && robotsMeta.parentNode) {
        robotsMeta.parentNode.removeChild(robotsMeta);
      }

      if (prevReferrer) {
        referrerMeta.setAttribute('content', prevReferrer);
      } else if (referrerMeta && referrerMeta.parentNode) {
        referrerMeta.parentNode.removeChild(referrerMeta);
      }
    };
  }, []);

  // Fetch project progress via Supabase RPC get_project_progress using anon key
  useEffect(() => {
    let isMounted = true;

    async function loadProgress() {
      if (!currentToken || !currentToken.trim()) {
        if (isMounted) {
          setLoading(false);
          setProjectData(null);
        }
        return;
      }

      setLoading(true);

      try {
        const { data, error } = await supabase.rpc('get_project_progress', {
          p_token: currentToken.trim()
        });

        if (!isMounted) return;

        if (error || !data) {
          if (fallbackComponent) {
            setShouldFallback(true);
          } else {
            setProjectData(null);
          }
        } else {
          setProjectData(data);
        }
      } catch {
        if (isMounted) {
          if (fallbackComponent) {
            setShouldFallback(true);
          } else {
            setProjectData(null);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProgress();

    return () => {
      isMounted = false;
    };
  }, [currentToken, fallbackComponent]);

  // Update document title dynamically
  useEffect(() => {
    const originalTitle = document.title;
    if (loading) {
      document.title = 'Memuat Progres Proyek... | Akbar Alfaidah';
    } else if (projectData) {
      const name = projectData.name || projectData.judul || 'Proyek';
      document.title = `${name} — Progres Pengerjaan | Akbar Alfaidah`;
    } else {
      document.title = 'Halaman Tidak Ditemukan | Akbar Alfaidah';
    }

    return () => {
      document.title = originalTitle;
    };
  }, [loading, projectData]);

  // Safe preview URL resolver (guarantees https:// if missing)
  const previewUrl = useMemo(() => {
    if (!projectData?.tracker_preview_url) return null;
    const url = projectData.tracker_preview_url.trim();
    if (!url) return null;
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
  }, [projectData]);

  // Sort stages by position
  const sortedStages = useMemo(() => {
    if (!projectData?.stages || !Array.isArray(projectData.stages)) return [];
    return [...projectData.stages].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  }, [projectData]);

  // Find currently active stage (in_progress, or first pending)
  const activeStageInfo = useMemo(() => {
    if (!sortedStages.length) return null;
    const inProgress = sortedStages.find(s => {
      const norm = (s.status || '').toLowerCase().trim();
      return ['in_progress', 'sedang berjalan', 'ongoing', 'proses', 'progress'].includes(norm);
    });
    if (inProgress) return inProgress;

    const firstPending = sortedStages.find(s => {
      const norm = (s.status || '').toLowerCase().trim();
      return !['done', 'selesai', 'completed'].includes(norm);
    });
    return firstPending || sortedStages[sortedStages.length - 1];
  }, [sortedStages]);

  // If this token wasn't found in RPC and fallbackComponent is provided, render the fallback
  if (shouldFallback && fallbackComponent) {
    return fallbackComponent;
  }

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '62881080245045';
  const projectName = projectData?.name || projectData?.judul || 'Proyek';

  // 1. Loading State (Polished responsive skeleton)
  if (loading) {
    return (
      <div className="min-h-screen bg-paper dark:bg-[#1A1A1C] text-charcoal dark:text-[#F2F0E8] py-8 sm:py-14 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center justify-between pb-6 border-b border-charcoal/10 dark:border-white/10">
            <div className="h-7 w-36 bg-charcoal/10 dark:bg-white/10 rounded-full animate-pulse" />
            <div className="h-7 w-28 bg-charcoal/10 dark:bg-white/10 rounded-full animate-pulse" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-4">
              <div className="h-6 w-24 bg-charcoal/10 dark:bg-white/10 rounded-full animate-pulse" />
              <div className="h-10 w-3/4 bg-charcoal/10 dark:bg-white/10 rounded-2xl animate-pulse" />
              <div className="h-28 bg-charcoal/5 dark:bg-white/5 rounded-3xl animate-pulse" />
            </div>
            <div className="lg:col-span-7 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-charcoal/5 dark:bg-white/5 rounded-3xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Generic Not Found / Disabled Tracker State (Per requirements: do NOT differentiate invalid token vs disabled tracker)
  if (!projectData) {
    return (
      <div className="min-h-screen bg-paper dark:bg-[#1A1A1C] text-charcoal dark:text-[#F2F0E8] flex flex-col items-center justify-center p-6 text-center selection:bg-charcoal dark:selection:bg-[#F2F0E8] selection:text-paper dark:selection:text-charcoal">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-md w-full bg-white/90 dark:bg-[#222428]/90 backdrop-blur-md rounded-3xl p-8 sm:p-10 border border-charcoal/10 dark:border-white/10 shadow-lg flex flex-col items-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-charcoal/5 dark:bg-white/5 border border-charcoal/10 dark:border-white/10 flex items-center justify-center text-charcoal/60 dark:text-[#F2F0E8]/60 mb-6">
            <FiAlertCircle size={28} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight mb-3 text-charcoal dark:text-[#F2F0E8]">
            Halaman Tidak Ditemukan
          </h1>

          <p className="text-sm sm:text-base text-charcoal/70 dark:text-[#F2F0E8]/70 leading-relaxed mb-8">
            Halaman yang Anda tuju tidak tersedia, tautan pelacak tidak valid, atau pemantauan progres proyek telah dinonaktifkan.
          </p>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-charcoal dark:bg-[#F2F0E8] text-paper dark:text-charcoal text-sm font-semibold hover:bg-brass dark:hover:bg-brass dark:hover:text-white transition-colors duration-200 shadow-sm"
          >
            <FiArrowLeft size={16} />
            Kembali ke Beranda
          </Link>
        </motion.div>
      </div>
    );
  }

  // 3. Main Project Progress Tracker View
  return (
    <div className="min-h-screen bg-paper dark:bg-[#1A1A1C] text-charcoal dark:text-[#F2F0E8] py-6 sm:py-10 px-4 sm:px-6 md:px-8 selection:bg-charcoal dark:selection:bg-[#F2F0E8] selection:text-paper dark:selection:text-charcoal transition-colors duration-300">
      
      {/* Top Header & Navigation */}
      <header className="max-w-5xl mx-auto mb-8 sm:mb-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between pb-4 border-b border-charcoal/10 dark:border-white/10"
        >
          {/* Brand Logo & Name */}
          <Link
            to="/"
            className="group flex items-center gap-3 hover:opacity-85 transition-opacity"
          >
            <img
              src="/img/unbackground.svg"
              alt="Akbar Alfaidah Logo"
              width={32}
              height={32}
              className="w-8 h-8 object-contain shrink-0 invert dark:invert-0 transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm tracking-tight text-charcoal dark:text-[#F2F0E8]">
                Akbar Alfaidah
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-charcoal/50 dark:text-[#F2F0E8]/50">
                Client Portal
              </span>
            </div>
          </Link>

          {/* Right Controls: Live status & theme toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Tracking
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 sm:px-3 sm:py-1.5 rounded-full border border-charcoal/10 dark:border-white/10 hover:bg-charcoal/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1.5 text-xs font-medium text-charcoal/70 dark:text-[#F2F0E8]/70"
              title="Ganti Tema"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <FiSun size={15} className="text-amber-400" /> : <FiMoon size={15} />}
              <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
          </div>
        </motion.div>
      </header>

      {/* Main Content Layout (Responsive 2-column on desktop, single column on mobile) */}
      <main className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Sticky Project Overview (Desktop) */}
          <motion.aside
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-8 space-y-6"
          >
            {/* Project Summary Card */}
            <div className="bg-white/80 dark:bg-[#222428]/80 backdrop-blur-xl rounded-[2rem] p-6 sm:p-7 border border-charcoal/10 dark:border-white/10 shadow-sm relative overflow-hidden">
              
              {/* Subtle ambient light gradient background */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-brass/10 dark:bg-brass/15 rounded-full blur-3xl pointer-events-none" />

              {/* Eyebrow badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-brass/15 text-brass dark:text-[#E0B566] border border-brass/25">
                  Proyek Klien
                </span>
                <span className="text-xs text-charcoal/40 dark:text-white/40">&bull;</span>
                <span className="text-xs text-charcoal/60 dark:text-[#F2F0E8]/60 font-medium">
                  {sortedStages.length} Tahap Pengerjaan
                </span>
              </div>

              {/* Project Headline */}
              <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-charcoal dark:text-[#F2F0E8] leading-tight mb-4">
                {projectName}
              </h1>

              {/* Active Stage Callout banner */}
              {activeStageInfo && (
                <div className="mb-6 p-3.5 rounded-2xl bg-brass/[0.08] dark:bg-brass/[0.12] border border-brass/25 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-brass text-white flex items-center justify-center shrink-0 shadow-sm shadow-brass/30">
                    <FiActivity size={16} className="animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[10px] uppercase font-mono font-bold tracking-wider text-brass dark:text-[#E0B566]">
                      Tahap Saat Ini
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-charcoal dark:text-[#F2F0E8] truncate block">
                      {activeStageInfo.name}
                    </span>
                  </div>
                </div>
              )}

              {/* Metadata Items: Estimasi Selesai & Terakhir Diperbarui */}
              <div className="space-y-3 pt-1 border-t border-charcoal/5 dark:border-white/5">
                
                {/* Estimasi Selesai */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-charcoal/[0.03] dark:bg-white/[0.03] border border-charcoal/5 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-brass/10 text-brass dark:text-[#E0B566] flex items-center justify-center shrink-0">
                      <FiCalendar size={15} />
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold tracking-wider text-charcoal/50 dark:text-[#F2F0E8]/50">
                        Estimasi Selesai
                      </span>
                      <span className="text-sm font-semibold text-charcoal dark:text-[#F2F0E8]">
                        {projectData.tracker_estimate && projectData.tracker_estimate.trim()
                          ? projectData.tracker_estimate.trim()
                          : 'Sesuai linimasa'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Terakhir Diperbarui */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-charcoal/[0.03] dark:bg-white/[0.03] border border-charcoal/5 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-charcoal/10 dark:bg-white/10 text-charcoal/70 dark:text-[#F2F0E8]/70 flex items-center justify-center shrink-0">
                      <FiRefreshCw size={14} />
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold tracking-wider text-charcoal/50 dark:text-[#F2F0E8]/50">
                        Terakhir Diperbarui
                      </span>
                      <span className="text-sm font-semibold text-charcoal dark:text-[#F2F0E8]">
                        {formatDate(projectData.tracker_updated_at) || 'Hari ini'}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Preview Link (Tautan Preview jika ada) */}
              {previewUrl && (
                <div className="mt-5 pt-3">
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 w-full py-3.5 px-5 rounded-2xl bg-charcoal dark:bg-[#F2F0E8] text-paper dark:text-charcoal hover:bg-brass dark:hover:bg-brass dark:hover:text-white font-semibold text-sm transition-all duration-300 shadow-sm group"
                  >
                    <span>Buka Demo / Staging Preview</span>
                    <FiExternalLink size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              )}

            </div>

            {/* Quick Contact & Reassurance Box */}
            <div className="bg-white/60 dark:bg-[#222428]/60 backdrop-blur-md rounded-3xl p-5 border border-charcoal/10 dark:border-white/10 flex flex-col gap-3">
              <div>
                <h3 className="text-sm font-bold text-charcoal dark:text-[#F2F0E8]">
                  Perlu Koordinasi atau Revisi?
                </h3>
                <p className="text-xs text-charcoal/60 dark:text-[#F2F0E8]/60 mt-0.5 leading-relaxed">
                  Hubungi langsung pengembang untuk mendiskusikan penyesuaian pengerjaan.
                </p>
              </div>

              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  `Halo Mas Akbar, saya ingin koordinasi terkait update progres proyek "${projectName}".`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition-colors duration-200 shadow-sm"
              >
                <FaWhatsapp size={16} />
                Hubungi via WhatsApp
              </a>
            </div>

            {/* Minimal Copyright */}
            <div className="hidden lg:block text-xs text-charcoal/40 dark:text-[#F2F0E8]/40 pt-2">
              © {new Date().getFullYear()} Akbar Alfaidah. Dokumen privat pelacakan proyek klien.
            </div>

          </motion.aside>

          {/* RIGHT COLUMN: Interactive Animated Timeline */}
          <section className="lg:col-span-7 xl:col-span-7 space-y-6">
            
            {/* Section Header */}
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-charcoal dark:text-[#F2F0E8]">
                  Linimasa Tahapan
                </h2>
                <p className="text-xs sm:text-sm text-charcoal/60 dark:text-[#F2F0E8]/60 mt-0.5">
                  Alur pengerjaan dari kesepakatan hingga serah terima.
                </p>
              </div>

              <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-charcoal/5 dark:bg-white/5 border border-charcoal/10 dark:border-white/10 text-charcoal/70 dark:text-[#F2F0E8]/70">
                {sortedStages.length} Tahap
              </span>
            </div>

            {/* Timeline Track Container */}
            {sortedStages.length === 0 ? (
              <div className="p-12 text-center text-sm text-charcoal/50 dark:text-[#F2F0E8]/50 bg-white/50 dark:bg-[#222428]/50 rounded-3xl border border-charcoal/10 dark:border-white/10">
                Belum ada data tahapan pengerjaan yang ditambahkan.
              </div>
            ) : (
              <div className="relative pl-2 sm:pl-4 space-y-4">
                
                {sortedStages.map((stage, idx) => {
                  const meta = getStageStatusMeta(stage.status);
                  const isLast = idx === sortedStages.length - 1;
                  const completedDate = formatDate(stage.completed_at);

                  return (
                    <motion.div
                      key={stage.id || stage.position || idx}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: idx * 0.04 }}
                      className="relative flex gap-4 sm:gap-6 group"
                    >
                      {/* Vertical Spine (Node + Connecting line with flowing animation) */}
                      <div className="flex flex-col items-center shrink-0 relative">
                        
                        {/* Node Container with Active Pulse/Ping */}
                        <div className="relative z-10 flex items-center justify-center">
                          {/* Active radar ping beacon on the In-Progress stage */}
                          {meta.isInProgress && (
                            <>
                              <span className="absolute -inset-2 rounded-full bg-brass/25 animate-ping duration-1000 pointer-events-none" />
                              <span className="absolute -inset-1 rounded-full bg-brass/35 animate-pulse duration-700 pointer-events-none" />
                            </>
                          )}

                          {/* Node Circle */}
                          <div
                            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${meta.nodeBg}`}
                            title={meta.label}
                          >
                            {meta.isDone ? (
                              <FiCheck size={18} className="stroke-[2.5]" />
                            ) : meta.isInProgress ? (
                              <FiClock size={18} className="stroke-[2.2]" />
                            ) : (
                              <span className="text-xs font-mono font-medium">{stage.position ?? idx + 1}</span>
                            )}
                          </div>
                        </div>

                        {/* Vertical Connector Line (Custom states based on progress) */}
                        {!isLast && (() => {
                          const lineState = getConnectorState(idx, sortedStages);

                          if (lineState === 'completed') {
                            // 1. Completed milestone line: Solid green, ZERO motion/animation
                            return (
                              <div className="relative w-1 flex-1 min-h-[4.5rem] my-1 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.3)]" />
                            );
                          }

                          if (lineState === 'active_flow') {
                            // 2. Active working segment (e.g. Stage 4 -> Stage 5): Prominent animated traveling beam
                            return (
                              <div className="relative w-1 sm:w-1.5 flex-1 min-h-[5rem] my-1 rounded-full bg-neutral-300 dark:bg-zinc-700/80 overflow-hidden shadow-[0_0_10px_rgba(201,152,63,0.4)]">
                                {/* Ambient highlight on the active path */}
                                <div className="absolute inset-0 bg-brass/25 dark:bg-brass/35" />
                                
                                {/* High-intensity traveling laser beam */}
                                <motion.div
                                  className="absolute left-0 right-0 h-16 rounded-full bg-gradient-to-b from-transparent via-amber-400 to-amber-200 dark:via-[#F5D061] dark:to-yellow-200 shadow-[0_0_14px_rgba(245,158,11,1)]"
                                  animate={{
                                    top: ['-100%', '100%']
                                  }}
                                  transition={{
                                    duration: 1.4,
                                    repeat: Infinity,
                                    ease: 'easeInOut'
                                  }}
                                />

                                {/* Bright leading spark traveling down */}
                                <motion.div
                                  className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(251,191,36,1)]"
                                  animate={{
                                    top: ['-15%', '100%']
                                  }}
                                  transition={{
                                    duration: 1.4,
                                    repeat: Infinity,
                                    ease: 'easeInOut'
                                  }}
                                />
                              </div>
                            );
                          }

                          // 3. Pending/Inactive line: Solid gray, clearly visible in both light & dark mode, zero animation
                          return (
                            <div className="relative w-1 flex-1 min-h-[4.5rem] my-1 rounded-full bg-neutral-300 dark:bg-zinc-700" />
                          );
                        })()}
                      </div>

                      {/* Right Stage Card */}
                      <div className={`flex-1 min-w-0 ${isLast ? 'pb-2' : 'pb-5'}`}>
                        <div className={`p-4 sm:p-5 rounded-3xl bg-white/80 dark:bg-[#222428]/80 backdrop-blur-md border ${meta.cardBorder} shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5`}>
                          
                          {/* Card Header: Position & Status Badge */}
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-charcoal/50 dark:text-[#F2F0E8]/50">
                              Tahap {stage.position || idx + 1}
                            </span>

                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${meta.badgeClass}`}>
                              {meta.isInProgress && (
                                <span className="w-1.5 h-1.5 rounded-full bg-brass animate-pulse" />
                              )}
                              {meta.label}
                            </span>
                          </div>

                          {/* Stage Name / Headline */}
                          <h3 className={`text-base sm:text-lg font-display font-semibold leading-snug mb-1.5 ${
                            meta.isInProgress
                              ? 'text-charcoal dark:text-[#F2F0E8] font-bold'
                              : meta.isDone
                              ? 'text-charcoal dark:text-[#F2F0E8]'
                              : 'text-charcoal/70 dark:text-[#F2F0E8]/70'
                          }`}>
                            {stage.name}
                          </h3>

                          {/* Completion date subtitle */}
                          {meta.isDone && completedDate && (
                            <div className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mt-1">
                              <span className="w-1 h-1 rounded-full bg-emerald-500" />
                              Selesai pada {completedDate}
                            </div>
                          )}

                          {/* Stage Note (Catatan singkat tahapan) */}
                          {stage.note && stage.note.trim() && (
                            <div className={`mt-3 p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                              meta.isInProgress
                                ? 'bg-brass/[0.08] dark:bg-brass/[0.12] border border-brass/25 text-charcoal dark:text-[#F2F0E8]'
                                : 'bg-charcoal/[0.03] dark:bg-white/[0.03] border border-charcoal/5 dark:border-white/5 text-charcoal/80 dark:text-[#F2F0E8]/80'
                            }`}>
                              <div className="flex items-start gap-2.5">
                                <FiMessageSquare size={14} className="shrink-0 mt-0.5 text-charcoal/40 dark:text-white/40" />
                                <p className="whitespace-pre-line">{stage.note.trim()}</p>
                              </div>
                            </div>
                          )}

                        </div>
                      </div>

                    </motion.div>
                  );
                })}

              </div>
            )}

            {/* Mobile Copyright */}
            <div className="block lg:hidden text-center text-xs text-charcoal/40 dark:text-[#F2F0E8]/40 pt-6 pb-4">
              © {new Date().getFullYear()} Akbar Alfaidah. Dokumen privat pelacakan proyek klien.
            </div>

          </section>

        </div>
      </main>

    </div>
  );
}
