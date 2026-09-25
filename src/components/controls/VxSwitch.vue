<script setup lang="ts">
withDefaults(defineProps<{ label?: string; disabled?: boolean; id?: string }>(), { disabled: false })
const model = defineModel<boolean>({ default: false })
</script>

<template>
  <label v-if="label || $slots.default" class="vx-check" :class="{ 'is-disabled': disabled }">
    <button
      :id="id"
      type="button"
      role="switch"
      class="vx-switch"
      :class="{ 'is-on': model }"
      :aria-checked="model"
      :disabled="disabled"
      @click="model = !model"
    ></button>
    <slot>{{ label }}</slot>
  </label>
  <button
    v-else
    :id="id"
    type="button"
    role="switch"
    class="vx-switch"
    :class="{ 'is-on': model }"
    :aria-checked="model"
    :disabled="disabled"
    @click="model = !model"
  ></button>
</template>
