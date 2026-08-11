import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiMail, FiMapPin, FiGithub, FiLinkedin, FiInstagram, FiSend, FiChevronDown } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import AnimatedButton from './ui/AnimatedButton';
import Toast from './ui/Toast';

// EmailJS credentials — user will fill these after creating an EmailJS account
const EMAILJS_SERVICE_ID = 'service_yrpp7lt';
const EMAILJS_TEMPLATE_ID = 'template_vqna3cl';
const EMAILJS_PUBLIC_KEY = 'CC8VVIa6kKxRTlQHm'; // Replace after setup

export default function Contact() {
  const { t } = useTranslation();
  const [mode, setMode] = useState('wa'); // 'wa' or 'email'
  const [formData, setFormData] = useState({ name: '', whatsapp: '', email: '', message: '', deadline: '' });
  const [toast, setToast] = useState(null);
  const [isSending, setIsSending] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (mode === 'wa') {
      handleWhatsApp();
    } else {
      await handleEmail();
    }
  };

  const handleWhatsApp = () => {
    const { name, whatsapp, message, deadline } = formData;
    const waTarget = '62881080245045';

    const lines = [
      `Halo Akbar! 👋🏻`,
      `Saya tertarik untuk menggunakan layanan Anda. Boleh minta Estimasi Harga dan waktu pengerjaannya?`,
      ``,
      `Berikut detail pesanan saya:`,
      `👤 *Nama:* ${name}`,
      `📱 *WhatsApp:* ${whatsapp}`,
      `⏰ *Deadline (Target Selesai):* ${t(`contact.form_deadline_options.${deadline}`)}`,
      `📌 *Detail Tugas:*`,
      `${message}`,
      ``,
      `Ditunggu balasannya ya, terima kasih! 🚀`,
    ];

    const text = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/${waTarget}?text=${text}`, '_blank');
    showToast(t('contact.toast.wa_success'), 'success');
    setFormData({ name: '', whatsapp: '', email: '', message: '', deadline: '' });
  };

  const handleEmail = async () => {
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
                      <p className="font-medium text-charcoal dark:text-[#F2F0E8]">akbaralfaidahohs@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-charcoal/5 dark:bg-[#F2F0E8]/10 flex items-center justify-center text-brass">
                      <FiMapPin size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-charcoal/70 dark:text-[#F2F0E8]/70 mb-1">Location</p>
                      <p className="font-medium text-charcoal dark:text-[#F2F0E8]">Indonesia</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-charcoal/70 dark:text-[#F2F0E8]/70 mb-4">{t('contact.follow_me')}</p>
                <div className="flex gap-4">
                  <a href="https://github.com/akbaralfaidah" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-charcoal/15 dark:border-[#F2F0E8]/15 flex items-center justify-center text-charcoal dark:text-[#F2F0E8] hover:bg-brass hover:text-white hover:border-brass transition-colors"><FiGithub size={20} /></a>
                  <a href="https://linkedin.com/in/akbaralfaidah" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-charcoal/15 dark:border-[#F2F0E8]/15 flex items-center justify-center text-charcoal dark:text-[#F2F0E8] hover:bg-brass hover:text-white hover:border-brass transition-colors"><FiLinkedin size={20} /></a>
                  <a href="https://instagram.com/akbaralfaidah" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-charcoal/15 dark:border-[#F2F0E8]/15 flex items-center justify-center text-charcoal dark:text-[#F2F0E8] hover:bg-brass hover:text-white hover:border-brass transition-colors"><FiInstagram size={20} /></a>
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

                  {/* Deadline Dropdown */}
                  <div className="space-y-2">
                    <label htmlFor="deadline" className="text-sm font-medium text-charcoal/70 dark:text-[#F2F0E8]/70">
                      {t('contact.form_deadline')}
                    </label>
                    <div className="relative cursor-pointer">
                      <select
                        id="deadline"
                        className={`w-full bg-transparent border-b-2 py-3 outline-none transition-colors font-medium appearance-none cursor-pointer pr-10 ${!formData.deadline
                          ? 'text-charcoal/50 dark:text-[#F2F0E8]/50 border-charcoal/15 dark:border-[#F2F0E8]/15'
                          : 'text-charcoal dark:text-[#F2F0E8] border-brass'
                          } focus:border-brass`}
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      >
                        <option value="" disabled className="text-charcoal/50 bg-paper dark:bg-[#1A1A1C] dark:text-white">
                          {t('contact.form_deadline_placeholder')}
                        </option>
                        <option value="santai" className="bg-paper dark:bg-[#1A1A1C] dark:text-white text-charcoal">{t('contact.form_deadline_options.santai')}</option>
                        <option value="normal" className="bg-paper dark:bg-[#1A1A1C] dark:text-white text-charcoal">{t('contact.form_deadline_options.normal')}</option>
                        <option value="cepat" className="bg-paper dark:bg-[#1A1A1C] dark:text-white text-charcoal">{t('contact.form_deadline_options.cepat')}</option>
                        <option value="kilat" className="bg-paper dark:bg-[#1A1A1C] dark:text-white text-charcoal">{t('contact.form_deadline_options.kilat')}</option>
                      </select>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal/50 dark:text-[#F2F0E8]/50">
                        <FiChevronDown size={20} />
                      </div>
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
