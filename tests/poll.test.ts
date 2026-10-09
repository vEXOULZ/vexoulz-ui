import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick, ref } from 'vue'
import { useNow } from '../src/composables/useNow'
import { usePoll } from '../src/composables/usePoll'
import { useResource } from '../src/composables/useResource'

/** A load whose answers the test settles by hand, in any order. */
function deferredLoad<T>() {
  const calls: { signal: AbortSignal; resolve: (v: T) => void; reject: (e: unknown) => void }[] = []
  const load = vi.fn(
    (signal: AbortSignal) =>
      new Promise<T>((resolve, reject) => {
        calls.push({ signal, resolve, reject })
      }),
  )
  return { load, calls }
}

const flush = () => new Promise<void>((r) => setTimeout(r, 0))

function setHidden(hidden: boolean) {
  Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => (hidden ? 'hidden' : 'visible') })
  document.dispatchEvent(new Event('visibilitychange'))
}

describe('useResource', () => {
  it('loads once, keeps the data on a failed reload and clears the error on success', async () => {
    const { load, calls } = deferredLoad<number>()
    const scope = effectScope()
    const r = scope.run(() => useResource(load))!
    expect(r.loading.value).toBe(true)
    calls[0]!.resolve(1)
    await flush()
    expect([r.data.value, r.loading.value, r.error.value]).toEqual([1, false, null])
    expect(r.updated.value).toBeTypeOf('number')

    void r.reload()
    expect(r.data.value).toBe(1) // stale data stays while reloading
    calls[1]!.reject(new Error('down'))
    await flush()
    expect(r.data.value).toBe(1)
    expect((r.error.value as Error).message).toBe('down')

    void r.reload()
    calls[2]!.resolve(2)
    await flush()
    expect([r.data.value, r.error.value]).toEqual([2, null])
    scope.stop()
  })

  it('aborts the older load, and its late answer never wins', async () => {
    const { load, calls } = deferredLoad<string>()
    const scope = effectScope()
    const r = scope.run(() => useResource(load))!
    void r.reload()
    expect(calls[0]!.signal.aborted).toBe(true)
    calls[1]!.resolve('new')
    calls[0]!.resolve('old')
    await flush()
    expect(r.data.value).toBe('new')
    calls[0]!.reject(new DOMException('aborted', 'AbortError'))
    await flush()
    expect(r.error.value).toBeNull()
    scope.stop()
  })

  it('reloads when the source changes, dropping the old data', async () => {
    const id = ref(1)
    const { load, calls } = deferredLoad<string>()
    const scope = effectScope()
    const r = scope.run(() => useResource(load, { source: id }))!
    calls[0]!.resolve('vod 1')
    await flush()
    expect(r.data.value).toBe('vod 1')
    id.value = 2
    await nextTick()
    expect(r.data.value).toBeNull()
    calls[1]!.resolve('vod 2')
    await flush()
    expect(r.data.value).toBe('vod 2')
    expect(load).toHaveBeenCalledTimes(2)
    scope.stop()
  })

  it('aborts the load in flight when its scope is disposed', () => {
    const { load, calls } = deferredLoad<number>()
    const scope = effectScope()
    scope.run(() => useResource(load))
    scope.stop()
    expect(calls[0]!.signal.aborted).toBe(true)
  })
})

describe('usePoll', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.useRealTimers()
    setHidden(false)
  })

  it('reloads every interval after each load ends', async () => {
    const load = vi.fn(async () => load.mock.calls.length)
    const scope = effectScope()
    const r = scope.run(() => usePoll(load, 1000))!
    await vi.advanceTimersByTimeAsync(0)
    expect(r.data.value).toBe(1)
    await vi.advanceTimersByTimeAsync(1000)
    expect(load).toHaveBeenCalledTimes(2)
    await vi.advanceTimersByTimeAsync(1000)
    expect(load).toHaveBeenCalledTimes(3)
    scope.stop()
    await vi.advanceTimersByTimeAsync(5000)
    expect(load).toHaveBeenCalledTimes(3)
  })

  it('pauses while the tab is hidden and catches up when it comes back, if stale', async () => {
    const load = vi.fn(async () => 'x')
    const scope = effectScope()
    scope.run(() => usePoll(load, 1000))
    await vi.advanceTimersByTimeAsync(0)
    setHidden(true)
    await vi.advanceTimersByTimeAsync(5000)
    expect(load).toHaveBeenCalledTimes(1)
    setHidden(false)
    await vi.advanceTimersByTimeAsync(0)
    expect(load).toHaveBeenCalledTimes(2)
    // Fresh data: hiding and showing again right away doesn't reload.
    setHidden(true)
    setHidden(false)
    await vi.advanceTimersByTimeAsync(0)
    expect(load).toHaveBeenCalledTimes(2)
    scope.stop()
  })

  it('takes the interval from a function and 0 pauses it', async () => {
    const every = ref(1000)
    const load = vi.fn(async () => 'x')
    const scope = effectScope()
    const r = scope.run(() => usePoll(load, () => every.value))!
    await vi.advanceTimersByTimeAsync(0)
    every.value = 0
    await vi.advanceTimersByTimeAsync(1000) // the wait already scheduled still runs once
    await vi.advanceTimersByTimeAsync(10_000)
    expect(load).toHaveBeenCalledTimes(2)
    every.value = 500
    await r.reload()
    await vi.advanceTimersByTimeAsync(500)
    expect(load).toHaveBeenCalledTimes(4)
    scope.stop()
  })

  it('removes its listener and aborts the load in flight on dispose', async () => {
    const { load, calls } = deferredLoad<number>()
    const remove = vi.spyOn(document, 'removeEventListener')
    const scope = effectScope()
    scope.run(() => usePoll(load, 1000))
    scope.stop()
    expect(calls[0]!.signal.aborted).toBe(true)
    expect(remove).toHaveBeenCalledWith('visibilitychange', expect.any(Function))
    remove.mockRestore()
  })
})

describe('useNow', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('ticks, shares one timer per interval and stops it when the last user goes', () => {
    const a = effectScope()
    const b = effectScope()
    const nowA = a.run(() => useNow(1000))!
    const nowB = b.run(() => useNow(1000))!
    expect(vi.getTimerCount()).toBe(1)
    const start = nowA.value
    vi.advanceTimersByTime(1000)
    expect(nowA.value).toBe(start + 1000)
    expect(nowB.value).toBe(nowA.value)
    a.stop()
    expect(vi.getTimerCount()).toBe(1)
    b.stop()
    expect(vi.getTimerCount()).toBe(0)
  })
})
