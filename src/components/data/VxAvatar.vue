<script setup lang="ts">
// Round profile picture; placeholder until real images exist. `live` adds the red ring and LIVE tag.
import VxPlaceholder from '../media/VxPlaceholder.vue'

withDefaults(defineProps<{ src?: string; name?: string; size?: number; live?: boolean }>(), { size: 32, live: false })
</script>

<template>
  <span class="vx-avatar" :class="{ 'is-live': live }" :style="{ width: `${size}px`, height: `${size}px` }">
    <img v-if="src" :src="src" :alt="name ?? ''" />
    <VxPlaceholder v-else :label="name ? name.slice(0, 2) : 'pfp'" round />
    <span v-if="live" class="vx-avatar-live">LIVE</span>
  </span>
</template>
