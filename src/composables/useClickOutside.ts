import { onScopeDispose, watch, type Ref } from 'vue'

/**
 * Calls `handler` on a pointerdown outside `el`, or on Escape, while `active()` is true. The document listeners are
 * only attached while it's active, so a page full of closed popovers costs nothing per click.
 */
export function useDismiss(el: Ref<HTMLElement | null | undefined>, active: () => boolean, handler: () => void) {
  const outside = (e: PointerEvent) => {
    if (el.value && !el.value.contains(e.target as Node)) handler()
  }
  const esc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') handler()
  }
  const listen = (on: boolean) => {
    if (on) {
      document.addEventListener('pointerdown', outside)
      document.addEventListener('keydown', esc)
    } else {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('keydown', esc)
    }
  }
  watch(active, listen, { immediate: true })
  onScopeDispose(() => listen(false))
}
