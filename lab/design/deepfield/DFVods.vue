<script setup>
import { inject } from 'vue'
import DFChrome from './DFChrome.vue'
import Ph from '../Ph.vue'
import Posters from './Posters.vue'
import { vods, gamesOf, gameColor } from './data.js'

const opts = inject('dfOpts')
// v3: signed-in watch progress from the shared account ([fraction, time])
const resumeAt = { 0: [0.2, '1:02:44'], 3: [0.37, '4:11:27'] }
</script>

<template>
  <DFChrome site="vods" sub="vods" :nav="['Vods', 'Games', 'Live']">
    <template #actions>
      <input class="input search" placeholder="Search vods…" />
    </template>

    <div class="bar">
      <h1 class="h-display">Past broadcasts</h1>
      <div class="filters">
        <span class="chip active">All</span>
        <span class="chip">Just Chatting</span>
        <span class="chip">DOOM Eternal</span>
        <span class="chip">Balatro</span>
        <span class="chip">Hollow Knight</span>
      </div>
    </div>

    <div class="grid" :class="'p-' + opts.posters">
      <a v-for="(v, vi) in vods" :key="v.title" href="#" class="card">
        <div class="thumb">
          <div class="ring thumb-img"><Ph label="thumbnail 16:9" ratio="16 / 9" /></div>
          <span class="dur mono">{{ v.dur }}</span>
          <template v-if="opts.resume && opts.signedIn && resumeAt[vi]">
            <span class="resume chip mono">resume {{ resumeAt[vi][1] }}</span>
            <span class="watched" :style="{ width: resumeAt[vi][0] * 100 + '%' }"></span>
          </template>
          <Posters v-if="opts.posters === 'fan'" class="on-thumb" :games="gamesOf(v)" mode="fan" :size="30" />
          <div v-if="opts.chapterBar" class="chapters" :title="v.chapters.map(([g]) => g).join(' → ')">
            <span v-for="([g, f], i) in v.chapters" :key="i" :style="{ flexGrow: f, background: gameColor(g) }"></span>
          </div>
        </div>
        <div class="body">
          <Posters v-if="opts.posters === 'stack' || opts.posters === 'row'" :games="gamesOf(v)" :mode="opts.posters" :size="36" />
          <div class="text">
            <div class="title">{{ v.title }}</div>
            <div class="meta">
              <span class="mono date">{{ v.date }}</span>
              <template v-if="opts.posters === 'chips'">
                <span v-for="g in gamesOf(v)" :key="g" class="chip">{{ g }}</span>
              </template>
              <span v-else class="games">{{ gamesOf(v).join(', ') }}</span>
            </div>
          </div>
        </div>
      </a>
    </div>
  </DFChrome>
</template>

<style scoped>
.search { width: 220px; }
.bar { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
.bar h1 { font-size: 28px; }
.filters { display: flex; gap: 6px; flex-wrap: wrap; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 24px 18px; }
.card { display: flex; flex-direction: column; gap: 9px; }
.card:hover { color: inherit; }
.thumb { position: relative; }
.thumb-img { border-radius: var(--radius); }
.thumb-img :deep(.ph) { border-radius: var(--radius); background-color: var(--surface); }
.dur {
  position: absolute; right: 6px; top: 6px; font-size: 11px;
  padding: 0 6px; border-radius: var(--radius-sm); background: rgb(0 0 0 / 0.75); color: #fff;
}
.resume { position: absolute; left: 6px; top: 6px; background: rgb(0 0 0 / 0.75); color: var(--accent); border-color: transparent; }
.watched { position: absolute; left: 0; bottom: 3px; height: 3px; background: var(--accent); z-index: 1; }
.on-thumb { position: absolute; left: 8px; bottom: 8px; }
.chapters {
  position: absolute; left: 0; right: 0; bottom: 0; height: 3px; display: flex; gap: 2px;
  border-radius: 0 0 var(--radius) var(--radius); overflow: hidden;
}
.chapters span { flex-basis: 0; }
.p-fan .chapters { left: 0; }
.body { display: flex; gap: 10px; align-items: flex-start; }
.text { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.title { color: var(--ink); font-weight: 600; line-height: 1.35; }
.card:hover .title { color: var(--accent); }
.meta { display: flex; gap: 6px; align-items: center; min-width: 0; font-size: 12px; color: var(--muted); }
.p-chips .meta { flex-wrap: wrap; }
.date { white-space: nowrap; }
.games { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.games::before { content: '·'; margin-right: 6px; }
@container frame (max-width: 700px) {
  .search { width: 100%; }
}
</style>
