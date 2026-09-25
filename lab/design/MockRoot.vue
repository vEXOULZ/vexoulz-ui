<script setup>
import SiteChrome from './SiteChrome.vue'
import Ph from './Ph.vue'

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
  <SiteChrome site="root">
    <div class="root">
      <section class="intro">
        <Ph label="logo 213×75" :w="213" :h="75" />
        <h1 class="h-display">Did you nose?</h1>
        <p class="muted">Vexoulz is not real. You are not real. No one is real.<br>The only thing that's real is my love for yo momma.</p>
        <div class="live panel">
          <span class="dot"></span>
          <span><b>Offline</b> <span class="muted">· next stream Fri 20:00</span></span>
        </div>
      </section>

      <section class="groups">
        <div v-for="g in groups" :key="g.title" class="group">
          <div class="eyebrow">{{ g.title }}</div>
          <a v-for="l in g.links" :key="l.name" href="#" class="link" :class="l.site ? 'accent-' + l.site : ''">
            <Ph :label="l.name.slice(0, 2).toLowerCase()" :w="40" :h="40" />
            <span class="text">
              <span class="name">{{ l.name }}</span>
              <span class="handle">{{ l.handle }}</span>
            </span>
            <span v-if="l.site" class="chip accent">subdomain</span>
            <span class="arrow">→</span>
          </a>
        </div>
      </section>
    </div>
  </SiteChrome>
</template>

<style scoped>
.root { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr); gap: 40px; align-items: start; }
.intro { display: flex; flex-direction: column; gap: 14px; align-items: flex-start; position: sticky; top: 0; }
.intro h1 { font-size: 34px; margin-top: 8px; }
.live { display: flex; align-items: center; gap: 10px; padding: 8px 14px; font-size: 13px; }
.dot { width: 8px; height: 8px; border-radius: 50%; background: var(--muted); }
.groups { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 26px 24px; }
.group { display: flex; flex-direction: column; gap: 6px; }
.group .eyebrow { margin-bottom: 4px; }
.link {
  display: flex; align-items: center; gap: 12px; padding: 6px 8px; margin: 0 -8px;
  border-radius: var(--radius); border: var(--bw) solid transparent;
}
.link:hover { background: var(--surface); border-color: var(--line); }
.link .text { display: flex; flex-direction: column; min-width: 0; flex: 1; line-height: 1.3; }
.link .name { color: var(--ink); font-weight: 600; }
.link .handle { font-size: 12px; color: var(--muted); font-family: var(--font-mono); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.link.accent-vods .handle { color: var(--accent-vods); }
.link.accent-dtp .handle { color: var(--accent-dtp); }
.link .chip { --accent: currentColor; }
.link.accent-vods .chip { --accent: var(--accent-vods); }
.link.accent-dtp .chip { --accent: var(--accent-dtp); }
.arrow { color: var(--muted); opacity: 0; transition: opacity 0.15s; }
.link:hover .arrow { opacity: 1; }
@container frame (max-width: 700px) {
  .root { grid-template-columns: 1fr; gap: 28px; }
  .intro { position: static; align-items: center; text-align: center; }
  .groups { grid-template-columns: 1fr; }
  .link .chip { display: none; }
}
</style>
