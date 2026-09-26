<script setup lang="ts">
// Site name written like its hostname: "vods.vexoulz" (root is just "vexoulz"); the subdomain takes its accent.
import { siteInfo, type NetworkSiteId } from '../../sites'

withDefaults(defineProps<{ site: NetworkSiteId; net?: boolean }>(), { net: false })
</script>

<template>
  <span class="vx-lockup">
    <template v-if="site !== 'root'"
      ><span :class="siteInfo(site).accent ? `vx-accent-${site}` : 'vx-accent-muted'">{{ site }}</span
      ><span class="vx-lockup-dot">.</span></template
    ><span>vexoulz</span><span v-if="net" class="vx-lockup-tld">.net</span>
  </span>
</template>
