// A clock for "updated 12s ago" and live durations. Everything asking for the same interval shares one timer, which
// runs only while something uses it.
import { getCurrentScope, onScopeDispose, readonly, ref, type Ref } from 'vue'

interface Clock {
  now: Ref<number>
  users: number
  timer: ReturnType<typeof setInterval>
}

const clocks = new Map<number, Clock>()

/** The current time (epoch ms), updated every `every` ms. Released when the scope (component) is disposed. */
export function useNow(every = 1000): Readonly<Ref<number>> {
  let clock = clocks.get(every)
  if (!clock) {
    const now = ref(Date.now())
    clock = { now, users: 0, timer: setInterval(() => (now.value = Date.now()), every) }
    clocks.set(every, clock)
  }
  clock.users++
  const own = clock
  if (getCurrentScope())
    onScopeDispose(() => {
      if (--own.users > 0) return
      clearInterval(own.timer)
      clocks.delete(every)
    })
  return readonly(own.now)
}
