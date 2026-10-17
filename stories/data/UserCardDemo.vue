<script setup lang="ts">
// Chat with platform-web's user cards, as a site wires it. Its own component so the open card's anchor element stays
// out of the story's state, which Histoire walks deeply. No lookup is set, so the card shows what the line knows.
import { onMounted, shallowRef } from 'vue'
import type { ChatLine as Line } from '@vexoulz/platform-web/chat'
import { ChatLine, UserCard } from '@vexoulz/platform-web/vue'

const props = defineProps<{ lines: Line[] }>()
const root = shallowRef<HTMLElement | null>(null)
const card = shallowRef<{ line: Line; anchor: HTMLElement } | null>(null)
const toggle = (line: Line, anchor: HTMLElement) => (card.value = card.value?.anchor === anchor ? null : { line, anchor })
// Opens on the first name, so the story shows the card over chat straight away.
onMounted(() => {
  const name = root.value?.querySelector<HTMLElement>('.who')
  if (name && props.lines[0]) card.value = { line: props.lines[0], anchor: name }
})
</script>

<template>
  <div ref="root">
    <ChatLine v-for="l in lines" :key="l.id" :line="l" user-cards :user-open="card?.line === l" @user="toggle" />
  </div>
  <UserCard v-if="card" :line="card.line" :anchor="card.anchor" @close="card = null" />
</template>
