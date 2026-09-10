import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/okozukai-manager/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png', 'favicon.ico', 'favicon-32x32.png'],
      manifest: {
        name: 'おこづかいマネージャー',
        short_name: 'おこづかい',
        description: '今月あといくら自由に使えるかを確認するアプリ',
        theme_color: '#c04e61',
        background_color: '#fdf4f1',
        display: 'standalone',
        start_url: '/okozukai-manager/',
        scope: '/okozukai-manager/',
        lang: 'ja',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
    }),
  ],
})
