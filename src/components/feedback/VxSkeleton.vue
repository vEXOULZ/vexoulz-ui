<script setup lang="ts">
// Loading stand-in shaped like the content it replaces, so nothing jumps when data arrives.
withDefaults(defineProps<{ w?: string; h?: string; ratio?: string; round?: boolean }>(), { w: '100%', h: '1em', round: false })
</script>

<template>
  <span
    class="vx-skeleton"
    aria-hidden="true"
    :style="{ width: w, height: ratio ? 'auto' : h, aspectRatio: ratio, borderRadius: round ? '50%' : undefined }"
  ></span>
</template>
