import { lazy, Suspense } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

// Lazy load below-the-fold components
const YouCanScroll = lazy(() => import('../components/ui/YouCanScroll'));
const About = lazy(() => import('../components/About'));
const Projects = lazy(() => import('../components/Projects'));
const Experience = lazy(() => import('../components/Experience'));
const Contact = lazy(() => import('../components/Contact'));
const TestimonialsSection = lazy(() => import('../components/TestimonialsSection'));

const LazyFallback = () => (
  <div className="flex items-center justify-center py-24">
    <div className="w-8 h-8 border-2 border-brass border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function HomePage() {
  return (
    <div className="bg-paper min-h-screen text-charcoal selection:bg-brass selection:text-paper">
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={<LazyFallback />}>
          <YouCanScroll />
          <About />
          <Projects />
          <Experience />
          <TestimonialsSection />
          <Contact />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
