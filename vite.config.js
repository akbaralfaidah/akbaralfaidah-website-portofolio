import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://akbaralfaidah.com',
      dynamicRoutes: [
        '/projects',
        '/project/bosdepot',
        '/project/siabsen',
        '/project/peka',
        '/project/chattask'
      ],
      robots: [{ userAgent: '*', allow: '/' }]
    })
  ],
  server: {
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    },
  },
})
