<script setup lang="ts">
// Short one-line hint on hover or focus. Never put anything here that's needed to use the page:
// touch screens rarely see it. The bubble is teleported to <body> so no scrolling container (a table's scroller, a
// dialog) cuts it off. It sits above its trigger, centred; near an edge of the screen it slides sideways, and with no
// room above it goes below. It hides when anything scrolls.
import { onScopeDispose, ref, useId, watch } from 'vue'
import { clampX } from '../../utils/place'

defineProps<{ text: string }>()
const GAP = 8
const shown = ref(false)
const id = useId()
const root = ref<HTMLElement | null>(null)
const pos = ref<{ left: number; top: number; below: boolean } | null>(null)

// Called by the bubble's ref once it's in the page, so its own size is known.
function place(bubble: HTMLElement | null) {
  if (!bubble || !root.value || pos.value) return
  const t = root.value.getBoundingClientRect()
  const b = bubble.getBoundingClientRect()
  const w = b.right - b.left
  const h = b.bottom - b.top
  let left = (t.left + t.right) / 2 - w / 2
  left += clampX(left, left + w, document.documentElement.clientWidth)
  const below = t.top - GAP - h < GAP
  pos.value = { left, top: below ? t.bottom + GAP : t.top - GAP - h, below }
}
function show() {
  pos.value = null
  shown.value = true
}
const hide = () => (shown.value = false)

function listen(on: boolean) {
  const method = on ? 'addEventListener' : 'removeEventListener'
  window[method]('scroll', hide, { capture: true, passive: true } as AddEventListenerOptions)
}
watch(shown, listen)
onScopeDispose(() => listen(false))
</script>

<template>
  <span
    ref="root"
    class="vx-tooltip"
    :aria-describedby="shown ? id : undefined"
    @pointerenter="show"
    @pointerleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <slot></slot>
    <Teleport to="body">
      <span
        v-if="shown"
        :id="id"
        :ref="(el) => place(el as HTMLElement | null)"
        class="vx-tooltip-bubble vx-overlay is-fixed"
        :class="{ 'is-below': pos?.below }"
        :style="{
          left: `${pos?.left ?? 0}px`,
          top: `${pos?.top ?? 0}px`,
          visibility: pos ? undefined : 'hidden',
        }"
        role="tooltip"
      >{{ text }}</span>
    </Teleport>
  </span>
</template>
