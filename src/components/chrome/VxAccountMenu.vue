<script setup lang="ts">
// Account control: always exactly one control-height tall, signed in or out, so the header never changes size.
// Signed out: a panel-styled "Sign in" button (icon-only on narrow sites). Signed in: an avatar opening a menu.
// The menu's items come from the site through the default slot.
import { computed } from 'vue'
import type { AccountUser } from '../../types'
import { twitchColor } from '../../utils/color'
import VxPlaceholder from '../media/VxPlaceholder.vue'
import VxPopover from '../overlays/VxPopover.vue'
import VxMenuItem from '../overlays/VxMenuItem.vue'
import VxMenuSeparator from '../overlays/VxMenuSeparator.vue'

const props = withDefaults(
  defineProps<{
    user?: AccountUser | null
    /** Sign-in isn't available yet (accounts ship in a later phase). */
    disabled?: boolean
    note?: string
  }>(),
  { user: null, disabled: false, note: 'signed in on all *.vexoulz.net' },
)
const emit = defineEmits<{ signIn: []; signOut: [] }>()
const nameColor = computed(() => (props.user ? twitchColor(props.user.name, props.user.color) : undefined))
</script>

<template>
  <button
    v-if="!user"
    type="button"
    class="vx-btn vx-signin"
    :disabled="disabled"
    :title="disabled ? 'Sign in is coming soon' : 'Sign in with Twitch'"
    @click="emit('signIn')"
  >
    <slot name="signin-icon"><VxPlaceholder label="tw" :w="16" :h="16" /></slot>
    <span class="vx-signin-label">Sign in</span>
  </button>
  <VxPopover v-else align="right" width="270px">
    <template #trigger="{ toggle, open }">
      <button
        type="button"
        class="vx-account-trigger vx-ring"
        :aria-expanded="open"
        aria-haspopup="menu"
        :aria-label="`Account: ${user.name}`"
        @click="toggle"
      >
        <img v-if="user.avatar" :src="user.avatar" alt="" style="width: 100%; height: 100%; border-radius: 50%" />
        <VxPlaceholder v-else label="pfp" w="100%" h="100%" round />
      </button>
    </template>
    <template #default="{ close }">
      <div class="vx-account-who">
        <img v-if="user.avatar" :src="user.avatar" alt="" width="36" height="36" style="border-radius: 50%" />
        <VxPlaceholder v-else label="pfp" :w="36" :h="36" round />
        <div style="min-width: 0">
          <div class="vx-account-name" :style="{ color: nameColor }">{{ user.name }}</div>
          <div class="vx-muted vx-mono" style="font-size: 11px">{{ note }}</div>
        </div>
      </div>
      <slot :close="close"></slot>
      <VxMenuSeparator />
      <VxMenuItem danger @click="emit('signOut'); close()">Sign out everywhere</VxMenuItem>
    </template>
  </VxPopover>
</template>
