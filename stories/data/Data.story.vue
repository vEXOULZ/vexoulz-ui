<script setup lang="ts">
import { ref } from 'vue'
import { VxAvatar, VxButton, VxChip, VxStatusDot, VxTable } from '../../src'
import type { SortState } from '../../src'
import StoryFrame from '../StoryFrame.vue'

const sort = ref<SortState | null>({ key: 'date', dir: 'desc' })
const columns = [
  { key: 'title', label: 'Title', sortable: true },
  { key: 'date', label: 'Date', sortable: true, mono: true, muted: true },
  { key: 'games', label: 'Games', muted: true },
  { key: 'length', label: 'Length', sortable: true, mono: true, align: 'right' as const },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: '', align: 'right' as const },
]
const rows = [
  { id: 1, title: 'subathon day 3', date: '2026-09-14', games: 'Just Chatting, Balatro, DOOM Eternal', length: '11:20:55', status: 'ok' },
  { id: 2, title: 'doom eternal nightmare any%', date: '2026-09-21', games: 'DOOM Eternal', length: '5:12:40', status: 'processing' },
  { id: 3, title: 'community game night', date: '2026-09-10', games: 'Jackbox, Among Us', length: '2:55:30', status: 'missing part' },
]
const filters = ref(['DOOM Eternal'])
const toggle = (g: string) => (filters.value = filters.value.includes(g) ? filters.value.filter((x) => x !== g) : [...filters.value, g])
</script>

<template>
  <Story title="Data" group="data">
    <Variant title="Table">
      <StoryFrame site="dtp">
        <VxTable v-model:sort="sort" :columns="columns" :rows="rows" row-key="id" label="VODs">
          <template #cell-status="{ value }">
            <VxChip :tone="value === 'ok' ? 'ok' : value === 'processing' ? 'warn' : 'bad'">{{ value }}</VxChip>
          </template>
          <template #cell-actions>
            <VxButton size="sm" icon label="More">⋯</VxButton>
          </template>
        </VxTable>
        <p class="story-note">narrow sites keep every column; the table scrolls sideways</p>
      </StoryFrame>
    </Variant>
    <Variant title="Chips & status">
      <StoryFrame site="vods">
        <div class="story-col">
          <div class="story-row">
            <VxChip>default</VxChip>
            <VxChip tone="accent">accent</VxChip>
            <VxChip tone="ok">ok</VxChip>
            <VxChip tone="warn">warn</VxChip>
            <VxChip tone="bad">bad</VxChip>
            <VxChip live />
            <VxChip k="game">DOOM Eternal</VxChip>
          </div>
          <div class="story-row">
            <VxChip v-for="g in ['DOOM Eternal', 'Balatro', 'Hollow Knight']" :key="g" clickable :active="filters.includes(g)" @click="toggle(g)">{{ g }}</VxChip>
          </div>
          <div class="story-row">
            <VxStatusDot status="live" label="Live now" />
            <VxStatusDot status="ok" label="Connected" />
            <VxStatusDot status="warn" label="Degraded" />
            <VxStatusDot status="off" label="Offline" />
          </div>
        </div>
      </StoryFrame>
    </Variant>
    <Variant title="Avatar">
      <StoryFrame>
        <div class="story-row" style="gap: 20px; padding-bottom: 10px">
          <VxAvatar name="vexoulz" />
          <VxAvatar name="vexoulz" :size="48" />
          <VxAvatar name="vexoulz" :size="64" live />
        </div>
      </StoryFrame>
    </Variant>
  </Story>
</template>
