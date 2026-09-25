<script setup>
// "Which vexoulz site am I on / take me to another one" menu, used in the footer and optionally the header brand.
import { onMounted, onUnmounted, ref } from 'vue'
import Ph from '../Ph.vue'
import Lockup from './Lockup.vue'

const props = defineProps({
  current: { type: String, required: true },
  up: { type: Boolean, default: false }, // open above the button (footer)
  brand: { type: Boolean, default: false }, // render as the header brand lockup
  sub: { type: String, default: '' },
  // v3: 'dot' = vods.vexoulz, 'dotnet' = vods.vexoulz.net, header and footer rendered the same way; unset = v2 look
  format: { type: String, default: null },
})

const sites = [
  { id: 'root', host: 'vexoulz.net', what: 'links, socials, stream status' },
  { id: 'vods', host: 'vods.vexoulz.net', what: 'past broadcasts + chat replay' },
  { id: 'dtp', host: 'dtp.vexoulz.net', what: 'chat bot, commands, docs' },
  { id: 'shop', host: 'shop.vexoulz.net', what: 'merch', external: true },
]

const open = ref(false)
const el = ref(null)
const close = (e) => {
  if (el.value && !el.value.contains(e.target)) open.value = false
}
onMounted(() => document.addEventListener('pointerdown', close))
onUnmounted(() => document.removeEventListener('pointerdown', close))
const hostOf = (id) => sites.find((s) => s.id === id)?.host
</script>

<template>
  <div ref="el" class="switcher" :class="{ up }">
    <button v-if="format" class="trigger lockup-trigger" :class="{ big: brand }" :aria-expanded="open" @click="open = !open">
      <Ph v-if="brand" label="mark" :w="22" :h="22" />
      <Lockup :site="current" :net="format === 'dotnet'" />
      <span class="caret">{{ up ? '▴' : '▾' }}</span>
    </button>
    <button v-else-if="brand" class="trigger brand-trigger df-brand" :aria-expanded="open" @click="open = !open">
      <Ph label="mark" :w="22" :h="22" />
      <span>vexoulz</span>
      <template v-if="sub"><span class="slash">/</span><span class="sub">{{ sub }}</span></template>
      <span class="caret">▾</span>
    </button>
    <button v-else class="trigger pill" :aria-expanded="open" @click="open = !open">
      <span class="dotmark" :class="'accent-' + current"></span>
      <span :class="'accent-' + current">{{ hostOf(current) }}</span>
      <span class="caret">{{ up ? '▴' : '▾' }}</span>
    </button>

    <div v-if="open" class="menu panel pop" role="menu">
      <div class="eyebrow head">vexoulz network</div>
      <a
        v-for="s in sites"
        :key="s.id"
        href="#"
        class="item"
        :class="{ cur: s.id === current }"
        role="menuitem"
        @click.prevent="open = false"
      >
        <span class="dotmark" :class="'accent-' + s.id"></span>
        <span class="text">
          <span v-if="format" class="host"><Lockup :site="s.id" net /><span v-if="s.external" class="muted"> ↗</span></span>
          <span v-else class="host" :class="'accent-' + s.id">{{ s.host }}<span v-if="s.external" class="muted"> ↗</span></span>
          <span class="what">{{ s.what }}</span>
        </span>
        <span v-if="s.id === current" class="here mono">here</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.switcher { position: relative; display: inline-block; }
.trigger { background: none; border: none; color: inherit; cursor: pointer; font: inherit; padding: 0; }
.pill {
  display: inline-flex; align-items: center; gap: 7px; padding: 3px 10px; border-radius: 999px;
  border: 1px solid var(--line); font-family: var(--font-mono); font-size: 12px;
}
.pill:hover { border-color: var(--accent); }
.brand-trigger { display: flex; align-items: center; gap: 10px; }
.lockup-trigger {
  display: inline-flex; align-items: center; gap: 8px; padding: 3px 10px 3px 8px; border-radius: var(--radius-sm);
  border: 1px solid transparent; font-size: 12px; transition: border-color 0.15s, background 0.15s;
}
.lockup-trigger.big { font-size: 15px; padding: 4px 10px 4px 6px; }
.lockup-trigger:hover, .lockup-trigger[aria-expanded='true'] { border-color: var(--line); background: rgb(170 170 170 / 0.07); }
.caret { color: var(--muted); font-size: 10px; }
.dotmark { width: 7px; height: 7px; border-radius: 50%; background: currentColor; flex: none; }
.accent-shop { color: var(--muted); }

.menu {
  position: absolute; left: 0; top: calc(100% + 8px); z-index: 30; min-width: 280px; padding: 6px; text-align: left;
  display: flex; flex-direction: column; gap: 2px; box-shadow: 0 16px 40px rgb(0 0 0 / 0.6);
}
.up .menu { top: auto; bottom: calc(100% + 8px); }
.head { padding: 4px 8px 6px; }
.item { display: flex; align-items: center; gap: 10px; padding: 7px 8px; border-radius: var(--radius-sm); }
.item:hover { background: rgb(170 170 170 / 0.1); }
.item.cur { background: rgb(170 170 170 / 0.07); }
.text { display: flex; flex-direction: column; line-height: 1.3; flex: 1; min-width: 0; }
.host { font-family: var(--font-mono); font-size: 13px; }
.what { font-size: 12px; color: var(--muted); }
.here { font-size: 10px; color: var(--muted); border: 1px solid var(--line); border-radius: 999px; padding: 0 6px; }
</style>
