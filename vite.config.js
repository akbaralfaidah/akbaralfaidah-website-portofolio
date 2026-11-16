import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Sitemap from 'vite-plugin-sitemap';

export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://akbaralfaidah.com',
      exclude: ['/google8c2a8f60a27d8865'],
      dynamicRoutes: [
        '/projects',
        '/project/bosdepot',
        '/project/chattask',
        '/project/siabsen',
        '/project/mpp',
        '/project/jokipro',
        '/project/peka',
        '/project/siskamling',
        '/project/simppk',
        '/project/caterly',
        '/project/minum-vr9'
      ],
      robots: [{ userAgent: '*', allow: '/' }]
    })
  ],
  build: {
    chunkSizeWarningLimit: 600
  }
});
