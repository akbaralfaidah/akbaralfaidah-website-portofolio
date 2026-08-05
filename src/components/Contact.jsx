import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiMail, FiMapPin, FiGithub, FiLinkedin, FiInstagram } from 'react-icons/fi';
import AnimatedButton from './ui/AnimatedButton';

export default function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = formData;
    const waNumber = "6281234567890"; // Ganti dengan nomor WhatsApp Abay
    const text = `Halo Akbar, saya ${name} (${email}).%0A%0A${message}`;
    window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');
  };

  return (
    <section id="contact" className="py-12 md:py-16 lg:py-20 px-6 relative z-10 bg-charcoal dark:bg-[#1A1A1C] text-paper dark:text-[#FAF8ED]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

          {/* Left Column - Info */}
          <div className="w-full lg:w-5/12 flex flex-col justify-between">
            <div>
              <h2 className="text-5xl md:text-7xl font-display font-bold text-paper dark:text-[#FAF8ED] mb-6 leading-tight tracking-tight">
                {t('contact.heading_1')} <br /><span className="text-brass">{t('contact.heading_2')}</span>
              </h2>
              <p className="text-paper/70 text-lg mb-12 max-w-md">
                {t('contact.desc')}
              </p>

              <div className="space-y-6 text-paper/80 mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-paper/10 flex items-center justify-center text-paper dark:text-[#D4A24C]">
                    <FiMail size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-mono opacity-60 uppercase tracking-widest mb-1">Email</p>
                    <p className="font-medium">hello@akbaralfaidah.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-paper/10 flex items-center justify-center text-paper dark:text-[#D4A24C]">
                    <FiMapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-mono opacity-60 uppercase tracking-widest mb-1">Location</p>
                    <p className="font-medium">Indonesia</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-mono opacity-60 uppercase tracking-widest mb-4 text-paper">{t('contact.follow_me')}</p>
              <div className="flex gap-4">
                <a href="https://github.com/akbaralfaidah" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-paper/20 flex items-center justify-center text-paper dark:text-[#D4A24C] hover:bg-paper hover:text-charcoal transition-colors"><FiGithub size={20} /></a>
                <a href="https://linkedin.com/in/akbaralfaidah" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-paper/20 flex items-center justify-center text-paper dark:text-[#D4A24C] hover:bg-paper hover:text-charcoal transition-colors"><FiLinkedin size={20} /></a>
                <a href="https://instagram.com/akbaralfaidah" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-paper/20 flex items-center justify-center text-paper dark:text-[#D4A24C] hover:bg-paper hover:text-charcoal transition-colors"><FiInstagram size={20} /></a>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="w-full lg:w-7/12">
            <div className="bg-paper/5 backdrop-blur-xl border border-paper/10 shadow-2xl rounded-[2.5rem] p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-mono tracking-widest uppercase text-paper/60">{t('contact.form_name')}</label>
                    <input
                      type="text"
                      id="name"
                      required
                      className="w-full bg-transparent border-b-2 border-paper/20 focus:border-brass py-3 outline-none transition-colors text-paper placeholder:text-paper/30 font-medium"
                      placeholder={t('contact.form_name_placeholder')}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-mono tracking-widest uppercase text-paper/60">{t('contact.form_email')}</label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="w-full bg-transparent border-b-2 border-paper/20 focus:border-brass py-3 outline-none transition-colors text-paper placeholder:text-paper/30 font-medium"
                      placeholder="akbar@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-mono tracking-widest uppercase text-paper/60">{t('contact.form_message')}</label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    className="w-full bg-transparent border-b-2 border-paper/20 focus:border-brass py-3 outline-none transition-colors text-paper placeholder:text-paper/30 font-medium resize-none"
                    placeholder={t('contact.form_message_placeholder')}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <AnimatedButton
                  type="submit"
                  variant="brass"
                  className="w-full md:w-auto px-8 h-14 text-sm tracking-widest uppercase"
                >
                  {t('contact.cta')}
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </AnimatedButton>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
