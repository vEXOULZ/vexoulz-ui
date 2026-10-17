/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// `vite` serves the design lab (index.html → lab/); `vite build --mode lib` builds the library (src/ → dist/).
// Histoire reads this config too, for its dev server and its build.
export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  server: { port: 5174 },
  // Left for the site's own build to fill in: a library build would replace it with this repo's (empty) env.
  // Only there: under Histoire it rewrites Histoire's own bundled code and blanks every story.
  define: mode === 'lib' ? { 'import.meta.env.VITE_AUTH_BASE': 'import.meta.env.VITE_AUTH_BASE' } : {},
  resolve: {
    alias: { '@vex/ui': fileURLToPath(new URL('./src/index.ts', import.meta.url)) },
  },
  build: {
    lib: {
      entry: {
        index: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
        account: fileURLToPath(new URL('./src/account.ts', import.meta.url)),
        utils: fileURLToPath(new URL('./src/utils.ts', import.meta.url)),
      },
      formats: ['es'],
      fileName: (_format, name) => `${name}.js`,
      cssFileName: 'style',
    },
    rollupOptions: { external: ['vue'] },
    assetsInlineLimit: 0,
  },
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.test.ts'],
  },
}))
