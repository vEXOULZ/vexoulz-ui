<script setup lang="ts">
import { SITES } from '../../src/sites'
import StoryFrame from '../StoryFrame.vue'

const colours = ['bg', 'surface', 'surface-2', 'ink', 'muted', 'line', 'ok', 'warn', 'bad', 'info']
const accents = SITES.filter((s) => 'accent' in s).map((s) => s.id)
const sizes = [
  ['--vx-ctl-sm', '26 · small controls'],
  ['--vx-ctl', '32 · every control, avatar, icon button'],
  ['--vx-head-h', '48 · the header, on every page'],
]
</script>

<template>
  <Story title="Tokens" group="foundations" :layout="{ type: 'single', iframe: true }">
    <Variant title="Colour">
      <StoryFrame>
        <div class="vx-eyebrow">Colour</div>
        <div class="story-row" style="margin-top: 10px">
          <div v-for="c in colours" :key="c" style="width: 110px">
            <div :style="{ height: '44px', background: `var(--vx-${c})`, border: '1px solid var(--vx-line)', borderRadius: 'var(--vx-radius-sm)' }"></div>
            <code class="story-note">--vx-{{ c }}</code>
          </div>
        </div>
        <div class="vx-eyebrow" style="margin-top: 24px">Accent per site (from src/sites.ts, switched by data-site)</div>
        <div class="story-row" style="margin-top: 10px">
          <div v-for="a in accents" :key="a" style="width: 160px">
            <div :style="{ height: '44px', background: `var(--vx-accent-${a})`, borderRadius: 'var(--vx-radius-sm)' }"></div>
            <code class="story-note">[data-site={{ a }}]</code>
          </div>
        </div>
      </StoryFrame>
    </Variant>
    <Variant title="Type">
      <StoryFrame>
        <div class="story-col">
          <h1 class="vx-display" style="font-size: 40px">vexoulz</h1>
          <div class="vx-eyebrow">eyebrow · mono label</div>
          <p style="margin: 0">Geist for names, titles and prose. The quick brown fox jumps over the lazy dog.</p>
          <p class="vx-mono" style="margin: 0">Geist Mono for labels, handles, numbers and code · 1:02:44</p>
          <pre class="vx-code"><span class="vx-tok-prefix">!</span><span class="vx-tok-cmd">uptime</span> <span class="vx-tok-op">&gt;</span> <span class="vx-tok-str">"live for {uptime}"</span> <span class="vx-tok-ph">{channel}</span></pre>
        </div>
      </StoryFrame>
    </Variant>
    <Variant title="Sizes">
      <StoryFrame>
        <div class="story-col">
          <div v-for="[v, label] in sizes" :key="v" class="story-row">
            <span :style="{ height: `var(${v})`, width: `var(${v})`, background: 'var(--vx-surface-2)', border: '1px solid var(--vx-line)', borderRadius: 'var(--vx-radius-sm)' }"></span>
            <code class="story-note">{{ v }} = {{ label }}</code>
          </div>
        </div>
      </StoryFrame>
    </Variant>
    <Variant title="Surfaces">
      <StoryFrame>
        <div class="story-row" style="align-items: stretch">
          <div class="vx-panel" style="padding: 16px; width: 200px">.vx-panel (glass)</div>
          <div class="vx-pop" style="padding: 16px; width: 200px">.vx-pop (menus)</div>
          <div class="vx-panel vx-ring" tabindex="0" style="padding: 16px; width: 200px">.vx-ring: hover me</div>
        </div>
      </StoryFrame>
    </Variant>
  </Story>
</template>
