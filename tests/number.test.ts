import { describe, expect, it } from 'vitest'
import { clamp, decimalsOf, stepValue } from '../src/utils/number'

describe('number stepping', () => {
  it('counts step decimals', () => {
    expect(decimalsOf(1)).toBe(0)
    expect(decimalsOf(0.1)).toBe(1)
    expect(decimalsOf(0.25)).toBe(2)
    expect(decimalsOf(1e-7)).toBe(7)
  })

  it('steps without float noise', () => {
    expect(stepValue(0.2, 1, { step: 0.1 })).toBe(0.3)
    expect(stepValue(0.3, -1, { step: 0.1 })).toBe(0.2)
    expect(stepValue(1.5, 1, { step: 0.1, big: true })).toBe(2.5)
  })

  it('clamps', () => {
    expect(stepValue(0, -1, { step: 0.1, min: 0 })).toBe(0)
    expect(stepValue(9.95, 1, { step: 0.1, max: 10 })).toBe(10)
    expect(clamp(5, 0, 3)).toBe(3)
  })

  it('treats a non-number as 0', () => {
    expect(stepValue(Number.NaN, 1, { step: 0.1 })).toBe(0.1)
  })
})
