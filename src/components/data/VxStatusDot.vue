<script setup lang="ts">
withDefaults(defineProps<{ status?: 'live' | 'ok' | 'warn' | 'off'; label?: string }>(), { status: 'off' })
</script>

<template>
  <span class="vx-status" :class="`is-${status}`">
    <span class="vx-status-dot" aria-hidden="true"></span>
    <slot>{{ label }}</slot>
  </span>
</template>
