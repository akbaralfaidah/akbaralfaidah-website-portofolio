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
import { usePageMeta } from '../hooks/usePageMeta';

export default function HomePage() {
  const { t } = useTranslation();

  usePageMeta({
    title: t('meta.home_title'),
    description: t('meta.home_description'),
    path: '/',
    robots: 'index,follow'
  });

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-accent/25 transition-colors duration-300">
      <CursorFollower />
      <Navbar />
      <main id="main-content">
        <Hero />
        <Projects />
        <Capabilities />
        <About />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
