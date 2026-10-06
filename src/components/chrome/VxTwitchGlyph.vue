<script setup lang="ts">
// Twitch's glyph from its brand kit, in one colour (currentColor), not redrawn. For "Sign in with Twitch" and other
// Twitch-bound buttons.
withDefaults(defineProps<{ size?: number | string; label?: string }>(), { size: 16 })
</script>

<template>
  <svg
    class="vx-twitch-glyph"
    :width="size"
    :height="size"
    viewBox="0 0 16 16"
    fill="currentColor"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
  >
    <path d="m 7.7139998,3.1426667 h 1.1433334 v 3.4286666 h -1.144 z m 3.1433332,0 H 12 V 6.5713333 H 10.857334 Z M 3.9999998,0 1.1426665,2.8573333 V 13.142667 H 4.5713332 V 16 l 2.8573333,-2.857333 h 2.285333 L 14.857334,8 V 0 Z M 13.714,7.4286667 11.428667,9.714 H 9.1426665 l -2,2 v -2 H 4.5713332 V 1.1426667 H 13.714 Z" />
  </svg>
</template>
