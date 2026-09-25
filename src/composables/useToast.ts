import { readonly, ref } from 'vue'

export type ToastKind = 'ok' | 'info' | 'error'

export interface Toast {
  id: number
  message: string
  kind: ToastKind
}

const toasts = ref<Toast[]>([])
let nextId = 1

function dismiss(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

/** Show a short confirmation ("Link copied"). Rendered by <VxToastHost>, which VxSiteShell includes. */
function show(message: string, opts: { kind?: ToastKind; duration?: number } = {}): number {
  const id = nextId++
  toasts.value = [...toasts.value.slice(-2), { id, message, kind: opts.kind ?? 'ok' }]
  setTimeout(() => dismiss(id), opts.duration ?? 1800)
  return id
}

export function useToast() {
  return { toasts: readonly(toasts), show, dismiss }
}
