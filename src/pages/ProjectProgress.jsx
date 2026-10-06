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
  FiRefreshCw
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { supabase } from '../lib/supabase';

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
 * Map status to label, visual styling tokens, and icon
 */
function getStageStatusMeta(status) {
  const norm = (status || '').toLowerCase().trim();
  if (['done', 'selesai', 'completed'].includes(norm)) {
    return {
      key: 'done',
      label: 'Selesai',
      badgeClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
      dotBg: 'bg-emerald-500 text-white shadow-emerald-500/30',
      lineBg: 'bg-emerald-500',
      isDone: true,
      isInProgress: false,
      isPending: false
    };
  }
  if (['in_progress', 'sedang berjalan', 'ongoing', 'proses', 'progress'].includes(norm)) {
    return {
      key: 'in_progress',
      label: 'Sedang Berjalan',
      badgeClass: 'bg-brass/15 text-brass dark:text-[#E0B566] border-brass/30',
      dotBg: 'bg-brass text-white shadow-brass/30 ring-4 ring-brass/20',
      lineBg: 'bg-charcoal/15 dark:bg-white/15',
      isDone: false,
      isInProgress: true,
      isPending: false
    };
  }
  return {
    key: 'pending',
    label: 'Belum',
    badgeClass: 'bg-charcoal/5 dark:bg-white/5 text-charcoal/60 dark:text-[#F2F0E8]/60 border-charcoal/10 dark:border-white/10',
    dotBg: 'bg-paper dark:bg-[#1A1A1C] border-2 border-charcoal/25 dark:border-white/25 text-charcoal/40 dark:text-white/40',
    lineBg: 'bg-charcoal/10 dark:bg-white/10',
    isDone: false,
    isInProgress: false,
    isPending: true
  };
}

export default function ProjectProgress({ fallbackComponent = null }) {
  const { token, slug } = useParams();
  const currentToken = token || slug;

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

  // If this token wasn't found in RPC and fallbackComponent is provided, render the fallback
  if (shouldFallback && fallbackComponent) {
    return fallbackComponent;
  }

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '62881080245045';
  const projectName = projectData?.name || projectData?.judul || 'Proyek';

  // 1. Loading State (Polished responsive skeleton)
  if (loading) {
    return (
      <div className="min-h-screen bg-paper dark:bg-[#1A1A1C] text-charcoal dark:text-[#F2F0E8] py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Skeleton Top Brand */}
          <div className="flex items-center justify-between pb-6 border-b border-charcoal/10 dark:border-white/10">
            <div className="h-6 w-32 bg-charcoal/10 dark:bg-white/10 rounded-full animate-pulse" />
            <div className="h-6 w-24 bg-charcoal/10 dark:bg-white/10 rounded-full animate-pulse" />
          </div>

          {/* Skeleton Header Card */}
          <div className="p-6 rounded-3xl bg-white/70 dark:bg-[#222428]/70 border border-charcoal/10 dark:border-white/10 space-y-4">
            <div className="h-4 w-28 bg-charcoal/10 dark:bg-white/10 rounded-full animate-pulse" />
            <div className="h-8 w-3/4 bg-charcoal/10 dark:bg-white/10 rounded-xl animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
              <div className="h-16 bg-charcoal/5 dark:bg-white/5 rounded-2xl animate-pulse" />
              <div className="h-16 bg-charcoal/5 dark:bg-white/5 rounded-2xl animate-pulse" />
            </div>
          </div>

          {/* Skeleton Timeline Steps */}
          <div className="p-6 rounded-3xl bg-white/70 dark:bg-[#222428]/70 border border-charcoal/10 dark:border-white/10 space-y-6">
            <div className="h-5 w-40 bg-charcoal/10 dark:bg-white/10 rounded-full animate-pulse" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-charcoal/10 dark:bg-white/10 shrink-0 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/2 bg-charcoal/10 dark:bg-white/10 rounded-md animate-pulse" />
                  <div className="h-3 w-1/4 bg-charcoal/5 dark:bg-white/5 rounded-md animate-pulse" />
                </div>
              </div>
            ))}
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
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-md w-full bg-white dark:bg-[#222428] rounded-3xl p-8 sm:p-10 border border-charcoal/10 dark:border-white/10 shadow-sm flex flex-col items-center"
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
    <div className="min-h-screen bg-paper dark:bg-[#1A1A1C] text-charcoal dark:text-[#F2F0E8] py-8 sm:py-12 px-4 sm:px-6 selection:bg-charcoal dark:selection:bg-[#F2F0E8] selection:text-paper dark:selection:text-charcoal transition-colors duration-300">
      <main className="max-w-2xl mx-auto space-y-6">
        
        {/* Top Minimal Brand Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between pb-4 border-b border-charcoal/10 dark:border-white/10 text-xs sm:text-sm font-medium"
        >
          <Link
            to="/"
            className="flex items-center gap-2.5 text-charcoal/80 dark:text-[#F2F0E8]/80 hover:text-brass dark:hover:text-brass transition-colors"
          >
            <img
              src="/img/unbackground.svg"
              alt="Akbar Alfaidah Logo"
              width={26}
              height={26}
              className="h-6.5 w-auto invert dark:invert-0"
            />
            <span className="font-semibold tracking-tight">Akbar Alfaidah</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brass/10 border border-brass/20 text-brass dark:text-[#E0B566] text-xs font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-brass animate-pulse" />
            Live Tracker
          </div>
        </motion.div>

        {/* Project Header Summary Card */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white/90 dark:bg-[#222428]/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-charcoal/10 dark:border-white/10 shadow-sm space-y-6"
        >
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-charcoal/50 dark:text-[#F2F0E8]/50 mb-2">
              Status Pengerjaan Proyek
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold tracking-tight text-charcoal dark:text-[#F2F0E8] leading-tight">
              {projectName}
            </h1>
          </div>

          {/* Metadata Grid: Estimasi Selesai & Terakhir Diperbarui */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Estimasi Selesai */}
            <div className="p-4 rounded-2xl bg-charcoal/[0.03] dark:bg-white/[0.03] border border-charcoal/5 dark:border-white/5 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-brass/10 text-brass dark:text-[#E0B566] flex items-center justify-center shrink-0 mt-0.5">
                <FiCalendar size={18} />
              </div>
              <div className="min-w-0">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/50 dark:text-[#F2F0E8]/50">
                  Estimasi Selesai
                </span>
                <span className="text-sm sm:text-base font-semibold text-charcoal dark:text-[#F2F0E8] truncate block">
                  {projectData.tracker_estimate && projectData.tracker_estimate.trim()
                    ? projectData.tracker_estimate.trim()
                    : 'Sesuai linimasa'}
                </span>
              </div>
            </div>

            {/* Terakhir Diperbarui */}
            <div className="p-4 rounded-2xl bg-charcoal/[0.03] dark:bg-white/[0.03] border border-charcoal/5 dark:border-white/5 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-charcoal/10 dark:bg-white/10 text-charcoal/70 dark:text-[#F2F0E8]/70 flex items-center justify-center shrink-0 mt-0.5">
                <FiRefreshCw size={17} />
              </div>
              <div className="min-w-0">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/50 dark:text-[#F2F0E8]/50">
                  Terakhir Diperbarui
                </span>
                <span className="text-sm sm:text-base font-semibold text-charcoal dark:text-[#F2F0E8] truncate block">
                  {formatDate(projectData.tracker_updated_at) || 'Baru saja'}
                </span>
              </div>
            </div>
          </div>

          {/* Preview Link (Tautan Preview jika ada) */}
          {previewUrl && (
            <div className="pt-1">
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 w-full py-3.5 px-5 rounded-2xl bg-charcoal/5 dark:bg-white/5 hover:bg-brass/15 dark:hover:bg-brass/20 border border-charcoal/10 dark:border-white/10 hover:border-brass/40 text-charcoal dark:text-[#F2F0E8] hover:text-brass dark:hover:text-[#E0B566] font-semibold text-sm transition-all duration-200 group"
              >
                <span>Buka Preview / Tautan Proyek</span>
                <FiExternalLink size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          )}
        </motion.section>

        {/* Vertical Stages Timeline */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white/90 dark:bg-[#222428]/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-charcoal/10 dark:border-white/10 shadow-sm"
        >
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-charcoal/10 dark:border-white/10">
            <div>
              <h2 className="text-lg sm:text-xl font-display font-bold text-charcoal dark:text-[#F2F0E8]">
                Tahapan Pengerjaan
              </h2>
              <p className="text-xs sm:text-sm text-charcoal/60 dark:text-[#F2F0E8]/60 mt-0.5">
                Rangkaian progres tahapan pengerjaan proyek dari awal hingga rilis.
              </p>
            </div>
            {sortedStages.length > 0 && (
              <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-charcoal/5 dark:bg-white/5 border border-charcoal/10 dark:border-white/10 text-charcoal/70 dark:text-[#F2F0E8]/70">
                {sortedStages.length} Tahap
              </span>
            )}
          </div>

          {sortedStages.length === 0 ? (
            <div className="text-center py-8 text-sm text-charcoal/50 dark:text-[#F2F0E8]/50">
              Belum ada data tahapan pengerjaan yang ditambahkan.
            </div>
          ) : (
            <div className="relative">
              {sortedStages.map((stage, idx) => {
                const meta = getStageStatusMeta(stage.status);
                const isLast = idx === sortedStages.length - 1;
                const completedDate = formatDate(stage.completed_at);

                return (
                  <div key={stage.id || stage.position || idx} className="relative flex gap-4 sm:gap-6">
                    
                    {/* Left Column: Timeline Line & Node */}
                    <div className="flex flex-col items-center shrink-0">
                      {/* Step Indicator Dot */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 ${meta.dotBg}`}
                        title={meta.label}
                      >
                        {meta.isDone ? (
                          <FiCheck size={16} className="stroke-[2.5]" />
                        ) : meta.isInProgress ? (
                          <FiClock size={15} className="animate-spin-slow stroke-[2.2]" />
                        ) : (
                          <span className="text-[11px] font-mono font-medium">{stage.position ?? idx + 1}</span>
                        )}
                      </div>

                      {/* Vertical Connector Line (hidden on last item) */}
                      {!isLast && (
                        <div
                          className={`w-0.5 flex-1 min-h-[3rem] my-1 rounded-full transition-colors ${
                            meta.isDone ? 'bg-emerald-500/70' : 'bg-charcoal/15 dark:bg-white/15'
                          }`}
                        />
                      )}
                    </div>

                    {/* Right Column: Stage Content */}
                    <div className={`flex-1 min-w-0 ${isLast ? 'pb-2' : 'pb-8'}`}>
                      
                      {/* Header Row: Title & Status Badge */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <h3 className={`text-sm sm:text-base font-semibold leading-snug ${
                          meta.isDone
                            ? 'text-charcoal dark:text-[#F2F0E8]'
                            : meta.isInProgress
                            ? 'text-charcoal dark:text-[#F2F0E8] font-bold'
                            : 'text-charcoal/70 dark:text-[#F2F0E8]/70'
                        }`}>
                          {stage.name}
                        </h3>

                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${meta.badgeClass}`}>
                          {meta.isInProgress && (
                            <span className="w-1.5 h-1.5 rounded-full bg-brass animate-pulse" />
                          )}
                          {meta.label}
                        </span>
                      </div>

                      {/* Completion Date (if completed) */}
                      {meta.isDone && completedDate && (
                        <div className="text-[11px] font-medium text-emerald-700/80 dark:text-emerald-400/80 mb-2">
                          Selesai pada {completedDate}
                        </div>
                      )}

                      {/* Brief Note (if provided) */}
                      {stage.note && stage.note.trim() && (
                        <div className={`mt-2 p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          meta.isInProgress
                            ? 'bg-brass/5 border border-brass/20 text-charcoal dark:text-[#F2F0E8]'
                            : 'bg-charcoal/[0.03] dark:bg-white/[0.03] border border-charcoal/5 dark:border-white/5 text-charcoal/80 dark:text-[#F2F0E8]/80'
                        }`}>
                          <div className="flex items-start gap-2">
                            <FiMessageSquare size={14} className="shrink-0 mt-0.5 text-charcoal/40 dark:text-white/40" />
                            <p className="whitespace-pre-line">{stage.note.trim()}</p>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.section>

        {/* Client Reassurance & Direct Contact Box */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="p-5 sm:p-6 rounded-3xl bg-white/60 dark:bg-[#222428]/60 border border-charcoal/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
        >
          <div>
            <h4 className="text-sm font-semibold text-charcoal dark:text-[#F2F0E8]">
              Ada pertanyaan terkait progres ini?
            </h4>
            <p className="text-xs text-charcoal/60 dark:text-[#F2F0E8]/60 mt-0.5">
              Hubungi langsung pengembang untuk koordinasi atau penyesuaian pengerjaan.
            </p>
          </div>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              `Halo Mas Akbar, saya ingin menanyakan perkembangan proyek "${projectName}".`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition-colors duration-200 shadow-sm shrink-0"
          >
            <FaWhatsapp size={16} />
            Hubungi via WhatsApp
          </a>
        </motion.footer>

        {/* Minimal Copyright */}
        <div className="text-center pt-2 pb-6 text-xs text-charcoal/40 dark:text-[#F2F0E8]/40">
          © {new Date().getFullYear()} Akbar Alfaidah. Dilindungi kerahasiaan klien.
        </div>

      </main>
    </div>
  );
}
