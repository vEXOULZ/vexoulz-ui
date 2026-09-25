import { describe, expect, it } from 'vitest'
import { createNoise } from '../src/utils/perlin'
import { hashString, mulberry32 } from '../src/utils/random'
import { generateStars, STARFIELD_DEFAULTS } from '../src/utils/starfield'

describe('starfield', () => {
  it('is deterministic per seed', () => {
    const a = generateStars('vods.vexoulz.net', 800, 600, STARFIELD_DEFAULTS).stars
    const b = generateStars('vods.vexoulz.net', 800, 600, STARFIELD_DEFAULTS).stars
    const c = generateStars('dtp.vexoulz.net', 800, 600, STARFIELD_DEFAULTS).stars
    expect(a).toEqual(b)
    expect(a).not.toEqual(c)
  })

  it('hits the density target inside the area', () => {
    const { stars } = generateStars('vexoulz.net', 1000, 1000, STARFIELD_DEFAULTS)
    expect(stars).toHaveLength(Math.round((STARFIELD_DEFAULTS.density * 1000 * 1000) / 10000))
    for (const s of stars) {
      expect(s.x).toBeGreaterThanOrEqual(0)
      expect(s.x).toBeLessThan(1000)
      expect(s.size).toBeGreaterThanOrEqual(1)
    }
  })

  it('perlin noise is seeded, bounded and zero on grid points', () => {
    const n = createNoise(mulberry32(hashString('x'))())
    expect(n.perlin2(3, 7)).toBe(0)
    for (let i = 0; i < 200; i++) expect(Math.abs(n.perlin2(i * 0.37, i * 0.91))).toBeLessThanOrEqual(1)
    expect(createNoise(0.5).perlin2(1.3, 2.7)).toBe(createNoise(0.5).perlin2(1.3, 2.7))
    expect(createNoise(0.5).perlin2(1.3, 2.7)).not.toBe(createNoise(0.25).perlin2(1.3, 2.7))
  })
})
