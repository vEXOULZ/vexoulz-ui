<script setup lang="ts" generic="T extends string">
// Small exclusive choice (grid / list, root / vods / dtp). Use VxTabs for page sections.
import type { Option } from '../../types'

defineProps<{ options: Option<T>[]; label?: string }>()
const model = defineModel<T>()
</script>

<template>
  <div class="vx-segmented" role="radiogroup" :aria-label="label">
    <button
      v-for="o in options"
      :key="o.value"
      type="button"
      role="radio"
      :aria-checked="o.value === model"
      :disabled="o.disabled"
      @click="model = o.value"
    ><slot name="option" :option="o">{{ o.label }}</slot></button>
  </div>
</template>
