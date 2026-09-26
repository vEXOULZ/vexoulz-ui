<script setup lang="ts">
// Desktop, one row: site switcher and the running build (linked to its commit) on the left; "report an issue" (the
// site's GitHub issues) and the credit on the right. Phones, two rows: switcher | report, then build | credit.
// The build comes from VxBuild (app.use), the repo from the site list.
import { computed } from 'vue'
import type { SiteId } from '../../types'
import { siteInfo } from '../../sites'
import { useBuild } from '../../composables/useBuild'
import { useSite } from '../../composables/useSite'
import VxSiteSwitcher from './VxSiteSwitcher.vue'

const props = withDefaults(defineProps<{ site?: SiteId; credit?: string }>(), {
  credit: 'made by vEXOULZ with 🧻',
})
const injected = useSite()
const current = computed(() => props.site ?? injected.value)
const build = useBuild()

const repo = computed(() => {
  const r = siteInfo(current.value).repo
  return r ? `https://github.com/${r}` : null
})
const release = computed(() => (build.version && build.version !== '0.0.0' ? `v${build.version}` : null))
const commit = computed(() => build.commit?.slice(0, 7) || null)
const buildHref = computed(() => {
  if (!repo.value) return null
  if (build.commit) return `${repo.value}/commit/${build.commit}`
  return release.value ? `${repo.value}/releases/tag/${release.value}` : null
})
const buildLabel = computed(() => [release.value, commit.value].filter(Boolean).join(' · '))
</script>

<template>
  <footer class="vx-foot">
    <VxSiteSwitcher :current="current" up />
    <template v-if="buildLabel">
      <a v-if="buildHref" class="vx-foot-build" :href="buildHref" rel="noopener" :title="`This build: ${build.commit ?? release}`">{{ buildLabel }}</a>
      <span v-else class="vx-foot-build">{{ buildLabel }}</span>
    </template>
    <slot></slot>
    <span class="vx-foot-spacer"></span>
    <a v-if="repo" class="vx-foot-report" :href="`${repo}/issues`" rel="noopener"><span aria-hidden="true">🛑</span> report an issue</a>
    <span class="vx-foot-break" aria-hidden="true"></span>
    <span class="vx-foot-credit">{{ credit }}</span>
  </footer>
</template>
