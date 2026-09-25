<script setup lang="ts" generic="T extends string | number">
// Dropdown select built on VxPopover, so it opens towards free space and scrolls like every other menu.
import { computed } from 'vue'
import type { Option } from '../../types'
import VxMenuItem from '../overlays/VxMenuItem.vue'
import VxPopover from '../overlays/VxPopover.vue'

const props = withDefaults(
  defineProps<{
    options: Option<T>[]
    placeholder?: string
    size?: 'md' | 'sm'
    width?: string
    prefer?: 'up' | 'down'
    align?: 'left' | 'right'
    disabled?: boolean
    id?: string
  }>(),
  { placeholder: 'Choose…', size: 'md', width: '220px', prefer: 'down', align: 'left', disabled: false },
)
const model = defineModel<T>()
const current = computed(() => props.options.find((o) => o.value === model.value))
</script>

<template>
  <VxPopover :prefer="prefer" :align="align" :width="width" role="listbox">
    <template #trigger="{ toggle, open }">
      <button
        :id="id"
        type="button"
        class="vx-btn vx-select"
        :class="{ 'is-sm': size === 'sm' }"
        :disabled="disabled"
        aria-haspopup="listbox"
        :aria-expanded="open"
        @click="toggle"
      >
        <span :class="{ 'vx-muted': !current }">{{ current?.label ?? placeholder }}</span>
        <span class="vx-caret" aria-hidden="true">▾</span>
      </button>
    </template>
    <template #default="{ close }">
      <VxMenuItem
        v-for="o in options"
        :key="String(o.value)"
        role="option"
        :aria-selected="o.value === model"
        :current="o.value === model"
        :sub="o.sub"
        :disabled="o.disabled"
        @click="model = o.value; close()"
      >{{ o.label }}</VxMenuItem>
    </template>
  </VxPopover>
</template>
