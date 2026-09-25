<script setup lang="ts">
// Small mono label. `tone` colours it; `live` is the red LIVE badge; with `clickable` it's a filter toggle.
withDefaults(
  defineProps<{
    tone?: 'default' | 'accent' | 'ok' | 'warn' | 'bad'
    live?: boolean
    /** Filter chip: a button, highlighted when active. */
    clickable?: boolean
    active?: boolean
    /** "key: value" chip: the key part. */
    k?: string
  }>(),
  { tone: 'default', live: false, clickable: false, active: false },
)
defineEmits<{ click: [e: MouseEvent] }>()
</script>

<template>
  <button
    v-if="clickable"
    type="button"
    class="vx-chip"
    :class="[tone !== 'default' && `is-${tone}`, { 'is-active': active }]"
    :aria-pressed="active"
    @click="$emit('click', $event)"
  ><span v-if="k" class="vx-chip-key">{{ k }}</span><slot></slot></button>
  <span v-else class="vx-chip" :class="[tone !== 'default' && `is-${tone}`, { 'is-live': live }]"
    ><span v-if="k" class="vx-chip-key">{{ k }}</span><slot>{{ live ? 'LIVE' : '' }}</slot></span
  >
</template>
