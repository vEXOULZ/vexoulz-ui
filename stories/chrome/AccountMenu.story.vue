<script setup lang="ts">
import { VxAccountMenu, VxChip, VxMenuItem, VxMenuLabel } from '../../src'
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
  </Story>
</template>
