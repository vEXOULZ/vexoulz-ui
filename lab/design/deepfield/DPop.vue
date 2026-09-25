<script setup>
// Popover / dropdown used for every menu in v4. Opens towards whichever side of its site has more room and
// caps its height to that room, so long lists scroll instead of running off-screen (the mobile chapter bug).
import { nextTick, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  prefer: { type: String, default: 'down' }, // up | down
  align: { type: String, default: 'left' }, // left | right
  width: { type: String, default: '260px' },
  cap: { type: Number, default: 420 }, // never taller than this, even with room
})

const open = ref(false)
const root = ref(null)
const panel = ref(null)
const dir = ref(props.prefer)
const maxH = ref(props.cap)

function place() {
  const a = root.value.getBoundingClientRect()
  // Room = the page's main area (below the sticky header), clipped to what's actually on screen
  const b = (root.value.closest('main') || root.value.closest('.df-site') || document.body).getBoundingClientRect()
  const up = a.top - Math.max(b.top, 0) - 10
  const down = Math.min(b.bottom, innerHeight) - a.bottom - 10
  const wanted = props.prefer === 'up' ? up : down
  const other = props.prefer === 'up' ? down : up
  // Stay on the preferred side if the whole list fits there, else take whichever side has more room
  const need = Math.min(panel.value?.scrollHeight ?? props.cap, props.cap)
  dir.value = wanted >= need || wanted >= other ? props.prefer : props.prefer === 'up' ? 'down' : 'up'
  maxH.value = Math.max(120, Math.min(props.cap, dir.value === 'up' ? up : down))
}

async function toggle() {
  open.value = !open.value
  if (open.value) {
    await nextTick()
    place()
  }
}
const close = () => (open.value = false)
const outside = (e) => {
  if (open.value && root.value && !root.value.contains(e.target)) close()
}
const esc = (e) => e.key === 'Escape' && close()
onMounted(() => {
  document.addEventListener('pointerdown', outside)
  document.addEventListener('keydown', esc)
})
onUnmounted(() => {
  document.removeEventListener('pointerdown', outside)
  document.removeEventListener('keydown', esc)
})
defineExpose({ close })
</script>

<template>
  <div ref="root" class="dpop">
    <slot name="trigger" :open="open" :toggle="toggle"></slot>
    <div
      v-if="open"
      ref="panel"
      class="dpop-panel panel pop"
      :class="[dir, align]"
      :style="{ width, maxHeight: maxH + 'px' }"
      role="menu"
    >
      <slot :close="close"></slot>
    </div>
  </div>
</template>
