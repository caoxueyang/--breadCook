import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: '面包の餐厅',
        short_name: '面包餐厅',
        description: '记录家的味道，随时查看你的私房菜谱',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#FFF8E7',
        theme_color: '#F5D76E',
        lang: 'zh-CN',
        icons: [
          { src: './icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: './icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: './icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,gif}'],
        inlineWorkboxRuntime: true,
        sourcemap: false,
        manifestTransforms: [],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 7 }
            }
          },
          {
            urlPattern: ({ request }) =>
              request.destination === 'script' || request.destination === 'style' ||
              request.destination === 'image' || request.destination === 'font',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'asset-cache' }
          }
        ]
      }
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  base: './',
  // Node 18 下避免 terser/serialize-javascript 的 crypto 报错
  build: {
    minify: 'esbuild'
  }
})
