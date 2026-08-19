import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { LenisProvider } from './context/LenisContext';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import MeshGradient from './components/ui/MeshGradient';

// Fix #6: Lazy load route-level pages — these are only needed when navigating
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));

const PageFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-paper dark:bg-[#1A1A1C]">
    <div className="w-8 h-8 border-2 border-brass border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <LenisProvider>
        <BrowserRouter>
          <MeshGradient />
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/project/:slug" element={<ProjectDetail />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </LenisProvider>
    </ErrorBoundary>
  );
}

export default App;
