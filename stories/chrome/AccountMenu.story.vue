<script setup lang="ts">
import { VxAccountMenu, VxChip, VxTwitchGlyph, VxMenuItem, VxMenuLabel } from '../../src'
import StoryFrame from '../StoryFrame.vue'
</script>

<template>
  <Story title="Account menu" group="chrome">
    <Variant title="Signed out">
      <StoryFrame><VxAccountMenu /></StoryFrame>
    </Variant>
    <Variant title="Sign-in not available yet">
      <StoryFrame><VxAccountMenu disabled /></StoryFrame>
    </Variant>
    <Variant title="Signed in">
      <StoryFrame height="420px">
        <div class="story-row" style="justify-content: flex-end">
          <VxAccountMenu :user="{ name: 'vexoulz', color: '#9146FF' }">
            <template #default="{ close }">
              <VxMenuLabel>vods</VxMenuLabel>
              <VxMenuItem sub="resume 1:02:44" @click="close">Watch history</VxMenuItem>
              <VxMenuLabel>dtp</VxMenuLabel>
              <VxMenuItem @click="close">My commands</VxMenuItem>
              <VxMenuItem @click="close">Channel admin<template #trail><VxChip tone="accent">broadcaster</VxChip></template></VxMenuItem>
            </template>
          </VxAccountMenu>
        </div>
      </StoryFrame>
    </Variant>
    <Variant title="Twitch glyph">
      <!-- currentColor, one colour as Twitch's brand rules ask. -->
      <StoryFrame>
        <div class="story-row" style="align-items: end">
          <VxTwitchGlyph />
          <VxTwitchGlyph :size="24" style="color: #9146ff" />
          <VxTwitchGlyph :size="48" label="Twitch" />
        </div>
      </StoryFrame>
    </Variant>
  </Story>
</template>
