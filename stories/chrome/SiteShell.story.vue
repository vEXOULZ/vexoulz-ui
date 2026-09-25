<script setup lang="ts">
import { reactive } from 'vue'
import { VxAccountMenu, VxButton, VxMenuItem, VxMenuLabel, VxSiteShell, useToast } from '../../src'
import type { AccountUser, SiteId } from '../../src'

const state = reactive({ site: 'vods' as SiteId, signedIn: false })
const user: AccountUser = { name: 'vexoulz', color: '#9146FF' }
const { show } = useToast()
const nav = [
  { label: 'VODs', href: '#', current: true },
  { label: 'Games', href: '#' },
  { label: 'Clips', href: '#' },
  { label: 'About', href: '#' },
]
</script>

<template>
  <Story title="Site shell" group="chrome" :layout="{ type: 'single', iframe: true }">
    <Variant title="Page">
      <VxSiteShell :site="state.site" :nav="nav" style="height: 100vh">
        <template #actions>
          <VxButton icon label="Search">⌕</VxButton>
        </template>
        <template #account>
          <VxAccountMenu :user="state.signedIn ? user : null" @sign-in="state.signedIn = true" @sign-out="state.signedIn = false">
            <template #default="{ close }">
              <VxMenuLabel>vods</VxMenuLabel>
              <VxMenuItem sub="resume 1:02:44" @click="close">Watch history</VxMenuItem>
            </template>
          </VxAccountMenu>
        </template>
        <h1 class="vx-display" style="font-size: 32px">Past broadcasts</h1>
        <p class="vx-muted">Header is 48px signed in and out. Narrow the preview below 700px: the nav moves to its own row.</p>
        <VxButton @click="show('Link copied')">Show a toast</VxButton>
      </VxSiteShell>
      <template #controls>
        <HstSelect v-model="state.site" title="Site" :options="['root', 'vods', 'dtp']" />
        <HstCheckbox v-model="state.signedIn" title="Signed in" />
      </template>
    </Variant>
    <Variant title="Fill (watch page)">
      <VxSiteShell site="vods" fill sky="off" style="height: 100vh">
        <div style="flex: 1; display: grid; place-items: center" class="vx-muted">player + chat fill the window; no footer</div>
      </VxSiteShell>
    </Variant>
  </Story>
</template>
