<script setup>
// dtp "explain" report, from doomtp-bot's _explain.html: what a line of chat would do, before it runs.
import { ref } from 'vue'
import DFChrome from './DFChrome.vue'

const expr = ref('!random 1-100 | echo {user} rolled {1} | set lastroll {1}')
const ctx = [['channel', '#vexoulz'], ['as', 'mod_person'], ['role', 'moderator'], ['live', 'yes']]
const ast = `pipe
├─ call random   args: "1-100"
├─ call echo     args: "{user} rolled {1}"
│    placeholders: {user} ← caller, {1} ← stage 1 output
└─ call set      args: "lastroll {1}"
     placeholders: {1} ← stage 1 output`
const calls = [
  { n: 1, cmd: 'random', from: 'core', needs: 'everyone', ok: true, cd: '3s', input: '1-100', ph: '—' },
  { n: 2, cmd: 'echo', from: 'core', needs: 'everyone', ok: true, cd: '—', input: 'stage 1', ph: '{user} {1}' },
  { n: 3, cmd: 'set', from: 'variables', needs: 'moderator', ok: true, cd: '—', input: 'stage 2', ph: '{1}' },
]
const writes = [{ name: 'lastroll', scope: 'channel', before: '42', after: '{1} (1–100)' }]
const showError = ref(false)
</script>

<template>
  <DFChrome site="dtp" sub="dtp" :nav="['Features', 'Commands', 'Language', 'API']">
    <div class="eyebrow">explain</div>
    <h1 class="h-display">What would this do?</h1>

    <div class="field">
      <label class="lbl" for="expr">Chat line</label>
      <div class="expr-row">
        <input id="expr" v-model="expr" class="input mono" spellcheck="false" />
        <button class="btn primary">Explain</button>
      </div>
      <div class="help muted">Nothing runs. Cooldowns, permissions and variable writes are simulated.</div>
    </div>
    <div class="pills">
      <span v-for="[k, v] in ctx" :key="k" class="chip"><span class="k">{{ k }}</span>{{ v }}</span>
      <button class="chip edit" @click="showError = !showError">{{ showError ? 'hide' : 'show' }} parse error example</button>
    </div>

    <div v-if="showError" class="callout error">
      <span>✕</span>
      <div class="c-body">
        <b>Parse error at column 18</b>
        <pre class="code err"><span>!random 1-100 | | echo</span>
<span class="caret">                 ^ expected a command after "|"</span></pre>
      </div>
    </div>

    <h2 class="sec eyebrow">Parsed as</h2>
    <pre class="code">{{ ast }}</pre>

    <h2 class="sec eyebrow">Commands</h2>
    <div class="panel table-wrap">
      <table class="dtable">
        <thead><tr><th>#</th><th>Command</th><th>From</th><th>Needs</th><th>Allowed</th><th>Cooldown</th><th>Input</th><th>Placeholders</th></tr></thead>
        <tbody>
          <tr v-for="c in calls" :key="c.n">
            <td class="mono muted">{{ c.n }}</td>
            <td><code><span class="tok-prefix">!</span>{{ c.cmd }}</code></td>
            <td class="muted">{{ c.from }}</td>
            <td><span class="chip" :class="{ accent: c.needs !== 'everyone' }">{{ c.needs }}</span></td>
            <td><span class="chip" :class="c.ok ? 'on' : 'off'">{{ c.ok ? 'yes' : 'no' }}</span></td>
            <td class="mono muted">{{ c.cd }}</td>
            <td class="mono muted">{{ c.input }}</td>
            <td class="mono"><span class="tok-ph">{{ c.ph }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2 class="sec eyebrow">Variable writes</h2>
    <div class="panel table-wrap">
      <table class="dtable">
        <thead><tr><th>Variable</th><th>Scope</th><th>Before</th><th>After</th></tr></thead>
        <tbody>
          <tr v-for="w in writes" :key="w.name">
            <td class="mono">{{ w.name }}</td>
            <td><span class="chip">{{ w.scope }}</span></td>
            <td class="mono muted">{{ w.before }}</td>
            <td class="mono"><span class="tok-str">{{ w.after }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </DFChrome>
</template>

<style scoped>
h1 { font-size: 28px; margin: 4px 0 18px; }
.field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
.lbl { font-size: 13px; font-weight: 600; }
.expr-row { display: flex; gap: 8px; }
.expr-row .input { flex: 1; }
.help { font-size: 12px; }
.pills { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
.pills .k { color: var(--muted); margin-right: 2px; }
.pills .k::after { content: ':'; }
.edit { cursor: pointer; background: none; border-style: dashed; }
.err { margin-top: 6px; }
.caret { color: var(--bad); }
.sec { margin: 24px 0 8px; }
</style>
