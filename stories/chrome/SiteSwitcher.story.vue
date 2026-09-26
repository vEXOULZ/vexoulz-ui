<script setup lang="ts">
import { VxLockup, VxSiteSwitcher } from '../../src'
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
    <Variant title="Lockups">
      <StoryFrame>
        <div class="story-col" style="font-size: 18px">
          <VxLockup site="root" />
          <VxLockup site="vods" />
          <VxLockup site="dtp" />
          <VxLockup site="vods" net />
        </div>
      </StoryFrame>
    </Variant>
  </Story>
</template>
