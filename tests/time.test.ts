import { describe, expect, it } from 'vitest'
import { timeAgo } from '../src/utils/time'

describe('timeAgo', () => {
  const now = Date.parse('2026-09-26T12:00:00Z')
  it('counts seconds, minutes and hours, then shows the date', () => {
    expect(timeAgo(now - 12_000, now)).toBe('12s ago')
    expect(timeAgo('2026-09-26T11:55:00Z', now)).toBe('5 min ago')
    expect(timeAgo(now - 3 * 3600_000, now)).toBe('3 h ago')
    expect(timeAgo('2026-09-20T12:00:00Z', now)).toBe('2026-09-20')
  })
  it('handles the future and missing values', () => {
    expect(timeAgo(now + 300_000, now)).toBe('in 5 min')
    expect(timeAgo(null)).toBe('—')
    expect(timeAgo('nope')).toBe('—')
  })
})
