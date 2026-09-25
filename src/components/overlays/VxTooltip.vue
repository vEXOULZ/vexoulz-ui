<script setup lang="ts">
// Short one-line hint on hover or focus. Never put anything here that's needed to use the page:
// touch screens rarely see it.
import { ref, useId } from 'vue'

defineProps<{ text: string }>()
const shown = ref(false)
const id = useId()
</script>

<template>
  <span
    class="vx-tooltip"
    :aria-describedby="shown ? id : undefined"
    @pointerenter="shown = true"
    @pointerleave="shown = false"
    @focusin="shown = true"
    @focusout="shown = false"
  >
    <slot></slot>
    <span v-if="shown" :id="id" class="vx-tooltip-bubble" role="tooltip">{{ text }}</span>
  </span>
</template>
