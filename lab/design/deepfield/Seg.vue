<script setup>
// Segmented control for the lab UI. options: ['a', 'b'] or [['a', 'Label A'], ...]
defineProps({ options: { type: Array, required: true }, disabled: { type: Boolean, default: false } })
const model = defineModel()
</script>

<template>
  <div class="seg" :class="{ disabled }">
    <button
      v-for="o in options"
      :key="Array.isArray(o) ? o[0] : o"
      :class="{ on: model === (Array.isArray(o) ? o[0] : o) }"
      :disabled="disabled"
      @click="model = Array.isArray(o) ? o[0] : o"
    >{{ Array.isArray(o) ? o[1] : o }}</button>
  </div>
</template>

<style scoped>
.seg { display: inline-flex; border: 1px solid #2c2c31; border-radius: 7px; overflow: hidden; flex-wrap: wrap; }
.seg button {
  font: inherit; font-size: 12px; padding: 3px 10px; background: transparent; color: #8d8d96;
  border: none; border-right: 1px solid #2c2c31; cursor: pointer;
}
.seg button:last-child { border-right: none; }
.seg button.on { background: #2e2e35; color: #e8e8ea; }
.seg.disabled { opacity: 0.35; }
</style>
