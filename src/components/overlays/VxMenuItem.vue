<script setup lang="ts">
// One row in a popover menu: main label, optional secondary text on the right, optional leading slot.
import VxLink from '../chrome/VxLink.vue'

withDefaults(
  defineProps<{
    sub?: string
    current?: boolean
    danger?: boolean
    disabled?: boolean
    /** Render as a link instead of a button. */
    to?: string
    href?: string
    external?: boolean
  }>(),
  { current: false, danger: false, disabled: false, external: false },
)
defineEmits<{ click: [e: MouseEvent] }>()
</script>

<template>
  <VxLink
    v-if="(to || href) && !disabled"
    class="vx-menu-item"
    :class="{ 'is-current': current, 'is-danger': danger }"
    :to="to"
    :href="href"
    :external="external"
    role="menuitem"
    :aria-current="current ? 'page' : undefined"
    @click="$emit('click', $event)"
  >
    <slot name="lead"></slot>
    <span class="vx-menu-main"><slot></slot></span>
    <span v-if="sub" class="vx-menu-sub">{{ sub }}</span>
    <slot name="trail"></slot>
  </VxLink>
  <button
    v-else
    type="button"
    class="vx-menu-item"
    :class="{ 'is-current': current, 'is-danger': danger }"
    :disabled="disabled"
    role="menuitem"
    :aria-current="current ? 'true' : undefined"
    @click="$emit('click', $event)"
  >
    <slot name="lead"></slot>
    <span class="vx-menu-main"><slot></slot></span>
    <span v-if="sub" class="vx-menu-sub">{{ sub }}</span>
    <slot name="trail"></slot>
  </button>
</template>
