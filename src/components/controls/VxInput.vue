<script setup lang="ts">
// Text input at control height, with an optional leading icon and a clear button.
import { ref } from 'vue'

withDefaults(
  defineProps<{
    type?: 'text' | 'search' | 'email' | 'url' | 'password' | 'number' | 'date'
    placeholder?: string
    invalid?: boolean
    clearable?: boolean
    disabled?: boolean
    mono?: boolean
    id?: string
  }>(),
  { type: 'text', invalid: false, clearable: false, disabled: false, mono: false },
)
const model = defineModel<string | number>({ default: '' })
const el = ref<HTMLInputElement | null>(null)
defineExpose({ focus: () => el.value?.focus() })

function clear() {
  model.value = ''
  el.value?.focus()
}
</script>

<template>
  <span class="vx-input-wrap" :class="{ 'has-icon': $slots.icon, 'has-clear': clearable }">
    <span v-if="$slots.icon" class="vx-input-icon" aria-hidden="true"><slot name="icon"></slot></span>
    <input
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
