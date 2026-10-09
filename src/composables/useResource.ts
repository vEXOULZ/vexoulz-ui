// Loads data, and again whenever `source` changes (a route param) or reload() is called. A newer load aborts the one
// in flight and wins even if the older one answers later. The last good data stays while reloading and when a reload
// fails, so a page can say it's stale instead of going blank. The data is replaced whole, never changed in place, so
// it isn't made deeply reactive.
import { getCurrentScope, onScopeDispose, readonly, ref, shallowRef, watch, type Ref, type WatchSource } from 'vue'

export interface ResourceOptions {
  /** Reload when this changes (and load right away). Without it, loads once on creation. */
  source?: WatchSource
  /** Drop the old data when `source` changes, since it describes something else. Default true. */
  resetOnSource?: boolean
}

export interface Resource<T> {
  readonly data: Ref<T | null>
  /** What the last load threw (an AbortError never lands here); null after a load succeeds. */
  readonly error: Readonly<Ref<unknown>>
  readonly loading: Readonly<Ref<boolean>>
  /** When `data` was fetched (epoch ms), null before the first success. */
  readonly updated: Readonly<Ref<number | null>>
  reload(): Promise<void>
  /** Aborts the load in flight. Called for you when the scope (component) is disposed. */
  stop(): void
}

export function useResource<T>(load: (signal: AbortSignal) => Promise<T>, options: ResourceOptions = {}): Resource<T> {
  const data = shallowRef<T | null>(null) as Ref<T | null>
  const error = shallowRef<unknown>(null)
  const loading = ref(false)
  const updated = ref<number | null>(null)
  let run = 0
  let ctrl: AbortController | null = null

  async function reload() {
    const mine = ++run
    ctrl?.abort()
    const own = (ctrl = new AbortController())
    loading.value = true
    try {
      const value = await load(own.signal)
      if (mine !== run) return
      data.value = value
      error.value = null
      updated.value = Date.now()
    } catch (e) {
      if (mine === run && !own.signal.aborted) error.value = e
    } finally {
      if (mine === run) {
        loading.value = false
        ctrl = null
      }
    }
  }

  function stop() {
    run++
    ctrl?.abort()
    ctrl = null
    loading.value = false
  }

  if (options.source) {
    watch(
      options.source,
      (_v, old) => {
        if (old !== undefined && options.resetOnSource !== false) {
          data.value = null
          error.value = null
          updated.value = null
        }
        void reload()
      },
      { immediate: true },
    )
  } else void reload()
  if (getCurrentScope()) onScopeDispose(stop)

  return { data, error: readonly(error), loading: readonly(loading), updated: readonly(updated), reload, stop }
}
