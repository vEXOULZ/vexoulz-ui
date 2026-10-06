<script setup lang="ts">
import { VxLockup, VxMark, VxSiteSwitcher } from '../../src'
import StoryFrame from '../StoryFrame.vue'
</script>

<template>
  <Story title="Site switcher & lockup" group="chrome">
    <Variant title="Switcher">
      <StoryFrame site="vods" height="420px">
        <div class="story-row">
          <VxSiteSwitcher current="vods" brand />
          <VxSiteSwitcher current="dtp" />
        </div>
      </StoryFrame>
    </Variant>
    <Variant title="Brand away from home">
      <!-- home points elsewhere so the story page counts as a subpage: the name links home, the caret opens the menu. -->
      <StoryFrame site="dtp" height="420px">
        <VxSiteSwitcher current="dtp" brand home="/somewhere-else" />
      </StoryFrame>
    </Variant>
    <Variant title="Mark">
      <!-- currentColor: it takes the colour it sits in. -->
      <StoryFrame>
        <div class="story-row" style="align-items: end">
          <VxMark :size="16" />
          <VxMark />
          <VxMark :size="48" style="color: var(--vx-accent-vods)" />
          <VxMark :size="64" style="color: var(--vx-accent-dtp)" />
          <VxMark :size="96" style="color: var(--vx-accent-status)" label="vexoul.net" />
        </div>
      </StoryFrame>
    </Variant>
    <Variant title="Lockups">
      <StoryFrame>
        <div class="story-col" style="font-size: 18px">
          <VxLockup site="root" />
          <VxLockup site="vods" />
          <VxLockup site="dtp" />
          <VxLockup site="vods" :net="false" />
        </div>
      </StoryFrame>
    </Variant>
  </Story>
</template>
