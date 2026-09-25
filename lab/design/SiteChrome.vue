<script setup>
// Header + footer shared by every *.vexoulz.net site: same brand lockup, only the accent and nav change.
import Ph from './Ph.vue'

defineProps({
  site: { type: String, required: true },
  sub: { type: String, default: '' },
  nav: { type: Array, default: () => [] },
})
</script>

<template>
  <div class="site" :data-site="site">
    <header class="site-head">
      <a class="brand" href="#">
        <Ph label="mark" :w="26" :h="26" />
        <span>vexoulz</span>
        <template v-if="sub"><span class="slash">/</span><span class="sub">{{ sub }}</span></template>
      </a>
      <nav class="site-nav">
        <a v-for="(item, i) in nav" :key="item" href="#" :class="{ on: i === 0 }">{{ item }}</a>
      </nav>
      <span class="spacer"></span>
      <slot name="actions"></slot>
    </header>
    <main class="site-main">
      <slot></slot>
    </main>
    <footer class="site-foot">
      <a href="#" class="accent-root">vexoulz.net</a>
      <a href="#" class="accent-vods">vods</a>
      <a href="#" class="accent-dtp">dtp</a>
      <span class="spacer" style="flex: 1"></span>
      <span>made by vEXOULZ · 2026</span>
    </footer>
  </div>
</template>
