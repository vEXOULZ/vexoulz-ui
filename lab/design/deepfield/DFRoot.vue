<script setup>
import { inject } from 'vue'
import DFChrome from './DFChrome.vue'
import Ph from '../Ph.vue'
import Posters from './Posters.vue'

const opts = inject('dfOpts')

const groups = [
  { title: 'Stream', links: [
    { name: 'Twitch', handle: 'ttv/vexoulz' },
    { name: 'Vods', handle: 'vods.vexoulz.net', site: 'vods' },
    { name: 'TikTok', handle: 'tiktok/@vexoulz' },
    { name: 'YouTube', handle: 'yt/@vexoulz' },
  ] },
  { title: 'Dev', links: [
    { name: 'GitHub', handle: 'github/vEXOULZ' },
    { name: 'DTP bot', handle: 'dtp.vexoulz.net', site: 'dtp' },
  ] },
  { title: 'Socials', links: [
    { name: 'Bluesky', handle: '@vexoulz.net' },
    { name: 'Discord', handle: 'vEXcord server' },
    { name: 'Steam', handle: 'steam/vexoulz' },
  ] },
  { title: 'Money', links: [
    { name: 'Merch shop', handle: 'shop.vexoulz.net' },
    { name: 'Throne', handle: 'throne/vexoulz' },
  ] },
]
</script>

<template>
  <DFChrome site="root">
    <div class="root">
      <section class="intro">
        <Ph label="logo 213×75" :w="213" :h="75" />
        <h1 class="h-display">Did you nose?</h1>
        <p class="muted">Vexoulz is not real. You are not real. No one is real.<br>The only thing that's real is my love for yo momma.</p>

        <a v-if="opts.live" href="#" class="live-card panel">
          <div class="live-thumb">
            <Ph label="live preview" ratio="16 / 9" />
            <span class="chip live">LIVE</span>
          </div>
          <div class="live-info">
            <div class="live-title">doom eternal nightmare any% attempts until i cry</div>
            <div class="live-meta">
              <Posters :games="['DOOM Eternal']" :mode="opts.posters === 'chips' ? 'stack' : opts.posters" :size="22" />
              <span class="mono muted">DOOM Eternal · 1:02:44 · 213 watching</span>
            </div>
          </div>
        </a>
        <div v-else class="offline panel">
          <span class="dot"></span>
          <span><b>Offline</b> <span class="muted mono">· next stream Fri 20:00</span></span>
        </div>
      </section>

      <section class="groups">
        <div v-for="g in groups" :key="g.title" class="group">
          <div class="eyebrow">{{ g.title }}</div>
          <a v-for="l in g.links" :key="l.name" href="#" class="link" :class="l.site ? 'accent-' + l.site : ''">
            <span class="icon ring"><Ph :label="l.name.slice(0, 2).toLowerCase()" :w="40" :h="40" /></span>
            <span class="text">
              <span class="name">{{ l.name }}</span>
              <span class="handle">{{ l.handle }}</span>
            </span>
            <span class="arrow">→</span>
          </a>
        </div>
      </section>
    </div>
  </DFChrome>
</template>

<style scoped>
.root { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr); gap: 40px; align-items: start; }
.intro { display: flex; flex-direction: column; gap: 14px; align-items: flex-start; }
.intro h1 { font-size: 34px; margin-top: 8px; }
.offline { display: flex; align-items: center; gap: 10px; padding: 8px 14px; font-size: 13px; }
.dot { width: 8px; height: 8px; border-radius: 50%; background: var(--muted); }
.live-card { display: flex; flex-direction: column; overflow: hidden; width: 100%; max-width: 360px; }
.live-card:hover { border-color: var(--bad); color: inherit; }
.live-thumb { position: relative; }
.live-thumb :deep(.ph) { border: none; border-radius: 0; }
.live-thumb .chip { position: absolute; left: 8px; top: 8px; }
.live-info { padding: 10px 12px; display: flex; flex-direction: column; gap: 6px; }
.live-title { font-weight: 600; line-height: 1.3; }
.live-meta { display: flex; align-items: center; gap: 10px; font-size: 12px; }
.groups { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 26px 24px; }
.group { display: flex; flex-direction: column; gap: 6px; }
.group .eyebrow { margin-bottom: 4px; }
.link { display: flex; align-items: center; gap: 12px; padding: 6px 8px; margin: 0 -8px; border-radius: var(--radius); }
.link:hover { background: rgb(170 170 170 / 0.09); }
.icon { border-radius: var(--radius-sm); display: block; }
.link .text { display: flex; flex-direction: column; min-width: 0; flex: 1; line-height: 1.3; }
.link .name { color: var(--ink); font-weight: 600; }
.link .handle { font-size: 12px; color: var(--muted); font-family: var(--font-mono); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.link.accent-vods .handle { color: var(--accent-vods); }
.link.accent-dtp .handle { color: var(--accent-dtp); }
.arrow { color: var(--muted); opacity: 0; transition: opacity 0.15s; font-family: var(--font-mono); }
.link:hover .arrow { opacity: 1; }
@container frame (max-width: 700px) {
  .root { grid-template-columns: 1fr; gap: 28px; }
  .intro { align-items: center; text-align: center; }
  .groups { grid-template-columns: 1fr; }
}
</style>
