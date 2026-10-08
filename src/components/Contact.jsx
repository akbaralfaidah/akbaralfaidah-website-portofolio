import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiMail, FiMapPin, FiGithub, FiLinkedin, FiInstagram, FiSend, FiExternalLink } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { Zap, Briefcase, Smartphone, Building2, Handshake, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { Turnstile } from '@marsidev/react-turnstile';
import AnimatedButton from './ui/AnimatedButton';
import Toast from './ui/Toast';

// EmailJS credentials — fetched from environment variables
// ⚠️ SECURITY: These are public keys exposed in the client bundle.
// Make sure to restrict allowed origins in the EmailJS Dashboard:
//   → https://dashboard.emailjs.com → Integration → Allowed Origins
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

// Allowed production domains for EmailJS (Fix #2)
const ALLOWED_ORIGINS = ['akbaralfaidah.com', 'www.akbaralfaidah.com', 'localhost'];

/**
 * Simple encode/decode helpers for rate limit data to resist casual localStorage tampering (Fix #4).
 * This is NOT cryptographic security — it just raises the bar above editing raw JSON in DevTools.
 */
const RATE_KEY = '_cl_rl';
function encodeRateData(data) {
  try {
    const json = JSON.stringify(data);
    return btoa(json.split('').reverse().join(''));
  } catch { return null; }
}
function decodeRateData(encoded) {
  try {
    const reversed = atob(encoded);
    return JSON.parse(reversed.split('').reverse().join(''));
  } catch { return { count: 0, lastSent: 0 }; }
}

export default function Contact() {
  const { t } = useTranslation();
  const [mode, setMode] = useState('wa'); // 'wa' or 'email'
  const [formData, setFormData] = useState({ name: '', whatsapp: '', email: '', message: '', deadline: '' });
  const [toast, setToast] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [turnstileToken, setTurnstileToken] = useState(null);
  const turnstileRef = useRef(null);

  // Custom Deadline Dropdown State & Click-outside Handler
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const deadlineOptions = [
    {
      id: 'cepat',
      icon: Zap,
      badgeClass: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
      label: t('contact.form_deadline_options.cepat'),
    },
    {
      id: 'standar',
      icon: Briefcase,
      badgeClass: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
      label: t('contact.form_deadline_options.standar'),
    },
    {
      id: 'menengah',
      icon: Smartphone,
      badgeClass: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
      label: t('contact.form_deadline_options.menengah'),
    },
    {
      id: 'kompleks',
      icon: Building2,
      badgeClass: 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400',
      label: t('contact.form_deadline_options.kompleks'),
    },
    {
      id: 'fleksibel',
      icon: Handshake,
      badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
      label: t('contact.form_deadline_options.fleksibel'),
    },
  ];

  const selectedDeadlineObj = deadlineOptions.find((opt) => opt.id === formData.deadline);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
  };

  const validate = () => {
    const { name, whatsapp, email, message, deadline } = formData;

    // Name validation
    if (!name.trim() || name.trim().length < 2) {
      showToast(t('contact.validation.name'));
      return false;
    }

    // Mode-specific validation
    if (mode === 'wa') {
      // WhatsApp number: digits only, 10-15 chars
      const cleanedWa = whatsapp.replace(/[\s\-()]/g, ''); // allow spaces/dashes for formatting
      if (!cleanedWa || !/^\d+$/.test(cleanedWa)) {
        showToast(t('contact.validation.wa_invalid'));
        return false;
      }
      if (cleanedWa.length < 10 || cleanedWa.length > 15) {
        showToast(t('contact.validation.wa_length'));
        return false;
      }
    } else {
      // Email validation
      if (!email.trim()) {
        showToast(t('contact.validation.email_empty'));
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        showToast(t('contact.validation.email_invalid'));
        return false;
      }
    }

    // Message validation
    if (!message.trim() || message.trim().length < 10) {
      showToast(t('contact.validation.message'));
      return false;
    }

    // Deadline validation
    if (!deadline) {
      showToast(t('contact.validation.deadline'));
      return false;
    }

    return true;
  };

  const checkRateLimit = () => {
    const stored = localStorage.getItem(RATE_KEY);
    const limitData = stored ? decodeRateData(stored) : { count: 0, lastSent: 0 };
    const now = Date.now();
    const cooldownMs = 60 * 1000; // 60 seconds
    const dailyMs = 24 * 60 * 60 * 1000; // 24 hours

    if (now - limitData.lastSent > dailyMs) {
      limitData.count = 0;
    }

    if (limitData.count >= 3) {
      showToast('Batas harian tercapai. Maksimal 3 pesan per hari.', 'error');
      return false;
    }

    if (now - limitData.lastSent < cooldownMs) {
      const waitSecs = Math.ceil((cooldownMs - (now - limitData.lastSent)) / 1000);
      showToast(`Tunggu ${waitSecs} detik sebelum mengirim lagi.`, 'error');
      return false;
    }

    return true;
  };

  const updateRateLimit = () => {
    const stored = localStorage.getItem(RATE_KEY);
    const limitData = stored ? decodeRateData(stored) : { count: 0, lastSent: 0 };
    const now = Date.now();
    const dailyMs = 24 * 60 * 60 * 1000;

    if (now - limitData.lastSent > dailyMs) {
      limitData.count = 0;
    }

    limitData.count += 1;
    limitData.lastSent = now;
    localStorage.setItem(RATE_KEY, encodeRateData(limitData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Honeypot trap: if filled, it's 100% a bot. Fake a success!
    if (honeypot) {
      showToast(mode === 'wa' ? t('contact.toast.wa_success') : t('contact.toast.email_success'), 'success');
      return;
    }

    if (!turnstileToken) {
      showToast('Mohon selesaikan verifikasi keamanan (Anti-Spam) terlebih dahulu.', 'error');
      return;
    }

    if (!validate()) return;
    if (!checkRateLimit()) return;

    if (mode === 'wa') {
      handleWhatsApp();
    } else {
      await handleEmail();
    }
  };

  /**
   * Reset Turnstile token after each submission to prevent token reuse (Fix #6).
   */
  const resetTurnstile = () => {
    setTurnstileToken(null);
    if (turnstileRef.current) {
      turnstileRef.current.reset();
    }
  };

  const handleWhatsApp = () => {
    const { name, whatsapp, message, deadline } = formData;
    const waTarget = import.meta.env.VITE_WHATSAPP_NUMBER;

    // Fix #10: Validate WhatsApp target number format
    if (!waTarget || !/^\d{10,15}$/.test(waTarget)) {
      showToast('Konfigurasi nomor WhatsApp tidak valid.', 'error');
      return;
    }

    const lines = [
      `Halo Akbar! \uD83D\uDC4B\uD83C\uDFFB `,
      `Saya tertarik untuk menggunakan layanan Anda. Boleh minta Estimasi Harga dan waktu pengerjaannya?`,
      ``,
      `Berikut detail pesanan saya:`,
      `\uD83D\uDC64 *Nama:* ${name}`,
      `\uD83D\uDCF1 *WhatsApp:* ${whatsapp}`,
      `\u23F0 *Deadline (Target Selesai):* ${t(`contact.form_deadline_options.${deadline}`)}`,
      `\uD83D\uDCCC *Detail Tugas:*`,
      `${message}`,
      ``,
      `Ditunggu balasannya ya, terima kasih! \uD83D\uDE80`,
    ];

    const text = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/${waTarget}?text=${text}`, '_blank');
    showToast(t('contact.toast.wa_success'), 'success');
    setFormData({ name: '', whatsapp: '', email: '', message: '', deadline: '' });
    updateRateLimit();
    resetTurnstile();
  };

  const handleEmail = async () => {
    // Fix #2: Validate origin before sending email
    const currentHost = window.location.hostname;
    if (!ALLOWED_ORIGINS.some(origin => currentHost === origin || currentHost.endsWith('.' + origin))) {
      showToast('Pengiriman email tidak diizinkan dari domain ini.', 'error');
      return;
    }

    setIsSending(true);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          deadline: t(`contact.form_deadline_options.${formData.deadline}`),
          to_name: 'Akbar Alfaidah',
        },
        EMAILJS_PUBLIC_KEY
      );
      showToast(t('contact.toast.email_success'), 'success');
      setFormData({ name: '', whatsapp: '', email: '', message: '', deadline: '' });
      updateRateLimit();
      resetTurnstile();
    } catch {
      showToast(t('contact.toast.email_error'), 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <section id="contact" className="py-8 md:py-12 lg:py-14 px-6 relative z-10 bg-paper dark:bg-[#1A1A1C] text-charcoal dark:text-[#F2F0E8]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

            {/* Left Column - Info */}
            <div className="w-full lg:w-5/12 flex flex-col justify-between">
              <div>
                <h2 className="text-5xl md:text-7xl font-display font-bold text-charcoal dark:text-[#F2F0E8] mb-6 leading-tight tracking-tight">
                  {t('contact.heading_1')} <br /><span className="text-brass">{t('contact.heading_2')}</span>
                </h2>
                <p className="text-charcoal/70 dark:text-[#F2F0E8]/70 text-lg mb-12 max-w-md">
                  {t('contact.desc')}
                </p>

                <div className="space-y-6 text-charcoal/80 dark:text-[#F2F0E8]/80 mb-12">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-charcoal/5 dark:bg-[#F2F0E8]/10 flex items-center justify-center text-brass">
                      <FiMail size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-charcoal/70 dark:text-[#F2F0E8]/70 mb-1">Email</p>
                      <p className="font-medium text-charcoal dark:text-[#F2F0E8]">{import.meta.env.VITE_CONTACT_EMAIL}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-charcoal/5 dark:bg-[#F2F0E8]/10 flex items-center justify-center text-brass">
                      <FiMapPin size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-charcoal/70 dark:text-[#F2F0E8]/70 mb-1">Location</p>
                      <p className="font-medium text-charcoal dark:text-[#F2F0E8]">Jambi, Indonesia</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                  <p className="text-sm font-medium text-charcoal/70 dark:text-[#F2F0E8]/70 mb-4">{t('contact.follow_me')}</p>
                  <div className="flex gap-4">
                    <a href="https://github.com/akbaralfaidah" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="w-12 h-12 rounded-full border border-charcoal/15 dark:border-[#F2F0E8]/15 flex items-center justify-center text-charcoal dark:text-[#F2F0E8] hover:bg-brass hover:text-white hover:border-brass transition-colors"><FiGithub size={20} /></a>
                    <a href="https://linkedin.com/in/akbaralfaidah" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-12 h-12 rounded-full border border-charcoal/15 dark:border-[#F2F0E8]/15 flex items-center justify-center text-charcoal dark:text-[#F2F0E8] hover:bg-brass hover:text-white hover:border-brass transition-colors"><FiLinkedin size={20} /></a>
                    <a href="https://instagram.com/akbaralfaidah" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-12 h-12 rounded-full border border-charcoal/15 dark:border-[#F2F0E8]/15 flex items-center justify-center text-charcoal dark:text-[#F2F0E8] hover:bg-brass hover:text-white hover:border-brass transition-colors"><FiInstagram size={20} /></a>
                  </div>
                </div>

                {/* Google Maps Studio Card */}
                <div className="rounded-3xl bg-charcoal/[0.03] dark:bg-[#F2F0E8]/5 border border-charcoal/10 dark:border-[#F2F0E8]/10 p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-charcoal/70 dark:text-[#F2F0E8]/70">
                        Studio & Lokasi Fisik
                      </span>
                    </div>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Akbar+Alfaidah+-+Jasa+Pembuatan+Website+%26+Aplikasi+di+Jambi"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brass hover:underline"
                    >
                      Buka Maps <FiExternalLink size={12} />
                    </a>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-charcoal dark:text-[#F2F0E8]">
                      Akbar Alfaidah
                    </h4>
                    <p className="text-xs text-charcoal/60 dark:text-[#F2F0E8]/60">
                      Jasa Pembuatan Website & Aplikasi di Jambi
                    </p>
                  </div>

                  {/* Responsive Map Viewport */}
                  <div className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-charcoal/10 dark:border-white/10 bg-charcoal/5 shadow-inner">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.2558810635155!2d103.61675777472514!3d-1.603528998381517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e2589f0973acb6f%3A0xbbce088fb030a962!2sAkbar%20Alfaidah%20-%20Jasa%20Pembuatan%20Website%20%26%20Aplikasi%20di%20Jambi!5e0!3m2!1sid!2sid!4v1791261507483!5m2!1sid!2sid"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      title="Lokasi Kantor Akbar Alfaidah di Google Maps"
                      className="w-full h-full object-cover dark:contrast-[1.05] dark:brightness-[0.9]"
                    />
                  </div>
                </div>
              </div>

            {/* Right Column - Form */}
            <div className="w-full lg:w-7/12">
              <div className="bg-charcoal/[0.03] dark:bg-[#F2F0E8]/5 border border-charcoal/10 dark:border-[#F2F0E8]/10 shadow-2xl rounded-[2.5rem] p-8 md:p-12">

                {/* Mode Toggle */}
                <div className="flex items-center justify-center mb-10">
                  <div className="inline-flex items-center bg-charcoal/5 dark:bg-[#F2F0E8]/5 rounded-full p-1 border border-charcoal/10 dark:border-[#F2F0E8]/10">
                    <button
                      type="button"
                      onClick={() => setMode('wa')}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${mode === 'wa'
                        ? 'bg-green-500 text-white shadow-md'
                        : 'text-charcoal/60 dark:text-[#F2F0E8]/60 hover:text-charcoal dark:hover:text-[#F2F0E8]'
                        }`}
                    >
                      <FaWhatsapp size={16} />
                      WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('email')}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${mode === 'email'
                        ? 'bg-brass text-white shadow-md'
                        : 'text-charcoal/60 dark:text-[#F2F0E8]/60 hover:text-charcoal dark:hover:text-[#F2F0E8]'
                        }`}
                    >
                      <FiMail size={16} />
                      Email
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                  {/* Name — always shown */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-charcoal/70 dark:text-[#F2F0E8]/70">{t('contact.form_name')}</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full bg-transparent border-b-2 border-charcoal/15 dark:border-[#F2F0E8]/15 focus:border-brass py-3 outline-none transition-colors text-charcoal dark:text-[#F2F0E8] placeholder:text-charcoal/50 dark:placeholder:text-[#F2F0E8]/50 font-medium"
                      placeholder={t('contact.form_name_placeholder')}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  {/* WA Number — only in WA mode */}
                  {mode === 'wa' && (
                    <div className="space-y-2">
                      <label htmlFor="whatsapp" className="text-sm font-medium text-charcoal/70 dark:text-[#F2F0E8]/70">
                        {t('contact.form_whatsapp')}
                      </label>
                      <div className="relative">
                        <FaWhatsapp size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-green-500" />
                        <input
                          type="tel"
                          id="whatsapp"
                          className="w-full bg-transparent border-b-2 border-charcoal/15 dark:border-[#F2F0E8]/15 focus:border-brass py-3 pl-7 outline-none transition-colors text-charcoal dark:text-[#F2F0E8] placeholder:text-charcoal/50 dark:placeholder:text-[#F2F0E8]/50 font-medium"
                          placeholder={t('contact.form_whatsapp_placeholder')}
                          value={formData.whatsapp}
                          onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  {/* Email — only in Email mode */}
                  {mode === 'email' && (
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-charcoal/70 dark:text-[#F2F0E8]/70">
                        {t('contact.form_email')}
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full bg-transparent border-b-2 border-charcoal/15 dark:border-[#F2F0E8]/15 focus:border-brass py-3 outline-none transition-colors text-charcoal dark:text-[#F2F0E8] placeholder:text-charcoal/50 dark:placeholder:text-[#F2F0E8]/50 font-medium"
                        placeholder="akbar@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  )}

                  {/* Custom Deadline Dropdown */}
                  <div className="space-y-1.5" ref={dropdownRef}>
                    <div className="relative">
                      <button
                        type="button"
                        id="deadline"
                        aria-haspopup="listbox"
                        aria-expanded={isDropdownOpen}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`w-full px-4 py-3 min-h-[60px] rounded-2xl border-2 flex items-center justify-between text-left transition-all duration-200 select-none focus:outline-none ${
                          isDropdownOpen
                            ? 'border-brass bg-white dark:bg-[#202226] ring-4 ring-brass/15 shadow-sm'
                            : formData.deadline
                              ? 'border-emerald-500/70 dark:border-emerald-400/70 bg-emerald-500/[0.03] dark:bg-emerald-500/[0.05]'
                              : 'border-charcoal/15 dark:border-[#F2F0E8]/15 hover:border-charcoal/30 dark:hover:border-[#F2F0E8]/30 bg-transparent'
                        }`}
                      >
                        <div className="flex flex-col gap-0.5 min-w-0 pr-3">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/50 dark:text-[#F2F0E8]/50">
                            {t('contact.form_deadline')}
                          </span>
                          {selectedDeadlineObj ? (
                            <div className="flex items-center gap-2.5 text-sm md:text-base font-semibold text-charcoal dark:text-[#F2F0E8] truncate">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${selectedDeadlineObj.badgeClass}`}>
                                <selectedDeadlineObj.icon size={15} strokeWidth={2.2} />
                              </div>
                              <span className="truncate">{selectedDeadlineObj.label}</span>
                            </div>
                          ) : (
                            <span className="text-sm md:text-base text-charcoal/40 dark:text-[#F2F0E8]/40 font-medium">
                              {t('contact.form_deadline_placeholder')}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {formData.deadline && !isDropdownOpen && (
                            <div className="w-6 h-6 rounded-full bg-emerald-500/15 dark:bg-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                              <Check size={14} strokeWidth={2.5} />
                            </div>
                          )}
                          <ChevronDown
                            size={20}
                            className={`transition-transform duration-300 ${
                              isDropdownOpen
                                ? 'rotate-180 text-brass'
                                : formData.deadline
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-charcoal/50 dark:text-[#F2F0E8]/50'
                            }`}
                          />
                        </div>
                      </button>

                      <AnimatePresence>
                        {isDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.98 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 bg-white dark:bg-[#202226] rounded-2xl border border-charcoal/10 dark:border-white/10 shadow-2xl shadow-charcoal/15 dark:shadow-black/60 p-2 overflow-hidden"
                          >
                            <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
                              {deadlineOptions.map((opt) => {
                                const isSelected = formData.deadline === opt.id;
                                const OptIcon = opt.icon;
                                return (
                                  <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => {
                                      setFormData({ ...formData, deadline: opt.id });
                                      setIsDropdownOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-sm md:text-[0.925rem] transition-all duration-150 ${
                                      isSelected
                                        ? 'bg-brass/15 dark:bg-brass/25 text-charcoal dark:text-white font-semibold'
                                        : 'text-charcoal/80 dark:text-[#F2F0E8]/80 hover:bg-charcoal/5 dark:hover:bg-white/5 font-medium'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3 min-w-0 pr-2">
                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${opt.badgeClass}`}>
                                        <OptIcon size={17} strokeWidth={2.2} />
                                      </div>
                                      <span className="truncate">{opt.label}</span>
                                    </div>
                                    {isSelected && (
                                      <Check size={18} className="text-brass shrink-0" strokeWidth={2.5} />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Message — always shown */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-charcoal/70 dark:text-[#F2F0E8]/70">{t('contact.form_message')}</label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full bg-transparent border-b-2 border-charcoal/15 dark:border-[#F2F0E8]/15 focus:border-brass py-3 outline-none transition-colors text-charcoal dark:text-[#F2F0E8] placeholder:text-charcoal/50 dark:placeholder:text-[#F2F0E8]/50 font-medium resize-none"
                      placeholder={t('contact.form_message_placeholder')}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  {/* Honeypot Field (Invisible to users) */}
                  <div style={{ display: 'none' }} aria-hidden="true">
                    <label htmlFor="website_url">Website URL</label>
                    <input
                      type="text"
                      id="website_url"
                      name="website_url"
                      tabIndex="-1"
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  {/* Cloudflare Turnstile Widget */}
                  <div className="pt-2">
                    <Turnstile 
                      ref={turnstileRef}
                      siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY} 
                      onSuccess={(token) => setTurnstileToken(token)}
                      onExpire={() => setTurnstileToken(null)}
                      options={{ theme: 'auto' }}
                    />
                    <p className="text-[10px] text-charcoal/40 dark:text-[#F2F0E8]/40 mt-1">
                      Dilindungi oleh Cloudflare Turnstile
                    </p>
                    {/* 
                      ⚠️ SECURITY TODO (Fix #6): For full protection, verify the Turnstile token 
                      server-side via POST https://challenges.cloudflare.com/turnstile/v0/siteverify
                      using your TURNSTILE_SECRET_KEY. This requires a backend/edge function.
                      Current implementation: client-side token presence check + token reuse prevention.
                    */}
                  </div>

                  <AnimatedButton
                    type="submit"
                    variant="brass"
                    disabled={isSending}
                    className="w-full md:w-auto px-8 h-14 text-sm tracking-widest uppercase"
                  >
                    {isSending ? t('contact.cta_sending') : t('contact.cta')}
                    <FiSend size={16} className="ml-2" />
                  </AnimatedButton>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
