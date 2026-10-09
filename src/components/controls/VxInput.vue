<script setup lang="ts">
// Text input at control height, with an optional leading icon and a clear button. Attributes and listeners go to the
// <input> (aria-*, min, @blur, ...); class and style stay on the wrapper. It fills its container's width unless
// `width` sets one; `grow` makes it share a flex row instead (growing from `width`, up to `maxWidth`).
import { computed, ref, useAttrs, type StyleValue } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    type?: 'text' | 'search' | 'email' | 'url' | 'password' | 'number' | 'date'
    placeholder?: string
    invalid?: boolean
    clearable?: boolean
    disabled?: boolean
    mono?: boolean
    id?: string
    /** Width (px or any CSS length) instead of the container's full width; with `grow`, where it grows from. */
    width?: number | string
    /** Take the free space of a flex row, next to other controls, rather than a fixed width. */
    grow?: boolean
    /** Never wider than this (px or any CSS length). */
    maxWidth?: number | string
  }>(),
  { type: 'text', invalid: false, clearable: false, disabled: false, mono: false, grow: false },
)
const model = defineModel<string | number>({ default: '' })
const attrs = useAttrs()
const len = (v: number | string | undefined) => (typeof v === 'number' ? `${v}px` : v)
const sizeStyle = computed(() => ({
  width: props.grow ? 'auto' : len(props.width),
  flex: props.grow ? `1 1 ${len(props.width) ?? '0'}` : props.width != null ? 'none' : undefined,
  maxWidth: len(props.maxWidth),
}))
const inputAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})
const el = ref<HTMLInputElement | null>(null)
defineExpose({ focus: () => el.value?.focus() })

function clear() {
  model.value = ''
  el.value?.focus()
}
</script>

<template>
  <span
    class="vx-input-wrap"
    :class="[attrs.class, { 'has-icon': $slots.icon, 'has-clear': clearable }]"
    :style="[sizeStyle, attrs.style as StyleValue]"
  >
    <span v-if="$slots.icon" class="vx-input-icon" aria-hidden="true"><slot name="icon"></slot></span>
    <input
      v-bind="inputAttrs"
      :id="id"
      ref="el"
      v-model="model"
      class="vx-input"
      :class="{ 'is-invalid': invalid, 'vx-mono': mono }"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-invalid="invalid || undefined"
    />
    <button
      v-if="clearable && model !== ''"
      type="button"
      class="vx-btn is-ghost is-icon is-sm vx-input-clear"
      aria-label="Clear"
      title="Clear"
      @click="clear"
    >×</button>
  </span>
</template>
