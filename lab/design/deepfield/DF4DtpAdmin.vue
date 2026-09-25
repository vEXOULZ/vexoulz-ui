<script setup>
// dtp channel admin, rebuilt from doomtp-bot's admin_channel.html with the shared kit: status pills, a ban
// callout, module switches, published commands and timers as tables, tabs for sections.
import { reactive, ref } from 'vue'
import DFChrome from './DFChrome.vue'
import DPop from './DPop.vue'

const tab = ref('Overview')
const tabs = ['Overview', 'Modules', 'Commands', 'Triggers & timers', 'Logs']
const status = [
  ['sign', '!', ''], ['tier', 'owner', 'accent'], ['joined', 'yes', 'on'], ['logging', 'on', 'on'],
  ['backfill', '72%', ''], ['error replies', 'off', 'off'], ['edit notices', 'on', 'on'], ['reply hold', '1.5s', ''], ['automod', 'on', 'on'],
]
const modules = reactive([
  { name: 'core', what: 'ping, uptime, help', on: true, locked: true },
  { name: 'custom commands', what: 'cc add / edit / remove', on: true },
  { name: 'variables', what: 'per-channel and per-user values', on: true },
  { name: 'random', what: 'random, pick, roll', on: true },
  { name: 'quotes', what: 'quote add / get', on: false },
  { name: 'timers', what: 'posts on an interval while live', on: true },
])
const published = reactive([
  { name: 'hi', by: 'mod_person', ver: 3, on: true },
  { name: 'deaths', by: 'vexoulz', ver: 12, on: true },
  { name: 'lurk', by: 'starchart', ver: 1, on: false },
  { name: 'so', by: 'mod_person', ver: 5, on: true },
])
const timers = reactive([
  { name: 'discord', kind: 'timer', when: 'every 20m · 15 msgs', last: '4m ago', on: true },
  { name: 'hydrate', kind: 'timer', when: 'every 45m', last: '31m ago', on: true },
  { name: 'first', kind: 'trigger', when: 'first message of stream', last: 'Sep 21', on: true },
  { name: 'raid-thanks', kind: 'trigger', when: 'on raid', last: 'Sep 14', on: false },
])
const banned = ref(true)
</script>

<template>
  <DFChrome site="dtp" sub="dtp" :nav="['Features', 'Commands', 'Language', 'API']">
    <nav class="crumbs mono"><a href="#">channels</a><span>/</span><a href="#">vexoulz</a><span>/</span><span class="here">admin</span></nav>
    <div class="top">
      <h1 class="h-display">#vexoulz</h1>
      <span class="spacer"></span>
      <button class="btn">View public page ↗</button>
      <DPop align="right" width="220px">
        <template #trigger="{ toggle, open }"><button class="btn icon" :class="{ on: open }" title="More" @click="toggle">⋯</button></template>
        <template #default="{ close }">
          <button class="menu-item" @click="close"><span class="mi-main">Export settings</span></button>
          <button class="menu-item" @click="close"><span class="mi-main">Re-run backfill</span></button>
          <div class="menu-sep"></div>
          <button class="menu-item bad" @click="close"><span class="mi-main">Part channel…</span></button>
        </template>
      </DPop>
    </div>
    <div class="pills">
      <span v-for="[k, v, c] in status" :key="k" class="chip" :class="c"><span class="k">{{ k }}</span>{{ v }}</span>
    </div>

    <div v-if="banned" class="callout error">
      <span>⚠</span>
      <div class="c-body">
        <b>The bot is banned in this channel.</b>
        <div class="muted">Unban <code>dtp</code> in Twitch mod tools, then rejoin. Logging continues from the moment it's back.</div>
      </div>
      <button class="btn sm" @click="banned = false">Rejoin</button>
    </div>

    <div class="tabs" role="tablist">
      <button v-for="t in tabs" :key="t" role="tab" :aria-selected="tab === t" :class="{ on: tab === t }" @click="tab = t">{{ t }}</button>
    </div>

    <h2 class="sec eyebrow">Modules</h2>
    <div class="panel table-wrap">
      <table class="dtable">
        <thead><tr><th>Module</th><th>What it adds</th><th style="width: 1%"></th></tr></thead>
        <tbody>
          <tr v-for="m in modules" :key="m.name">
            <td class="mono">{{ m.name }}</td>
            <td class="muted">{{ m.what }}</td>
            <td>
              <button class="switch" :class="{ on: m.on }" role="switch" :aria-checked="m.on" :disabled="m.locked" :title="m.locked ? 'Always on' : ''" @click="m.on = !m.on"></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2 class="sec eyebrow">Published custom commands</h2>
    <div class="panel table-wrap">
      <table class="dtable">
        <thead><tr><th class="sort asc">Command</th><th>By</th><th>Version</th><th>State</th><th style="width: 1%"></th></tr></thead>
        <tbody>
          <tr v-for="c in published" :key="c.name">
            <td><code><span class="tok-prefix">!</span>{{ c.name }}</code></td>
            <td class="muted">{{ c.by }}</td>
            <td class="mono muted">v{{ c.ver }}</td>
            <td><span class="chip" :class="c.on ? 'on' : 'off'">{{ c.on ? 'enabled' : 'disabled' }}</span></td>
            <td><button class="btn sm" :class="{ danger: c.on }" @click="c.on = !c.on">{{ c.on ? 'Disable' : 'Enable' }}</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2 class="sec eyebrow">Triggers & timers</h2>
    <div class="panel table-wrap">
      <table class="dtable">
        <thead><tr><th>Name</th><th>Kind</th><th>When</th><th>Last fired</th><th style="width: 1%"></th></tr></thead>
        <tbody>
          <tr v-for="t in timers" :key="t.name">
            <td class="mono">{{ t.name }}</td>
            <td><span class="chip" :class="{ accent: t.kind === 'trigger' }">{{ t.kind }}</span></td>
            <td class="muted">{{ t.when }}</td>
            <td class="muted mono">{{ t.last }}</td>
            <td><button class="switch" :class="{ on: t.on }" role="switch" :aria-checked="t.on" @click="t.on = !t.on"></button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </DFChrome>
</template>

<style scoped>
.crumbs { display: flex; gap: 8px; font-size: 12px; color: var(--muted); margin-bottom: 6px; }
.crumbs .here { color: var(--ink); }
.top { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.top h1 { font-size: 28px; }
.spacer { flex: 1; }
.pills { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
.pills .k { color: var(--muted); margin-right: 2px; }
.pills .k::after { content: ':'; }
.callout { margin-bottom: 16px; align-items: center; }
.callout code { font-family: var(--font-mono); }
.tabs {
  display: flex; gap: 2px; border-bottom: 1px solid var(--line); margin-bottom: 8px; overflow-x: auto; scrollbar-width: none;
}
.tabs button {
  height: var(--ctl); padding: 0 12px; background: none; border: none; color: var(--muted); cursor: pointer; font-size: 14px;
  white-space: nowrap; box-shadow: inset 0 -2px 0 transparent;
}
.tabs button:hover { color: var(--ink); }
.tabs button.on { color: var(--ink); box-shadow: inset 0 -2px 0 var(--accent); }
.sec { margin: 24px 0 8px; }
.switch:disabled { opacity: 0.45; cursor: not-allowed; }
.bad .mi-main { color: var(--bad); }
</style>
