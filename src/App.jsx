import { BrowserRouter, Routes, Route, useLocation, useParams, UNSAFE_RouteContext as RouteContext } from 'react-router-dom';
import { lazy, Suspense, useEffect, useRef, useContext } from 'react';
import { LenisProvider } from './context/LenisContext';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import MeshGradient from './components/ui/MeshGradient';
import { supabase } from './lib/supabase';

// Fix #6: Lazy load route-level pages — these are only needed when navigating
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const ProjectProgress = lazy(() => import('./pages/ProjectProgress'));

const PageFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-paper dark:bg-[#1A1A1C]">
    <div className="w-8 h-8 border-2 border-brass border-t-transparent rounded-full animate-spin" />
  </div>
);

// Known static portfolio slugs to resolve directly without overhead
const STATIC_PORTFOLIO_SLUGS = new Set([
  'bosdepot', 'chattask', 'siabsen', 'mpp', 'jokipro', 'peka', 'siskamling', 'simppk'
]);

// Adapter to forward slug param to ProjectDetail
function ProjectSlugAdapter({ children }) {
  const context = useContext(RouteContext);
  if (!context || !context.matches || context.matches.length === 0) return children;

  const lastMatch = context.matches[context.matches.length - 1];
  const params = { ...lastMatch.params, slug: lastMatch.params.token || lastMatch.params.slug };
  const updatedMatches = [
    ...context.matches.slice(0, -1),
    { ...lastMatch, params }
  ];

  return (
    <RouteContext.Provider value={{ ...context, matches: updatedMatches }}>
      {children}
    </RouteContext.Provider>
  );
}

// Route handler for /project/:token:
// Differentiates between portfolio project detail and client progress tracker
function ProjectRoute() {
  const { token, slug } = useParams();
  const id = (token || slug || '').trim();

  // 1. Known static portfolio slugs -> render ProjectDetail
  if (STATIC_PORTFOLIO_SLUGS.has(id.toLowerCase())) {
    return (
      <ProjectSlugAdapter>
        <ProjectDetail />
      </ProjectSlugAdapter>
    );
  }

  // 2. 32-64 char hex string or UUID -> client tracker token
  const isTrackerToken = /^[a-f0-9]{32,64}$/i.test(id) ||
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  if (isTrackerToken) {
    return <ProjectProgress />;
  }

  // 3. Any other identifier: check tracker first, fallback to ProjectDetail if not found
  return (
    <ProjectProgress
      fallbackComponent={
        <ProjectSlugAdapter>
          <ProjectDetail />
        </ProjectSlugAdapter>
      }
    />
  );
}

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
                <Route path="/project/:token" element={<ProjectRoute />} />
              </Routes>
            </Suspense>
          </div>
        </BrowserRouter>
      </LenisProvider>
    </ErrorBoundary>
  );
}

export default App;
