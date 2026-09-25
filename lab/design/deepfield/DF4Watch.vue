<script setup>
// v4 watch page. Changes from v3: parts are a dropdown (27h VODs have 9+ parts, some unavailable), every popover
// opens where there's room and scrolls, icon buttons are fixed squares, copy link confirms with a toast, and chat
// delay steps by 0.1s.
import { computed, inject, reactive, ref, watch } from 'vue'
import DFChrome from './DFChrome.vue'
import Ph from '../Ph.vue'
import Posters from './Posters.vue'
import DPop from './DPop.vue'
import { watchVod, marathonVod, ytToVod, vodToYt, hms, gameColor, twitchColor, chat3, emoteNames } from './data.js'

const opts = inject('dfOpts')

const vod = computed(() => (opts.value.vod === 'marathon' ? marathonVod : watchVod))
const pos = ref(15087) // VOD seconds
watch(vod, (v) => (pos.value = v === marathonVod ? 62000 : 15087))

const chatOpen = ref(true)
const theater = ref(false)
const playing = ref(true)
const toast = ref(null)
let toastTimer
function say(msg) {
  toast.value = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = null), 1800)
}

// Chat settings: the viewer's own (localStorage / their account), not a design option
const chatSet = reactive({
  delay: 0,
  timestamps: true,
  colors: 'readable',
  badges: true,
  emotes: { '7tv': true, bttv: true, ffz: true },
  size: 'm',
})
const emoteSource = { KEKW: 'bttv', Pog: 'twitch', catJAM: '7tv', OMEGALUL: 'ffz', Clap: 'bttv', monkaS: 'ffz' }
const clampDelay = (d) => Math.max(-60, Math.min(60, Math.round(d * 10) / 10))
const step = (d, e) => (chatSet.delay = clampDelay(chatSet.delay + (e.shiftKey ? d * 10 : d)))
const fmtDelay = (d) => (d > 0 ? '+' : '') + d.toFixed(1) + 's'

// Parts: YouTube uploads (≤3h of uploaded time), mapped back onto VOD time
const parts = computed(() => {
  const v = vod.value
  let yt = 0
  const list = v.parts.map((p) => {
    const { len, status = 'ok' } = typeof p === 'number' ? { len: p } : p
    const item = { len, status, ytStart: yt, start: ytToVod(yt, v.chapters) }
    yt += len
    return item
  })
  list.forEach((p, i) => (p.end = list[i + 1]?.start ?? v.duration))
  return list
})
const part = computed(() => parts.value.findLastIndex((p) => p.start <= pos.value))
const cur = computed(() => parts.value[part.value])
const partTime = computed(() => vodToYt(pos.value, vod.value.chapters) - cur.value.ytStart)
const chapterIdx = computed(() => vod.value.chapters.findIndex((c) => pos.value >= c.start && pos.value < c.end))
const chapter = computed(() => vod.value.chapters[chapterIdx.value])
const games = computed(() => [...new Set(vod.value.chapters.filter((c) => !c.restricted).map((c) => c.game))])
const pct = (s) => (s / vod.value.duration) * 100
const statusText = { removed: 'removed', processing: 'processing' }
const nextOk = computed(() => parts.value.findIndex((p, i) => i > part.value && p.status === 'ok'))
const prevOk = computed(() => parts.value.findLastIndex((p, i) => i < part.value && p.status === 'ok'))

function seek(t) {
  const c = vod.value.chapters.find((c) => c.restricted && t >= c.start && t < c.end)
  pos.value = c ? c.end : t // restricted time isn't on YouTube: jump past it, like the Archive does
}
function onTrack(e) {
  const r = e.currentTarget.getBoundingClientRect()
  seek(((e.clientX - r.left) / r.width) * vod.value.duration)
}
function copyLink() {
  say(`Link copied at ${hms(pos.value)}`)
}

const badgeLabel = { mod: 'M', sub: 'S', vip: 'V', bits: 'B', bot: 'b' }
function words(m) {
  return m.split(' ').map((w) => {
    const src = emoteSource[w]
    return { w, emote: emoteNames.includes(w) && (src === 'twitch' || chatSet.emotes[src]) }
  })
}
const lines = computed(() => chat3.map((c) => ({ ...c, t: c.t - 15087 + pos.value })))
const shortcuts = [
  ['space / k', 'play · pause'], ['j / l', '−10s / +10s'], ['[ / ]', 'previous / next part'],
  [', / .', 'previous / next chapter'], ['c', 'toggle chat'], ['t', 'theater'], ['y', 'copy link at time'],
]
// Fits a phone: never wider than the frame minus its gutters
const popW = (px) => `min(${px}px, calc(100cqw - 24px))`
</script>

<template>
  <DFChrome site="vods" sub="vods" :nav="['Vods', 'Games', 'Live']" fill :hide-head="theater" :sky="opts.watchSky">
    <div class="watch" :class="{ nochat: !chatOpen }">
      <section class="stage">
        <div class="video">
          <div class="video-box">
            <Ph :label="`YouTube embed · part ${part + 1} of ${parts.length}`" ratio="16 / 9" />
            <div v-if="cur.status !== 'ok'" class="unavail">
              <div class="panel pop un-card">
                <div class="eyebrow">part {{ part + 1 }} of {{ parts.length }}</div>
                <b>{{ cur.status === 'processing' ? 'Still processing on YouTube' : 'This part is not on YouTube' }}</b>
                <p class="muted">
                  {{ hms(cur.start) }} – {{ hms(cur.end) }} of the VOD. Chat replay still plays, and the timeline keeps the
                  place of the missing video.
                </p>
                <div class="un-actions">
                  <button v-if="prevOk >= 0" class="btn" @click="seek(parts[prevOk].end - 30)">← Part {{ prevOk + 1 }}</button>
                  <button v-if="nextOk >= 0" class="btn primary" @click="seek(parts[nextOk].start)">Skip to part {{ nextOk + 1 }} →</button>
                </div>
              </div>
            </div>
            <div v-else-if="opts.ytControls !== 'custom'" class="yt-bar">
              <div class="yt-track"><span :style="{ width: (partTime / cur.len) * 100 + '%' }"></span></div>
              <div class="yt-row">
                <span>▶ &nbsp;🔊</span>
                <span>{{ hms(partTime) }} / {{ hms(cur.len) }}</span>
                <span class="yt-spacer"></span>
                <span>⚙ &nbsp;⛶</span>
              </div>
            </div>
          </div>
          <button v-if="!chatOpen" class="chat-reopen btn icon" title="Show chat" @click="chatOpen = true">⇤</button>
        </div>

        <div class="controls">
          <div v-if="opts.timeline !== 'off'" class="timeline" :class="opts.timeline">
            <div class="part-labels">
              <button
                v-for="(p, i) in parts"
                :key="i"
                class="plabel mono"
                :class="{ cur: i === part, un: p.status !== 'ok' }"
                :style="{ left: pct(p.start) + '%' }"
                :title="`Part ${i + 1}${p.status !== 'ok' ? ' · ' + statusText[p.status] : ''}`"
                @click="seek(p.start)"
              >P{{ i + 1 }}</button>
            </div>
            <div class="track" @click="onTrack">
              <span
                v-for="(c, i) in vod.chapters"
                :key="i"
                class="seg"
                :class="{ restricted: c.restricted }"
                :style="{ left: pct(c.start) + '%', width: pct(c.end - c.start) + '%', '--c': gameColor(c.game) }"
                :title="c.restricted ? `${c.game} — cut from YouTube` : c.game"
              ></span>
              <template v-for="(p, i) in parts" :key="'u' + i">
                <span v-if="p.status !== 'ok'" class="unseg" :style="{ left: pct(p.start) + '%', width: pct(p.end - p.start) + '%' }"></span>
              </template>
              <span v-for="(p, i) in parts.slice(1)" :key="'p' + i" class="ptick" :style="{ left: pct(p.start) + '%' }"></span>
              <span class="played" :style="{ width: pct(pos) + '%' }"></span>
              <span class="head" :style="{ left: pct(pos) + '%' }"></span>
            </div>
          </div>

          <div class="row">
            <template v-if="opts.ytControls === 'custom'">
              <button class="btn primary icon" :title="playing ? 'Pause' : 'Play'" @click="playing = !playing">{{ playing ? '❚❚' : '▶' }}</button>
              <input class="vol" type="range" min="0" max="100" value="70" aria-label="Volume" />
            </template>
            <span class="time mono">{{ hms(pos) }} <span class="muted">/ {{ hms(vod.duration) }}</span></span>

            <div class="now">
              <DPop prefer="up" :width="popW(340)" :cap="380">
                <template #trigger="{ toggle, open }">
                  <button class="poster-btn" :class="{ open }" title="Chapters" @click="toggle">
                    <Posters :games="games" :mode="opts.posters === 'chips' ? 'stack' : opts.posters" :size="26" />
                  </button>
                </template>
                <template #default="{ close }">
                  <div class="eyebrow menu-head">Chapters · {{ vod.chapters.length }}</div>
                  <button
                    v-for="(c, i) in vod.chapters"
                    :key="i"
                    class="menu-item"
                    :class="{ cur: i === chapterIdx }"
                    :disabled="c.restricted"
                    @click="seek(c.start); close()"
                  >
                    <Posters :games="[c.game]" mode="row" :size="24" />
                    <span class="mi-main">{{ c.game }}</span>
                    <span v-if="c.restricted" class="chip off">cut</span>
                    <span v-else class="mi-sub">{{ hms(c.start) }}</span>
                  </button>
                </template>
              </DPop>
              <div class="now-text">
                <div class="title">{{ vod.title }}</div>
                <div class="sub mono muted">ch {{ chapterIdx + 1 }}/{{ vod.chapters.length }} · {{ chapter?.game }} · {{ hms(partTime) }} into part {{ part + 1 }}</div>
              </div>
            </div>

            <DPop prefer="up" align="right" :width="popW(320)" :cap="360">
              <template #trigger="{ toggle, open }">
                <button class="btn mono partbtn" :class="{ on: open }" title="YouTube part" @click="toggle">
                  <span><span class="hide-sm">Part&nbsp;</span>{{ part + 1 }}<span class="muted">/{{ parts.length }}</span></span><span class="caret">▾</span>
                </button>
              </template>
              <template #default="{ close }">
                <div class="eyebrow menu-head">YouTube parts · {{ parts.length }}</div>
                <button
                  v-for="(p, i) in parts"
                  :key="i"
                  class="menu-item"
                  :class="{ cur: i === part }"
                  :disabled="p.status === 'removed'"
                  @click="seek(p.start); close()"
                >
                  <span class="mono pname">Part {{ i + 1 }}</span>
                  <span v-if="p.status !== 'ok'" class="chip" :class="p.status === 'removed' ? 'off' : 'accent'">{{ statusText[p.status] }}</span>
                  <span class="mi-sub prange">{{ hms(p.start) }}–{{ hms(p.end) }}</span>
                </button>
              </template>
            </DPop>
            <button class="btn icon" title="Copy link at this time" @click="copyLink">⧉</button>
            <button class="btn icon" title="Download VOD">⤓</button>
            <button class="btn icon" :class="{ on: theater }" title="Theater" @click="theater = !theater">{{ theater ? '⤡' : '⤢' }}</button>
            <DPop prefer="up" align="right" :width="popW(250)">
              <template #trigger="{ toggle, open }">
                <button class="btn icon" :class="{ on: open }" title="Keyboard shortcuts" @click="toggle">?</button>
              </template>
              <div class="eyebrow menu-head">Shortcuts</div>
              <div v-for="[k, d] in shortcuts" :key="k" class="kv">
                <kbd class="mono">{{ k }}</kbd><span class="muted">{{ d }}</span>
              </div>
            </DPop>
          </div>
        </div>
        <div v-if="toast" class="toast"><span class="ok">✓</span>{{ toast }}</div>
      </section>

      <aside v-if="chatOpen" class="chat" :class="'size-' + chatSet.size">
        <div class="chat-head">
          <button class="btn sm icon ghost" title="Hide chat" @click="chatOpen = false">⇥</button>
          <span class="eyebrow">Chat replay</span>
          <span class="spacer"></span>
          <button v-if="chatSet.delay" class="chip accent mono delaychip" title="Chat delay — click to reset" @click="chatSet.delay = 0">{{ fmtDelay(chatSet.delay) }}</button>
          <DPop align="right" :width="popW(300)">
            <template #trigger="{ toggle, open }">
              <button class="btn sm icon ghost" :class="{ on: open }" title="Chat settings" @click="toggle">⚙</button>
            </template>
            <div class="eyebrow menu-head">Chat settings</div>
            <div class="set col">
              <span>Chat delay <span class="muted small">shift-click for ±1s</span></span>
              <span class="stepper">
                <button class="btn sm icon" title="−0.1s" @click="step(-0.1, $event)">−</button>
                <input
                  class="input mono delay-in"
                  type="number"
                  step="0.1"
                  :value="chatSet.delay.toFixed(1)"
                  aria-label="Chat delay in seconds"
                  @change="chatSet.delay = clampDelay(+$event.target.value || 0)"
                />
                <button class="btn sm icon" title="+0.1s" @click="step(0.1, $event)">+</button>
                <button class="btn sm ghost" :disabled="!chatSet.delay" @click="chatSet.delay = 0">reset</button>
              </span>
            </div>
            <label class="set"><span>Timestamps</span><button class="switch" :class="{ on: chatSet.timestamps }" role="switch" :aria-checked="chatSet.timestamps" @click="chatSet.timestamps = !chatSet.timestamps"></button></label>
            <label class="set"><span>Badges</span><button class="switch" :class="{ on: chatSet.badges }" role="switch" :aria-checked="chatSet.badges" @click="chatSet.badges = !chatSet.badges"></button></label>
            <div class="set col">
              <span>Name colours <span class="muted small">as chosen by each chatter</span></span>
              <span class="opts">
                <button class="chip" :class="{ active: chatSet.colors === 'readable' }" @click="chatSet.colors = 'readable'">readable</button>
                <button class="chip" :class="{ active: chatSet.colors === 'raw' }" @click="chatSet.colors = 'raw'">exact</button>
              </span>
            </div>
            <div class="set">
              <span>Emotes</span>
              <span class="opts">
                <button v-for="(on, k) in chatSet.emotes" :key="k" class="chip" :class="{ active: on }" @click="chatSet.emotes[k] = !on">{{ k }}</button>
              </span>
            </div>
            <div class="set">
              <span>Text size</span>
              <span class="opts">
                <button v-for="s in ['s', 'm', 'l']" :key="s" class="chip" :class="{ active: chatSet.size === s }" @click="chatSet.size = s">{{ s.toUpperCase() }}</button>
              </span>
            </div>
          </DPop>
        </div>
        <div class="lines">
          <div v-for="(c, i) in lines" :key="i" class="line">
            <span v-if="chatSet.timestamps" class="ts mono">{{ hms(c.t + chatSet.delay) }}</span>
            <span v-if="chatSet.badges" class="badges">
              <Ph v-for="b in c.badges" :key="b" :label="badgeLabel[b]" :w="16" :h="16" />
            </span>
            <span class="who" :style="{ color: twitchColor(c.u, chatSet.colors) }">{{ c.u }}</span>
            <template v-for="(w, j) in words(c.m)" :key="j">
              <Ph v-if="w.emote" class="emote" :label="w.w.slice(0, 4)" :w="28" :h="24" />
              <span v-else>{{ w.w + ' ' }}</span>
            </template>
          </div>
        </div>
      </aside>
    </div>
  </DFChrome>
</template>

<style scoped>
.watch { display: grid; grid-template-columns: minmax(0, 1fr) 340px; height: 100%; }
.watch.nochat { grid-template-columns: minmax(0, 1fr); }

.stage { position: relative; display: flex; flex-direction: column; min-height: 0; min-width: 0; }
.video { position: relative; flex: 1; min-height: 0; container-type: size; display: grid; place-items: center; background: #000; }
.video-box { position: relative; width: min(100cqw, 100cqh * 16 / 9); }
.video-box :deep(.ph) { border-radius: 0; background-color: #050506; }
.chat-reopen { position: absolute; right: 8px; top: 8px; }

.unavail { position: absolute; inset: 0; display: grid; place-items: center; padding: 12px; background: rgb(0 0 0 / 0.6); }
.un-card { max-width: 380px; padding: 14px 16px; display: flex; flex-direction: column; gap: 6px; font-size: 14px; }
.un-card p { font-size: 13px; line-height: 1.5; margin: 0; }
.un-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 6px; }

/* Stand-in for YouTube's own control bar inside the iframe */
.yt-bar { position: absolute; left: 0; right: 0; bottom: 0; padding: 20px 12px 6px; background: linear-gradient(transparent, rgb(0 0 0 / 0.7)); color: #fff; font: 11px/1.4 Roboto, Arial, sans-serif; pointer-events: none; }
.yt-track { height: 3px; background: rgb(255 255 255 / 0.25); margin-bottom: 6px; }
.yt-track span { display: block; height: 100%; background: #f00; }
.yt-row { display: flex; gap: 14px; opacity: 0.9; }
.yt-spacer { flex: 1; }

.controls { border-top: 1px solid var(--line); background: rgb(0 0 0 / 0.7); }

.timeline { padding: 2px 12px 0; }
.part-labels { position: relative; height: 16px; }
.plabel {
  position: absolute; top: 1px; transform: translateX(2px); font-size: 10px; line-height: 1; padding: 1px 3px;
  background: none; border: none; color: var(--muted); cursor: pointer; border-radius: 3px;
}
.plabel:first-child { transform: none; }
.plabel.cur { color: var(--accent); }
.plabel.un { text-decoration: line-through; opacity: 0.6; }
.plabel:hover { color: var(--ink); }
.track { position: relative; height: 6px; cursor: pointer; margin-bottom: 2px; transition: height 0.1s; }
.track:hover { height: 9px; }
.seg { position: absolute; top: 0; bottom: 0; border-right: 2px solid rgb(0 0 0 / 0.85); background: color-mix(in srgb, var(--c) 45%, transparent); }
.mono .seg { background: rgb(255 255 255 / 0.2); }
.seg.restricted { background: repeating-linear-gradient(-45deg, rgb(255 255 255 / 0.18) 0 3px, transparent 3px 6px); }
/* A whole missing YouTube part: darkened with a red hatch over whatever chapters it covered */
.unseg { position: absolute; top: 0; bottom: 0; pointer-events: none; background: repeating-linear-gradient(45deg, color-mix(in srgb, var(--bad) 55%, transparent) 0 2px, rgb(0 0 0 / 0.65) 2px 6px); }
.ptick { position: absolute; top: -9px; bottom: -2px; width: 1px; background: var(--muted); pointer-events: none; }
.played { position: absolute; left: 0; top: 0; bottom: 0; background: var(--accent); opacity: 0.75; pointer-events: none; mix-blend-mode: screen; }
.mono .played { background: var(--ink); opacity: 0.55; }
.head { position: absolute; top: 50%; width: 11px; height: 11px; margin: -5.5px 0 0 -5.5px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 3px rgb(0 0 0 / 0.6); pointer-events: none; }
.mono .head { background: var(--ink); }

.row { display: flex; align-items: center; gap: 8px; padding: 6px 12px 8px; min-width: 0; }
.vol { width: 70px; accent-color: var(--accent); }
.time { font-size: 12px; white-space: nowrap; }
.now { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; margin-left: 4px; }
.poster-btn { background: none; border: none; padding: 0 4px; cursor: pointer; display: flex; height: var(--ctl); align-items: center; }
.now-text { min-width: 0; line-height: 1.3; }
.title { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sub { font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.partbtn { min-width: 92px; }
.pname { flex: none; }
.prange { margin-left: auto; }
.menu-item.cur .pname { color: var(--accent); }

.kv { display: flex; justify-content: space-between; gap: 10px; padding: 4px 8px; font-size: 12px; }
kbd { font-size: 11px; border: 1px solid var(--line); border-radius: 4px; padding: 0 5px; }

.chat { display: flex; flex-direction: column; min-height: 0; border-left: 1px solid var(--line); background: #0b0b0d; }
.chat-head { display: flex; align-items: center; gap: 6px; height: 40px; padding: 0 6px; border-bottom: 1px solid var(--line); }
.chat-head .spacer { flex: 1; }
.delaychip { cursor: pointer; background: none; }
.set { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 6px 8px; font-size: 13px; cursor: default; }
.set.col { flex-direction: column; align-items: flex-start; gap: 6px; }
.small { font-size: 11px; }
.opts { display: flex; gap: 4px; flex-wrap: wrap; }
.opts .chip { cursor: pointer; background: none; }
.opts .chip.active { background: var(--accent); color: var(--bg); }
.stepper { display: flex; align-items: center; gap: 4px; }
.delay-in { width: 64px; height: var(--ctl-sm); text-align: center; font-size: 12px; padding: 0 4px; -moz-appearance: textfield; }
.delay-in::-webkit-inner-spin-button { display: none; }

.lines { flex: 1; min-height: 0; overflow-y: auto; padding: 8px 12px; display: flex; flex-direction: column; gap: 3px; font-size: 13px; line-height: 1.6; scrollbar-width: thin; scrollbar-color: var(--line) transparent; }
.size-s .lines { font-size: 12px; }
.size-l .lines { font-size: 15px; }
.ts { color: var(--muted); font-size: 10px; margin-right: 6px; opacity: 0.7; }
.badges { display: inline-flex; gap: 2px; vertical-align: -3px; margin-right: 4px; }
.badges:empty { display: none; }
.badges :deep(.ph) { font-size: 8px; padding: 0; }
.who { font-weight: 700; }
.who::after { content: ':'; color: var(--muted); margin-right: 5px; }
.emote { display: inline-grid; vertical-align: middle; margin: -4px 3px -4px 0; font-size: 8px; }

@container frame (max-width: 700px) {
  .watch, .watch.nochat { grid-template-columns: 1fr; grid-template-rows: auto minmax(0, 1fr); }
  .video { flex: none; aspect-ratio: 16 / 9; container-type: inline-size; }
  .video-box { width: 100%; }
  .unavail { position: static; background: none; }
  .video:has(.unavail) { aspect-ratio: auto; }
  .video:has(.unavail) .video-box > :deep(.ph) { display: none; }
  /* Same controls as desktop, just reflowed: title on its own line, everything else wraps below it */
  .row { flex-wrap: wrap; gap: 6px; }
  .time { margin-right: auto; }
  .now { order: -1; flex-basis: 100%; margin-left: 0; }
  .partbtn { min-width: 0; }
  .chat { border-left: none; border-top: 1px solid var(--line); }
}
</style>
