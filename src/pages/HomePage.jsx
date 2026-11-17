import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Projects from '../components/Projects';
import Capabilities from '../components/Capabilities';
import About from '../components/About';
import Experience from '../components/Experience';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import CursorFollower from '../components/ui/CursorFollower';
import { ScrollProgressBar, ParallaxRibbon } from '../components/ui/MotionPrimitives';
import { usePageMeta } from '../hooks/usePageMeta';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  usePageMeta({
    title: t('meta.home_title'),
    description: t('meta.home_description'),
    path: '/',
    robots: 'index,follow'
  });

  const ribbonTop = isEn
    ? ['Website & Portals', 'Android & iOS Apps', 'Applied AI & Chat', 'POS & Hardware', 'Cloud Deployment']
    : ['Website & Sistem Web', 'Aplikasi Android', 'Integrasi AI & Chat', 'Kasir & Barcode POS', 'Rilis & Server Online'];

  const ribbonMid = isEn
    ? ['Institutions & SOEs', 'SME Digitalization', '50m GPS Attendance', 'Automated PDF / Excel', 'Built in Jambi']
    : ['Instansi & BUMN', 'Bisnis & UMKM', 'Presensi GPS 50m', 'Laporan PDF & Excel', 'Basis Kota Jambi'];

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-accent/25 transition-colors duration-300">
      <ScrollProgressBar />
      <CursorFollower />
      <Navbar />
      <main id="main-content">
        <Hero />
        <ParallaxRibbon items={ribbonTop} direction={1} />
        <Projects />
        <ParallaxRibbon items={ribbonMid} direction={-1} />
        <Capabilities />
        <About />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
