import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function HeroParticle({ imagePath = '/img/akbar-4.jpg' }) {
  const pointsRef = useRef();
  const [geometryData, setGeometryData] = useState(null);
  
  const { viewport } = useThree();

  useEffect(() => {
    const img = new Image();
    img.src = imagePath;
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      
      const maxDim = 150;
      let width = img.width;
      let height = img.height;
      
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      const imgData = ctx.getImageData(0, 0, width, height).data;
      
      const positions = [];
      const colors = [];
      
      const aspect = width / height;
      const scale = Math.min(viewport.width * 0.8, viewport.height * 0.8) / maxDim;
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;
          const r = imgData[i] / 255;
          const g = imgData[i + 1] / 255;
          const b = imgData[i + 2] / 255;
          const a = imgData[i + 3] / 255;
          
          const brightness = (r + g + b) / 3;
          if (brightness > 0.1 || a > 0.5) { 
            const posX = (x - width / 2) * scale * aspect * 2;
            const posY = -(y - height / 2) * scale * 2;
            const posZ = (Math.random() - 0.5) * 0.2;
            
            positions.push(posX, posY, posZ);
            colors.push(r, g, b);
          }
        }
      }
      
      setGeometryData({
        positions: new Float32Array(positions),
        colors: new Float32Array(colors)
      });
    };
  }, [imagePath, viewport.width, viewport.height]);

  const geometry = useMemo(() => {
    if (!geometryData) return null;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(geometryData.positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(geometryData.colors, 3));
    return geo;
  }, [geometryData]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      pointsRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.05;
      
      const targetX = (state.pointer.x * Math.PI) / 10;
      const targetY = (state.pointer.y * Math.PI) / 10;
      
      pointsRef.current.rotation.y += (targetX - pointsRef.current.rotation.y) * 0.05;
      pointsRef.current.rotation.x += (-targetY - pointsRef.current.rotation.x) * 0.05;
    }
  });

  if (!geometry) return null;

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial 
        size={0.03}
        vertexColors 
        transparent 
        opacity={0.8}
        sizeAttenuation 
      />
    </points>
  );
}
