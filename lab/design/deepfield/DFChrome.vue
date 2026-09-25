<script setup>
// Shared header/footer + sky for every *.vexoulz.net page in the Deep Field lab.
import { computed, inject } from 'vue'
import Ph from '../Ph.vue'
import Starfield from './Starfield.vue'
import SiteSwitcher from './SiteSwitcher.vue'
import AccountMenu from './AccountMenu.vue'
import AccountMenu4 from './AccountMenu4.vue'

const props = defineProps({
  site: { type: String, required: true },
  sub: { type: String, default: '' },
  nav: { type: Array, default: () => [] },
  fill: { type: Boolean, default: false }, // app-like page: no footer, main fills the frame
  hideHead: { type: Boolean, default: false },
  sky: { type: String, default: 'full' }, // full | dim | off
})

const opts = inject('dfOpts')
const stars = computed(() => opts.value.stars)
const hosts = { root: 'vexoulz.net', vods: 'vods.vexoulz.net', dtp: 'dtp.vexoulz.net' }
// Seeded by the hostname, so each subdomain always gets the same sky
const seed = computed(() => (stars.value.perSite ? hosts[props.site] : 'vexoulz.net'))
// v2 lab: opts.switcher = footer | header | both; older labs leave it unset and keep plain footer links
const switchIn = (where) => opts.value.switcher === where || opts.value.switcher === 'both'
// v4 lab provides dfV4: fixed-height header, compact sign-in, nav moves to a sub-row on phones
const v4 = inject('dfV4', false)
const skyOpacity = computed(() => (props.sky === 'dim' ? 0.35 : 1))
</script>

<template>
  <div class="df-site" :class="{ fill, tile: stars.mode === 'tile' && sky !== 'off' }" :data-site="site">
    <Starfield
      v-if="stars.mode === 'gen' && sky !== 'off'"
      :seed="seed"
      :opts="stars"
      :style="{ opacity: skyOpacity }"
    />
    <header v-if="!hideHead" class="df-head" :class="{ compact: fill }" style="z-index: 3">
      <SiteSwitcher v-if="switchIn('header')" :current="site" :sub="sub" :format="opts.brand" brand />
      <a v-else class="df-brand" href="#">
        <Ph label="mark" :w="fill ? 22 : 26" :h="fill ? 22 : 26" />
        <span>vexoulz</span>
        <template v-if="sub"><span class="slash">/</span><span class="sub">{{ sub }}</span></template>
      </a>
      <nav class="df-nav">
        <a v-for="(item, i) in nav" :key="item" href="#" :class="{ on: i === 0 }">{{ item }}</a>
      </nav>
      <span class="spacer"></span>
      <slot name="actions"></slot>
      <template v-if="opts.signedIn !== undefined">
        <AccountMenu4 v-if="v4" :site="site" />
        <AccountMenu v-else :site="site" />
      </template>
    </header>
    <nav v-if="v4 && !hideHead && !fill && nav.length" class="df-subnav">
      <a v-for="(item, i) in nav" :key="item" href="#" :class="{ on: i === 0 }">{{ item }}</a>
    </nav>
    <main :class="fill ? 'df-main-fill' : 'df-main'">
      <slot></slot>
    </main>
    <footer v-if="!fill" class="df-foot" style="align-items: center">
      <SiteSwitcher v-if="switchIn('footer')" :current="site" :format="opts.brand" up />
      <template v-else>
        <a href="#" class="accent-root">vexoulz.net</a>
        <a href="#" class="accent-vods">vods</a>
        <a href="#" class="accent-dtp">dtp</a>
      </template>
      <span style="flex: 1"></span>
      <span>made by vEXOULZ · 2026</span>
    </footer>
  </div>
</template>
