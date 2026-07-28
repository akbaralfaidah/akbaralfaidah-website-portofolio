import { useState } from 'react';

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
    <section id="contact" className="py-32 px-6 bg-charcoal/95 backdrop-blur-xl text-paper relative overflow-hidden z-10 border-t border-mist/20">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Mari Diskusi</h2>
          <p className="text-paper/70 max-w-xl mx-auto">Punya ide proyek, tawaran pekerjaan, atau sekadar ingin menyapa? Kirim pesan, dan saya akan membalas secepatnya.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-paper text-charcoal p-8 md:p-12 rounded-3xl shadow-2xl max-w-2xl mx-auto">
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">Nama Lengkap</label>
              <input 
                type="text" 
                id="name"
                required
                className="w-full px-4 py-3 bg-mist/30 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-brass focus:border-transparent transition-shadow"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
              <input 
                type="email" 
                id="email"
                required
                className="w-full px-4 py-3 bg-mist/30 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-brass focus:border-transparent transition-shadow"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">Pesan</label>
              <textarea 
                id="message"
                required
                rows={5}
                className="w-full px-4 py-3 bg-mist/30 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-brass focus:border-transparent transition-shadow resize-none"
                placeholder="Halo, saya ingin berkolaborasi untuk proyek..."
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </div>
            <button 
              type="submit"
              className="w-full py-4 bg-brass text-paper rounded-xl font-bold hover:bg-charcoal transition-colors shadow-lg hover:shadow-xl"
            >
              Kirim ke WhatsApp
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
