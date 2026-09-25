<script setup lang="ts">
// Thin strip of game colours, one segment per chapter, sized by length. Restricted (cut) chapters are hatched.
// Used along the bottom edge of VOD thumbnails; the full watch-page timeline lives in the vods site.
import { computed } from 'vue'
import type { Chapter } from '../../types'
import { gameColor } from '../../utils/color'

const props = withDefaults(defineProps<{ chapters: Chapter[]; height?: number }>(), { height: 3 })
const segments = computed(() => props.chapters.map((c) => ({ ...c, len: Math.max(0, c.end - c.start) })))
</script>

<template>
  <div class="vx-chapterbar" :style="{ height: `${height}px` }" :title="chapters.map((c) => c.name).join(' → ')">
    <span
      v-for="(c, i) in segments"
      :key="i"
      :class="{ 'is-restricted': c.restricted }"
      :style="{ flexGrow: c.len, background: gameColor(c.name) }"
    ></span>
  </div>
</template>
