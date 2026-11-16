import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Mail,
  MapPin,
  Send,
  ExternalLink,
  ChevronDown,
  Check,
  Zap,
  Briefcase,
  Smartphone,
  Building2,
  Handshake,
  Map as MapIcon
} from 'lucide-react';
import { FiGithub, FiLinkedin, FiInstagram } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import { Turnstile } from '@marsidev/react-turnstile';
import { useTheme } from '../hooks/useTheme';
import { Button } from './ui/Button';
import Toast from './ui/Toast';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT;
const DISPLAY_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'akbaralfaidah667@gmail.com';
const WHATSAPP_TARGET = import.meta.env.VITE_WHATSAPP_NUMBER || '62881080245045';

const ALLOWED_ORIGINS = ['akbaralfaidah.com', 'www.akbaralfaidah.com', 'localhost', '127.0.0.1'];
const RATE_KEY = '_cl_rl';

const MAPS_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.2558810635155!2d103.61675777472514!3d-1.603528998381517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e2589f0973acb6f%3A0xbbce088fb030a962!2sAkbar%20Alfaidah%20-%20Jasa%20Pembuatan%20Website%20%26%20Aplikasi%20di%20Jambi!5e0!3m2!1sid!2sid!4v1791261507483!5m2!1sid!2sid';

const MAPS_DIRECT_URL =
  'https://www.google.com/maps/search/?api=1&query=Akbar+Alfaidah+-+Jasa+Pembuatan+Website+%26+Aplikasi+di+Jambi';

function encodeRateData(data) {
  try {
    const json = JSON.stringify(data);
    return btoa(json.split('').reverse().join(''));
  } catch {
    return null;
  }
}

function decodeRateData(encoded) {
  try {
    const reversed = atob(encoded);
    return JSON.parse(reversed.split('').reverse().join(''));
  } catch {
    return { count: 0, lastSent: 0 };
  }
}

export default function Contact() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();

  const [mode, setMode] = useState('wa');
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    message: '',
    deadline: ''
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const turnstileRef = useRef(null);
  const dropdownRef = useRef(null);
  const deadlineTriggerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isDropdownOpen) {
        setIsDropdownOpen(false);
        deadlineTriggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  const deadlineOptions = [
    { id: 'cepat', icon: Zap, label: t('contact.form_deadline_options.cepat') },
    { id: 'standar', icon: Briefcase, label: t('contact.form_deadline_options.standar') },
    { id: 'menengah', icon: Smartphone, label: t('contact.form_deadline_options.menengah') },
    { id: 'kompleks', icon: Building2, label: t('contact.form_deadline_options.kompleks') },
    { id: 'fleksibel', icon: Handshake, label: t('contact.form_deadline_options.fleksibel') }
  ];

  const selectedDeadline = deadlineOptions.find((opt) => opt.id === formData.deadline);

  const clearFieldError = (field) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = () => {
    const nextErrors = {};
    const { name, whatsapp, email, message, deadline } = formData;

    if (!name.trim() || name.trim().length < 2) {
      nextErrors.name = t('contact.validation.name');
    }

    if (mode === 'wa') {
      const cleaned = whatsapp.replace(/[\s\-()+]/g, '');
      if (!whatsapp.trim() || !/^\+?[\d\s\-()]+$/.test(whatsapp.trim())) {
        nextErrors.whatsapp = t('contact.validation.wa_invalid');
      } else if (cleaned.length < 10 || cleaned.length > 15) {
        nextErrors.whatsapp = t('contact.validation.wa_length');
      }
    } else {
      if (!email.trim()) {
        nextErrors.email = t('contact.validation.email_empty');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        nextErrors.email = t('contact.validation.email_invalid');
      }

      if (TURNSTILE_SITE_KEY && !turnstileToken) {
        nextErrors.turnstile = t('contact.validation.turnstile');
      }
    }

    if (!deadline) {
      nextErrors.deadline = t('contact.validation.deadline');
    }

    if (!message.trim() || message.trim().length < 10) {
      nextErrors.message = t('contact.validation.message');
    }

    setErrors(nextErrors);

    const firstKey = Object.keys(nextErrors)[0];
    if (firstKey) {
      const fieldIdMap = {
        name: 'contact-name',
        whatsapp: 'contact-whatsapp',
        email: 'contact-email',
        deadline: 'contact-deadline',
        message: 'contact-message'
      };
      const el = document.getElementById(fieldIdMap[firstKey]);
      el?.focus();
      return false;
    }

    return true;
  };

  const checkRateLimit = () => {
    try {
      const stored = window.localStorage.getItem(RATE_KEY);
      const limitData = stored ? decodeRateData(stored) : { count: 0, lastSent: 0 };
      const now = Date.now();
      const cooldownMs = 60 * 1000;
      const dailyMs = 24 * 60 * 60 * 1000;

      if (now - limitData.lastSent > dailyMs) {
        limitData.count = 0;
      }

      if (limitData.count >= 3) {
        setToast({
          message:
            i18n.language === 'en'
              ? 'Daily limit reached (max 3 inquiries per day).'
              : 'Batas harian tercapai (maksimal 3 pesan per hari).',
          type: 'error'
        });
        return false;
      }

      if (now - limitData.lastSent < cooldownMs) {
        const waitSecs = Math.ceil((cooldownMs - (now - limitData.lastSent)) / 1000);
        setToast({
          message:
            i18n.language === 'en'
              ? `Please wait ${waitSecs} seconds before sending again.`
              : `Tunggu ${waitSecs} detik sebelum mengirim kembali.`,
          type: 'error'
        });
        return false;
      }
    } catch {
      // Allow if localStorage unavailable
    }
    return true;
  };

  const updateRateLimit = () => {
    try {
      const stored = window.localStorage.getItem(RATE_KEY);
      const limitData = stored ? decodeRateData(stored) : { count: 0, lastSent: 0 };
      const now = Date.now();
      const dailyMs = 24 * 60 * 60 * 1000;

      if (now - limitData.lastSent > dailyMs) {
        limitData.count = 0;
      }
      limitData.count += 1;
      limitData.lastSent = now;
      window.localStorage.setItem(RATE_KEY, encodeRateData(limitData));
    } catch {
      // Ignore storage restriction
    }
  };

  const resetTurnstile = () => {
    setTurnstileToken(null);
    turnstileRef.current?.reset?.();
  };

  const handleWhatsApp = () => {
    if (!/^\d{10,15}$/.test(WHATSAPP_TARGET)) {
      setToast({
        message: 'WhatsApp configuration invalid.',
        type: 'error'
      });
      return;
    }

    const lines = [
      'Halo Akbar,',
      'Saya ingin berdiskusi mengenai pembuatan proyek digital.',
      '',
      `Nama: ${formData.name.trim()}`,
      `WhatsApp: ${formData.whatsapp.trim()}`,
      `Target Waktu: ${t(`contact.form_deadline_options.${formData.deadline}`)}`,
      '',
      'Ringkasan Kebutuhan:',
      formData.message.trim()
    ];

    const url = `https://wa.me/${WHATSAPP_TARGET}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setToast({ message: t('contact.toast.wa_success'), type: 'success' });
    setFormData({ name: '', whatsapp: '', email: '', message: '', deadline: '' });
    setErrors({});
    updateRateLimit();
  };

  const handleEmail = async () => {
    const currentHost = window.location.hostname;
    if (!ALLOWED_ORIGINS.some((origin) => currentHost === origin || currentHost.endsWith(`.${origin}`))) {
      setToast({ message: 'Origin is not permitted for form dispatch.', type: 'error' });
      return;
    }

    setIsSending(true);
    try {
      if (CONTACT_ENDPOINT) {
        const res = await fetch(CONTACT_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            deadline: t(`contact.form_deadline_options.${formData.deadline}`),
            message: formData.message.trim(),
            turnstileToken
          })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } else {
        if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
          throw new Error('Email service not configured');
        }
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            from_name: formData.name.trim(),
            from_email: formData.email.trim(),
            message: formData.message.trim(),
            deadline: t(`contact.form_deadline_options.${formData.deadline}`),
            to_name: 'Akbar Alfaidah'
          },
          EMAILJS_PUBLIC_KEY
        );
      }

      setToast({ message: t('contact.toast.email_success'), type: 'success' });
      setFormData({ name: '', whatsapp: '', email: '', message: '', deadline: '' });
      setErrors({});
      updateRateLimit();
      resetTurnstile();
    } catch {
      setToast({ message: t('contact.toast.email_error'), type: 'error' });
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (honeypot) {
      setToast({
        message: mode === 'wa' ? t('contact.toast.wa_success') : t('contact.toast.email_success'),
        type: 'success'
      });
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

  return (
    <>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <section id="contact" className="py-16 sm:py-24 px-6 bg-paper text-ink">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column — Contact Details & Map Facade */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-brass mb-3">
                {t('contact.eyebrow')}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-ink mb-4">
                {t('contact.heading_1')}{' '}
                <span className="text-brass">{t('contact.heading_2')}</span>
              </h2>
              <p className="text-base text-ink-muted leading-relaxed">{t('contact.desc')}</p>
            </div>

            {/* Direct Info */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-surface border border-line flex items-center justify-center text-brass shrink-0">
                  <Mail size={18} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted">
                    {t('contact.direct_email')}
                  </p>
                  <a
                    href={`mailto:${DISPLAY_EMAIL}`}
                    className="text-sm sm:text-base font-medium text-ink hover:text-brass transition-colors break-all"
                  >
                    {DISPLAY_EMAIL}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-surface border border-line flex items-center justify-center text-brass shrink-0">
                  <MapPin size={18} aria-hidden="true" />
                </div>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted">
                    Studio
                  </p>
                  <p className="text-sm sm:text-base font-medium text-ink">Jambi, Indonesia</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted mb-3">
                {t('contact.follow_me')}
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/AkbarAlfaidah"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Akbar Alfaidah"
                  className="w-11 h-11 rounded-xl bg-surface border border-line flex items-center justify-center text-ink hover:border-brass hover:text-brass transition-colors"
                >
                  <FiGithub size={18} aria-hidden="true" />
                </a>
                <a
                  href="https://www.linkedin.com/in/akbar-alfaidah/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Akbar Alfaidah"
                  className="w-11 h-11 rounded-xl bg-surface border border-line flex items-center justify-center text-ink hover:border-brass hover:text-brass transition-colors"
                >
                  <FiLinkedin size={18} aria-hidden="true" />
                </a>
                <a
                  href="https://www.instagram.com/akbralf._/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Akbar Alfaidah"
                  className="w-11 h-11 rounded-xl bg-surface border border-line flex items-center justify-center text-ink hover:border-brass hover:text-brass transition-colors"
                >
                  <FiInstagram size={18} aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Privacy-Friendly Click-to-Load Map Card */}
            <div className="rounded-2xl bg-surface border border-line p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-sm font-bold text-ink">{t('contact.map_title')}</h3>
                <a
                  href={MAPS_DIRECT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] inline-flex items-center gap-1 text-xs font-semibold text-brass hover:underline shrink-0"
                >
                  <span>{t('contact.map_open_external')}</span>
                  <ExternalLink size={12} aria-hidden="true" />
                </a>
              </div>

              <p className="text-xs text-ink-muted leading-relaxed">{t('contact.map_desc')}</p>

              <div className="aspect-[16/9] rounded-xl overflow-hidden border border-line bg-mist/60 flex items-center justify-center">
                {isMapLoaded ? (
                  <iframe
                    src={MAPS_EMBED_URL}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    title="Akbar Alfaidah Studio Location on Google Maps"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsMapLoaded(true)}
                    className="w-full h-full flex flex-col items-center justify-center gap-2.5 p-4 text-center hover:bg-mist transition-colors cursor-pointer"
                  >
                    <span className="w-10 h-10 rounded-full bg-surface border border-line flex items-center justify-center text-brass shadow-sm">
                      <MapIcon size={18} aria-hidden="true" />
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-ink">
                      {t('contact.map_load')}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column — Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-surface border border-line p-6 sm:p-8 lg:p-10 shadow-sm">
              {/* Channel Tabs */}
              <div
                role="tablist"
                aria-label="Contact channel"
                className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-mist border border-line mb-8"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'wa'}
                  onClick={() => {
                    setMode('wa');
                    setErrors({});
                  }}
                  className={`min-h-[44px] px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors ${
                    mode === 'wa'
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  <FaWhatsapp size={16} aria-hidden="true" />
                  <span>{t('contact.tab_wa')}</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'email'}
                  onClick={() => {
                    setMode('email');
                    setErrors({});
                  }}
                  className={`min-h-[44px] px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors ${
                    mode === 'email'
                      ? 'bg-brass text-on-brass shadow-sm'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  <Mail size={16} aria-hidden="true" />
                  <span>{t('contact.tab_email')}</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-ink mb-2">
                    {t('contact.form_name')}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    autoComplete="name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      clearFieldError('name');
                    }}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    placeholder={t('contact.form_name_placeholder')}
                    className={`w-full rounded-xl border bg-paper px-4 py-3 text-sm sm:text-base text-ink placeholder:text-ink-muted/60 focus:border-brass outline-none transition-colors ${
                      errors.name ? 'border-red-600 dark:border-red-400' : 'border-line'
                    }`}
                  />
                  {errors.name && (
                    <p
                      id="contact-name-error"
                      role="alert"
                      className="text-xs font-medium text-red-700 dark:text-red-400 mt-1.5"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Conditional WhatsApp / Email */}
                {mode === 'wa' ? (
                  <div>
                    <label
                      htmlFor="contact-whatsapp"
                      className="block text-sm font-medium text-ink mb-2"
                    >
                      {t('contact.form_whatsapp')}
                    </label>
                    <input
                      id="contact-whatsapp"
                      type="tel"
                      autoComplete="tel"
                      value={formData.whatsapp}
                      onChange={(e) => {
                        setFormData({ ...formData, whatsapp: e.target.value });
                        clearFieldError('whatsapp');
                      }}
                      aria-invalid={Boolean(errors.whatsapp)}
                      aria-describedby={errors.whatsapp ? 'contact-whatsapp-error' : undefined}
                      placeholder={t('contact.form_whatsapp_placeholder')}
                      className={`w-full rounded-xl border bg-paper px-4 py-3 text-sm sm:text-base text-ink placeholder:text-ink-muted/60 focus:border-brass outline-none transition-colors ${
                        errors.whatsapp ? 'border-red-600 dark:border-red-400' : 'border-line'
                      }`}
                    />
                    {errors.whatsapp && (
                      <p
                        id="contact-whatsapp-error"
                        role="alert"
                        className="text-xs font-medium text-red-700 dark:text-red-400 mt-1.5"
                      >
                        {errors.whatsapp}
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-sm font-medium text-ink mb-2"
                    >
                      {t('contact.form_email')}
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        clearFieldError('email');
                      }}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'contact-email-error' : undefined}
                      placeholder={t('contact.form_email_placeholder')}
                      className={`w-full rounded-xl border bg-paper px-4 py-3 text-sm sm:text-base text-ink placeholder:text-ink-muted/60 focus:border-brass outline-none transition-colors ${
                        errors.email ? 'border-red-600 dark:border-red-400' : 'border-line'
                      }`}
                    />
                    {errors.email && (
                      <p
                        id="contact-email-error"
                        role="alert"
                        className="text-xs font-medium text-red-700 dark:text-red-400 mt-1.5"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>
                )}

                {/* Accessible Timeline Select */}
                <div ref={dropdownRef} className="relative">
                  <label
                    htmlFor="contact-deadline"
                    className="block text-sm font-medium text-ink mb-2"
                  >
                    {t('contact.form_deadline')}
                  </label>

                  <button
                    ref={deadlineTriggerRef}
                    id="contact-deadline"
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={isDropdownOpen}
                    aria-invalid={Boolean(errors.deadline)}
                    aria-describedby={errors.deadline ? 'contact-deadline-error' : undefined}
                    onClick={() => setIsDropdownOpen((open) => !open)}
                    className={`w-full min-h-[48px] rounded-xl border bg-paper px-4 py-3 flex items-center justify-between text-left transition-colors ${
                      isDropdownOpen
                        ? 'border-brass'
                        : errors.deadline
                        ? 'border-red-600 dark:border-red-400'
                        : 'border-line hover:border-ink/40'
                    }`}
                  >
                    {selectedDeadline ? (
                      <span className="flex items-center gap-2.5 text-sm sm:text-base font-medium text-ink truncate pr-2">
                        <selectedDeadline.icon
                          size={16}
                          className="text-brass shrink-0"
                          aria-hidden="true"
                        />
                        <span className="truncate">{selectedDeadline.label}</span>
                      </span>
                    ) : (
                      <span className="text-sm sm:text-base text-ink-muted/70">
                        {t('contact.form_deadline_placeholder')}
                      </span>
                    )}

                    <ChevronDown
                      size={18}
                      className={`text-ink-muted shrink-0 transition-transform duration-200 ${
                        isDropdownOpen ? 'rotate-180 text-brass' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {isDropdownOpen && (
                    <div
                      role="listbox"
                      aria-labelledby="contact-deadline"
                      className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 rounded-xl bg-surface border border-line shadow-xl p-1.5 space-y-1 max-h-64 overflow-y-auto"
                    >
                      {deadlineOptions.map((opt) => {
                        const selected = formData.deadline === opt.id;
                        const OptIcon = opt.icon;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            role="option"
                            aria-selected={selected}
                            onClick={() => {
                              setFormData({ ...formData, deadline: opt.id });
                              clearFieldError('deadline');
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full min-h-[44px] px-3 py-2 rounded-lg text-left text-sm flex items-center justify-between gap-2 transition-colors ${
                              selected
                                ? 'bg-mist text-ink font-semibold'
                                : 'text-ink-muted hover:bg-mist/60 hover:text-ink'
                            }`}
                          >
                            <span className="flex items-center gap-2.5 min-w-0">
                              <OptIcon size={16} className="text-brass shrink-0" aria-hidden="true" />
                              <span className="truncate">{opt.label}</span>
                            </span>
                            {selected && (
                              <Check size={16} className="text-brass shrink-0" aria-hidden="true" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {errors.deadline && (
                    <p
                      id="contact-deadline-error"
                      role="alert"
                      className="text-xs font-medium text-red-700 dark:text-red-400 mt-1.5"
                    >
                      {errors.deadline}
                    </p>
                  )}
                </div>

                {/* Project Brief */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-sm font-medium text-ink mb-2"
                  >
                    {t('contact.form_message')}
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      clearFieldError('message');
                    }}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                    placeholder={t('contact.form_message_placeholder')}
                    className={`w-full rounded-xl border bg-paper px-4 py-3 text-sm sm:text-base text-ink placeholder:text-ink-muted/60 focus:border-brass outline-none transition-colors resize-y ${
                      errors.message ? 'border-red-600 dark:border-red-400' : 'border-line'
                    }`}
                  />
                  {errors.message && (
                    <p
                      id="contact-message-error"
                      role="alert"
                      className="text-xs font-medium text-red-700 dark:text-red-400 mt-1.5"
                    >
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Honeypot */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website_url">Website</label>
                  <input
                    id="website_url"
                    name="website_url"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                {/* Cloudflare Turnstile shown in Email mode where backend/API quota needs protection */}
                {mode === 'email' && (
                  <div className="space-y-2">
                    <span className="block font-mono text-xs uppercase tracking-[0.12em] text-ink-muted">
                      {t('contact.turnstile_label')}
                    </span>
                    {TURNSTILE_SITE_KEY ? (
                      <Turnstile
                        ref={turnstileRef}
                        siteKey={TURNSTILE_SITE_KEY}
                        onSuccess={(token) => {
                          setTurnstileToken(token);
                          clearFieldError('turnstile');
                        }}
                        onExpire={() => setTurnstileToken(null)}
                        options={{ theme: theme === 'dark' ? 'dark' : 'light' }}
                      />
                    ) : (
                      <p className="text-xs text-ink-muted border border-line rounded-lg px-3.5 py-2.5 bg-paper">
                        {t('contact.turnstile_unavailable')}
                      </p>
                    )}
                    {errors.turnstile && (
                      <p role="alert" className="text-xs font-medium text-red-700 dark:text-red-400">
                        {errors.turnstile}
                      </p>
                    )}
                  </div>
                )}

                <Button
                  type="submit"
                  variant={mode === 'wa' ? 'whatsapp' : 'accent'}
                  size="lg"
                  disabled={isSending}
                  className="w-full sm:w-auto"
                >
                  {mode === 'wa' ? (
                    <>
                      <FaWhatsapp size={18} aria-hidden="true" />
                      <span>{t('contact.cta_wa')}</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} aria-hidden="true" />
                      <span>{isSending ? t('contact.cta_sending') : t('contact.cta_email')}</span>
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
