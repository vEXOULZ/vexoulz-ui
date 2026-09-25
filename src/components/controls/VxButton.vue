<script setup lang="ts">
// Every button: one height (32px, or 26px small). Icon buttons are square and keep their size when their
// icon changes; confirmations ("copied") go to a toast, never into the button.
import VxLink from '../chrome/VxLink.vue'

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'primary' | 'ghost' | 'danger' | 'danger-solid'
    size?: 'md' | 'sm'
    /** Square icon-only button; give it a `label` for screen readers. */
    icon?: boolean
    /** Accessible name (and tooltip) for icon buttons. */
    label?: string
    loading?: boolean
    /** Toggle state, shown in the accent colour. */
    pressed?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    /** Render as a link. */
    to?: string
    href?: string
    external?: boolean
  }>(),
  { variant: 'default', size: 'md', icon: false, loading: false, pressed: undefined, disabled: false, type: 'button' },
)
defineEmits<{ click: [e: MouseEvent] }>()

const classes = () => [
  'vx-btn',
  props.variant !== 'default' && `is-${props.variant}`,
  props.size === 'sm' && 'is-sm',
  props.icon && 'is-icon',
  props.pressed && 'is-pressed',
]
</script>

<template>
  <VxLink
    v-if="(to || href) && !disabled"
    :class="classes()"
    :to="to"
    :href="href"
    :external="external"
    :title="label"
    :aria-label="icon ? label : undefined"
  ><slot></slot></VxLink>
  <button
    v-else
    :type="type"
    :class="classes()"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
    :aria-pressed="pressed"
    :title="label"
    :aria-label="icon ? label : undefined"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="vx-spinner" aria-hidden="true"></span>
    <slot v-if="!(loading && icon)"></slot>
  </button>
</template>
