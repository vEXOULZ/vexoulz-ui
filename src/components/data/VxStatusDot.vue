<script setup lang="ts">
// `live` is red with a halo (on air); `down` is plain red (a service not answering).
import type { Health } from '../../types'

withDefaults(defineProps<{ status?: 'live' | Health; label?: string }>(), { status: 'off' })
</script>

<template>
  <span class="vx-status" :class="`is-${status}`">
    <span class="vx-status-dot" aria-hidden="true"></span>
    <slot>{{ label }}</slot>
  </span>
</template>
