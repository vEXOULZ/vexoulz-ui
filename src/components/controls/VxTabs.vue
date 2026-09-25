<script setup lang="ts" generic="T extends string">
// Underlined tabs. Scrolls sideways when there are more tabs than width; arrow keys move between tabs.
import { ref } from 'vue'
import type { Option } from '../../types'

defineProps<{ options: Option<T>[]; label?: string }>()
const model = defineModel<T>()
const list = ref<HTMLElement | null>(null)

function key(e: KeyboardEvent) {
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
  const tabs = [...(list.value?.querySelectorAll<HTMLButtonElement>('[role=tab]:not(:disabled)') ?? [])]
  const i = tabs.indexOf(document.activeElement as HTMLButtonElement)
  const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length]
  next?.focus()
  next?.click()
  e.preventDefault()
}
</script>

<template>
  <div ref="list" class="vx-tabs" role="tablist" :aria-label="label" @keydown="key">
    <button
      v-for="o in options"
      :key="o.value"
      type="button"
      role="tab"
      :aria-selected="o.value === model"
      :tabindex="o.value === model ? 0 : -1"
      :disabled="o.disabled"
      @click="model = o.value"
    >{{ o.label }}</button>
  </div>
</template>
