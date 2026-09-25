<script setup lang="ts">
import { ref } from 'vue'
import { VxButton, VxDialog, VxKbd, VxMenuItem, VxMenuLabel, VxMenuSeparator, VxPopover, VxTooltip, useToast } from '../../src'
import StoryFrame from '../StoryFrame.vue'

const dialog = ref(false)
const { show } = useToast()
const chapters = Array.from({ length: 24 }, (_, i) => ({ name: `Chapter ${i + 1}`, at: `${Math.floor(i / 2)}:${i % 2 ? '30' : '00'}:00` }))
</script>

<template>
  <Story title="Popover, dialog, toast, tooltip" group="overlays">
    <Variant title="Popover menu">
      <StoryFrame height="520px">
        <main style="height: 100%; display: flex; flex-direction: column; justify-content: space-between">
          <VxPopover>
            <template #trigger="{ toggle, open }">
              <VxButton :pressed="open" @click="toggle">Chapters ▾</VxButton>
            </template>
            <template #default="{ close }">
              <VxMenuLabel>24 chapters</VxMenuLabel>
              <VxMenuItem v-for="(c, i) in chapters" :key="i" :sub="c.at" :current="i === 3" @click="close">{{ c.name }}</VxMenuItem>
            </template>
          </VxPopover>
          <VxPopover>
            <template #trigger="{ toggle }">
              <VxButton @click="toggle">Near the bottom: opens up ▴</VxButton>
            </template>
            <template #default="{ close }">
              <VxMenuItem @click="close">Copy link</VxMenuItem>
              <VxMenuItem @click="close">Copy link at current time</VxMenuItem>
              <VxMenuSeparator />
              <VxMenuItem danger @click="close">Report</VxMenuItem>
            </template>
          </VxPopover>
        </main>
      </StoryFrame>
    </Variant>
    <Variant title="Dialog">
      <StoryFrame>
        <VxButton variant="danger" @click="dialog = true">Delete trigger…</VxButton>
        <VxDialog v-model:open="dialog" title="Delete this trigger?">
          It stops replying straight away. This can't be undone.
          <template #actions="{ close }">
            <VxButton @click="close">Cancel</VxButton>
            <VxButton variant="danger-solid" @click="dialog = false; show('Trigger deleted')">Delete</VxButton>
          </template>
        </VxDialog>
      </StoryFrame>
    </Variant>
    <Variant title="Toast">
      <StoryFrame>
        <div class="story-row">
          <VxButton @click="show('Link copied')">ok</VxButton>
          <VxButton @click="show('Loaded newer messages', { kind: 'info' })">info</VxButton>
          <VxButton @click="show('Could not reach the API', { kind: 'error' })">error</VxButton>
        </div>
      </StoryFrame>
    </Variant>
    <Variant title="Tooltip & kbd">
      <StoryFrame>
        <div class="story-row" style="padding-top: 40px">
          <VxTooltip text="Short, one line, never needed to use the page"><VxButton>hover me</VxButton></VxTooltip>
          <span>Press <VxKbd>y</VxKbd> to copy, <VxKbd>shift</VxKbd>+<VxKbd>click</VxKbd> for ±1s</span>
        </div>
      </StoryFrame>
    </Variant>
  </Story>
</template>
