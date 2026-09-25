<script setup>
// One Twitch login shared by every *.vexoulz.net site: same button, same menu, everywhere.
import { inject, onMounted, onUnmounted, ref } from 'vue'
import Ph from '../Ph.vue'
import { twitchColor } from './data.js'

defineProps({ site: { type: String, required: true } })
const opts = inject('dfOpts')
const open = ref(false)
const el = ref(null)
const close = (e) => {
  if (el.value && !el.value.contains(e.target)) open.value = false
}
onMounted(() => document.addEventListener('pointerdown', close))
onUnmounted(() => document.removeEventListener('pointerdown', close))
</script>

<template>
  <div ref="el" class="account">
    <button v-if="!opts.signedIn" class="btn signin" @click="opts.signedIn = true">
      <Ph label="tw" :w="16" :h="16" /> Sign in with Twitch
    </button>
    <template v-else>
      <button class="me ring" :aria-expanded="open" @click="open = !open">
        <Ph label="pfp" :w="28" :h="28" round />
      </button>
      <div v-if="open" class="menu panel pop" role="menu">
        <div class="who">
          <Ph label="pfp" :w="36" :h="36" round />
          <div>
            <div class="name" :style="{ color: twitchColor('vexoulz', opts.chatColors || 'readable') }">vexoulz</div>
            <div class="muted small mono">signed in on all *.vexoulz.net</div>
          </div>
        </div>
        <div class="eyebrow sec">vods</div>
        <a href="#" class="item" @click.prevent>Watch history <span class="muted mono">continue 1:02:44</span></a>
        <div class="eyebrow sec">dtp</div>
        <a href="#" class="item" @click.prevent>My commands</a>
        <a href="#" class="item" @click.prevent>Channel admin <span class="chip accent-dtp">broadcaster</span></a>
        <div class="sep"></div>
        <a href="#" class="item" @click.prevent>Settings</a>
        <a href="#" class="item bad" @click.prevent="opts.signedIn = false; open = false">Sign out everywhere</a>
      </div>
    </template>
  </div>
</template>

<style scoped>
.account { position: relative; }
.signin { display: inline-flex; align-items: center; gap: 8px; }
.me { background: none; border: none; padding: 0; border-radius: 50%; cursor: pointer; display: block; }
.menu {
  position: absolute; right: 0; top: calc(100% + 8px); z-index: 30; width: 270px; padding: 6px;
  display: flex; flex-direction: column; box-shadow: 0 16px 40px rgb(0 0 0 / 0.6);
}
.who { display: flex; gap: 10px; align-items: center; padding: 6px 8px 8px; border-bottom: 1px solid var(--line); margin-bottom: 4px; }
.name { font-weight: 700; }
.small { font-size: 11px; }
.sec { padding: 6px 8px 2px; }
.item { display: flex; justify-content: space-between; align-items: center; gap: 8px; padding: 6px 8px; border-radius: var(--radius-sm); font-size: 14px; }
.item:hover { background: rgb(170 170 170 / 0.1); }
.item .mono { font-size: 11px; }
.item .chip { color: var(--accent-dtp); }
.item.bad { color: var(--bad); }
.sep { height: 1px; background: var(--line); margin: 4px 0; }
</style>
