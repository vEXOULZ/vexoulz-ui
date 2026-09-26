<script setup lang="ts">
// "Which vexoulz site am I on / take me to another one". Used as the header brand and in the footer.
// As the header brand, away from the home page the name is a link home and only the caret opens the menu; on the
// home page (where "home" goes nowhere) the whole button opens it.
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref } from 'vue'
import { switcherSites } from '../../sites'
import type { SiteId } from '../../types'
import VxPlaceholder from '../media/VxPlaceholder.vue'
import VxPopover from '../overlays/VxPopover.vue'
import VxMenuItem from '../overlays/VxMenuItem.vue'
import VxMenuLabel from '../overlays/VxMenuLabel.vue'
import VxLink from './VxLink.vue'
import VxLockup from './VxLockup.vue'

const props = withDefaults(
  defineProps<{
    current: SiteId
    /** Header brand: bigger, with the logo mark, and a link home away from the home page. */
    brand?: boolean
    /** Open above the trigger (footer). */
    up?: boolean
    /** Where "home" is on this site. */
    home?: string
  }>(),
  { brand: false, up: false, home: '/' },
)

// The current path: vue-router's when the app has one (the library doesn't depend on it), else the page's own.
const router = getCurrentInstance()?.appContext.config.globalProperties.$router as
  | { currentRoute: { value: { path: string } } }
  | undefined
const pagePath = ref(typeof location === 'undefined' ? '/' : location.pathname)
const syncPath = () => (pagePath.value = location.pathname)
onMounted(() => { if (!router) addEventListener('popstate', syncPath) })
onBeforeUnmount(() => removeEventListener('popstate', syncPath))
const path = computed(() => router?.currentRoute.value.path ?? pagePath.value)

const strip = (p: string) => p.replace(/\/+$/, '') || '/'
const linksHome = computed(() => props.brand && strip(path.value) !== strip(props.home))
</script>

<template>
  <VxPopover :prefer="up ? 'up' : 'down'" width="290px">
    <template #trigger="{ toggle, open }">
      <span v-if="linksHome" class="vx-switcher-split" :class="{ 'is-open': open }">
        <VxLink :to="home" class="vx-switcher-trigger is-brand vx-switcher-home" :aria-label="`${current === 'root' ? 'vexoulz' : current + '.vexoulz'} home`">
          <slot name="mark"><VxPlaceholder label="mark" :w="22" :h="22" /></slot>
          <VxLockup :site="current" />
        </VxLink>
        <button
          type="button"
          class="vx-switcher-trigger vx-switcher-caret"
          :aria-expanded="open"
          aria-haspopup="menu"
          aria-label="vexoulz sites"
          @click="toggle"
        >
          <span class="vx-caret" aria-hidden="true">{{ up ? '▴' : '▾' }}</span>
        </button>
      </span>
      <button
        v-else
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
        v-for="s in switcherSites(current)"
        :key="s.id"
        class="vx-site-item"
        :href="s.href"
        :external="s.external"
        :current="s.id === current"
        @click="close"
      >
        <template #lead
          ><span class="vx-dotmark" :class="s.accent ? `vx-accent-${s.id}` : 'vx-accent-muted'"></span
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
