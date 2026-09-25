<script setup lang="ts">
// Renders the toasts from useToast(). Teleported to <body>: .vx-site is a size container, which would
// otherwise become the containing block for position: fixed.
import { useToast } from '../../composables/useToast'

const { toasts } = useToast()
const icon = { ok: '✓', info: 'i', error: '!' } as const
</script>

<template>
  <Teleport to="body">
    <div class="vx-toasts vx-overlay" role="status" aria-live="polite">
      <div v-for="t in toasts" :key="t.id" class="vx-toast" :class="`is-${t.kind}`">
        <span class="vx-toast-icon" aria-hidden="true">{{ icon[t.kind] }}</span>{{ t.message }}
      </div>
    </div>
  </Teleport>
</template>
