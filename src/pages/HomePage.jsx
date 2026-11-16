import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Capabilities from '../components/Capabilities';
import About from '../components/About';
import Services from '../components/Services';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import TestimonialsSection from '../components/TestimonialsSection';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
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
    <div className="min-h-screen bg-paper text-ink selection:bg-brass/25 transition-colors duration-300">
      <Navbar />
      <main id="main-content">
        <Hero />
        <Capabilities />
        <About />
        <Services />
        <Projects />
        <Experience />
        <TestimonialsSection />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
