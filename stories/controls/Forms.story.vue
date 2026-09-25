<script setup lang="ts">
import { computed, reactive } from 'vue'
import { VxCheckbox, VxDateRange, VxField, VxInput, VxRadioGroup, VxSelect, VxSlider, VxStepper, VxSwitch } from '../../src'
import StoryFrame from '../StoryFrame.vue'

const f = reactive({
  name: 'vexoulz', search: '', delay: 1.5, sort: 'new', check: true, radio: 'all', sw: true, sw2: false, vol: 40,
  from: '2026-09-01', to: '2026-09-24',
})
const nameErr = computed(() => (f.name.length < 3 ? 'At least 3 characters.' : ''))
const sorts = [
  { value: 'new', label: 'Newest' },
  { value: 'old', label: 'Oldest' },
  { value: 'long', label: 'Longest', sub: 'duration' },
  { value: 'watched', label: 'Most watched', disabled: true },
]
</script>

<template>
  <Story title="Form controls" group="controls">
    <Variant title="Inputs">
      <StoryFrame height="480px">
        <div class="story-col">
          <VxField v-slot="{ id }" label="Display name" :error="nameErr" help="Shown in chat replays.">
            <VxInput :id="id" v-model="f.name" :invalid="!!nameErr" />
          </VxField>
          <VxField v-slot="{ id }" label="Search">
            <VxInput :id="id" v-model="f.search" type="search" placeholder="Search titles" clearable>
              <template #icon>⌕</template>
            </VxInput>
          </VxField>
          <VxField v-slot="{ id }" label="Sort">
            <VxSelect :id="id" v-model="f.sort" :options="sorts" />
          </VxField>
          <VxField v-slot="{ id }" label="Chat delay" help="0.1s steps; shift-click for 1s.">
            <VxStepper :id="id" v-model="f.delay" :step="0.1" :min="-30" :max="30" unit="s" label="Chat delay" />
          </VxField>
        </div>
      </StoryFrame>
    </Variant>
    <Variant title="Choices">
      <StoryFrame>
        <div class="story-col">
          <VxCheckbox v-model="f.check" label="Show timestamps" />
          <VxRadioGroup v-model="f.radio" label="Show" :options="[{ value: 'all', label: 'All' }, { value: 'vod', label: 'VODs' }, { value: 'live', label: 'Live' }]" />
          <VxSwitch v-model="f.sw" label="7TV emotes" />
          <VxSwitch v-model="f.sw2" label="Disabled" disabled />
          <div class="story-row"><span>Volume</span><VxSlider v-model="f.vol" label="Volume" style="max-width: 200px" /><code class="story-note">{{ f.vol }}</code></div>
        </div>
      </StoryFrame>
    </Variant>
    <Variant title="Date range">
      <StoryFrame>
        <div class="story-col">
          <VxDateRange v-model:from="f.from" v-model:to="f.to" />
          <code class="story-note">{{ f.from || '…' }} → {{ f.to || '…' }}</code>
        </div>
      </StoryFrame>
    </Variant>
  </Story>
</template>
