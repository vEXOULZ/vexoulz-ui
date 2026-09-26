<script setup lang="ts">
// Page frame for every site: starfield, header, main, footer, toasts. Sets data-site on <html> as well,
// so overlays teleported to <body> (dialogs, toasts) keep the site's accent.
import { computed, onMounted, onUnmounted, toRef, watch } from 'vue'
import { provideSite } from '../../composables/useSite'
import { ensureSiteAccents, siteInfo } from '../../sites'
import type { NavItem, SiteId } from '../../types'
import type { StarfieldOptions } from '../../utils/starfield'
import VxStarfield from '../media/VxStarfield.vue'
import VxToastHost from '../overlays/VxToastHost.vue'
import VxSiteFooter from './VxSiteFooter.vue'
import VxSiteHeader from './VxSiteHeader.vue'

const props = withDefaults(
  defineProps<{
    site: SiteId
    nav?: NavItem[]
    /** App-like page (watch page): no footer, main fills the window. */
    fill?: boolean
    /** full | dim | off */
    sky?: 'full' | 'dim' | 'off'
    /** Sky seed; defaults to the site's hostname so each subdomain keeps its own sky. */
    seed?: string
    stars?: Partial<StarfieldOptions>
    /** Set data-site on <html> too (default on). Turn off when several shells share a page (stories). */
    global?: boolean
  }>(),
  { nav: () => [], fill: false, sky: 'full', global: true },
)

ensureSiteAccents()
provideSite(toRef(props, 'site'))
const seed = computed(() => props.seed ?? siteInfo(props.site).host)

function applyGlobal() {
  if (props.global) document.documentElement.dataset.site = props.site
}
onMounted(applyGlobal)
watch(() => props.site, applyGlobal)
onUnmounted(() => {
  if (props.global && document.documentElement.dataset.site === props.site) delete document.documentElement.dataset.site
})
</script>

<template>
  <div class="vx-site" :class="{ 'is-fill': fill }" :data-site="site">
    <VxStarfield v-if="sky !== 'off'" :seed="seed" :options="stars" :style="{ opacity: sky === 'dim' ? 0.35 : 1 }" />
    <slot name="header">
      <VxSiteHeader :site="site" :nav="nav">
        <template #actions><slot name="actions"></slot></template>
        <template #account><slot name="account"></slot></template>
      </VxSiteHeader>
    </slot>
    <main class="vx-main" :class="{ 'is-fill': fill }">
      <slot></slot>
    </main>
    <slot v-if="!fill" name="footer"><VxSiteFooter :site="site" /></slot>
    <VxToastHost />
  </div>
</template>
