<script setup lang="ts">
import { reactive } from 'vue'
import { VxPagination, VxSegmented, VxTabs } from '../../src'
import StoryFrame from '../StoryFrame.vue'

const s = reactive({ tab: 'overview', view: 'grid', page: 3, total: 54 })
const tabs = ['overview', 'modules', 'publications', 'filters', 'triggers', 'timers'].map((v) => ({ value: v, label: v[0]!.toUpperCase() + v.slice(1) }))
</script>

<template>
  <Story title="Navigation" group="controls">
    <Variant title="Tabs">
      <StoryFrame site="dtp">
        <VxTabs v-model="s.tab" :options="tabs" label="Channel sections" />
        <p class="story-note">{{ s.tab }} · arrow keys move between tabs; scrolls sideways when narrow</p>
      </StoryFrame>
    </Variant>
    <Variant title="Segmented">
      <StoryFrame>
        <VxSegmented v-model="s.view" :options="[{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }]" label="View" />
      </StoryFrame>
    </Variant>
    <Variant title="Pagination">
      <StoryFrame site="vods">
        <VxPagination v-model="s.page" :total="s.total" />
        <p class="story-note">page {{ s.page }} of {{ s.total }} · same width on every page</p>
      </StoryFrame>
      <template #controls>
        <HstNumber v-model="s.total" title="Total pages" />
      </template>
    </Variant>
  </Story>
</template>
