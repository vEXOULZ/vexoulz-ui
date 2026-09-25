<script setup lang="ts">
// "Nothing here" / 404 / no results. Always offers a way on (the actions slot).
defineProps<{ title: string; text?: string; code?: string }>()
</script>

<template>
  <div class="vx-empty">
    <slot name="art"></slot>
    <div v-if="code" class="vx-display" style="font-size: 44px">{{ code }}</div>
    <div class="vx-empty-title">{{ title }}</div>
    <div v-if="text || $slots.default" class="vx-empty-text"><slot>{{ text }}</slot></div>
    <div v-if="$slots.actions" class="vx-empty-actions"><slot name="actions"></slot></div>
  </div>
</template>
