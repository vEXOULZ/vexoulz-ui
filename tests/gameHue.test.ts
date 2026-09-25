import { describe, expect, it } from 'vitest'
import { nextTick, effect } from 'vue'
import { dominantHue, gameColor, hasGameHue, setGameHue } from '../src/utils/color'

/** RGBA bytes for n pixels of one colour. */
const fill = (n: number, [r, g, b]: [number, number, number], a = 255) => Array.from({ length: n }, () => [r, g, b, a]).flat()

describe('dominantHue', () => {
  it('finds the main colour', () => {
    expect(dominantHue(fill(10, [255, 0, 0]))).toBe(0)
    expect(dominantHue(fill(10, [0, 0, 255]))).toBe(240)
    expect(dominantHue([...fill(30, [120, 40, 200]), ...fill(5, [255, 200, 0])])).toBe(270)
  })

  it('ignores greys, near-black and transparent pixels', () => {
    expect(dominantHue([...fill(50, [128, 128, 128]), ...fill(50, [5, 0, 10]), ...fill(10, [0, 200, 0])])).toBe(120)
    expect(dominantHue(fill(10, [255, 0, 0], 0))).toBeNull()
  })

  it('gives up on grey art', () => {
    expect(dominantHue(fill(100, [40, 40, 40]))).toBeNull()
    expect(dominantHue([...fill(99, [200, 200, 200]), ...fill(1, [255, 0, 0])])).toBeNull()
  })

  it('handles hues across 0°', () => {
    const h = dominantHue([...fill(10, [255, 0, 20]), ...fill(10, [255, 20, 0])])!
    expect(h < 5 || h > 355).toBe(true)
  })
})

describe('game hues from art', () => {
  it('overrides the name hue and keeps the pastel family', () => {
    const name = 'Test Game A'
    const before = gameColor(name)
    setGameHue(name, 200)
    expect(hasGameHue(name)).toBe(true)
    expect(gameColor(name)).toBe('hsl(200 38% 62%)')
    setGameHue(name, null)
    expect(gameColor(name)).toBe(before)
  })

  it('is reactive', async () => {
    const name = 'Test Game B'
    let seen = ''
    effect(() => (seen = gameColor(name)))
    setGameHue(name, -30)
    await nextTick()
    expect(seen).toBe('hsl(330 38% 62%)')
  })
})
