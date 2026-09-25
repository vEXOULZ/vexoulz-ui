<script setup lang="ts">
import { reactive } from 'vue'
import { VxChapterBar, VxPlaceholder, VxPosters, VxStarfield } from '../../src'
import type { StarfieldOptions } from '../../src'
import StoryFrame from '../StoryFrame.vue'

const games = ['Just Chatting', 'Balatro', 'DOOM Eternal', 'Hollow Knight', 'Music']
const chapters = [
  { name: 'Just Chatting', start: 0, end: 3600 },
  { name: 'Balatro', start: 3600, end: 13500 },
  { name: 'Music', start: 13500, end: 14400, restricted: true },
  { name: 'DOOM Eternal', start: 14400, end: 25200 },
  { name: 'Hollow Knight', start: 25200, end: 33000 },
]
const sky = reactive({ seed: 'vexoulz.net', options: { density: 3.2, meteors: true, pointer: true, band: false } as Partial<StarfieldOptions> })
</script>

<template>
  <Story title="Media" group="media">
    <Variant title="Starfield">
      <StoryFrame flush height="420px" style="position: relative">
        <VxStarfield :seed="sky.seed" :options="sky.options" />
      </StoryFrame>
      <template #controls>
        <HstSelect v-model="sky.seed" title="Seed" :options="['vexoulz.net', 'vods.vexoulz.net', 'dtp.vexoulz.net']" />
        <HstSlider v-model="sky.options.density" title="Density" :min="0.4" :max="8" :step="0.2" />
        <HstCheckbox v-model="sky.options.meteors" title="Meteors" />
        <HstCheckbox v-model="sky.options.pointer" title="Pointer parallax" />
        <HstCheckbox v-model="sky.options.band" title="Milky-way band" />
      </template>
    </Variant>
    <Variant title="Posters">
      <StoryFrame site="vods">
        <div class="story-row" style="gap: 40px; padding: 20px 0">
          <VxPosters :games="games" mode="fan" />
          <VxPosters :games="games" mode="stack" />
          <VxPosters :games="games" mode="row" :max="4" />
          <VxPosters :games="games.slice(0, 1)" :size="48" />
        </div>
      </StoryFrame>
    </Variant>
    <Variant title="Thumbnail + chapter bar">
      <StoryFrame site="vods">
        <div class="vx-ring" style="position: relative; width: 320px; border-radius: var(--vx-radius); overflow: hidden">
          <VxPlaceholder label="thumbnail 16:9" ratio="16 / 9" />
          <VxPosters :games="games" style="position: absolute; left: 8px; bottom: 10px" />
          <VxChapterBar :chapters="chapters" style="position: absolute; left: 0; right: 0; bottom: 0" />
        </div>
        <p class="story-note">Music was cut from YouTube (restricted): hatched</p>
      </StoryFrame>
    </Variant>
    <Variant title="Placeholder">
      <StoryFrame>
        <div class="story-row">
          <VxPlaceholder label="mark" :w="32" :h="32" />
          <VxPlaceholder label="pfp" :w="48" :h="48" round />
          <VxPlaceholder label="banner 3:1" ratio="3 / 1" w="300px" />
        </div>
      </StoryFrame>
    </Variant>
  </Story>
</template>
