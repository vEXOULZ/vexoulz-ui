<script setup>
// v3 watch page, modelled on the Archive's YouTube mode: the VOD is several ≤3h YouTube uploads, restricted
// chapters are cut from them, and a custom timeline spans the whole VOD across every part.
import { computed, inject, onMounted, onUnmounted, reactive, ref } from 'vue'
import DFChrome from './DFChrome.vue'
import Ph from '../Ph.vue'
import Posters from './Posters.vue'
import { watchVod as vod, ytToVod, vodToYt, hms, gameColor, twitchColor, chat3, emoteNames } from './data.js'

const opts = inject('dfOpts')

const pos = ref(15087) // VOD seconds
const chatOpen = ref(true)
const theater = ref(false)
const pop = ref(null) // 'chapters' | 'settings' | 'help' | null
const playing = ref(true)
const copied = ref(false)

// Chat settings: the viewer's own (would persist in localStorage / their account), not a design option
const chatSet = reactive({
  delay: 0,
  timestamps: true,
  colors: opts.value.chatColors || 'readable',
  badges: true,
  emotes: { '7tv': true, bttv: true, ffz: true },
  size: 'm',
})
const emoteSource = { KEKW: 'bttv', Pog: 'twitch', catJAM: '7tv', OMEGALUL: 'ffz', Clap: 'bttv', monkaS: 'ffz' }

// Parts: cumulative YouTube starts mapped back to VOD time
const ytStarts = vod.parts.reduce((a, d, i) => (a.push(i ? a[i - 1] + vod.parts[i - 1] : 0), a), [])
const partStarts = ytStarts.map((s) => ytToVod(s))
const part = computed(() => partStarts.findLastIndex((s) => s <= pos.value))
const partTime = computed(() => vodToYt(pos.value) - ytStarts[part.value])
const chapterIdx = computed(() => vod.chapters.findIndex((c) => pos.value >= c.start && pos.value < c.end))
const chapter = computed(() => vod.chapters[chapterIdx.value])
const games = [...new Set(vod.chapters.filter((c) => !c.restricted).map((c) => c.game))]
const pct = (s) => (s / vod.duration) * 100

function seek(t) {
  const c = vod.chapters.find((c) => c.restricted && t >= c.start && t < c.end)
  pos.value = c ? c.end : t // restricted time isn't on YouTube: jump past it, like the Archive does
  pop.value = null
}
function onTrack(e) {
  const r = e.currentTarget.getBoundingClientRect()
  seek(((e.clientX - r.left) / r.width) * vod.duration)
}
function copyLink() {
  copied.value = true
  setTimeout(() => (copied.value = false), 1200)
}

const el = ref(null)
const closePop = (e) => {
  if (pop.value && el.value && !e.target.closest('.pop-anchor')) pop.value = null
}
onMounted(() => document.addEventListener('pointerdown', closePop))
onUnmounted(() => document.removeEventListener('pointerdown', closePop))
const toggle = (name) => (pop.value = pop.value === name ? null : name)

const badgeLabel = { mod: 'M', sub: 'S', vip: 'V', bits: 'B', bot: 'b' }
function words(m) {
  return m.split(' ').map((w) => {
    const src = emoteSource[w]
    const on = emoteNames.includes(w) && (src === 'twitch' || chatSet.emotes[src])
    return { w, emote: on }
  })
}
</script>

<template>
  <DFChrome site="vods" sub="vods" :nav="['Vods', 'Games', 'Live']" fill :hide-head="theater" :sky="opts.watchSky">
    <div ref="el" class="watch" :class="{ nochat: !chatOpen }">
      <section class="stage">
        <div class="video">
          <div class="video-box">
            <Ph :label="`YouTube embed · part ${part + 1} of ${vod.parts.length}`" ratio="16 / 9" />
            <div v-if="opts.ytControls !== 'custom'" class="yt-bar">
              <div class="yt-track"><span :style="{ width: (partTime / vod.parts[part]) * 100 + '%' }"></span></div>
              <div class="yt-row">
                <span>▶ &nbsp;🔊</span>
                <span>{{ hms(partTime) }} / {{ hms(vod.parts[part]) }}</span>
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
                v-for="(s, i) in partStarts"
                :key="i"
                class="plabel mono"
                :class="{ cur: i === part }"
                :style="{ left: pct(s) + '%' }"
                @click="seek(s)"
              >P{{ i + 1 }}</button>
            </div>
            <div class="track" @click="onTrack">
              <span
                v-for="(c, i) in vod.chapters"
                :key="i"
                class="seg"
                :class="{ restricted: c.restricted }"
                :style="{ left: pct(c.start) + '%', width: pct(c.end - c.start) + '%', '--c': gameColor(c.game) }"
                :title="c.restricted ? `${c.game} — not on YouTube` : c.game"
              ></span>
              <span v-for="(s, i) in partStarts.slice(1)" :key="'p' + i" class="ptick" :style="{ left: pct(s) + '%' }"></span>
              <span class="played" :style="{ width: pct(pos) + '%' }"></span>
              <span class="head" :style="{ left: pct(pos) + '%' }"></span>
            </div>
          </div>

          <div class="row">
            <template v-if="opts.ytControls === 'custom'">
              <button class="btn primary icon" @click="playing = !playing">{{ playing ? '❚❚' : '▶' }}</button>
              <input class="vol" type="range" min="0" max="100" value="70" aria-label="Volume" />
            </template>
            <span class="time mono">{{ hms(pos) }} <span class="muted">/ {{ hms(vod.duration) }}</span></span>

            <div class="now pop-anchor">
              <button class="poster-btn" title="Chapters" @click="toggle('chapters')">
                <Posters :games="games" :mode="opts.posters === 'chips' ? 'stack' : opts.posters" :size="26" />
              </button>
              <div class="now-text">
                <div class="title">{{ vod.title }}</div>
                <div class="sub mono muted">ch {{ chapterIdx + 1 }}/{{ vod.chapters.length }} · {{ chapter?.game }} · part {{ part + 1 }} @ {{ hms(partTime) }}</div>
              </div>
              <div v-if="pop === 'chapters'" class="popover chapter-list panel pop">
                <div class="eyebrow ph">Chapters</div>
                <button
                  v-for="(c, i) in vod.chapters"
                  :key="i"
                  class="chapter"
                  :class="{ cur: i === chapterIdx }"
                  :disabled="c.restricted"
                  @click="seek(c.start)"
                >
                  <Posters :games="[c.game]" mode="row" :size="24" />
                  <span class="c-name">{{ c.game }}</span>
                  <span v-if="c.restricted" class="chip off">not on YouTube</span>
                  <span v-else class="mono muted">{{ hms(c.start) }}</span>
                </button>
              </div>
            </div>

            <div class="parts" role="group" aria-label="YouTube part">
              <span class="eyebrow">part</span>
              <button
                v-for="(s, i) in partStarts"
                :key="i"
                class="pbtn mono"
                :class="{ on: i === part }"
                :title="`Part ${i + 1}: ${hms(s)} – ${hms(partStarts[i + 1] ?? vod.duration)}`"
                @click="seek(s)"
              >{{ i + 1 }}</button>
            </div>
            <button class="btn icon" :title="copied ? 'Copied!' : 'Copy link at this time'" @click="copyLink">{{ copied ? '✓' : '⧉' }}</button>
            <button class="btn icon hide-sm" title="Download VOD">⤓</button>
            <button class="btn icon hide-sm" title="Theater" @click="theater = !theater">{{ theater ? '⤡' : '⤢' }}</button>
            <div class="pop-anchor rel hide-sm">
              <button class="btn icon" title="Keyboard shortcuts" @click="toggle('help')">?</button>
              <div v-if="pop === 'help'" class="popover help panel pop">
                <div class="eyebrow ph">Shortcuts</div>
                <div v-for="[k, d] in [['space / k', 'play · pause'], ['j / l', '−10s / +10s'], ['[ / ]', 'previous / next part'], [', / .', 'previous / next chapter'], ['c', 'toggle chat'], ['t', 'theater'], ['y', 'copy link at time']]" :key="k" class="kv">
                  <kbd class="mono">{{ k }}</kbd><span class="muted">{{ d }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <aside v-if="chatOpen" class="chat" :class="'size-' + chatSet.size">
        <div class="chat-head">
          <button class="btn icon ghost" title="Hide chat" @click="chatOpen = false">⇥</button>
          <span class="eyebrow">Chat replay</span>
          <div class="pop-anchor rel">
            <button class="btn icon ghost" :class="{ active: pop === 'settings' }" title="Chat settings" @click="toggle('settings')">
              ⚙<span v-if="chatSet.delay" class="mono delay">{{ chatSet.delay > 0 ? '+' : '' }}{{ chatSet.delay }}s</span>
            </button>
            <div v-if="pop === 'settings'" class="popover settings panel pop">
              <div class="eyebrow ph">Chat settings</div>
              <div class="set">
                <span>Chat delay</span>
                <span class="stepper">
                  <button class="btn icon" @click="chatSet.delay--">−</button>
                  <span class="mono">{{ chatSet.delay }}s</span>
                  <button class="btn icon" @click="chatSet.delay++">+</button>
                </span>
              </div>
              <div class="set">
                <span>Timestamps</span>
                <span class="opts">
                  <button class="chip" :class="{ active: chatSet.timestamps }" @click="chatSet.timestamps = true">on</button>
                  <button class="chip" :class="{ active: !chatSet.timestamps }" @click="chatSet.timestamps = false">off</button>
                </span>
              </div>
              <div class="set col">
                <span>Name colours <span class="muted small">as chosen by each chatter</span></span>
                <span class="opts">
                  <button class="chip" :class="{ active: chatSet.colors === 'readable' }" @click="chatSet.colors = 'readable'">readable</button>
                  <button class="chip" :class="{ active: chatSet.colors === 'raw' }" @click="chatSet.colors = 'raw'">exact</button>
                </span>
              </div>
              <div class="set">
                <span>Badges</span>
                <span class="opts">
                  <button class="chip" :class="{ active: chatSet.badges }" @click="chatSet.badges = true">on</button>
                  <button class="chip" :class="{ active: !chatSet.badges }" @click="chatSet.badges = false">off</button>
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
            </div>
          </div>
        </div>
        <div class="lines">
          <div v-for="(c, i) in chat3" :key="i" class="line">
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

.stage { display: flex; flex-direction: column; min-height: 0; min-width: 0; }
.video { position: relative; flex: 1; min-height: 0; container-type: size; display: grid; place-items: center; background: #000; }
.video-box { position: relative; width: min(100cqw, 100cqh * 16 / 9); }
.video-box :deep(.ph) { border-radius: 0; background-color: #050506; }
.chat-reopen { position: absolute; right: 8px; top: 8px; }

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
.plabel:hover { color: var(--ink); }
.track { position: relative; height: 6px; cursor: pointer; margin-bottom: 2px; transition: height 0.1s; }
.track:hover { height: 9px; }
.seg { position: absolute; top: 0; bottom: 0; border-right: 2px solid rgb(0 0 0 / 0.85); background: color-mix(in srgb, var(--c) 45%, transparent); }
.mono .seg { background: rgb(255 255 255 / 0.2); }
.seg.restricted { background: repeating-linear-gradient(-45deg, rgb(255 255 255 / 0.18) 0 3px, transparent 3px 6px); }
.ptick { position: absolute; top: -9px; bottom: -2px; width: 1px; background: var(--muted); pointer-events: none; }
.played { position: absolute; left: 0; top: 0; bottom: 0; background: var(--accent); opacity: 0.75; pointer-events: none; mix-blend-mode: screen; }
.mono .played { background: var(--ink); opacity: 0.55; }
.head { position: absolute; top: 50%; width: 11px; height: 11px; margin: -5.5px 0 0 -5.5px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 3px rgb(0 0 0 / 0.6); pointer-events: none; }
.mono .head { background: var(--ink); }

.row { display: flex; align-items: center; gap: 10px; padding: 6px 12px 8px; min-width: 0; }
.vol { width: 70px; accent-color: var(--accent); }
.time { font-size: 12px; white-space: nowrap; }
.now { position: relative; display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; margin-left: 4px; }
.poster-btn { background: none; border: none; padding: 0 4px; cursor: pointer; display: flex; }
.now-text { min-width: 0; line-height: 1.3; }
.title { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sub { font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.parts { display: flex; align-items: center; gap: 3px; margin-right: 4px; }
.parts .eyebrow { margin-right: 4px; }
.pbtn {
  width: 24px; height: 24px; font-size: 12px; border-radius: var(--radius-sm); border: 1px solid var(--line);
  background: transparent; color: var(--muted); cursor: pointer; padding: 0;
}
.pbtn:hover { border-color: var(--accent); color: var(--ink); }
.pbtn.on { background: var(--accent); color: var(--bg); border-color: var(--accent); font-weight: 600; }

.rel { position: relative; }
.popover { position: absolute; z-index: 10; padding: 6px; display: flex; flex-direction: column; box-shadow: 0 16px 40px rgb(0 0 0 / 0.6); text-align: left; }
.ph { padding: 4px 8px 6px; }
.chapter-list { left: 0; bottom: calc(100% + 12px); min-width: 300px; }
.chapter { display: flex; align-items: center; gap: 10px; padding: 5px 8px; background: none; border: none; color: var(--ink); cursor: pointer; border-radius: var(--radius-sm); text-align: left; font: inherit; font-size: 13px; }
.chapter:hover:not(:disabled), .chapter.cur { background: rgb(170 170 170 / 0.1); }
.chapter.cur .c-name { color: var(--accent); }
.chapter:disabled { cursor: default; opacity: 0.6; }
.c-name { flex: 1; }
.help { right: 0; bottom: calc(100% + 12px); width: 250px; }
.kv { display: flex; justify-content: space-between; gap: 10px; padding: 3px 8px; font-size: 12px; }
kbd { font-size: 11px; border: 1px solid var(--line); border-radius: 4px; padding: 0 5px; }

.chat { display: flex; flex-direction: column; min-height: 0; border-left: 1px solid var(--line); background: #0b0b0d; }
.chat-head { display: flex; justify-content: space-between; align-items: center; padding: 4px 6px; border-bottom: 1px solid var(--line); }
.btn.ghost { background: none; border-color: transparent; color: var(--muted); }
.btn.ghost:hover, .btn.ghost.active { color: var(--ink); border-color: var(--line); }
.delay { font-size: 10px; margin-left: 4px; color: var(--accent); }
.settings { right: 0; top: calc(100% + 6px); width: 290px; gap: 2px; }
.set { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 6px 8px; font-size: 13px; }
.set.col { flex-direction: column; align-items: flex-start; gap: 6px; }
.small { font-size: 11px; }
.opts { display: flex; gap: 4px; flex-wrap: wrap; }
.opts .chip { cursor: pointer; background: none; }
.opts .chip.active { background: var(--accent); color: var(--bg); }
.stepper { display: flex; align-items: center; gap: 6px; }
.stepper .mono { min-width: 34px; text-align: center; font-size: 12px; }

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
  .time, .hide-sm, .parts .eyebrow, .vol { display: none; }
  .row { flex-wrap: wrap; }
  .now { order: -1; flex-basis: 100%; margin-left: 0; }
  .chat { border-left: none; border-top: 1px solid var(--line); }
  .chapter-list { left: 0; right: 0; min-width: 0; }
}
</style>
