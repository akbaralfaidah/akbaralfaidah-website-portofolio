import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import YouCanScroll from '../components/ui/YouCanScroll';
import About from '../components/About';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import TestimonialsSection from '../components/TestimonialsSection';

export default function HomePage() {
  return (
    <div className="bg-paper min-h-screen text-charcoal selection:bg-brass selection:text-paper">
      <Navbar />
      <main>
        <Hero />
        <YouCanScroll />
        <About />
        <Projects />
        <Experience />
        <TestimonialsSection />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
