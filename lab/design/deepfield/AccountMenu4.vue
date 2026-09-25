<script setup>
// v4 account control: always exactly one control-height (--ctl) tall, signed in or out, so the header never
// changes size. Signed out it is a normal panel-styled button (icon-only on phones); signed in, a --ctl avatar.
import { inject } from 'vue'
import Ph from '../Ph.vue'
import DPop from './DPop.vue'
import { twitchColor } from './data.js'

defineProps({ site: { type: String, required: true } })
const opts = inject('dfOpts')
</script>

<template>
  <button v-if="!opts.signedIn" class="btn signin" title="Sign in with Twitch" @click="opts.signedIn = true">
    <Ph label="tw" :w="16" :h="16" /><span class="lbl">Sign in</span>
  </button>
  <DPop v-else align="right" width="270px">
    <template #trigger="{ toggle, open }">
      <button class="me ring" :aria-expanded="open" title="Account" @click="toggle">
        <Ph label="pfp" w="100%" h="100%" round />
      </button>
    </template>
    <template #default="{ close }">
      <div class="who">
        <Ph label="pfp" :w="36" :h="36" round />
        <div>
          <div class="name" :style="{ color: twitchColor('vexoulz', 'readable') }">vexoulz</div>
          <div class="muted small mono">signed in on all *.vexoulz.net</div>
        </div>
      </div>
      <div class="eyebrow sec">vods</div>
      <button class="menu-item" @click="close"><span class="mi-main">Watch history</span><span class="mi-sub">resume 1:02:44</span></button>
      <div class="eyebrow sec">dtp</div>
      <button class="menu-item" @click="close"><span class="mi-main">My commands</span></button>
      <button class="menu-item" @click="close"><span class="mi-main">Channel admin</span><span class="chip accent-dtp">broadcaster</span></button>
      <div class="menu-sep"></div>
      <button class="menu-item" @click="close"><span class="mi-main">Settings</span></button>
      <button class="menu-item bad" @click="opts.signedIn = false"><span class="mi-main">Sign out everywhere</span></button>
    </template>
  </DPop>
</template>

<style scoped>
.signin :deep(.ph) { border-radius: 3px; }
.me {
  width: var(--ctl); height: var(--ctl); flex: none; background: none; border: none; padding: 0; border-radius: 50%;
  cursor: pointer; display: block;
}
.who { display: flex; gap: 10px; align-items: center; padding: 6px 8px 8px; border-bottom: 1px solid var(--line); margin-bottom: 4px; }
.name { font-weight: 700; }
.small { font-size: 11px; }
.sec { padding: 6px 8px 2px; }
.chip { color: var(--accent-dtp); }
.bad .mi-main { color: var(--bad); }
@container frame (max-width: 700px) {
  .signin { width: var(--ctl); padding: 0; }
  .signin .lbl { display: none; }
}
</style>
