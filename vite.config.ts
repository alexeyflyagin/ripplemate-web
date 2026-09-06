import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import Icons from 'unplugin-icons/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
      ],
      manifest: {
        name: 'RippleMate',
        short_name: 'RippleMate',
        description: 'RippleMate',
        start_url: '/',
        display: 'standalone',
        background_color: '#181b19',
        theme_color: '#181b19',
        orientation: 'portrait',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      },
    }),
    Icons({
      compiler: 'vue3',
      customCollections: {
        'icons-12': FileSystemIconLoader(
          './src/assets/icons/12px',
        ),
        'icons-16': FileSystemIconLoader(
          './src/assets/icons/16px',
        ),
        'icons-80': FileSystemIconLoader(
          './src/assets/icons/80px',
        ),
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
  },
})
