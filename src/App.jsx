import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect, useRef } from 'react';
import { LenisProvider } from './context/LenisContext';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import MeshGradient from './components/ui/MeshGradient';
import { supabase } from './lib/supabase';

// Fix #6: Lazy load route-level pages — these are only needed when navigating
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));

const PageFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-paper dark:bg-[#1A1A1C]">
    <div className="w-8 h-8 border-2 border-brass border-t-transparent rounded-full animate-spin" />
  </div>
);

// Komponen untuk melacak navigasi halaman (Analytics)
const PageTracker = () => {
  const location = useLocation();
  const trackedPath = useRef('');

  useEffect(() => {
    if (trackedPath.current === location.pathname) return;
    trackedPath.current = location.pathname;

    const trackView = async () => {
      // Cegah Bot (UptimeRobot, Lighthouse, Googlebot) agar tidak mengotori analytics
      const ua = navigator.userAgent.toLowerCase();
      if (ua.includes('bot') || ua.includes('uptimerobot') || ua.includes('lighthouse') || ua.includes('spider') || ua.includes('headless')) {
        return;
      }

      try {
        await supabase.from('page_views').insert([{
          path: location.pathname,
          browser: navigator.userAgent,
          device_type: window.innerWidth < 768 ? 'Mobile' : 'Desktop'
        }]);
      } catch (e) {
        console.log('Analytics error:', e);
      }
    };
    trackView();
  }, [location]);

  return null; // Komponen ini tidak menampilkan apapun (invisible)
};

function App() {
  return (
    <ErrorBoundary>
      <LenisProvider>
        <BrowserRouter>
          <div className="relative w-full overflow-x-hidden min-h-screen">
            <PageTracker />
            <MeshGradient />
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/project/:slug" element={<ProjectDetail />} />
              </Routes>
            </Suspense>
          </div>
        </BrowserRouter>
      </LenisProvider>
    </ErrorBoundary>
  );
}

export default App;
