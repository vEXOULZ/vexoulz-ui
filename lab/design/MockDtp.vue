<script setup>
import SiteChrome from './SiteChrome.vue'

const commands = [
  { name: 'ping', role: 'everyone', cd: '5s', summary: 'Check the bot is alive.' },
  { name: 'random <min>-<max>', role: 'everyone', cd: '3s', summary: 'Roll a number in a range.' },
  { name: 'cc add <name> <body>', role: 'moderator', cd: '—', summary: 'Create a custom command from the pieces.' },
  { name: 'prefix <sign>', role: 'broadcaster', cd: '—', summary: 'Change the command sign for this channel.' },
  { name: 'uptime', role: 'everyone', cd: '10s', summary: 'How long the stream has been live.' },
]
const channels = [
  { login: 'vexoulz', sign: '!', tier: 'owner', on: true },
  { login: 'somefriend', sign: '?', tier: 'trusted', on: true },
  { login: 'oldchannel', sign: '!', tier: 'basic', on: false },
]
</script>

<template>
  <SiteChrome site="dtp" sub="dtp" :nav="['Features', 'Commands', 'Language', 'API']">
    <template #actions>
      <button class="btn">Sign in</button>
    </template>

    <div class="hero">
      <div>
        <div class="eyebrow">doomtp-bot · v0.x</div>
        <h1 class="h-display">A Twitch chat bot with a composable command language.</h1>
        <p class="muted lead">Commands pipe into each other, anyone can build new ones from the pieces, and every
          message is logged and searchable.</p>
      </div>
      <div class="panel try">
        <div class="eyebrow">Try it in chat</div>
        <pre class="code"><span class="tok-prefix">!</span><span class="tok-cmd">ping</span>
<span class="tok-prefix">!</span><span class="tok-cmd">random</span> 1-100 <span class="tok-op">|</span> <span class="tok-cmd">echo</span> you rolled <span class="tok-ph">{1}</span>!
<span class="tok-prefix">!</span><span class="tok-cmd">cc</span> add hi <span class="tok-str">"hello {user}"</span></pre>
      </div>
    </div>

    <h2 class="h-display sec">Commands</h2>
    <div class="filters">
      <input class="input" placeholder="Filter commands…" style="flex: 1" />
      <span class="chip active">All roles</span>
      <span class="chip">Moderator</span>
    </div>
    <div class="panel table">
      <div class="row head eyebrow"><span>Command</span><span>Role</span><span>Cooldown</span><span>Summary</span></div>
      <div v-for="c in commands" :key="c.name" class="row">
        <code class="cmd"><span class="tok-prefix">!</span>{{ c.name }}</code>
        <span><span class="chip" :class="{ accent: c.role !== 'everyone' }">{{ c.role }}</span></span>
        <span class="muted mono">{{ c.cd }}</span>
        <span class="muted">{{ c.summary }}</span>
      </div>
    </div>

    <h2 class="h-display sec">Channels</h2>
    <div class="chans">
      <a v-for="ch in channels" :key="ch.login" href="#" class="panel chan">
        <div class="chan-top">
          <b>#{{ ch.login }}</b>
          <span class="chip" :class="ch.on ? 'on' : 'off'">{{ ch.on ? 'joined' : 'parted' }}</span>
        </div>
        <div class="muted small">sign <code>{{ ch.sign }}</code> · {{ ch.tier }} tier</div>
      </a>
    </div>
  </SiteChrome>
</template>

<style scoped>
.hero { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: 28px; align-items: center; }
.hero h1 { font-size: 30px; margin: 8px 0 12px; }
.lead { max-width: 34rem; }
.try { padding: 14px; display: flex; flex-direction: column; gap: 10px; }
.sec { font-size: 22px; margin: 36px 0 14px; }
.filters { display: flex; gap: 8px; align-items: center; margin-bottom: 12px; flex-wrap: wrap; }
.table { overflow: hidden; }
.row {
  display: grid; grid-template-columns: minmax(12rem, 30%) 7.5rem 5.5rem minmax(0, 1fr);
  gap: 12px; padding: 9px 14px; border-bottom: 1px solid var(--line); align-items: baseline; font-size: 14px;
}
.row:last-child { border-bottom: none; }
.row:not(.head):hover { background: var(--surface-2); }
.row.head { font-size: 11px; background: var(--surface-2); }
.cmd { font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mono { font-family: var(--font-mono); font-size: 13px; }
.chans { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px; }
.chan { padding: 12px 14px; display: flex; flex-direction: column; gap: 4px; }
.chan:hover { border-color: var(--accent); }
.chan-top { display: flex; justify-content: space-between; align-items: center; gap: 8px; color: var(--ink); }
.small { font-size: 13px; }
@container frame (max-width: 700px) {
  .hero { grid-template-columns: 1fr; }
  .row { grid-template-columns: 1fr auto; }
  .row > :nth-child(3), .row > :nth-child(4), .row.head { display: none; }
}
</style>
