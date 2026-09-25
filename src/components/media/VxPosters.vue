<script setup lang="ts">
// Twitch box-art posters (3:4) for the games in a VOD.
// fan: rotated cards (the picked look) · stack: overlapping cards that spread on hover · row: side by side
import { computed } from 'vue'
import type { PosterGame } from '../../types'
import { gameColor, initials } from '../../utils/color'
import VxPlaceholder from './VxPlaceholder.vue'

const props = withDefaults(
  defineProps<{ games: PosterGame[]; mode?: 'fan' | 'stack' | 'row'; size?: number; max?: number }>(),
  { mode: 'fan', size: 32, max: 3 },
)

const all = computed(() => props.games.map((g) => (typeof g === 'string' ? { name: g } : g)))
const shown = computed(() => all.value.slice(0, props.max))
const extra = computed(() => all.value.length - shown.value.length)
</script>

<template>
  <div
    class="vx-posters"
    :class="`is-${mode}`"
    :style="{ '--vx-pw': `${size}px`, '--vx-n': shown.length }"
    :title="all.map((g) => g.name).join(' · ')"
  >
    <div
      v-for="(g, i) in shown"
      :key="g.name"
      class="vx-poster vx-ring"
      :style="{ zIndex: mode === 'fan' && i === 0 ? 12 : 10 - i, '--vx-i': i, '--vx-c': gameColor(g.name) }"
    >
      <img v-if="g.image" :src="g.image" :alt="g.name" loading="lazy" />
      <VxPlaceholder v-else :label="initials(g.name)" ratio="3 / 4" />
    </div>
    <span v-if="extra > 0" class="vx-posters-more">+{{ extra }}</span>
  </div>
</template>
