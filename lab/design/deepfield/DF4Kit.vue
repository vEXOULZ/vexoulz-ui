<script setup>
// The shared UI kit: every common control defined once, so a page that needs a "confirm dialog" or "date filter"
// later doesn't invent its own. In the real setup this is the vexoulz-ui Histoire site.
import { computed, reactive, ref } from 'vue'
import DFChrome from './DFChrome.vue'
import Ph from '../Ph.vue'
import DPop from './DPop.vue'

const accent = ref('root')
const accentStyle = computed(() => ({ '--accent': `var(--accent-${accent.value})` }))

const loading = ref(false)
function fakeLoad() {
  loading.value = true
  setTimeout(() => (loading.value = false), 1500)
}
const toast = ref(null)
let t
function say(m) {
  toast.value = m
  clearTimeout(t)
  t = setTimeout(() => (toast.value = null), 1800)
}
const modal = ref(false)

const f = reactive({
  name: 'vexoulz', search: '', num: 1.5, sort: 'Newest', check: true, check2: false, radio: 'all',
  sw: true, sw2: false, slider: 40, text: '', seg: 'grid', from: '2026-09-01', to: '2026-09-24', tab: 'Overview', page: 3,
})
const sorts = ['Newest', 'Oldest', 'Longest', 'Most watched']
const nameErr = computed(() => (f.name.length < 3 ? 'At least 3 characters.' : ''))
const sortCol = ref('date')
const rows = [
  ['subathon day 3', 'Sep 14', '11:20:55'],
  ['doom eternal nightmare any%', 'Sep 21', '5:12:40'],
  ['community game night', 'Sep 10', '2:55:30'],
]
</script>

<template>
  <DFChrome site="root" :nav="['Tokens', 'Buttons', 'Forms', 'Navigation', 'Feedback', 'Content']">
    <div class="kit" :style="accentStyle">
      <div class="kit-top">
        <div>
          <div class="eyebrow">vexoulz-ui · 0.4.0</div>
          <h1 class="h-display">UI kit</h1>
        </div>
        <span class="spacer"></span>
        <div class="segctl" role="radiogroup" aria-label="Preview accent">
          <button v-for="a in ['root', 'vods', 'dtp']" :key="a" :class="{ on: accent === a }" @click="accent = a">
            <span class="dotmark" :class="'accent-' + a"></span>{{ a }}
          </button>
        </div>
      </div>

      <!-- Tokens -->
      <section>
        <h2 class="eyebrow">Tokens</h2>
        <div class="grid3">
          <div class="panel card">
            <b>Control heights</b>
            <div class="row"><span class="tok" style="height: 26px">26 · sm</span><span class="tok" style="height: 32px">32 · default</span><span class="tok" style="height: 48px">48 · header, every page</span></div>
            <p class="muted small">Buttons, inputs, avatars and selects share one height, so rows and headers never jump when their contents change.</p>
          </div>
          <div class="panel card">
            <b>Colour</b>
            <div class="swatches">
              <span v-for="c in ['bg', 'surface', 'surface-2', 'line', 'muted', 'ink', 'ok', 'bad', 'accent-root', 'accent-vods', 'accent-dtp']" :key="c" class="sw">
                <span class="chipc" :style="{ background: `var(--${c})` }"></span><code>{{ c }}</code>
              </span>
            </div>
          </div>
          <div class="panel card">
            <b>Type &amp; radius</b>
            <div class="h-display" style="font-size: 22px">Display heading</div>
            <div style="font-weight: 600">Sans title — names, prose</div>
            <div class="mono muted small">mono 1:02:44 · labels, handles, numbers</div>
            <div class="eyebrow">eyebrow label</div>
            <div class="row"><span class="rad" style="border-radius: 5px">5</span><span class="rad" style="border-radius: 8px">8</span><span class="rad" style="border-radius: 999px">pill</span></div>
          </div>
        </div>
      </section>

      <!-- Buttons -->
      <section>
        <h2 class="eyebrow">Buttons</h2>
        <div class="panel card">
          <div class="row">
            <button class="btn">Default</button>
            <button class="btn primary">Primary</button>
            <button class="btn ghost">Ghost</button>
            <button class="btn danger">Danger</button>
            <button class="btn danger solid">Delete</button>
            <button class="btn" disabled>Disabled</button>
            <button class="btn on">Toggled</button>
            <button class="btn primary" :disabled="loading" @click="fakeLoad"><span v-if="loading" class="spinner"></span>{{ loading ? 'Saving…' : 'Save (loading)' }}</button>
          </div>
          <div class="row">
            <button class="btn sm">Small</button>
            <button class="btn sm primary">Small primary</button>
            <button class="btn"><Ph label="i" :w="14" :h="14" /> With icon</button>
            <button class="btn">Menu<span class="caret">▾</span></button>
            <span class="btngroup"><button class="btn">Day</button><button class="btn on">Week</button><button class="btn">Month</button></span>
          </div>
          <div class="row">
            <span class="muted small lab">square icon buttons</span>
            <button class="btn icon" title="Copy" @click="say('Link copied at 4:11:27')">⧉</button>
            <button class="btn icon" title="Download">⤓</button>
            <button class="btn icon on" title="Theater">⤢</button>
            <button class="btn icon primary" title="Play">▶</button>
            <button class="btn icon ghost" title="Settings">⚙</button>
            <button class="btn sm icon" title="Close">✕</button>
            <button class="btn icon" disabled title="Disabled">⤓</button>
          </div>
          <p class="muted small">Icon buttons are always square; state changes swap the icon or colour, never the size. Confirmation goes to a toast (try ⧉).</p>
        </div>
      </section>

      <!-- Forms -->
      <section>
        <h2 class="eyebrow">Forms</h2>
        <div class="grid2">
          <div class="panel card form">
            <div class="field">
              <label class="lbl" for="k-name">Display name</label>
              <input id="k-name" v-model="f.name" class="input" :class="{ invalid: nameErr }" />
              <span v-if="nameErr" class="err">{{ nameErr }}</span>
              <span v-else class="help muted">Shown on your commands.</span>
            </div>
            <div class="field">
              <label class="lbl">Search</label>
              <span class="input-icon"><span class="ic">⌕</span><input v-model="f.search" class="input" placeholder="Search vods…" /><button v-if="f.search" class="btn sm icon ghost clear" @click="f.search = ''">✕</button></span>
            </div>
            <div class="field">
              <label class="lbl">Sort (select)</label>
              <DPop width="220px">
                <template #trigger="{ toggle, open }">
                  <button class="btn select" :class="{ on: open }" @click="toggle">{{ f.sort }}<span class="caret">▾</span></button>
                </template>
                <template #default="{ close }">
                  <button v-for="s in sorts" :key="s" class="menu-item" :class="{ cur: f.sort === s }" @click="f.sort = s; close()">
                    <span class="mi-main">{{ s }}</span><span v-if="f.sort === s">✓</span>
                  </button>
                </template>
              </DPop>
            </div>
            <div class="field">
              <label class="lbl">Number stepper</label>
              <span class="stepper">
                <button class="btn icon" @click="f.num = Math.round((f.num - 0.1) * 10) / 10">−</button>
                <input v-model.number="f.num" class="input mono num" type="number" step="0.1" />
                <button class="btn icon" @click="f.num = Math.round((f.num + 0.1) * 10) / 10">+</button>
              </span>
            </div>
            <div class="field">
              <label class="lbl">Date range</label>
              <span class="row nowrap"><input v-model="f.from" class="input mono" type="date" /><span class="muted">→</span><input v-model="f.to" class="input mono" type="date" /></span>
              <span class="row"><button class="chip">7 days</button><button class="chip active">this month</button><button class="chip">this year</button></span>
            </div>
          </div>
          <div class="panel card form">
            <div class="field">
              <span class="lbl">Checkbox</span>
              <label class="check"><input v-model="f.check" type="checkbox" /> Show timestamps</label>
              <label class="check"><input v-model="f.check2" type="checkbox" /> Hide restricted chapters</label>
            </div>
            <div class="field">
              <span class="lbl">Radio</span>
              <label v-for="r in ['all', 'games only', 'chatting only']" :key="r" class="check"><input v-model="f.radio" type="radio" :value="r" /> {{ r }}</label>
            </div>
            <div class="field">
              <span class="lbl">Switch</span>
              <label class="check"><button class="switch" :class="{ on: f.sw }" role="switch" :aria-checked="f.sw" @click="f.sw = !f.sw"></button> Autoplay next part</label>
              <label class="check"><button class="switch" :class="{ on: f.sw2 }" role="switch" :aria-checked="f.sw2" @click="f.sw2 = !f.sw2"></button> Theater by default</label>
            </div>
            <div class="field">
              <label class="lbl">Slider <span class="mono muted">{{ f.slider }}</span></label>
              <input v-model.number="f.slider" class="slider" type="range" min="0" max="100" />
            </div>
            <div class="field">
              <label class="lbl">Textarea</label>
              <textarea v-model="f.text" class="input" rows="3" placeholder="Command body…"></textarea>
              <span class="help muted mono">{{ f.text.length }}/500</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Navigation -->
      <section>
        <h2 class="eyebrow">Navigation</h2>
        <div class="panel card">
          <div class="tabs">
            <button v-for="tb in ['Overview', 'Modules', 'Commands', 'Logs']" :key="tb" :class="{ on: f.tab === tb }" @click="f.tab = tb">{{ tb }}</button>
          </div>
          <div class="row">
            <div class="segctl">
              <button v-for="s in ['grid', 'list', 'compact']" :key="s" :class="{ on: f.seg === s }" @click="f.seg = s">{{ s }}</button>
            </div>
            <nav class="crumbs mono"><a href="#">channels</a><span>/</span><a href="#">vexoulz</a><span>/</span><span class="here">admin</span></nav>
          </div>
          <div class="row">
            <span class="pager">
              <button class="btn sm icon" :disabled="f.page === 1" @click="f.page--">‹</button>
              <button v-for="p in [1, 2, 3, 4, 5]" :key="p" class="btn sm icon mono" :class="{ on: f.page === p }" @click="f.page = p">{{ p }}</button>
              <span class="muted">…</span>
              <button class="btn sm icon mono" :class="{ on: f.page === 54 }" @click="f.page = 54">54</button>
              <button class="btn sm icon" @click="f.page++">›</button>
            </span>
            <button class="btn">Load 24 more</button>
          </div>
        </div>
      </section>

      <!-- Feedback -->
      <section>
        <h2 class="eyebrow">Feedback &amp; overlays</h2>
        <div class="grid2">
          <div class="panel card">
            <div class="row">
              <button class="btn" @click="modal = true">Open confirm dialog</button>
              <button class="btn" @click="say('Settings saved')">Show toast</button>
              <DPop width="220px">
                <template #trigger="{ toggle, open }"><button class="btn" :class="{ on: open }" @click="toggle">Menu<span class="caret">▾</span></button></template>
                <template #default="{ close }">
                  <div class="eyebrow menu-head">Actions</div>
                  <button class="menu-item" @click="close"><span class="mi-main">Edit</span><kbd class="mono">e</kbd></button>
                  <button class="menu-item" @click="close"><span class="mi-main">Duplicate</span></button>
                  <button class="menu-item" disabled><span class="mi-main">Publish</span><span class="mi-sub">needs mod</span></button>
                  <div class="menu-sep"></div>
                  <button class="menu-item bad" @click="close"><span class="mi-main">Delete</span></button>
                </template>
              </DPop>
              <span class="tip" data-tip="Tooltips: short, one line, never needed to use the page">hover me</span>
            </div>
            <div class="stack">
              <div class="callout info"><span>ℹ</span><div class="c-body"><b>Info.</b> Part 4 was re-uploaded; links still work.</div></div>
              <div class="callout ok"><span>✓</span><div class="c-body"><b>Saved.</b> Changes apply on the next message.</div></div>
              <div class="callout warn"><span>!</span><div class="c-body"><b>Heads up.</b> Backfill is 72% done; search may miss older chat.</div></div>
              <div class="callout error"><span>✕</span><div class="c-body"><b>Couldn't load chat.</b> <a href="#" class="accent-link">Retry</a></div></div>
            </div>
          </div>
          <div class="panel card">
            <div class="field">
              <span class="lbl">Progress <span class="mono muted">72%</span></span>
              <div class="progress"><span style="width: 72%"></span></div>
            </div>
            <div class="row"><span class="spinner"></span><span class="muted small">Loading chat…</span></div>
            <div class="skel-card">
              <div class="skel" style="aspect-ratio: 16 / 9"></div>
              <div class="skel" style="height: 12px; width: 80%"></div>
              <div class="skel" style="height: 10px; width: 45%"></div>
            </div>
          </div>
        </div>
        <div class="grid2">
          <div class="panel card empty">
            <Ph label="empty art" :w="72" :h="72" round />
            <b>No vods match "speedrun"</b>
            <span class="muted small">Try another word, or clear the game filter.</span>
            <button class="btn sm">Clear filters</button>
          </div>
          <div class="panel card empty">
            <div class="big mono h-display">404</div>
            <b>This page drifted off.</b>
            <span class="muted small">It may have moved, or the VOD was removed.</span>
            <span class="row" style="justify-content: center"><button class="btn sm primary">Go home</button><button class="btn sm">Report</button></span>
          </div>
        </div>
      </section>

      <!-- Content -->
      <section>
        <h2 class="eyebrow">Content</h2>
        <div class="grid2">
          <div class="panel card">
            <div class="row">
              <span class="chip">default</span><span class="chip accent">accent</span><span class="chip on">on</span><span class="chip off">off</span>
              <span class="chip active">active</span><span class="chip live">LIVE</span>
            </div>
            <div class="row">
              <span class="status"><span class="sdot live"></span>live</span>
              <span class="status"><span class="sdot ok"></span>joined</span>
              <span class="status"><span class="sdot"></span>offline</span>
              <span class="status"><span class="sdot warn"></span>degraded</span>
            </div>
            <div class="row">
              <Ph label="pfp" :w="20" :h="20" round />
              <Ph label="pfp" :w="32" :h="32" round />
              <Ph label="pfp" :w="44" :h="44" round />
              <span class="liveav"><Ph label="pfp" :w="44" :h="44" round /><span class="tag">LIVE</span></span>
              <span class="avgroup"><Ph v-for="i in 4" :key="i" label="" :w="26" :h="26" round /><span class="more mono">+12</span></span>
            </div>
            <div class="row"><span>Press <kbd class="mono">y</kbd> to copy, <kbd class="mono">shift</kbd>+<kbd class="mono">click</kbd> for ±1s</span></div>
            <dl class="kvlist">
              <dt>duration</dt><dd class="mono">27:00:00</dd>
              <dt>parts</dt><dd class="mono">9 · 2 unavailable</dd>
              <dt>chat lines</dt><dd class="mono">184,220</dd>
            </dl>
          </div>
          <div class="panel card">
            <table class="dtable">
              <thead>
                <tr>
                  <th class="sort" :class="{ asc: sortCol === 'title' }" @click="sortCol = 'title'">Title</th>
                  <th class="sort" :class="{ asc: sortCol === 'date' }" @click="sortCol = 'date'">Date</th>
                  <th class="sort" :class="{ asc: sortCol === 'dur' }" @click="sortCol = 'dur'">Length</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in rows" :key="r[0]"><td>{{ r[0] }}</td><td class="mono muted">{{ r[1] }}</td><td class="mono muted">{{ r[2] }}</td></tr>
              </tbody>
            </table>
            <a href="#" class="panel ring minicard" @click.prevent>
              <Ph label="16:9" :w="96" ratio="16 / 9" />
              <span><b>Card</b><br><span class="muted small">panel + ring hover, whole card is the link</span></span>
            </a>
          </div>
        </div>
      </section>
    </div>

    <Teleport defer to=".df.v4">
      <div class="df-site layer" data-site="root" :style="accentStyle">
        <div v-if="modal" class="scrim" @click.self="modal = false">
          <div class="panel pop dialog" role="dialog" aria-modal="true" aria-labelledby="dlg-t">
            <b id="dlg-t">Disable !deaths for everyone?</b>
            <p class="muted">Viewers get no reply until someone enables it again. Its history and variables are kept.</p>
            <div class="row end">
              <button class="btn ghost" @click="modal = false">Cancel</button>
              <button class="btn danger solid" @click="modal = false; say('!deaths disabled')">Disable</button>
            </div>
          </div>
        </div>
        <div v-if="toast" class="toast"><span class="ok">✓</span>{{ toast }}</div>
      </div>
    </Teleport>
  </DFChrome>
</template>

<style scoped>
.kit { display: flex; flex-direction: column; gap: 30px; }
.kit-top { display: flex; align-items: flex-end; gap: 12px; flex-wrap: wrap; }
.kit-top h1 { font-size: 30px; }
.spacer { flex: 1; }
section { display: flex; flex-direction: column; gap: 12px; }
.grid2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 14px; }
.grid3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; }
.card { padding: 16px; display: flex; flex-direction: column; gap: 12px; min-width: 0; }
.row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.row.nowrap { flex-wrap: nowrap; }
.row.nowrap .input { min-width: 0; flex: 1; }
.row.end { justify-content: flex-end; }
.small { font-size: 12px; }
.lab { width: 100%; }
p { margin: 0; }
.tok { display: inline-flex; align-items: center; padding: 0 10px; border: 1px dashed var(--muted); border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: 11px; color: var(--muted); }
.swatches { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 12px; }
.sw { display: flex; align-items: center; gap: 8px; font-size: 11px; }
.chipc { width: 18px; height: 18px; border-radius: 4px; border: 1px solid var(--line); flex: none; }
.rad { width: 44px; height: 28px; display: grid; place-items: center; border: 1px solid var(--muted); font-size: 11px; font-family: var(--font-mono); color: var(--muted); }

.segctl { display: inline-flex; height: var(--ctl); padding: 2px; gap: 2px; border: 1px solid var(--glass-line); border-radius: var(--radius-sm); background: var(--glass); }
.segctl button { display: inline-flex; align-items: center; gap: 6px; padding: 0 10px; border: none; border-radius: 3px; background: none; color: var(--muted); cursor: pointer; font-size: 13px; }
.segctl button.on { background: rgb(255 255 255 / 0.1); color: var(--ink); }
.dotmark { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
.btngroup { display: inline-flex; }
.btngroup .btn { border-radius: 0; margin-left: -1px; }
.btngroup .btn:first-child { border-radius: var(--radius-sm) 0 0 var(--radius-sm); margin-left: 0; }
.btngroup .btn:last-child { border-radius: 0 var(--radius-sm) var(--radius-sm) 0; }

.form { gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
.field > .input, .field > textarea, .input-icon { width: 100%; }
.lbl { font-size: 13px; font-weight: 600; }
.help, .err { font-size: 12px; }
.err { color: var(--bad); }
.input.invalid { border-color: var(--bad); }
.input-icon { position: relative; display: flex; }
.input-icon .input { width: 100%; padding-left: 30px; padding-right: 34px; }
.input-icon .ic { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--muted); pointer-events: none; }
.input-icon .clear { position: absolute; right: 3px; top: 3px; }
.card .btn.select { min-width: 180px; justify-content: space-between; }
.stepper { display: flex; gap: 4px; }
.num { width: 72px; text-align: center; -moz-appearance: textfield; }
.num::-webkit-inner-spin-button { display: none; }
input[type='date'] { color-scheme: dark; }
.check { display: flex; align-items: center; gap: 8px; font-size: 14px; cursor: pointer; }
.check input { accent-color: var(--accent); width: 15px; height: 15px; }
.slider { width: 100%; accent-color: var(--accent); }

.tabs { display: flex; gap: 2px; border-bottom: 1px solid var(--line); overflow-x: auto; scrollbar-width: none; }
.tabs button { height: var(--ctl); padding: 0 12px; background: none; border: none; color: var(--muted); cursor: pointer; font-size: 14px; white-space: nowrap; }
.tabs button:hover { color: var(--ink); }
.tabs button.on { color: var(--ink); box-shadow: inset 0 -2px 0 var(--accent); }
.crumbs { display: flex; gap: 8px; font-size: 12px; color: var(--muted); }
.crumbs .here { color: var(--ink); }
.pager { display: inline-flex; align-items: center; gap: 4px; }

.tip { position: relative; border-bottom: 1px dashed var(--muted); cursor: help; font-size: 13px; }
.tip:hover::after {
  content: attr(data-tip); position: absolute; left: 50%; bottom: calc(100% + 8px); transform: translateX(-50%); z-index: 20;
  width: max-content; max-width: 220px; padding: 5px 9px; border-radius: var(--radius-sm); background: rgb(12 12 16 / 0.96);
  border: 1px solid var(--line); font-size: 12px; line-height: 1.4; color: var(--ink);
}
.stack { display: flex; flex-direction: column; gap: 8px; }
.accent-link { color: var(--accent) !important; }
.progress { width: 100%; height: 6px; border-radius: 999px; background: var(--surface-2); overflow: hidden; }
.progress span { display: block; height: 100%; background: var(--accent); }
.skel-card { display: flex; flex-direction: column; gap: 8px; max-width: 260px; }
.empty { align-items: center; text-align: center; gap: 8px; padding: 28px 16px; }
.big { font-size: 48px; line-height: 1; }

.status { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; }
.sdot { width: 8px; height: 8px; border-radius: 50%; background: var(--muted); }
.sdot.live { background: var(--bad); box-shadow: 0 0 0 3px color-mix(in srgb, var(--bad) 30%, transparent); }
.sdot.ok { background: var(--ok); }
.sdot.warn { background: #e8c35a; }
.liveav { position: relative; display: inline-block; border-radius: 50%; box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--bad); }
.liveav .tag { position: absolute; left: 50%; bottom: -8px; transform: translateX(-50%); background: var(--bad); color: #fff; font-size: 9px; font-weight: 700; padding: 0 4px; border-radius: 3px; }
.avgroup { display: inline-flex; align-items: center; }
.avgroup > * { margin-left: -8px; box-shadow: 0 0 0 2px var(--bg); background-color: var(--surface-2); }
.avgroup > :first-child { margin-left: 0; }
.avgroup .more { font-size: 11px; color: var(--muted); padding-left: 12px; box-shadow: none; background: none; }
kbd { font-size: 11px; border: 1px solid var(--line); border-bottom-width: 2px; border-radius: 4px; padding: 0 5px; }
.kvlist { display: grid; grid-template-columns: auto 1fr; gap: 4px 16px; margin: 0; font-size: 13px; }
.kvlist dt { color: var(--muted); }
.kvlist dd { margin: 0; }
.minicard { display: flex; gap: 12px; align-items: center; padding: 10px; }
.minicard:hover { color: inherit; }
.bad .mi-main { color: var(--bad); }

/* Overlay layer, teleported so it covers the viewport like it would on the real site */
.layer { position: fixed; inset: 0; z-index: 60; pointer-events: none; background: none; }
.layer > .scrim { position: absolute; inset: 0; display: grid; place-items: center; padding: 16px; background: rgb(0 0 0 / 0.6); pointer-events: auto; }
.dialog { width: min(400px, 100%); padding: 18px; display: flex; flex-direction: column; gap: 10px; font-size: 14px; }
.layer > .toast { position: absolute; bottom: 24px; }
</style>
