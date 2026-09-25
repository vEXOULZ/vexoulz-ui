<script setup>
// Watch page as an app: no footer, no max-width, the video takes every pixel the chat doesn't.
import { inject, ref } from 'vue'
import DFChrome from './DFChrome.vue'
import Ph from '../Ph.vue'
import Posters from './Posters.vue'
import { vods, gamesOf, gameColor, userColor, twitchColor, chat } from './data.js'

const opts = inject('dfOpts')
const vod = vods[3]
const chatOpen = ref(true)
const theater = ref(false)
const chaptersOpen = ref(false)
const progress = 0.37

// v2 lab sets opts.chatColors ('readable' | 'raw') for real Twitch colours; the older lab uses star colours
const nameColor = (u) =>
  opts.value.chatColors ? twitchColor(u, opts.value.chatColors) : u === 'dtp' ? 'var(--accent-dtp)' : userColor(u)

let acc = 0
const segments = vod.chapters.map(([g, f]) => {
  const s = { g, f, start: acc }
  acc += f
  return s
})
</script>

<template>
  <DFChrome site="vods" sub="vods" :nav="['Vods', 'Games', 'Live']" fill :hide-head="theater" :sky="opts.watchSky">
    <div class="watch" :class="{ nochat: !chatOpen }">
      <section class="stage">
        <div class="video">
          <div class="video-box"><Ph label="video player · 16:9, letterboxed to fit" ratio="16 / 9" /></div>
        </div>

        <div class="controls">
          <div class="track" :title="segments.map((s) => s.g).join(' → ')">
            <span
              v-for="(s, i) in segments"
              :key="i"
              class="seg"
              :style="{ flexGrow: s.f, '--c': gameColor(s.g) }"
            ></span>
            <span class="played" :style="{ width: progress * 100 + '%' }"></span>
            <span class="head" :style="{ left: progress * 100 + '%' }"></span>
          </div>

          <div class="row">
            <button class="btn primary icon">▶</button>
            <span class="time mono">4:11:48 <span class="muted">/ {{ vod.dur }}</span></span>
            <div class="now">
              <button class="poster-btn" @click="chaptersOpen = !chaptersOpen">
                <Posters :games="gamesOf(vod)" :mode="opts.posters === 'chips' ? 'stack' : opts.posters" :size="26" />
              </button>
              <div class="now-text">
                <div class="title">{{ vod.title }}</div>
                <div class="sub mono muted">ch 2/5 · Balatro · {{ vod.date }}</div>
              </div>
            </div>
            <button class="btn icon" title="Theater" @click="theater = !theater">{{ theater ? '⤡' : '⤢' }}</button>
            <button class="btn icon" title="Chat" @click="chatOpen = !chatOpen">{{ chatOpen ? '⇥' : '⇤' }}</button>
          </div>

          <div v-if="chaptersOpen" class="chapter-list panel">
            <button v-for="(s, i) in segments" :key="i" class="chapter" :class="{ cur: i === 1 }">
              <Posters :games="[s.g]" mode="row" :size="26" />
              <span class="c-name">{{ s.g }}</span>
              <span class="mono muted">{{ Math.round(s.start * 680) }}m</span>
            </button>
          </div>
        </div>
      </section>

      <aside v-if="chatOpen" class="chat">
        <div class="chat-head">
          <span class="eyebrow">Chat replay</span>
          <span class="mono muted small">synced · +0s</span>
        </div>
        <div class="lines">
          <div v-for="(c, i) in chat" :key="i" class="line">
            <span class="ts mono">{{ c.t }}</span>
            <span class="who" :style="{ color: nameColor(c.u) }">{{ c.u }}</span>
            <span class="msg">{{ c.m }}</span>
          </div>
        </div>
      </aside>
    </div>
  </DFChrome>
</template>

<style scoped>
.watch { display: grid; grid-template-columns: minmax(0, 1fr) 340px; height: 100%; }
.watch.nochat { grid-template-columns: minmax(0, 1fr); }

.stage { display: flex; flex-direction: column; min-height: 0; min-width: 0; }
.video { flex: 1; min-height: 0; container-type: size; display: grid; place-items: center; background: rgb(0 0 0 / 0.55); }
.video-box { width: min(100cqw, 100cqh * 16 / 9); }
.video-box :deep(.ph) { border-radius: 0; background-color: #050506; }

.controls { position: relative; border-top: 1px solid var(--line); background: rgb(0 0 0 / 0.7); }
.track { position: relative; display: flex; gap: 2px; height: 5px; cursor: pointer; }
.track:hover { height: 8px; margin-top: -3px; }
.seg { flex-basis: 0; background: color-mix(in srgb, var(--c) 35%, transparent); }
.played {
  position: absolute; left: 0; top: 0; bottom: 0; pointer-events: none;
  background: var(--accent); mix-blend-mode: normal; opacity: 0.85;
}
.head { position: absolute; top: 50%; width: 11px; height: 11px; margin: -5.5px 0 0 -5.5px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 3px rgb(0 0 0 / 0.6); }

.row { display: flex; align-items: center; gap: 12px; padding: 8px 12px; min-width: 0; }
.time { font-size: 12px; white-space: nowrap; }
.now { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; margin-left: 6px; }
.poster-btn { background: none; border: none; padding: 0; cursor: pointer; display: flex; }
.now-text { min-width: 0; line-height: 1.3; }
.title { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sub { font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.chapter-list { position: absolute; left: 110px; bottom: calc(100% + 8px); padding: 6px; display: flex; flex-direction: column; min-width: 260px; z-index: 5; background: var(--surface); }
.chapter { display: flex; align-items: center; gap: 10px; padding: 5px 8px; background: none; border: none; color: var(--ink); cursor: pointer; border-radius: var(--radius-sm); text-align: left; font-size: 13px; }
.chapter:hover, .chapter.cur { background: var(--surface-2); }
.chapter.cur .c-name { color: var(--accent); }
.c-name { flex: 1; }

.chat { display: flex; flex-direction: column; min-height: 0; border-left: 1px solid var(--line); background: rgb(6 6 8 / 0.8); }
.chat-head { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; border-bottom: 1px solid var(--line); }
.small { font-size: 11px; }
.lines { flex: 1; min-height: 0; overflow-y: auto; padding: 8px 12px; display: flex; flex-direction: column; gap: 3px; font-size: 13px; line-height: 1.45; scrollbar-width: thin; scrollbar-color: var(--line) transparent; }
.ts { color: var(--muted); font-size: 10px; margin-right: 6px; opacity: 0.7; }
.who { font-weight: 700; }
.who::after { content: ':'; color: var(--muted); margin-right: 5px; }

@container frame (max-width: 700px) {
  .watch, .watch.nochat { grid-template-columns: 1fr; grid-template-rows: auto minmax(0, 1fr); }
  .video { flex: none; aspect-ratio: 16 / 9; container-type: inline-size; }
  .video-box { width: 100%; }
  .time { display: none; }
  .chat { border-left: none; border-top: 1px solid var(--line); }
  .chapter-list { left: 8px; right: 8px; min-width: 0; }
}
</style>
