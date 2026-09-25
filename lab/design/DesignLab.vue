<script setup>
// Local-only design lab: the same three *.vexoulz.net mocks rendered under each design direction.
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import './lab.css'
import { directions, sites } from './directions.js'
import MockRoot from './MockRoot.vue'
import MockVods from './MockVods.vue'
import MockDtp from './MockDtp.vue'

const mocks = { root: MockRoot, vods: MockVods, dtp: MockDtp }

const params = new URLSearchParams(location.search)
const dirId = ref(directions.some((d) => d.id === params.get('dir')) ? params.get('dir') : directions[0].id)
const mode = ref(params.get('mode') === 'light' ? 'light' : 'dark')
const only = ref(params.get('site') || 'all')
const width = ref(params.get('w') === 'mobile' ? 'mobile' : 'desktop')

const dir = computed(() => directions.find((d) => d.id === dirId.value))
const effectiveMode = computed(() => (dir.value.light ? mode.value : 'dark'))
const shown = computed(() => (only.value === 'all' ? sites : sites.filter((s) => s.id === only.value)))

watch([dirId, mode, only, width], () => {
  const q = new URLSearchParams({ dir: dirId.value, mode: mode.value, site: only.value, w: width.value })
  history.replaceState(null, '', '?' + q)
})

const swatches = ['bg', 'surface', 'surface-2', 'line', 'muted', 'ink', 'accent-root', 'accent-vods', 'accent-dtp', 'ok', 'bad']

let fontLink
onMounted(() => {
  document.body.classList.add('lab-body')
  fontLink = document.createElement('link')
  fontLink.rel = 'stylesheet'
  fontLink.href =
    'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap'
  document.head.appendChild(fontLink)
})
onUnmounted(() => {
  document.body.classList.remove('lab-body')
  fontLink?.remove()
})
</script>

<template>
  <div class="lab">
    <header class="lab-bar">
      <div class="lab-title">vexoulz design lab <span>local only</span> <a class="next" href="/design/deepfield">Deep Field lab →</a></div>
      <div class="seg">
        <button v-for="d in directions" :key="d.id" :class="{ on: d.id === dirId }" @click="dirId = d.id">{{ d.name }}</button>
      </div>
      <div class="seg">
        <button :class="{ on: effectiveMode === 'dark' }" @click="mode = 'dark'">dark</button>
        <button :class="{ on: effectiveMode === 'light' }" :disabled="!dir.light" @click="mode = 'light'">light</button>
      </div>
      <div class="seg">
        <button :class="{ on: only === 'all' }" @click="only = 'all'">all</button>
        <button v-for="s in sites" :key="s.id" :class="{ on: only === s.id }" @click="only = s.id">{{ s.label }}</button>
      </div>
      <div class="seg">
        <button :class="{ on: width === 'desktop' }" @click="width = 'desktop'">desktop</button>
        <button :class="{ on: width === 'mobile' }" @click="width = 'mobile'">mobile</button>
      </div>
    </header>

    <div class="lab-theme" :data-dir="dirId" :data-mode="effectiveMode">
      <section class="notes">
        <div class="notes-text">
          <h1>{{ dir.name }}</h1>
          <p>{{ dir.pitch }}</p>
          <p class="type"><b>Type</b> {{ dir.type }}<span v-if="!dir.light"> · dark only</span></p>
          <div class="pc">
            <ul><li v-for="p in dir.pros" :key="p">+ {{ p }}</li></ul>
            <ul><li v-for="c in dir.cons" :key="c">− {{ c }}</li></ul>
          </div>
        </div>
        <div class="swatches">
          <div v-for="s in swatches" :key="s" class="sw">
            <span class="chipcol" :style="{ background: `var(--${s})` }"></span>
            <code>{{ s }}</code>
          </div>
        </div>
      </section>

      <div class="frames" :class="width">
        <div v-for="s in shown" :key="s.id" class="frame">
          <div class="url"><span class="dots">● ● ●</span> https://{{ s.host }}</div>
          <div class="viewport">
            <component :is="mocks[s.id]" />
          </div>
        </div>
      </div>
    </div>

    <section class="foundation">
      <h2>Shared across every direction</h2>
      <ul>
        <li><b>One brand lockup</b>: <code>[mark] vexoulz / sub</code> in the header of every site, linking home. Only the sub-name takes the site accent.</li>
        <li><b>Accent per subdomain</b>: root, vods and dtp each own one colour from the same palette; the footer shows all three as the "family" nav.</li>
        <li><b>Same tokens</b>: <code>bg · surface · surface-2 · line · muted · ink · accent · ok · bad</code>, one radius scale, one type stack. Swapping a direction here only swaps those values.</li>
        <li><b>Same components</b>: header, footer, panel, chip, button, input, code block. Everything in the mocks is built from those.</li>
        <li><b>Brand colours of third-party links</b> (Twitch purple, Discord blurple…) live only inside their icons, not in text, so they stop fighting the site accent.</li>
      </ul>
    </section>
  </div>
</template>

<style>
body.lab-body {
  display: block;
  background: #151517;
  padding: 0;
}
body.lab-body #app { width: 100%; }
</style>

<style scoped>
.lab {
  --lab-ink: #e8e8ea;
  --lab-muted: #8d8d96;
  --lab-line: #2c2c31;
  color: var(--lab-ink);
  font-family: system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  min-height: 100vh;
}
.lab-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
  align-items: center;
  padding: 10px 16px;
  background: rgb(21 21 23 / 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--lab-line);
}
.lab-title { font-weight: 700; margin-right: auto; }
.lab-title span { font-weight: 400; color: var(--lab-muted); font-size: 12px; margin-left: 6px; }
.lab-title a.next { font-weight: 400; font-size: 12px; margin-left: 10px; padding: 0; color: #d5e0ff; }
.seg { display: inline-flex; border: 1px solid var(--lab-line); border-radius: 8px; overflow: hidden; }
.seg button {
  font: inherit; font-size: 13px; padding: 4px 11px; background: transparent; color: var(--lab-muted);
  border: none; border-right: 1px solid var(--lab-line); cursor: pointer;
}
.seg button:last-child { border-right: none; }
.seg button.on { background: #2e2e35; color: var(--lab-ink); }
.seg button:disabled { opacity: 0.35; cursor: not-allowed; }

.notes {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: 24px;
  padding: 20px 16px 8px;
  max-width: 1240px;
  margin: 0 auto;
}
.notes h1 { font-size: 22px; font-weight: 700; margin-bottom: 4px; color: var(--lab-ink); }
.notes p { color: #c4c4cc; margin-bottom: 6px; }
.notes .type { color: var(--lab-muted); font-size: 13px; }
.notes .type b { color: var(--lab-ink); margin-right: 6px; }
.pc { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 8px; font-size: 13px; }
.pc ul { list-style: none; padding: 0; margin: 0; }
.pc ul:first-child li { color: #9ad7a0; }
.pc ul:last-child li { color: #e7a39a; }
.swatches { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 6px; align-content: start; }
.sw { display: flex; align-items: center; gap: 8px; font-size: 12px; }
.sw code { color: var(--lab-muted); font-family: ui-monospace, Consolas, monospace; }
.chipcol { width: 22px; height: 22px; border-radius: 5px; border: 1px solid #ffffff30; flex: none; }

.frames { display: flex; flex-direction: column; align-items: center; gap: 28px; padding: 16px 16px 40px; }
.frame {
  width: 100%;
  max-width: 1240px;
  border: 1px solid var(--lab-line);
  border-radius: 10px;
  overflow: hidden;
  background: #0c0c0d;
  box-shadow: 0 20px 50px rgb(0 0 0 / 0.4);
}
.frames.mobile { flex-direction: row; flex-wrap: wrap; justify-content: center; align-items: flex-start; }
.frames.mobile .frame { width: 390px; max-width: 100%; }
.url {
  font-family: ui-monospace, Consolas, monospace;
  font-size: 12px;
  color: var(--lab-muted);
  padding: 7px 12px;
  border-bottom: 1px solid var(--lab-line);
  background: #1b1b1e;
}
.dots { letter-spacing: 2px; margin-right: 10px; color: #444; }
.viewport { container: frame / inline-size; }

.foundation { max-width: 1240px; margin: 0 auto; padding: 0 16px 60px; color: #c4c4cc; }
.foundation h2 { font-size: 18px; font-weight: 700; color: var(--lab-ink); margin-bottom: 8px; }
.foundation ul { padding-left: 18px; display: flex; flex-direction: column; gap: 4px; }
.foundation b { color: var(--lab-ink); font-weight: 600; }
.foundation code { font-family: ui-monospace, Consolas, monospace; font-size: 12px; color: var(--lab-ink); }

@media (max-width: 800px) {
  .notes { grid-template-columns: 1fr; }
  .pc { grid-template-columns: 1fr; }
}
</style>
