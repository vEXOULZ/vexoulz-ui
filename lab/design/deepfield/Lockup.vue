<script setup>
// Site name written like its hostname: "vods.vexoulz" (root is just "vexoulz"); the subdomain takes its accent.
defineProps({
  site: { type: String, required: true },
  net: { type: Boolean, default: false },
})
</script>

<template>
  <span class="lockup">
    <template v-if="site !== 'root'"><span class="sub" :class="'accent-' + site">{{ site }}</span><span class="dot">.</span></template><span class="base">vexoulz</span><span v-if="net" class="tld">.net</span>
  </span>
</template>

<style scoped>
.lockup { font-family: var(--font-mono); font-weight: 500; white-space: nowrap; }
.dot, .tld { color: var(--muted); }
.accent-shop { color: var(--muted); }
</style>
