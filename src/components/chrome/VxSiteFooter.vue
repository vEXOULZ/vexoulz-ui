<script setup lang="ts">
// Site switcher on the left; on the right the credit, which build is running (linked to its commit) and a link to
// report an issue on the site's GitHub repo. On phones the credit and build take a row of their own, under the
// switcher and the report link. The build comes from VxBuild (app.use), the repo from the site list.
import { computed } from 'vue'
import type { SiteId } from '../../types'
import { siteInfo } from '../../sites'
import { useBuild } from '../../composables/useBuild'
import { useSite } from '../../composables/useSite'
import VxSiteSwitcher from './VxSiteSwitcher.vue'

const props = withDefaults(defineProps<{ site?: SiteId; credit?: string }>(), {
  credit: `made by vEXOULZ · ${new Date().getFullYear()}`,
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
    <slot></slot>
    <span class="vx-foot-spacer"></span>
    <span class="vx-foot-meta">
      <span>{{ credit }}</span>
      <template v-if="buildLabel">
        <span class="vx-foot-sep" aria-hidden="true">·</span>
        <a v-if="buildHref" :href="buildHref" rel="noopener" :title="`This build: ${build.commit ?? release}`">{{ buildLabel }}</a>
        <span v-else>{{ buildLabel }}</span>
      </template>
    </span>
    <a v-if="repo" class="vx-foot-report" :href="`${repo}/issues`" rel="noopener">
      <!-- ❗ from Twemoji (© Twitter, Inc. and contributors, CC-BY 4.0): https://github.com/jdecked/twemoji -->
      <svg viewBox="0 0 36 36" width="14" height="14" aria-hidden="true">
        <circle fill="#BE1931" cx="18" cy="32" r="3" />
        <path fill="#BE1931" d="M21 24c0 1.657-1.344 3-3 3-1.657 0-3-1.343-3-3V5c0-1.657 1.343-3 3-3 1.656 0 3 1.343 3 3v19z" />
      </svg>
      report an issue
    </a>
  </footer>
</template>
