<script setup lang="ts">
// The one header every page uses: 48px, never wraps. Brand switcher, nav, spacer, page actions, account.
// On narrow sites the nav moves to a scrollable sub-row (it's never hidden).
import type { NavItem, SiteId } from '../../types'
import { useSite } from '../../composables/useSite'
import VxLink from './VxLink.vue'
import VxSiteSwitcher from './VxSiteSwitcher.vue'

const props = withDefaults(defineProps<{ site?: SiteId; nav?: NavItem[] }>(), { nav: () => [] })
const injected = useSite()
const current = () => props.site ?? injected.value
</script>

<template>
  <header class="vx-head">
    <slot name="brand"><VxSiteSwitcher :current="current()" brand /></slot>
    <nav v-if="nav.length" class="vx-nav" aria-label="Main">
      <VxLink
        v-for="item in nav"
        :key="item.label"
        :to="item.to"
        :href="item.href"
        :class="{ 'is-current': item.current }"
        :aria-current="item.current ? 'page' : undefined"
      >{{ item.label }}</VxLink>
    </nav>
    <span class="vx-head-spacer"></span>
    <div class="vx-head-actions">
      <slot name="actions"></slot>
      <slot name="account"></slot>
    </div>
  </header>
  <nav v-if="nav.length" class="vx-subnav vx-nav" aria-label="Main (compact)">
    <VxLink
      v-for="item in nav"
      :key="item.label"
      :to="item.to"
      :href="item.href"
      :class="{ 'is-current': item.current }"
      :aria-current="item.current ? 'page' : undefined"
    >{{ item.label }}</VxLink>
  </nav>
</template>
