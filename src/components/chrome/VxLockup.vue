<script setup lang="ts">
// Site name written like its hostname: "vods.vexoulz" (root is just "vexoulz"); the subdomain takes its accent.
import type { SiteInfo } from '../../types'

withDefaults(defineProps<{ site: SiteInfo['id']; net?: boolean }>(), { net: false })
</script>

<template>
  <span class="vx-lockup">
    <template v-if="site !== 'root'"
      ><span :class="site === 'shop' ? 'vx-accent-muted' : `vx-accent-${site}`">{{ site }}</span
      ><span class="vx-lockup-dot">.</span></template
    ><span>vexoulz</span><span v-if="net" class="vx-lockup-tld">.net</span>
  </span>
</template>
