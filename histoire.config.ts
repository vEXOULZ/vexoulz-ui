import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'

export default defineConfig({
  plugins: [HstVue()],
  setupFile: 'stories/setup.ts',
  storyMatch: ['stories/**/*.story.vue'],
  theme: { title: 'vexoulz-ui', defaultColorScheme: 'dark', hideColorSchemeSwitch: true },
  tree: { groups: [
    { id: 'foundations', title: 'Foundations' },
    { id: 'chrome', title: 'Site chrome' },
    { id: 'controls', title: 'Controls' },
    { id: 'overlays', title: 'Overlays' },
    { id: 'feedback', title: 'Feedback' },
    { id: 'data', title: 'Data' },
    { id: 'media', title: 'Media' },
  ] },
  vite: { server: { port: 6006 } },
})
