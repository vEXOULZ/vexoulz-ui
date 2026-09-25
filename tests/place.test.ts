import { describe, expect, it } from 'vitest'
import { place } from '../src/utils/place'

const bounds = { top: 48, bottom: 900 } // main starts under the 48px header
const base = { bounds, viewport: 900, cap: 420 }

describe('place', () => {
  it('opens down when the whole list fits below', () => {
    expect(place({ ...base, anchor: { top: 100, bottom: 132 }, prefer: 'down', content: 300 })).toEqual({ dir: 'down', maxHeight: 420 })
  })

  it('flips up when the content does not fit below and there is more room above', () => {
    const r = place({ ...base, anchor: { top: 700, bottom: 732 }, prefer: 'down', content: 300 })
    expect(r.dir).toBe('up')
    expect(r.maxHeight).toBe(420)
  })

  it('stays on the preferred side if it has at least as much room as the other', () => {
    // above: 440 - 48 - 10 = 382, below: 900 - 472 - 10 = 418
    const r = place({ ...base, anchor: { top: 440, bottom: 472 }, prefer: 'down', content: 1000 })
    expect(r).toEqual({ dir: 'down', maxHeight: 418 })
    // one pixel less room below than above: flips
    const r2 = place({ ...base, anchor: { top: 461, bottom: 492 }, prefer: 'down', content: 1000 })
    expect(r2.dir).toBe('up')
  })

  it('never goes above main (under the header) when opening up', () => {
    // room above = 300 - 48 - 10 = 242, room below = 900 - 332 - 10 = 558, so it flips down
    const r = place({ ...base, anchor: { top: 300, bottom: 332 }, prefer: 'up', content: 1000 })
    expect(r.dir).toBe('down')
    const r2 = place({ ...base, anchor: { top: 600, bottom: 632 }, prefer: 'up', content: 1000 })
    expect(r2).toEqual({ dir: 'up', maxHeight: 420 })
    const r3 = place({ ...base, cap: 1000, anchor: { top: 600, bottom: 632 }, prefer: 'up', content: 1000 })
    expect(r3.maxHeight).toBe(600 - 48 - 10)
  })

  it('clips bounds to the viewport and keeps a minimum height', () => {
    const r = place({ anchor: { top: 60, bottom: 92 }, bounds: { top: -500, bottom: 3000 }, viewport: 200, prefer: 'down', cap: 420, content: 400 })
    expect(r.dir).toBe('down')
    expect(r.maxHeight).toBe(120) // 200 - 92 - 10 = 98, raised to the 120 minimum
  })

  it('uses cap as the need when content is not measured yet', () => {
    // below: 358 < cap 420, above: 442, so it flips
    const r = place({ ...base, anchor: { top: 500, bottom: 532 }, prefer: 'down' })
    expect(r.dir).toBe('up')
  })
})
