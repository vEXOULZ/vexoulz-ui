<script setup lang="ts">
// Number with − / + buttons. Shift-click steps ×10 (e.g. chat delay: 0.1s, shift for 1s).
import { clamp, decimalsOf, stepValue } from '../../utils/number'

const props = withDefaults(
  defineProps<{
    step?: number
    min?: number
    max?: number
    size?: 'md' | 'sm'
    /** Unit shown in the button tooltips, e.g. "s". */
    unit?: string
    label?: string
    id?: string
  }>(),
  { step: 1, size: 'md', unit: '' },
)
const model = defineModel<number>({ default: 0 })

function press(dir: 1 | -1, e: MouseEvent) {
  model.value = stepValue(model.value, dir, { step: props.step, min: props.min, max: props.max, big: e.shiftKey })
}
function typed(e: Event) {
  const v = (e.target as HTMLInputElement).valueAsNumber
  if (Number.isFinite(v)) model.value = clamp(Number(v.toFixed(decimalsOf(props.step))), props.min, props.max)
}
</script>

<template>
  <span class="vx-stepper" :class="{ 'is-sm': size === 'sm' }" role="group" :aria-label="label">
    <button
      type="button"
      class="vx-btn is-icon"
      :class="{ 'is-sm': size === 'sm' }"
      :title="`−${step}${unit} (shift: −${step * 10}${unit})`"
      :aria-label="`Decrease by ${step}${unit}`"
      :disabled="min != null && model <= min"
      @click="press(-1, $event)"
    >−</button>
    <input
      :id="id"
      class="vx-input"
      type="number"
      :value="model"
      :step="step"
      :min="min"
      :max="max"
      :aria-label="label"
      @change="typed"
    />
    <button
      type="button"
      class="vx-btn is-icon"
      :class="{ 'is-sm': size === 'sm' }"
      :title="`+${step}${unit} (shift: +${step * 10}${unit})`"
      :aria-label="`Increase by ${step}${unit}`"
      :disabled="max != null && model >= max"
      @click="press(1, $event)"
    >+</button>
  </span>
</template>
