<script setup>
// Placeholder for any logo, icon, thumbnail or image asset.
defineProps({
  label: { type: String, default: 'img' },
  w: { type: [Number, String], default: null },
  h: { type: [Number, String], default: null },
  ratio: { type: String, default: null },
  round: { type: Boolean, default: false },
})
</script>

<template>
  <div
    class="ph"
    :class="{ round }"
    :style="{
      width: w == null ? '100%' : (typeof w === 'number' ? w + 'px' : w),
      height: h == null ? 'auto' : (typeof h === 'number' ? h + 'px' : h),
      aspectRatio: ratio || undefined,
    }"
  >
    <span>{{ label }}</span>
  </div>
</template>

<style scoped>
.ph {
  flex: none;
  display: grid;
  place-items: center;
  overflow: hidden;
  border: 1px dashed color-mix(in srgb, var(--ink) 30%, transparent);
  border-radius: var(--radius-sm);
  background: repeating-linear-gradient(
    -45deg,
    color-mix(in srgb, var(--ink) 7%, transparent) 0 6px,
    transparent 6px 12px
  );
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: 10px;
  line-height: 1.1;
  text-align: center;
  padding: 2px;
}
.ph.round { border-radius: 50%; }
</style>
