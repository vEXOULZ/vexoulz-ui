<script setup lang="ts">
// The 16:9 stand-in for a stream or VOD with no thumbnail. Drawn as an <img> so its pattern ids can't collide with
// other inline SVGs on the page.
import svg from '../../assets/no-thumbnail.svg?raw'

withDefaults(defineProps<{ label?: string }>(), {})

const src = `data:image/svg+xml,${encodeURIComponent(svg)}`
</script>

<template>
  <div class="vx-nothumb" role="img" :aria-label="label ?? 'no thumbnail'">
    <img :src="src" alt="" />
    <span v-if="label">{{ label }}</span>
  </div>
</template>
