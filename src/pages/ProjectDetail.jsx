import { useParams, Link } from 'react-router-dom';
import { ScrollExpandMedia } from '../components/ui/ScrollExpandMedia';
import Footer from '../components/Footer';

export default function ProjectDetail() {
  const { slug } = useParams();
  
  return (
    <div className="bg-paper min-h-screen text-charcoal">
      <div className="fixed top-6 left-6 z-50">
        <Link to="/" className="px-5 py-2.5 bg-paper/80 backdrop-blur-md rounded-full shadow-md font-medium text-charcoal hover:bg-brass hover:text-paper transition-colors">
          &larr; Kembali
        </Link>
      </div>

      <div className="h-[150vh] relative">
        <ScrollExpandMedia src="/img/hero-section.png" alt="Project detail" />
      </div>

      <div className="max-w-4xl mx-auto py-24 px-6 relative z-10 bg-paper">
        <h1 className="text-5xl font-display font-bold mb-6">Detail Project: {slug}</h1>
        <div className="prose prose-lg">
          <p>
            Ini adalah halaman detail untuk project <strong>{slug}</strong>. 
            Gambar di atas menggunakan efek ScrollExpandMedia di mana saat di-scroll ke bawah, 
            gambar akan membesar secara progresif hingga memenuhi layar penuh.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
