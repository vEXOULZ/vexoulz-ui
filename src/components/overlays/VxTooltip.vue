<script setup lang="ts">
// Short one-line hint on hover or focus. Never put anything here that's needed to use the page:
// touch screens rarely see it. The bubble sits above, centred; near an edge of the screen it slides sideways, and
// with no room above it goes below.
import { nextTick, ref, useId } from 'vue'
import { clampX } from '../../utils/place'

defineProps<{ text: string }>()
const shown = ref(false)
const id = useId()
const bubble = ref<HTMLElement | null>(null)
const shiftX = ref(0)
const below = ref(false)

async function show() {
  shiftX.value = 0
  below.value = false
  shown.value = true
  await nextTick()
  const box = bubble.value?.getBoundingClientRect()
  if (!box) return
  shiftX.value = clampX(box.left, box.right, document.documentElement.clientWidth)
  below.value = box.top < 8
}
</script>

<template>
  <span
    class="vx-tooltip"
    :aria-describedby="shown ? id : undefined"
    @pointerenter="show"
    @pointerleave="shown = false"
    @focusin="show"
    @focusout="shown = false"
  >
    <slot></slot>
    <span
      v-if="shown"
      :id="id"
      ref="bubble"
      class="vx-tooltip-bubble"
      :class="{ 'is-below': below }"
      :style="{ translate: shiftX ? `${shiftX}px 0` : undefined }"
      role="tooltip"
    >{{ text }}</span>
  </span>
</template>
