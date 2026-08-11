import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import HeroParticle from '../components/HeroParticle';

export default function Sandbox() {
  return (
    <div className="w-full h-screen bg-charcoal text-paper relative">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <HeroParticle imagePath="/img/akbar-1.webp" />
        <OrbitControls enableZoom={false} />
      </Canvas>
      <div className="absolute top-4 left-4">
        <h1 className="text-2xl font-display">Sandbox Mode</h1>
        <p className="font-mono text-sm opacity-70">Testing 3D Particle Performance</p>
      </div>
    </div>
  );
}
