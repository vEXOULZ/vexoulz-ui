<script setup>
// Deep Field lab: presets + knobs for the chosen direction. The original four-direction lab stays at /design.
import { computed, onMounted, onUnmounted, provide, ref, watch } from 'vue'
import './df.css'
import { presets } from './presets.js'
import Seg from './Seg.vue'
import DFRoot from './DFRoot.vue'
import DFVods from './DFVods.vue'
import DFWatch from './DFWatch.vue'
import DFDtp from './DFDtp.vue'

const pages = [
  { id: 'root', host: 'vexoulz.net', comp: DFRoot },
  { id: 'vods', host: 'vods.vexoulz.net', comp: DFVods },
  { id: 'watch', host: 'vods.vexoulz.net/vods/2211', comp: DFWatch, fill: true },
  { id: 'dtp', host: 'dtp.vexoulz.net', comp: DFDtp },
]

const clone = (o) => JSON.parse(JSON.stringify(o))
const params = new URLSearchParams(location.search)

function fromUrl() {
  try {
    return JSON.parse(atob(params.get('o')))
  } catch {
    return null
  }
}

const presetId = ref(params.get('p') || 'mixed')
const opts = ref(fromUrl() || clone((presets.find((p) => p.id === presetId.value) || presets[1]).opts))
const only = ref(params.get('page') || 'all')
const width = ref(params.get('w') === 'mobile' ? 'mobile' : 'desktop')
const showControls = ref(true)
provide('dfOpts', opts)

const preset = computed(() => presets.find((p) => p.id === presetId.value))
const dirty = computed(() => preset.value && JSON.stringify(preset.value.opts) !== JSON.stringify(opts.value))
const shown = computed(() => (only.value === 'all' ? pages : pages.filter((p) => p.id === only.value)))

function applyPreset(id) {
  presetId.value = id
  opts.value = clone(presets.find((p) => p.id === id).opts)
}

watch(
  [presetId, opts, only, width],
  () => {
    const q = new URLSearchParams({ p: presetId.value, page: only.value, w: width.value, o: btoa(JSON.stringify(opts.value)) })
    history.replaceState(null, '', '?' + q)
  },
  { deep: true },
)

let fontLink
onMounted(() => {
  document.body.classList.add('lab-body')
  fontLink = document.createElement('link')
  fontLink.rel = 'stylesheet'
  fontLink.href =
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Geist:wght@400;600;700&family=Geist+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap'
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
      <div class="lab-title">
        Deep Field lab <a href="/design">← all directions</a> <a href="/design/deepfield/v2">v2 →</a>
      </div>
      <Seg :model-value="presetId" :options="presets.map((p) => [p.id, p.name])" @update:model-value="applyPreset" />
      <Seg v-model="only" :options="['all', 'root', 'vods', 'watch', 'dtp']" />
      <Seg v-model="width" :options="['desktop', 'mobile']" />
      <button class="toggle-controls" @click="showControls = !showControls">{{ showControls ? 'hide' : 'show' }} controls</button>
    </header>

    <section class="intro">
      <p><b>{{ preset?.name }}</b><span v-if="dirty" class="dirty"> (modified)</span> — {{ preset?.note }}</p>
    </section>

    <section v-if="showControls" class="controls">
      <div class="group">
        <h3>Type & colour</h3>
        <label>Font pair <Seg v-model="opts.type" :options="[['mono', 'mono only'], ['inter', 'JetBrains + Inter'], ['geist', 'Geist'], ['plex', 'IBM Plex']]" /></label>
        <label>Headings <Seg v-model="opts.head" :options="['mono', 'sans']" :disabled="opts.type === 'mono'" /></label>
        <label>Heading fill <Seg v-model="opts.fill" :options="[['grey', 'grey→white'], ['accent', 'white→accent'], ['plain', 'plain']]" /></label>
        <label>Accents <Seg v-model="opts.accent" :options="[['pastel', 'star pastel'], ['hot', 'hot']]" /></label>
        <label>Panels <Seg v-model="opts.panel" :options="['solid', 'glass', 'outline']" /></label>
        <label>Hover ring <Seg v-model="opts.ring" :options="['on', 'off']" /></label>
      </div>
      <div class="group">
        <h3>Vods</h3>
        <label>Game art <Seg v-model="opts.posters" :options="[['chips', 'text chips'], ['stack', 'poster stack'], ['fan', 'fan on thumb'], ['row', 'poster row']]" /></label>
        <label>Chapter bar <Seg v-model="opts.chapterBar" :options="[[true, 'on'], [false, 'off']]" /></label>
        <label>Sky on watch page <Seg v-model="opts.watchSky" :options="['off', 'dim', 'full']" /></label>
        <label>Root stream card <Seg v-model="opts.live" :options="[[true, 'live'], [false, 'offline']]" /></label>
      </div>
      <div class="group">
        <h3>Starfield</h3>
        <label>Source <Seg v-model="opts.stars.mode" :options="[['gen', 'generator'], ['tile', 'CSS tile'], ['off', 'none']]" /></label>
        <template v-if="opts.stars.mode === 'gen'">
          <label>Density <input v-model.number="opts.stars.density" type="range" min="0.4" max="8" step="0.2" /><code>{{ opts.stars.density.toFixed(1) }}</code></label>
          <label>Clumping <input v-model.number="opts.stars.cluster" type="range" min="0" max="1" step="0.05" /><code>{{ opts.stars.cluster.toFixed(2) }}</code></label>
          <label>Spectrum <Seg v-model="opts.stars.spectrum" :options="[['classic', 'classic (yours)'], ['bright', 'more hot stars'], ['mono', 'white only']]" /></label>
          <div class="checks">
            <label><input v-model="opts.stars.twinkle" type="checkbox" /> twinkle</label>
            <label><input v-model="opts.stars.glow" type="checkbox" /> glow on big stars</label>
            <label><input v-model="opts.stars.band" type="checkbox" /> milky-way band</label>
            <label><input v-model="opts.stars.drift" type="checkbox" /> slow drift</label>
            <label><input v-model="opts.stars.pointer" type="checkbox" /> mouse parallax</label>
            <label><input v-model="opts.stars.meteors" type="checkbox" /> meteors</label>
            <label><input v-model="opts.stars.perSite" type="checkbox" /> own sky per subdomain</label>
          </div>
        </template>
      </div>
    </section>

    <div class="df" :data-type="opts.type" :data-head="opts.type === 'mono' ? 'mono' : opts.head" :data-fill="opts.fill"
         :data-accent="opts.accent" :data-panel="opts.panel" :data-ring="opts.ring">
      <div class="frames" :class="width">
        <div v-for="p in shown" :key="p.id" class="frame" :class="{ fill: p.fill }">
          <div class="url"><span class="dots">● ● ●</span> https://{{ p.host }}</div>
          <div class="viewport">
            <component :is="p.comp" />
          </div>
        </div>
      </div>
    </div>

    <section class="suggest">
      <h2>What changed from the plain Deep Field, and why</h2>
      <ul>
        <li><b>Two fonts, clear roles.</b> Sans for anything people read (names, titles, prose), mono for anything that is data (handles, times, durations, counts, labels, code). Keeps the terminal feel without making VOD titles tiring.</li>
        <li><b>Game posters instead of text.</b> Box art at 3:4 like the Archive's 40×53 images. Multiple games stack; hovering the stack spreads it out. Past three games it shows <code>+N</code>.</li>
        <li><b>Chapter bar.</b> A thin bar under each thumbnail (and the watch page's seek bar) split by chapter, each game with a stable colour, so you can see a VOD's shape at a glance.</li>
        <li><b>Watch page is an app.</b> No footer or max-width; the video letterboxes into whatever space is left, chat takes the full height, theater mode hides the header, and chat can collapse. Chapters open from the posters. Stars are off or dimmed there so they don't compete with the video.</li>
        <li><b>Starfield generator v2.</b> Same spectral table and perlin clumping as <code>stars_bg.js</code>, but drawn to one canvas instead of ~200 divs, sized to the page instead of the viewport, <b>seeded</b> so the sky doesn't change on every refresh (optionally a different sky per subdomain), with density per area so big screens aren't sparse. Motion stops when it's off-screen and for people with reduced motion turned on.</li>
        <li><b>Signature hover ring</b> from today's link icons (dark gap + thin white ring) reused for posters, thumbnails and icons, so it becomes the family's focus style too.</li>
        <li><b>Chat uses star colours</b> for usernames instead of random Twitch colours, and the bot always uses the dtp accent.</li>
        <li><b>Live card on root</b> when streaming: preview, game poster, uptime and viewers; offline shows the next stream.</li>
      </ul>
    </section>
  </div>
</template>

<style>
body.lab-body { display: block; background: #151517; padding: 0; }
body.lab-body #app { width: 100%; }
</style>

<style scoped>
.lab { color: #e8e8ea; font-family: system-ui, sans-serif; font-size: 14px; line-height: 1.5; min-height: 100vh; }
.lab-bar {
  position: sticky; top: 0; z-index: 20; display: flex; flex-wrap: wrap; gap: 10px 14px; align-items: center;
  padding: 10px 16px; background: rgb(21 21 23 / 0.94); backdrop-filter: blur(8px); border-bottom: 1px solid #2c2c31;
}
.lab-title { font-weight: 700; margin-right: auto; }
.lab-title a { font-weight: 400; font-size: 12px; margin-left: 8px; color: #8d8d96; padding: 0; }
.lab-title a:hover { color: #e8e8ea; }
.toggle-controls { font: inherit; font-size: 12px; background: none; border: 1px solid #2c2c31; color: #8d8d96; border-radius: 7px; padding: 3px 10px; cursor: pointer; }

.intro, .controls, .suggest { max-width: 1240px; margin: 0 auto; padding: 14px 16px 0; }
.intro p { color: #c4c4cc; }
.dirty { color: #ffb56c; }
.controls { display: grid; grid-template-columns: repeat(auto-fit, minmax(330px, 1fr)); gap: 12px 28px; }
.group { display: flex; flex-direction: column; gap: 7px; }
.group h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #8d8d96; font-weight: 600; margin-bottom: 2px; }
.group > label { display: flex; align-items: center; gap: 10px; color: #c4c4cc; font-size: 12px; flex-wrap: wrap; }
.group > label > :first-child:not(input) { margin-left: auto; }
.group label input[type='range'] { margin-left: auto; width: 150px; accent-color: #d5e0ff; }
.group label code { font-size: 11px; color: #8d8d96; width: 32px; text-align: right; }
.checks { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 10px; font-size: 12px; color: #c4c4cc; }
.checks label { display: flex; gap: 6px; align-items: center; cursor: pointer; }
.checks input { accent-color: #d5e0ff; }

.frames { display: flex; flex-direction: column; align-items: center; gap: 28px; padding: 18px 16px 40px; }
.frame { width: 100%; max-width: 1240px; border: 1px solid #2c2c31; border-radius: 10px; overflow: hidden; background: #000; box-shadow: 0 20px 50px rgb(0 0 0 / 0.4); }
.frame.fill .viewport { height: calc(100vh - 120px); min-height: 480px; }
.frames.mobile { flex-direction: row; flex-wrap: wrap; justify-content: center; align-items: flex-start; }
.frames.mobile .frame { width: 390px; max-width: 100%; }
.frames.mobile .frame.fill .viewport { height: 780px; min-height: 0; }
.url { font-family: ui-monospace, Consolas, monospace; font-size: 12px; color: #8d8d96; padding: 7px 12px; border-bottom: 1px solid #2c2c31; background: #1b1b1e; }
.dots { letter-spacing: 2px; margin-right: 10px; color: #444; }
.viewport { container: frame / inline-size; }

.suggest { padding-bottom: 60px; color: #c4c4cc; }
.suggest h2 { font-size: 17px; font-weight: 700; color: #e8e8ea; margin-bottom: 8px; }
.suggest ul { padding-left: 18px; display: flex; flex-direction: column; gap: 6px; }
.suggest b { color: #e8e8ea; font-weight: 600; }
.suggest code { font-family: ui-monospace, Consolas, monospace; font-size: 12px; color: #e8e8ea; }
</style>
