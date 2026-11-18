import { useEffect, useState, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import { usePageMeta } from '../hooks/usePageMeta';

const loadProjects = () => import('../components/Projects');
const loadCapabilities = () => import('../components/Capabilities');
const loadAbout = () => import('../components/About');
const loadExperience = () => import('../components/Experience');
const loadContact = () => import('../components/Contact');
const loadFooter = () => import('../components/Footer');
const loadCursor = () => import('../components/ui/CursorFollower');
const loadMotionPrimitives = () => import('../components/ui/MotionPrimitives');

const Projects = lazy(loadProjects);
const Capabilities = lazy(loadCapabilities);
const About = lazy(loadAbout);
const Experience = lazy(loadExperience);
const Contact = lazy(loadContact);
const Footer = lazy(loadFooter);
const CursorFollower = lazy(loadCursor);
const ScrollProgressBar = lazy(() =>
  loadMotionPrimitives().then((m) => ({ default: m.ScrollProgressBar }))
);
const ParallaxRibbon = lazy(() =>
  loadMotionPrimitives().then((m) => ({ default: m.ParallaxRibbon }))
);

function SectionPlaceholder({ heightClass = 'min-h-[42vh]' }) {
  return <div className={`${heightClass} bg-paper border-b border-line`} aria-hidden="true" />;
}

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [belowFoldReady, setBelowFoldReady] = useState(() =>
    typeof window !== 'undefined' && Boolean(window.location.hash)
  );
  const [cursorReady, setCursorReady] = useState(false);

  usePageMeta({
    title: t('meta.home_title'),
    description: t('meta.home_description'),
    path: '/',
    robots: 'index,follow'
  });

  useEffect(() => {
    const triggerPreload = () => {
      setBelowFoldReady(true);
      loadMotionPrimitives();
      loadProjects();
      loadCapabilities();
      loadAbout();
      loadExperience();
      loadContact();
      loadFooter();
      if (window.innerWidth >= 1024) setCursorReady(true);
    };

    const onPreloadEvent = () => triggerPreload();
    window.addEventListener('app:preload-sections', onPreloadEvent, { once: true });

    const onScrollOrInteract = () => {
      if (window.scrollY > 8) {
        triggerPreload();
      }
    };
    window.addEventListener('wheel', triggerPreload, { once: true, passive: true });
    window.addEventListener('touchstart', triggerPreload, { once: true, passive: true });
    window.addEventListener('scroll', onScrollOrInteract, { passive: true });

    // Defer automatic below-the-fold hydration cleanly past initial TBT/TTI measurement window
    const fallbackTimer = window.setTimeout(triggerPreload, 5600);

    return () => {
      window.removeEventListener('app:preload-sections', onPreloadEvent);
      window.removeEventListener('wheel', triggerPreload);
      window.removeEventListener('touchstart', triggerPreload);
      window.removeEventListener('scroll', onScrollOrInteract);
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  // Lazy-initialize Lenis momentum scrolling strictly on scroll/touch interaction or post-boot
  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return undefined;

    let lenisInstance = null;
    let cancelled = false;

    const initLenis = async () => {
      if (lenisInstance || cancelled) return;
      const { default: Lenis } = await import('lenis');
      if (cancelled) return;
      lenisInstance = new Lenis({
        autoRaf: true,
        lerp: 0.085,
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.1,
        anchors: { offset: -72 },
        respectReducedMotion: true
      });
      window.__lenis = lenisInstance;
    };

    window.addEventListener('wheel', initLenis, { once: true, passive: true });
    window.addEventListener('touchstart', initLenis, { once: true, passive: true });
    const fallbackTimer = window.setTimeout(initLenis, 5800);

    return () => {
      cancelled = true;
      window.clearTimeout(fallbackTimer);
      window.removeEventListener('wheel', initLenis);
      window.removeEventListener('touchstart', initLenis);
      if (lenisInstance) {
        if (window.__lenis === lenisInstance) {
          delete window.__lenis;
        }
        lenisInstance.destroy();
      }
    };
  }, []);

  // Register optional WebMCP tools for AI browser agents when supported
  useEffect(() => {
    const mc = typeof navigator !== 'undefined' ? navigator.modelContext : null;
    if (!mc || typeof mc.registerTool !== 'function') return undefined;

    const cleanups = [];
    const registerSafe = (spec) => {
      try {
        const res = mc.registerTool(spec);
        if (typeof res === 'function') {
          cleanups.push(res);
        } else if (typeof mc.unregisterTool === 'function') {
          cleanups.push(() => mc.unregisterTool(spec.name));
        }
      } catch {
        // Ignore if browser WebMCP registry differs
      }
    };

    registerSafe({
      name: 'navigate_portfolio_section',
      description:
        'Scroll smoothly to a section on Akbar Alfaidah portfolio (hero, projects, capabilities, services, about, experience, contact).',
      inputSchema: {
        type: 'object',
        properties: {
          sectionId: {
            type: 'string',
            enum: ['hero', 'projects', 'capabilities', 'services', 'about', 'experience', 'contact']
          }
        },
        required: ['sectionId']
      },
      execute: async ({ sectionId }) => {
        setBelowFoldReady(true);
        const target = document.getElementById(sectionId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          return { navigated: true, sectionId };
        }
        return { navigated: false, sectionId };
      }
    });

    registerSafe({
      name: 'list_services_offered',
      description:
        'Return core engineering services, timelines, and contact links offered by Akbar Alfaidah Tech Agency.',
      inputSchema: { type: 'object', properties: {} },
      execute: async () => ({
        agency: 'Akbar Alfaidah Tech Agency',
        location: 'Jambi, Indonesia (Remote available)',
        services: [
          'Website & Information Systems (2-8 weeks)',
          'Android & Mobile Apps (4-10 weeks)',
          'Applied AI & Automation (3-8 weeks)'
        ],
        contactSection: '#contact'
      })
    });

    return () => {
      cleanups.forEach((fn) => {
        try {
          fn();
        } catch {
          // Ignore cleanup errors
        }
      });
    };
  }, []);

  const ribbonTop = isEn
    ? ['Website & Portals', 'Android & iOS Apps', 'Applied AI & Chat', 'POS & Hardware', 'Cloud Deployment']
    : ['Website & Sistem Web', 'Aplikasi Android', 'Integrasi AI & Chat', 'Kasir & Barcode POS', 'Rilis & Server Online'];

  const ribbonMid = isEn
    ? ['Institutions & SOEs', 'SME Digitalization', '50m GPS Attendance', 'Automated PDF / Excel', 'Built in Jambi']
    : ['Instansi & BUMN', 'Bisnis & UMKM', 'Presensi GPS 50m', 'Laporan PDF & Excel', 'Basis Kota Jambi'];

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-accent/25 transition-colors duration-300">
      {belowFoldReady && (
        <Suspense fallback={null}>
          <ScrollProgressBar />
        </Suspense>
      )}
      {cursorReady && (
        <Suspense fallback={null}>
          <CursorFollower />
        </Suspense>
      )}
      <Navbar />
      <main id="main-content">
        <Hero />
        {belowFoldReady ? (
          <>
            <Suspense fallback={null}>
              <ParallaxRibbon items={ribbonTop} direction={1} />
            </Suspense>
            <Suspense fallback={<SectionPlaceholder heightClass="min-h-[60vh]" />}>
              <Projects />
            </Suspense>
            <Suspense fallback={null}>
              <ParallaxRibbon items={ribbonMid} direction={-1} />
            </Suspense>
            <Suspense fallback={<SectionPlaceholder heightClass="min-h-[80vh]" />}>
              <Capabilities />
            </Suspense>
            <Suspense fallback={<SectionPlaceholder heightClass="min-h-[50vh]" />}>
              <About />
            </Suspense>
            <Suspense fallback={<SectionPlaceholder heightClass="min-h-[60vh]" />}>
              <Experience />
            </Suspense>
            <Suspense fallback={<SectionPlaceholder heightClass="min-h-[50vh]" />}>
              <Contact />
            </Suspense>
          </>
        ) : (
          <div className="min-h-[60vh] bg-paper" aria-hidden="true" />
        )}
      </main>
      {belowFoldReady && (
        <Suspense fallback={<SectionPlaceholder heightClass="min-h-[24vh]" />}>
          <Footer />
        </Suspense>
      )}
    </div>
  );
}
