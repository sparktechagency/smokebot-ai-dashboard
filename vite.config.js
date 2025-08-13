import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      manifest: {
        name: 'SmokeBot',
        short_name: 'SmokeBot',
        description: 'SmokeBot - Your smart assistant',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 's.png',
            sizes: '64x64',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },

  // server: {
  //   host: '10.0.60.187',
  //   port: 11000,
  // },

  // server: {
  //   host: '0.0.0.0',
  //   port: 4173,
  //   https: {
  //     key: fs.readFileSync('192.168.0.101-key.pem'),
  //     cert: fs.readFileSync('192.168.0.101.pem'),
  //   },
  // },
})
