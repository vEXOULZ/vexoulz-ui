<script setup lang="ts">
import type { SiteId } from '../../types'
import { useSite } from '../../composables/useSite'
import VxSiteSwitcher from './VxSiteSwitcher.vue'

const props = withDefaults(defineProps<{ site?: SiteId; credit?: string }>(), {
  credit: `made by vEXOULZ · ${new Date().getFullYear()}`,
})
const injected = useSite()
const current = () => props.site ?? injected.value
</script>

<template>
  <footer class="vx-foot">
    <VxSiteSwitcher :current="current()" up />
    <slot></slot>
    <span class="vx-foot-spacer"></span>
    <span>{{ credit }}</span>
  </footer>
</template>
