<script setup lang="ts">
// Inline message with a coloured edge. The body can hold code blocks; they scroll inside the callout.
import type { Tone } from '../../types'

withDefaults(defineProps<{ tone?: Tone; title?: string }>(), { tone: 'info' })
const icons: Record<Tone, string> = { info: 'i', ok: '✓', warn: '!', error: '×' }
</script>

<template>
  <div class="vx-callout" :class="`is-${tone}`" :role="tone === 'error' ? 'alert' : 'status'">
    <span class="vx-callout-icon vx-mono" aria-hidden="true"><slot name="icon">{{ icons[tone] }}</slot></span>
    <div class="vx-callout-body">
      <div v-if="title" class="vx-callout-title">{{ title }}</div>
      <slot></slot>
    </div>
    <div v-if="$slots.actions" class="vx-callout-actions"><slot name="actions"></slot></div>
  </div>
</template>
