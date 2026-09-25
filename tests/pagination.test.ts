import { describe, expect, it } from 'vitest'
import { pageRange } from '../src/utils/pagination'

describe('pageRange', () => {
  it('lists every page when few', () => {
    expect(pageRange(1, 1)).toEqual([1])
    expect(pageRange(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('handles empty and out-of-range pages', () => {
    expect(pageRange(1, 0)).toEqual([])
    expect(pageRange(99, 54)).toEqual([1, 'gap', 50, 51, 52, 53, 54])
    expect(pageRange(-3, 54)).toEqual([1, 2, 3, 4, 5, 'gap', 54])
  })

  it('shows first, last and a window around the current page', () => {
    expect(pageRange(3, 54)).toEqual([1, 2, 3, 4, 5, 'gap', 54])
    expect(pageRange(27, 54)).toEqual([1, 'gap', 26, 27, 28, 'gap', 54])
    expect(pageRange(54, 54)).toEqual([1, 'gap', 50, 51, 52, 53, 54])
  })

  it('keeps the same number of items while paging', () => {
    for (let p = 1; p <= 54; p++) expect(pageRange(p, 54)).toHaveLength(7)
    for (let p = 1; p <= 30; p++) expect(pageRange(p, 30, 2)).toHaveLength(9)
  })

  it('never uses a gap to hide a single page', () => {
    for (let total = 1; total <= 40; total++) {
      for (let p = 1; p <= total; p++) {
        const r = pageRange(p, total)
        r.forEach((item, i) => {
          if (item !== 'gap') return
          expect((r[i + 1] as number) - (r[i - 1] as number)).toBeGreaterThan(2)
        })
        // Pages are strictly increasing and include the current one
        const nums = r.filter((x): x is number => x !== 'gap')
        expect(nums).toContain(p)
        expect([...nums].sort((a, b) => a - b)).toEqual(nums)
        expect(new Set(nums).size).toBe(nums.length)
      }
    }
  })
})
