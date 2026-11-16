import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useParams } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import HomePage from './pages/HomePage';
import { fetchProjectBySlug } from './data/projects';
import { supabase } from './lib/supabase';
import { ThemeProvider } from './context/ThemeContext';

const ProjectsPage = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const ProjectProgress = lazy(() => import('./pages/ProjectProgress'));
const NotFound = lazy(() => import('./pages/NotFound'));

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

function PageTracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!supabase || pathname.startsWith('/sandbox') || pathname.length > 100) return;

    const ua = navigator.userAgent || '';
    if (/bot|uptimerobot|lighthouse|spider|headless/i.test(ua)) return;

    const timer = window.setTimeout(() => {
      supabase
        .from('page_views')
        .insert([
          {
            path: pathname,
            browser: ua.slice(0, 250),
            device_type: window.innerWidth < 768 ? 'Mobile' : 'Desktop'
          }
        ])
        .then(() => {})
        .catch(() => {});
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [pathname]);
  return null;
}

const PageLoader = () => (
  <div className="min-h-screen bg-paper text-ink flex items-center justify-center p-6">
    <div
      className="w-7 h-7 border-2 border-ink/20 border-t-brass rounded-full animate-spin"
      role="status"
      aria-label="Loading page"
    />
  </div>
);

function isLikelyTrackerToken(value) {
  if (!value) return false;
  return (
    /^[a-f0-9]{32,64}$/i.test(value) ||
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
}

/**
 * Resolves `/project/:token` cleanly:
 * 1. Hex/UUID tracker tokens go straight to ProjectProgress (noindex).
 * 2. Human-readable slugs check Supabase/fallback projects first so public pages never leak `noindex`.
 * 3. Unknown slugs check ProjectProgress (for custom readable client tokens) and otherwise fall back to 404.
 */
function ProjectRoute() {
  const { token } = useParams();
  const [resolution, setResolution] = useState(() =>
    isLikelyTrackerToken(token)
      ? { status: 'tracker', project: null }
      : { status: 'resolving', project: null }
  );

  useEffect(() => {
    let active = true;
    if (!token) {
      setResolution({ status: 'not_found', project: null });
      return () => {
        active = false;
      };
    }

    if (isLikelyTrackerToken(token)) {
      setResolution({ status: 'tracker', project: null });
      return () => {
        active = false;
      };
    }

    setResolution({ status: 'resolving', project: null });
    fetchProjectBySlug(token).then((found) => {
      if (!active) return;
      if (found) {
        setResolution({ status: 'public', project: found });
      } else {
        setResolution({ status: 'maybe_tracker', project: null });
      }
    });

    return () => {
      active = false;
    };
  }, [token]);

  if (resolution.status === 'resolving') {
    return <PageLoader />;
  }

  if (resolution.status === 'public') {
    return (
      <Suspense fallback={<PageLoader />}>
        <ProjectDetail initialProject={resolution.project} />
      </Suspense>
    );
  }

  if (resolution.status === 'tracker') {
    return (
      <Suspense fallback={<PageLoader />}>
        <ProjectProgress fallbackComponent={<NotFound />} />
      </Suspense>
    );
  }

  if (resolution.status === 'maybe_tracker') {
    return (
      <Suspense fallback={<PageLoader />}>
        <ProjectProgress fallbackComponent={<NotFound />} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <NotFound />
    </Suspense>
  );
}

function App() {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <Router>
          <ScrollToTop />
          <PageTracker />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/projects"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ProjectsPage />
                </Suspense>
              }
            />
            <Route path="/project/:token" element={<ProjectRoute />} />
            <Route
              path="*"
              element={
                <Suspense fallback={<PageLoader />}>
                  <NotFound />
                </Suspense>
              }
            />
          </Routes>
        </Router>
      </MotionConfig>
    </ThemeProvider>
  );
}

export default App;
