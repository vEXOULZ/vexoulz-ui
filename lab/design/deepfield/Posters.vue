<script setup>
// Twitch box-art posters (3:4, like the 40×53 ones the Archive uses) for the games in a VOD.
// stack: overlapping cards that spread on hover · fan: rotated cards · row: side by side
import { computed } from 'vue'
import Ph from '../Ph.vue'
import { gameColor } from './data.js'

const props = defineProps({
  games: { type: Array, required: true },
  mode: { type: String, default: 'stack' },
  size: { type: Number, default: 32 },
  max: { type: Number, default: 3 },
})

const shown = computed(() => props.games.slice(0, props.max))
const extra = computed(() => props.games.length - shown.value.length)
const initials = (g) => g.split(/\s+/).map((p) => p[0]).join('').slice(0, 3).toUpperCase()
</script>

<template>
  <div class="posters" :class="mode" :style="{ '--pw': size + 'px', '--n': shown.length }" :title="games.join(' · ')">
    <div
      v-for="(g, i) in shown"
      :key="g"
      class="poster ring"
      :style="{ zIndex: 10 - i, '--i': i, '--c': gameColor(g) }"
    >
      <Ph :label="initials(g)" ratio="3 / 4" />
    </div>
    <span v-if="extra > 0" class="more">+{{ extra }}</span>
  </div>
</template>

<style scoped>
.posters { display: inline-flex; align-items: flex-end; flex: none; }
.poster {
  width: var(--pw);
  aspect-ratio: 3 / 4;
  border-radius: 3px;
  overflow: hidden;
  background: color-mix(in srgb, var(--c) 30%, var(--surface-2));
  outline: 2px solid var(--bg);
  transition: margin 0.2s, transform 0.2s, filter 0.2s;
}
.poster :deep(.ph) { border-radius: 3px; font-size: 9px; height: 100%; color: var(--ink); border-color: color-mix(in srgb, var(--c) 60%, transparent); }

.stack .poster + .poster { margin-left: calc(var(--pw) * -0.62); filter: brightness(calc(1 - var(--i) * 0.22)); }
.stack .poster { transform: translateY(calc(var(--i) * -3px)); }
.stack:hover .poster + .poster { margin-left: 4px; filter: none; }
.stack:hover .poster { transform: none; }

.fan { padding: 0 calc(var(--pw) * 0.15); }
.fan .poster { transform-origin: 50% 110%; transform: rotate(calc((var(--i) - (var(--n) - 1) / 2) * 9deg)); }
.fan .poster + .poster { margin-left: calc(var(--pw) * -0.55); }
.fan .poster:nth-child(1) { z-index: 12 !important; }
.fan:hover .poster { transform: rotate(calc((var(--i) - (var(--n) - 1) / 2) * 15deg)); }

.row { gap: 4px; }

.more {
  align-self: center;
  margin-left: 6px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--muted);
}
</style>
