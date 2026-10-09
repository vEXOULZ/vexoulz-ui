// A useResource() that also reloads every `every` ms while the tab is visible. A hidden tab doesn't poll; coming
// back to it reloads right away if the data is older than one interval. Stops (timer, listener, load in flight) when
// the scope (component) is disposed.
import { getCurrentScope, onScopeDispose, watch } from 'vue'
import { useResource, type Resource, type ResourceOptions } from './useResource'

/** `every`: the interval in ms, read before each wait; 0 pauses polling until the next reload(). */
export function usePoll<T>(
  load: (signal: AbortSignal) => Promise<T>,
  every: number | (() => number),
  options: ResourceOptions = {},
): Resource<T> {
  const interval = () => (typeof every === 'function' ? every() : every)
  const hidden = () => typeof document !== 'undefined' && document.visibilityState === 'hidden'
  let timer: ReturnType<typeof setTimeout> | undefined
  let stopped = false

  const resource = useResource(load, options)

  function schedule() {
    clearTimeout(timer)
    const wait = interval()
    if (stopped || wait <= 0) return
    // A hidden tab lets the timer lapse; onVisible picks it up again.
    timer = setTimeout(() => !hidden() && void resource.reload(), wait)
  }

  // Each load, however it started, ends by scheduling the next one.
  watch(resource.loading, (busy) => (busy ? clearTimeout(timer) : schedule()), { flush: 'sync' })
  if (!resource.loading.value) schedule()

  const onVisible = () => {
    if (hidden() || stopped || resource.loading.value) return
    const wait = interval()
    const updated = resource.updated.value
    if (wait > 0 && (updated === null || Date.now() - updated >= wait)) void resource.reload()
  }
  if (typeof document !== 'undefined') document.addEventListener('visibilitychange', onVisible)

  function stop() {
    stopped = true
    clearTimeout(timer)
    if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', onVisible)
    resource.stop()
  }
  if (getCurrentScope()) onScopeDispose(stop)

  return { ...resource, stop }
}
