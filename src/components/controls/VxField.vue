<script setup lang="ts">
// Label + control + help or error text. The slot gets the id to put on the control.
import { useId } from 'vue'

withDefaults(defineProps<{ label: string; help?: string; error?: string }>(), {})
const id = useId()
</script>

<template>
  <div class="vx-field">
    <label class="vx-field-label" :for="id">{{ label }}</label>
    <slot :id="id"></slot>
    <span v-if="error" class="vx-field-error" role="alert">{{ error }}</span>
    <span v-else-if="help" class="vx-field-help">{{ help }}</span>
  </div>
</template>
