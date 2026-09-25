<script setup lang="ts">
// Page buttons that keep the same width while paging (see pageRange). Small square buttons.
import { computed } from 'vue'
import { pageRange } from '../../utils/pagination'

const props = withDefaults(defineProps<{ total: number; siblings?: number }>(), { siblings: 1 })
const page = defineModel<number>({ default: 1 })
const items = computed(() => pageRange(page.value, props.total, props.siblings))
const go = (p: number) => (page.value = Math.min(Math.max(1, p), props.total))
</script>

<template>
  <nav class="vx-pagination" aria-label="Pages">
    <button type="button" class="vx-btn is-sm is-icon" aria-label="Previous page" :disabled="page <= 1" @click="go(page - 1)">‹</button>
    <template v-for="(p, i) in items" :key="p === 'gap' ? `gap${i}` : p">
      <span v-if="p === 'gap'" class="vx-gap" aria-hidden="true">…</span>
      <button
        v-else
        type="button"
        class="vx-btn is-sm vx-mono"
        :class="{ 'is-primary': p === page }"
        :style="{ minWidth: 'var(--vx-ctl-sm)', padding: '0 6px' }"
        :aria-current="p === page ? 'page' : undefined"
        @click="go(p)"
      >{{ p }}</button>
    </template>
    <button type="button" class="vx-btn is-sm is-icon" aria-label="Next page" :disabled="page >= total" @click="go(page + 1)">›</button>
  </nav>
</template>
