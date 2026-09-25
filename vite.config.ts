/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// `vite` serves the design lab (index.html → lab/); `vite build` builds the library (src/ → dist/).
export default defineConfig({
  plugins: [vue()],
  server: { port: 5174 },
  resolve: {
    alias: { '@vexoulz/ui': fileURLToPath(new URL('./src/index.ts', import.meta.url)) },
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'style',
    },
    rollupOptions: { external: ['vue'] },
    assetsInlineLimit: 0,
  },
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.test.ts'],
  },
})
