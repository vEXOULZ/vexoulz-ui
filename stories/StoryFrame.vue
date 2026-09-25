<script setup lang="ts">
// Wraps a story in .vx-site (fonts, colours, container queries) with the chosen site accent.
import type { SiteId } from '../src/types'

withDefaults(defineProps<{ site?: SiteId; flush?: boolean; height?: string }>(), { site: 'root', flush: false })
</script>

<template>
  <div class="vx-site story-frame" :class="{ 'is-flush': flush }" :data-site="site" :style="{ height }">
    <slot></slot>
  </div>
</template>
