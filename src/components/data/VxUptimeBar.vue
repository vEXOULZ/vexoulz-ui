<script setup lang="ts">
// A service's recent history as a row of ticks, oldest on the left: green up, yellow degraded, red down, grey no
// data. A tick can be one check or an hour or a day of them; its label says which.
// `slots` fixes the number of ticks (the row is padded with empty ones on the left), so bars stacked in a list
// line up even when one service has less history. Hovering or focusing a tick shows its label above it.
// `selectable` makes the ticks buttons and `v-model:selected` the chosen one's index, so a page can show that
// check in full; touch screens never see a hover, so anything more than the label belongs there.
import { computed, nextTick, ref } from 'vue'
import type { UptimeTick } from '../../types'
import { clampX } from '../../utils/place'

const props = withDefaults(
  defineProps<{
    ticks: UptimeTick[]
    slots?: number
    height?: number
    /** What the bar is, for screen readers ("dtp, last 50 checks"). */
    label?: string
    selectable?: boolean
  }>(),
  { height: 28, selectable: false },
)
const selected = defineModel<number | null>('selected', { default: null })

const pad = computed(() => Math.max(0, (props.slots ?? props.ticks.length) - props.ticks.length))
const summary = computed(() => {
  const known = props.ticks.filter((t) => t.status !== 'off')
  const up = known.filter((t) => t.status !== 'down').length // degraded is still up
  const text = known.length ? `${up} of ${known.length} up` : 'no data'
  return props.label ? `${props.label}: ${text}` : text
})

// The one bubble, over whichever tick is hovered or focused.
const root = ref<HTMLElement | null>(null)
const bubble = ref<HTMLElement | null>(null)
const shown = ref<number | null>(null)
const shiftX = ref(0)
const bubbleLeft = computed(() => (shown.value === null ? 0 : ((pad.value + shown.value + 0.5) / (pad.value + props.ticks.length)) * 100))

async function show(i: number) {
  if (!props.ticks[i]?.label) return
  shiftX.value = 0
  shown.value = i
  await nextTick()
  const box = bubble.value?.getBoundingClientRect()
  if (box) shiftX.value = clampX(box.left, box.right, document.documentElement.clientWidth)
}
const hide = (i: number) => {
  if (shown.value === i) shown.value = null
}

// Arrow keys move along the bar; only one tick is a tab stop (the selected one, else the newest).
const focusIndex = computed(() => selected.value ?? props.ticks.length - 1)
function onKey(e: KeyboardEvent, i: number) {
  const last = props.ticks.length - 1
  const to = { ArrowLeft: i - 1, ArrowRight: i + 1, Home: 0, End: last }[e.key]
  if (to === undefined) return
  e.preventDefault()
  const next = Math.min(last, Math.max(0, to))
  selected.value = next
  root.value?.querySelectorAll<HTMLElement>('.vx-uptime-tick:not(.is-pad)')[next]?.focus()
}
</script>

<template>
  <div
    ref="root"
    class="vx-uptime"
    :class="{ 'is-selectable': selectable }"
    :style="{ height: `${height}px` }"
    :role="selectable ? 'group' : 'img'"
    :aria-label="summary"
  >
    <span v-for="i in pad" :key="`pad-${i}`" class="vx-uptime-tick is-pad" aria-hidden="true"></span>
    <template v-if="selectable">
      <button
        v-for="(t, i) in ticks"
        :key="i"
        type="button"
        class="vx-uptime-tick"
        :class="[`is-${t.status}`, { 'is-selected': selected === i }]"
        :aria-label="t.label ?? t.status"
        :aria-pressed="selected === i"
        :tabindex="i === focusIndex ? 0 : -1"
        @click="selected = selected === i ? null : i"
        @keydown="onKey($event, i)"
        @pointerenter="show(i)"
        @pointerleave="hide(i)"
        @focus="show(i)"
        @blur="hide(i)"
      ></button>
    </template>
    <template v-else>
      <span
        v-for="(t, i) in ticks"
        :key="i"
        class="vx-uptime-tick"
        :class="`is-${t.status}`"
        @pointerenter="show(i)"
        @pointerleave="hide(i)"
      ></span>
    </template>
    <span
      v-if="shown !== null"
      ref="bubble"
      class="vx-tooltip-bubble"
      :style="{ left: `${bubbleLeft}%`, translate: shiftX ? `${shiftX}px 0` : undefined }"
      aria-hidden="true"
    >{{ ticks[shown]?.label }}</span>
  </div>
</template>
