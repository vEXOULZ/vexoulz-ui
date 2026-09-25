<script setup lang="ts">
// "Which vexoulz site am I on / take me to another one". Used as the header brand and in the footer.
import { SITES, type SiteId } from '../../types'
import VxPlaceholder from '../media/VxPlaceholder.vue'
import VxPopover from '../overlays/VxPopover.vue'
import VxMenuItem from '../overlays/VxMenuItem.vue'
import VxMenuLabel from '../overlays/VxMenuLabel.vue'
import VxLockup from './VxLockup.vue'

withDefaults(
  defineProps<{
    current: SiteId
    /** Header brand: bigger, with the logo mark. */
    brand?: boolean
    /** Open above the trigger (footer). */
    up?: boolean
  }>(),
  { brand: false, up: false },
)
</script>

<template>
  <VxPopover :prefer="up ? 'up' : 'down'" width="290px">
    <template #trigger="{ toggle, open }">
      <button
        type="button"
        class="vx-switcher-trigger"
        :class="{ 'is-brand': brand }"
        :aria-expanded="open"
        aria-haspopup="menu"
        aria-label="vexoulz sites"
        @click="toggle"
      >
        <slot name="mark"><VxPlaceholder v-if="brand" label="mark" :w="22" :h="22" /></slot>
        <VxLockup :site="current" />
        <span class="vx-caret" aria-hidden="true">{{ up ? '▴' : '▾' }}</span>
      </button>
    </template>
    <template #default="{ close }">
      <VxMenuLabel>vexoulz network</VxMenuLabel>
      <VxMenuItem
        v-for="s in SITES"
        :key="s.id"
        class="vx-site-item"
        :href="s.href"
        :external="s.external"
        :current="s.id === current"
        @click="close"
      >
        <template #lead
          ><span class="vx-dotmark" :class="s.id === 'shop' ? 'vx-accent-muted' : `vx-accent-${s.id}`"></span
        ></template>
        <span class="vx-site-item-text">
          <span><VxLockup :site="s.id" net /><span v-if="s.external" class="vx-muted"> ↗</span></span>
          <span class="vx-site-item-what">{{ s.what }}</span>
        </span>
        <template #trail><span v-if="s.id === current" class="vx-here">here</span></template>
      </VxMenuItem>
    </template>
  </VxPopover>
</template>
