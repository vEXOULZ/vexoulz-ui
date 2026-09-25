import { onMounted, onUnmounted, type Ref } from 'vue'

/** Calls `handler` on a pointerdown outside `el`, or on Escape, while `active()` is true. */
export function useDismiss(el: Ref<HTMLElement | null | undefined>, active: () => boolean, handler: () => void) {
  const outside = (e: PointerEvent) => {
    if (active() && el.value && !el.value.contains(e.target as Node)) handler()
  }
  const esc = (e: KeyboardEvent) => {
    if (active() && e.key === 'Escape') handler()
  }
  onMounted(() => {
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', esc)
  })
  onUnmounted(() => {
    document.removeEventListener('pointerdown', outside)
    document.removeEventListener('keydown', esc)
  })
}
