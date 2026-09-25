<script setup lang="ts" generic="T extends string | number">
import { useId } from 'vue'
import type { Option } from '../../types'

withDefaults(defineProps<{ options: Option<T>[]; label?: string; inline?: boolean }>(), { inline: true })
const model = defineModel<T>()
const name = useId()
</script>

<template>
  <div
    role="radiogroup"
    :aria-label="label"
    :style="{ display: 'flex', flexDirection: inline ? 'row' : 'column', flexWrap: 'wrap', gap: inline ? '16px' : '8px' }"
  >
    <label v-for="o in options" :key="String(o.value)" class="vx-check" :class="{ 'is-disabled': o.disabled }">
      <input v-model="model" type="radio" :name="name" :value="o.value" :disabled="o.disabled" />
      {{ o.label }}
    </label>
  </div>
</template>
