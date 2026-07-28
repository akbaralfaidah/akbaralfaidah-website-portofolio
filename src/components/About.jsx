export default function About() {
  return (
    <section id="about" className="py-32 px-6 relative overflow-hidden z-10">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
        <div className="w-full md:w-1/2 relative group">
          <div className="absolute top-6 left-6 w-full h-full bg-charcoal rounded-2xl transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
          <img 
            src="/img/akbar-1.jpg" 
            alt="Akbar Alfaidah - Profile" 
            className="relative z-10 w-full aspect-[4/5] object-cover rounded-2xl shadow-xl border-2 border-paper"
          />
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-8">
            Lebih dari sekadar kode.
          </h2>
          <div className="space-y-6 text-lg text-charcoal/80 leading-relaxed">
            <p>
              Halo, saya <strong className="text-charcoal font-semibold">Akbar Alfaidah</strong>. Saya adalah seorang solo developer dari Indonesia dengan keahlian lintas disiplin di bidang Web, Mobile, dan AI.
            </p>
            <p>
              Saya percaya bahwa portofolio yang baik tidak hanya menunjukkan apa yang bisa dibuat, tetapi bagaimana pembuatnya memadukan presisi teknis dengan estetika yang humanis. Itulah mengapa setiap produk yang saya kembangkan selalu berfokus pada <span className="text-brass font-medium">keandalan sistem dan pengalaman pengguna yang premium</span>.
            </p>
            <p>
              Apakah Anda membutuhkan solusi digital untuk UMKM, startup, atau proyek inovatif berbasis AI? Mari diskusikan bagaimana kita bisa mewujudkannya bersama.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
