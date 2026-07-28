import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProjectDetail from './pages/ProjectDetail';
import MeshGradient from './components/ui/MeshGradient';

function App() {
  return (
    <BrowserRouter>
      <MeshGradient />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/project/:slug" element={<ProjectDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
