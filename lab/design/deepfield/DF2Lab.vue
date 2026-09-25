<script setup>
// Deep Field v2: the picked settings as defaults, plus the switcher / Twitch colours / shared login.
// Older labs stay at /design and /design/deepfield.
import { computed, onMounted, onUnmounted, provide, ref, watch } from 'vue'
import './df.css'
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

// Your picks
const defaults = {
  type: 'geist', head: 'mono', fill: 'grey', accent: 'pastel', panel: 'glass', ring: 'on',
  posters: 'fan', chapterBar: true, watchSky: 'off',
  switcher: 'footer', chatColors: 'readable',
  stars: {
    mode: 'gen', density: 3.2, cluster: 1, spectrum: 'classic',
    twinkle: true, pointer: true, parallax: 14, meteors: true, meteorRate: 'normal', perSite: true,
    drift: false, band: false, glow: false,
  },
}
// Page state, not design: previewed but not part of the defaults
const stateDefaults = { live: false, signedIn: false }

const clone = (o) => JSON.parse(JSON.stringify(o))
const params = new URLSearchParams(location.search)
function fromUrl() {
  try {
    return JSON.parse(atob(params.get('o')))
  } catch {
    return null
  }
}

const opts = ref(fromUrl() || { ...clone(defaults), ...stateDefaults })
const only = ref(params.get('page') || 'all')
const width = ref(params.get('w') === 'mobile' ? 'mobile' : 'desktop')
const showControls = ref(true)
provide('dfOpts', opts)

const design = (o) => {
  const { live, signedIn, ...rest } = o
  return rest
}
const dirty = computed(() => JSON.stringify(design(opts.value)) !== JSON.stringify(defaults))
const shown = computed(() => (only.value === 'all' ? pages : pages.filter((p) => p.id === only.value)))
const reset = () => (opts.value = { ...clone(defaults), live: opts.value.live, signedIn: opts.value.signedIn })

watch(
  [opts, only, width],
  () => {
    const q = new URLSearchParams({ page: only.value, w: width.value, o: btoa(JSON.stringify(opts.value)) })
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
        Deep Field v2
        <a href="/design/deepfield">← v1 lab</a>
        <a href="/design">all directions</a>
        <a href="/design/deepfield/v3">v3 →</a>
      </div>
      <Seg v-model="only" :options="['all', 'root', 'vods', 'watch', 'dtp']" />
      <Seg v-model="width" :options="['desktop', 'mobile']" />
      <button class="lab-btn" :disabled="!dirty" @click="reset">reset to picks</button>
      <button class="lab-btn" @click="showControls = !showControls">{{ showControls ? 'hide' : 'show' }} controls</button>
    </header>

    <section class="intro">
      <p>
        <b>Your picks</b><span v-if="dirty" class="dirty"> (modified)</span>. New in v2: a network switcher in the
        footer, chat names in each chatter's own Twitch colour, and one shared Twitch sign-in across the subdomains.
        Controls marked <span class="new">new</span> are extra options for those.
      </p>
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
        <h3>Vods & network</h3>
        <label>Game art <Seg v-model="opts.posters" :options="[['chips', 'text chips'], ['stack', 'poster stack'], ['fan', 'fan on thumb'], ['row', 'poster row']]" /></label>
        <label>Chapter bar <Seg v-model="opts.chapterBar" :options="[[true, 'on'], [false, 'off']]" /></label>
        <label>Sky on watch page <Seg v-model="opts.watchSky" :options="['off', 'dim', 'full']" /></label>
        <label><span><span class="new">new</span> Site switcher</span> <Seg v-model="opts.switcher" :options="[['footer', 'footer'], ['header', 'header brand'], ['both', 'both']]" /></label>
        <label><span><span class="new">new</span> Chat name colours</span> <Seg v-model="opts.chatColors" :options="[['readable', 'theirs, contrast-fixed'], ['raw', 'theirs, exact']]" /></label>
      </div>
      <div class="group">
        <h3>Starfield</h3>
        <label>Source <Seg v-model="opts.stars.mode" :options="[['gen', 'generator'], ['tile', 'CSS tile'], ['off', 'none']]" /></label>
        <template v-if="opts.stars.mode === 'gen'">
          <label>Density <input v-model.number="opts.stars.density" type="range" min="0.4" max="8" step="0.2" /><code>{{ opts.stars.density.toFixed(1) }}</code></label>
          <label>Clumping <input v-model.number="opts.stars.cluster" type="range" min="0" max="1" step="0.05" /><code>{{ opts.stars.cluster.toFixed(2) }}</code></label>
          <label>Spectrum <Seg v-model="opts.stars.spectrum" :options="[['classic', 'classic (yours)'], ['bright', 'more hot stars'], ['mono', 'white only']]" /></label>
          <label v-if="opts.stars.pointer"><span><span class="new">new</span> Parallax depth</span> <input v-model.number="opts.stars.parallax" type="range" min="4" max="40" step="1" /><code>{{ opts.stars.parallax }}px</code></label>
          <label v-if="opts.stars.meteors"><span><span class="new">new</span> Meteors</span> <Seg v-model="opts.stars.meteorRate" :options="['rare', 'normal', 'frequent']" /></label>
          <div class="checks">
            <label><input v-model="opts.stars.twinkle" type="checkbox" /> twinkle</label>
            <label><input v-model="opts.stars.pointer" type="checkbox" /> mouse parallax</label>
            <label><input v-model="opts.stars.meteors" type="checkbox" /> meteors</label>
            <label><input v-model="opts.stars.perSite" type="checkbox" /> sky seeded by hostname</label>
            <label><input v-model="opts.stars.glow" type="checkbox" /> glow on big stars</label>
            <label><input v-model="opts.stars.band" type="checkbox" /> milky-way band</label>
            <label><input v-model="opts.stars.drift" type="checkbox" /> slow drift</label>
          </div>
        </template>
      </div>
      <div class="group state">
        <h3>State preview <span class="hint">not a setting</span></h3>
        <label>Stream <Seg v-model="opts.live" :options="[[false, 'offline'], [true, 'live']]" /></label>
        <label>Viewer <Seg v-model="opts.signedIn" :options="[[false, 'signed out'], [true, 'signed in']]" /></label>
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
  </div>
</template>

<style>
body.lab-body { display: block; background: #151517; padding: 0; }
body.lab-body #app { width: 100%; }
</style>

<style scoped>
.lab { color: #e8e8ea; font-family: system-ui, sans-serif; font-size: 14px; line-height: 1.5; min-height: 100vh; }
.lab-bar {
  position: sticky; top: 0; z-index: 40; display: flex; flex-wrap: wrap; gap: 10px 14px; align-items: center;
  padding: 10px 16px; background: rgb(21 21 23 / 0.94); backdrop-filter: blur(8px); border-bottom: 1px solid #2c2c31;
}
.lab-title { font-weight: 700; margin-right: auto; }
.lab-title a { font-weight: 400; font-size: 12px; margin-left: 10px; color: #8d8d96; padding: 0; }
.lab-title a:hover { color: #e8e8ea; }
.lab-btn { font: inherit; font-size: 12px; background: none; border: 1px solid #2c2c31; color: #c4c4cc; border-radius: 7px; padding: 3px 10px; cursor: pointer; }
.lab-btn:disabled { opacity: 0.35; cursor: default; }

.intro, .controls { max-width: 1240px; margin: 0 auto; padding: 14px 16px 0; }
.intro p { color: #c4c4cc; }
.dirty { color: #ffb56c; }
.new { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #0b0b0d; background: #d5e0ff; border-radius: 4px; padding: 0 5px; margin-right: 4px; }
.controls { display: grid; grid-template-columns: repeat(auto-fit, minmax(330px, 1fr)); gap: 14px 28px; }
.group { display: flex; flex-direction: column; gap: 7px; }
.group h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #8d8d96; font-weight: 600; margin-bottom: 2px; }
.hint { text-transform: none; letter-spacing: 0; font-weight: 400; margin-left: 6px; color: #66666e; }
.group > label { display: flex; align-items: center; gap: 10px; color: #c4c4cc; font-size: 12px; flex-wrap: wrap; justify-content: space-between; }
.group label input[type='range'] { margin-left: auto; width: 150px; accent-color: #d5e0ff; }
.group label code { font-size: 11px; color: #8d8d96; width: 38px; text-align: right; }
.checks { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 10px; font-size: 12px; color: #c4c4cc; }
.checks label { display: flex; gap: 6px; align-items: center; cursor: pointer; }
.checks input { accent-color: #d5e0ff; }

.frames { display: flex; flex-direction: column; align-items: center; gap: 28px; padding: 18px 16px 60px; }
.frame { width: 100%; max-width: 1240px; border: 1px solid #2c2c31; border-radius: 10px; overflow: hidden; background: #000; box-shadow: 0 20px 50px rgb(0 0 0 / 0.4); }
.frame.fill .viewport { height: calc(100vh - 90px); min-height: 480px; }
.frames.mobile { flex-direction: row; flex-wrap: wrap; justify-content: center; align-items: flex-start; }
.frames.mobile .frame { width: 390px; max-width: 100%; }
.frames.mobile .frame.fill .viewport { height: 780px; min-height: 0; }
.url { font-family: ui-monospace, Consolas, monospace; font-size: 12px; color: #8d8d96; padding: 7px 12px; border-bottom: 1px solid #2c2c31; background: #1b1b1e; }
.dots { letter-spacing: 2px; margin-right: 10px; color: #444; }
.viewport { container: frame / inline-size; }
</style>
