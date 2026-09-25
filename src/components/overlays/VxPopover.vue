<script setup lang="ts">
// Popover / dropdown used for every menu. Opens towards whichever side of its page has room and caps its height
// to that room (bounded by <main>, so it never slides under the sticky header), so long lists scroll.
import { nextTick, ref } from 'vue'
import { useDismiss } from '../../composables/useClickOutside'
import { place } from '../../utils/place'

const props = withDefaults(
  defineProps<{
    prefer?: 'up' | 'down'
    align?: 'left' | 'right'
    width?: string
    /** Never taller than this (px), even with room. */
    cap?: number
    /** ARIA role of the panel. */
    role?: 'menu' | 'dialog' | 'listbox'
  }>(),
  { prefer: 'down', align: 'left', width: '260px', cap: 420, role: 'menu' },
)
const emit = defineEmits<{ open: []; close: [] }>()

const open = ref(false)
const root = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const dir = ref(props.prefer)
const maxH = ref(props.cap)

function reposition() {
  if (!root.value) return
  const bounds = (root.value.closest('main') ?? root.value.closest('.vx-site') ?? document.body).getBoundingClientRect()
  const r = place({
    anchor: root.value.getBoundingClientRect(),
    bounds,
    viewport: window.innerHeight,
    prefer: props.prefer,
    cap: props.cap,
    content: panel.value?.scrollHeight,
  })
  dir.value = r.dir
  maxH.value = r.maxHeight
}

async function show() {
  if (open.value) return
  open.value = true
  emit('open')
  await nextTick()
  reposition()
}
function close() {
  if (!open.value) return
  open.value = false
  emit('close')
}
const toggle = () => (open.value ? close() : show())

useDismiss(root, () => open.value, close)
defineExpose({ open: show, close, toggle, reposition })
</script>

<template>
  <div ref="root" class="vx-popover">
    <slot name="trigger" :open="open" :toggle="toggle" :close="close"></slot>
    <div
      v-if="open"
      ref="panel"
      class="vx-popover-panel vx-pop"
      :class="[`is-${dir}`, `is-${align}`]"
      :style="{ width, maxHeight: `${maxH}px` }"
      :role="role"
    >
      <slot :close="close"></slot>
    </div>
  </div>
</template>
