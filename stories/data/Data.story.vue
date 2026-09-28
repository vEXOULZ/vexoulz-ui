<script setup lang="ts">
import { ref } from 'vue'
import { VxAvatar, VxButton, VxChip, VxStatusDot, VxTable, VxUptimeBar } from '../../src'
import type { Health, SortState, UptimeTick } from '../../src'
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
// Fifty one-minute checks: a short outage, one slow check, and a newer service with only twenty.
const checks = (n: number, bad: (i: number) => Health | null): UptimeTick[] =>
  Array.from({ length: n }, (_, i) => {
    const status = bad(i) ?? 'ok'
    const time = `14:${String(10 + i).padStart(2, '0')}`
    return { status, label: status === 'down' ? `${time} · 502 · timed out` : `${time} · 200 · ${18 + ((i * 7) % 11)} ms` }
  })
const services = [
  { name: 'vexoulz.net', ticks: checks(50, () => null) },
  { name: 'vods', ticks: checks(50, (i) => (i >= 31 && i <= 34 ? 'down' : i === 40 ? 'warn' : null)) },
  { name: 'dtp', ticks: checks(20, (i) => (i === 19 ? 'down' : null)) },
]
const picked = ref<number | null>(33)
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
            <VxStatusDot status="down" label="Down" />
            <VxStatusDot status="off" label="Offline" />
          </div>
        </div>
      </StoryFrame>
    </Variant>
    <Variant title="Uptime bar">
      <StoryFrame site="status">
        <div class="story-col" style="padding-top: 28px">
          <div v-for="s in services" :key="s.name" class="story-col" style="gap: 6px">
            <VxStatusDot :status="s.ticks.at(-1)!.status" :label="s.name" />
            <VxUptimeBar :ticks="s.ticks" :slots="50" :label="`${s.name}, last 50 checks`" />
          </div>
          <VxUptimeBar v-model:selected="picked" :ticks="services[1]!.ticks" selectable :height="36" label="vods, selectable" />
          <p class="story-note">selected: {{ picked === null ? 'none' : services[1]!.ticks[picked]!.label }} · tap a tick, or arrow keys</p>
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
