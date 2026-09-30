<script setup lang="ts">
import { reactive } from 'vue'
import { VxPagination, VxSegmented, VxTabs } from '../../src'
import StoryFrame from '../StoryFrame.vue'

const s = reactive({ tab: 'overview', many: 'settings', view: 'grid', page: 3, total: 54 })
const tabs = ['overview', 'modules', 'publications', 'filters', 'triggers', 'timers'].map((v) => ({ value: v, label: v[0]!.toUpperCase() + v.slice(1) }))
const many = ['settings', 'modules', 'commands', 'published', 'triggers & timers', 'replies', 'word filter', 'roles', 'variables', 'runs', 'chat log', 'audit', 'ignored'].map((v) => ({ value: v, label: v[0]!.toUpperCase() + v.slice(1) }))
</script>

<template>
  <Story title="Navigation" group="controls">
    <Variant title="Tabs">
      <StoryFrame site="dtp">
        <VxTabs v-model="s.tab" :options="tabs" label="Channel sections" />
        <p class="story-note">{{ s.tab }} · arrow keys move between tabs; scrolls sideways when narrow</p>
      </StoryFrame>
    </Variant>
    <Variant title="Tabs, more than fit">
      <StoryFrame site="dtp">
        <div style="max-width: 520px"><VxTabs v-model="s.many" :options="many" label="Channel sections" /></div>
        <p class="story-note">{{ s.many }} · the side with more fades under an arrow that scrolls it</p>
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
