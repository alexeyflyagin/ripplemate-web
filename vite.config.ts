import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Icons from 'unplugin-icons/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'

export default defineConfig({
  plugins: [
    vue(),
    // vueDevTools(),
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
