<script setup>
import SiteChrome from './SiteChrome.vue'
import Ph from './Ph.vue'

const vods = [
  { title: 'doom eternal nightmare any% attempts until i cry', date: 'Sep 21', dur: '5:12:40', games: ['DOOM Eternal'] },
  { title: 'just chatting + reacting to your terrible clips', date: 'Sep 19', dur: '3:04:11', games: ['Just Chatting'] },
  { title: 'first time hollow knight?? (blind)', date: 'Sep 17', dur: '6:48:02', games: ['Hollow Knight', 'Just Chatting'] },
  { title: 'subathon day 3 — the bot is sentient now', date: 'Sep 14', dur: '11:20:55', games: ['Just Chatting', 'Balatro'] },
  { title: 'balatro but every joker is cursed', date: 'Sep 12', dur: '4:02:19', games: ['Balatro'] },
  { title: 'community game night', date: 'Sep 10', dur: '2:55:30', games: ['Jackbox'] },
]
const chat = [
  ['doomguy_', 'KEKW'],
  ['viewer_one', 'no way he missed that'],
  ['mod_person', '!uptime'],
  ['dtp', 'stream has been live for 2h 14m'],
  ['lurker42', 'first time watching the vod hi'],
  ['doomguy_', 'the bot is sentient now'],
  ['someone', 'clip it'],
]
</script>

<template>
  <SiteChrome site="vods" sub="vods" :nav="['Vods', 'Games', 'Live']">
    <template #actions>
      <input class="input search" placeholder="Search vods…" />
    </template>

    <div class="bar">
      <h1 class="h-display">Past broadcasts</h1>
      <div class="filters">
        <span class="chip active">All</span>
        <span class="chip">Just Chatting</span>
        <span class="chip">DOOM Eternal</span>
        <span class="chip">Balatro</span>
        <span class="chip">Hollow Knight</span>
      </div>
    </div>

    <div class="grid">
      <a v-for="v in vods" :key="v.title" href="#" class="card">
        <div class="thumb">
          <Ph label="thumbnail 16:9" ratio="16 / 9" />
          <span class="dur">{{ v.dur }}</span>
        </div>
        <div class="title">{{ v.title }}</div>
        <div class="meta">
          <span>{{ v.date }}</span>
          <span v-for="g in v.games" :key="g" class="chip">{{ g }}</span>
        </div>
      </a>
    </div>

    <div class="eyebrow section">Watch page</div>
    <div class="watch">
      <div class="player">
        <Ph label="video player" ratio="16 / 9" />
        <div class="controls panel">
          <button class="btn primary">▶</button>
          <div class="track">
            <span class="fill"></span>
            <span class="mark" style="left: 22%"></span>
            <span class="mark" style="left: 61%"></span>
          </div>
          <span class="muted time">1:02:44 / 5:12:40</span>
          <button class="btn">Chapters</button>
        </div>
        <div class="now">
          <Ph label="box art" :w="38" :h="50" />
          <div>
            <div class="title">doom eternal nightmare any% attempts until i cry</div>
            <div class="muted small">Chapter 2 · DOOM Eternal · started 0:48:10</div>
          </div>
        </div>
      </div>
      <aside class="chat panel">
        <div class="chat-head eyebrow">Chat replay</div>
        <div class="lines">
          <div v-for="(c, i) in chat" :key="i" class="line">
            <span class="who" :class="{ bot: c[0] === 'dtp' }">{{ c[0] }}</span>
            <span>{{ c[1] }}</span>
          </div>
        </div>
      </aside>
    </div>
  </SiteChrome>
</template>

<style scoped>
.search { width: 220px; }
.bar { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
.bar h1 { font-size: 28px; }
.filters { display: flex; gap: 6px; flex-wrap: wrap; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 22px 18px; }
.card { display: flex; flex-direction: column; gap: 8px; }
.thumb { position: relative; }
.thumb :deep(.ph) { border-radius: var(--radius); }
.card:hover .thumb :deep(.ph) { outline: 2px solid var(--accent); outline-offset: 2px; }
.dur {
  position: absolute; right: 6px; bottom: 6px; font-family: var(--font-mono); font-size: 11px;
  padding: 1px 6px; border-radius: var(--radius-sm); background: rgb(0 0 0 / 0.75); color: #fff;
}
.title { color: var(--ink); font-weight: 600; line-height: 1.35; }
.meta { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; font-size: 12px; color: var(--muted); }
.section { margin: 40px 0 12px; }
.watch { display: grid; grid-template-columns: minmax(0, 1fr) 280px; gap: 16px; }
.player { display: flex; flex-direction: column; gap: 10px; }
.controls { display: flex; align-items: center; gap: 12px; padding: 8px 10px; }
.track { flex: 1; height: 4px; background: var(--line); border-radius: 2px; position: relative; }
.track .fill { position: absolute; inset: 0 80% 0 0; background: var(--accent); border-radius: 2px; }
.track .mark { position: absolute; top: -3px; width: 2px; height: 10px; background: var(--muted); }
.time { font-family: var(--font-mono); font-size: 12px; white-space: nowrap; }
.now { display: flex; gap: 12px; align-items: center; }
.small { font-size: 13px; }
.chat { display: flex; flex-direction: column; min-height: 0; }
.chat-head { padding: 10px 14px; border-bottom: var(--bw) solid var(--line); }
.lines { padding: 10px 14px; display: flex; flex-direction: column; gap: 6px; font-size: 13px; line-height: 1.4; }
.who { font-weight: 700; margin-right: 6px; color: var(--accent); }
.who::after { content: ':'; color: var(--muted); }
.who.bot { color: var(--accent-dtp); }
@container frame (max-width: 700px) {
  .search { width: 100%; }
  .watch { grid-template-columns: 1fr; }
  .controls .btn:last-child { display: none; }
}
</style>
