<script setup lang="ts">
import { reactive } from 'vue'
import { VxButton, useToast } from '../../src'
import StoryFrame from '../StoryFrame.vue'

const s = reactive({ theater: false, saving: false })
const { show } = useToast()
function save() {
  s.saving = true
  setTimeout(() => {
    s.saving = false
    show('Saved')
  }, 900)
}
</script>

<template>
  <Story title="Button" group="controls">
    <Variant title="Variants">
      <StoryFrame>
        <div class="story-row">
          <VxButton>Default</VxButton>
          <VxButton variant="primary">Primary</VxButton>
          <VxButton variant="ghost">Ghost</VxButton>
          <VxButton variant="danger">Danger</VxButton>
          <VxButton variant="danger-solid">Delete</VxButton>
          <VxButton disabled>Disabled</VxButton>
          <VxButton href="#">Link</VxButton>
        </div>
      </StoryFrame>
    </Variant>
    <Variant title="Sizes & icons">
      <StoryFrame>
        <div class="story-row">
          <VxButton>32 · default</VxButton>
          <VxButton size="sm">26 · small</VxButton>
          <VxButton icon label="Copy link" @click="show('Link copied')">⧉</VxButton>
          <VxButton icon size="sm" label="Close">×</VxButton>
          <VxButton icon label="Theater mode" :pressed="s.theater" @click="s.theater = !s.theater">▭</VxButton>
          <span class="story-note">icon buttons are square; confirmations go to a toast</span>
        </div>
      </StoryFrame>
    </Variant>
    <Variant title="Loading">
      <StoryFrame>
        <div class="story-row">
          <VxButton variant="primary" :loading="s.saving" @click="save">Save</VxButton>
          <VxButton loading>Loading</VxButton>
          <VxButton icon loading label="Refreshing">↻</VxButton>
        </div>
      </StoryFrame>
    </Variant>
  </Story>
</template>
