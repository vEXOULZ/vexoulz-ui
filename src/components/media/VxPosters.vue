<script setup lang="ts">
// Twitch box-art posters (3:4) for the games in a VOD.
// Each poster has a band of its game colour along the bottom, matching chapter bars and timelines.
// fan: rotated cards (the picked look) · stack: overlapping cards that spread on hover · row: side by side
import { computed } from 'vue'
import type { PosterGame } from '../../types'
import { gamePalette, initials } from '../../utils/color'
import VxPlaceholder from './VxPlaceholder.vue'

const props = withDefaults(
  defineProps<{ games: PosterGame[]; mode?: 'fan' | 'stack' | 'row'; size?: number; max?: number }>(),
  { mode: 'fan', size: 32, max: 3 },
)

const all = computed(() => props.games.map((g) => (typeof g === 'string' ? { name: g } : g)))
// Same palette a chapter bar builds for these games (in this order), unless the caller passes colours.
const palette = computed(() => gamePalette(all.value.map((g) => g.name)))
const colorOf = (g: { name: string; color?: string }) => g.color ?? palette.value.get(g.name)!
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
      :style="{ zIndex: mode === 'fan' && i === 0 ? 12 : 10 - i, '--vx-i': i, '--vx-c': colorOf(g) }"
    >
      <img v-if="g.image" :src="g.image" :alt="g.name" loading="lazy" />
      <VxPlaceholder v-else :label="initials(g.name)" ratio="3 / 4" />
      <span class="vx-poster-band" aria-hidden="true"></span>
    </div>
    <span v-if="extra > 0" class="vx-posters-more">+{{ extra }}</span>
  </div>
</template>
