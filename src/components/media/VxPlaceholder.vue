<script setup lang="ts">
// Stand-in for any logo, icon, thumbnail or image until real assets exist.
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    label?: string
    w?: number | string
    h?: number | string
    ratio?: string
    round?: boolean
  }>(),
  { label: 'img', round: false },
)

const px = (v: number | string | undefined, fallback: string) => (v == null ? fallback : typeof v === 'number' ? `${v}px` : v)
const style = computed(() => ({
  width: px(props.w, '100%'),
  height: px(props.h, 'auto'),
  aspectRatio: props.ratio,
}))
</script>

<template>
  <div class="vx-ph" :class="{ 'is-round': round }" :style="style" role="img" :aria-label="`placeholder: ${label}`">
    <span>{{ label }}</span>
  </div>
</template>
