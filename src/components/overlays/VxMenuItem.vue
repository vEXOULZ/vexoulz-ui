<script setup lang="ts">
// One row in a popover menu: main label, optional secondary text on the right, optional leading slot.
import { computed } from 'vue'
import VxLink from '../chrome/VxLink.vue'

const props = withDefaults(
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

const link = computed(() => !!(props.to || props.href) && !props.disabled)
const bind = computed(() =>
  link.value
    ? { to: props.to, href: props.href, external: props.external, 'aria-current': props.current ? 'page' : undefined }
    : { type: 'button', disabled: props.disabled, 'aria-current': props.current ? 'true' : undefined },
)
</script>

<template>
  <component
    :is="link ? VxLink : 'button'"
    v-bind="bind"
    class="vx-menu-item"
    :class="{ 'is-current': current, 'is-danger': danger }"
    role="menuitem"
    @click="$emit('click', $event)"
  >
    <slot name="lead"></slot>
    <span class="vx-menu-main"><slot></slot></span>
    <span v-if="sub" class="vx-menu-sub">{{ sub }}</span>
    <slot name="trail"></slot>
  </component>
</template>
