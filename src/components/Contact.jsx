import { useState } from 'react';
import { FiMail, FiMapPin, FiGithub, FiLinkedin, FiInstagram } from 'react-icons/fi';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = formData;
    const waNumber = "6281234567890"; // Ganti dengan nomor WhatsApp Abay
    const text = `Halo Akbar, saya ${name} (${email}).%0A%0A${message}`;
    window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');
  };

  return (
    <section id="contact" className="py-24 md:py-32 px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Column - Info */}
          <div className="w-full lg:w-5/12 flex flex-col justify-between">
            <div>
              <h2 className="text-5xl md:text-7xl font-display font-bold text-charcoal mb-6 leading-tight tracking-tight">
                Let's Start a <br/><span className="text-brass">Project.</span>
              </h2>
              <p className="text-charcoal/70 text-lg mb-12 max-w-md">
                Punya ide proyek atau peluang kerja sama? Jangan ragu untuk menghubungi saya.
              </p>
              
              <div className="space-y-6 text-charcoal/80 mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-mist/30 flex items-center justify-center text-charcoal">
                    <FiMail size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-mono opacity-60 uppercase tracking-widest mb-1">Email</p>
                    <p className="font-medium">hello@akbaralfaidah.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-mist/30 flex items-center justify-center text-charcoal">
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
              <p className="text-sm font-mono opacity-60 uppercase tracking-widest mb-4 text-charcoal">Follow Me</p>
              <div className="flex gap-4">
                <a href="https://github.com/akbaralfaidah" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-mist flex items-center justify-center text-charcoal hover:bg-charcoal hover:text-paper transition-colors"><FiGithub size={20}/></a>
                <a href="https://linkedin.com/in/akbaralfaidah" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-mist flex items-center justify-center text-charcoal hover:bg-charcoal hover:text-paper transition-colors"><FiLinkedin size={20}/></a>
                <a href="https://instagram.com/akbaralfaidah" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-mist flex items-center justify-center text-charcoal hover:bg-charcoal hover:text-paper transition-colors"><FiInstagram size={20}/></a>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="w-full lg:w-7/12">
            <div className="bg-paper/40 backdrop-blur-xl border border-charcoal/5 dark:border-paper/10 shadow-2xl rounded-[2.5rem] p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-mono tracking-widest uppercase text-charcoal/60">Nama Lengkap</label>
                    <input 
                      type="text" 
                      id="name"
                      required
                      className="w-full bg-transparent border-b-2 border-charcoal/10 focus:border-brass py-3 outline-none transition-colors text-charcoal placeholder:text-charcoal/20 font-medium"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-mono tracking-widest uppercase text-charcoal/60">Email</label>
                    <input 
                      type="email" 
                      id="email"
                      required
                      className="w-full bg-transparent border-b-2 border-charcoal/10 focus:border-brass py-3 outline-none transition-colors text-charcoal placeholder:text-charcoal/20 font-medium"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-mono tracking-widest uppercase text-charcoal/60">Pesan</label>
                  <textarea 
                    id="message"
                    required
                    rows={4}
                    className="w-full bg-transparent border-b-2 border-charcoal/10 focus:border-brass py-3 outline-none transition-colors text-charcoal placeholder:text-charcoal/20 font-medium resize-none"
                    placeholder="Ceritakan tentang proyek Anda..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>

                <button 
                  type="submit"
                  className="group w-full md:w-auto inline-flex items-center justify-center gap-3 bg-charcoal text-paper px-8 py-4 rounded-full font-bold tracking-widest uppercase text-sm hover:bg-brass transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-brass/20"
                >
                  Kirim Pesan
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
