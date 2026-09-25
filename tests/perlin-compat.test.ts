// The TS port must match noisejs exactly, so a seed draws the same sky as the lab did.
// noisejs is a lab-only devDependency; this test goes away if the lab stops using it.
import { createRequire } from 'node:module'
import { describe, expect, it } from 'vitest'
import { createNoise } from '../src/utils/perlin'

const require = createRequire(import.meta.url)
const { Noise } = require('noisejs') as { Noise: new (seed: number) => { perlin2(x: number, y: number): number } }

describe('perlin port', () => {
  it('matches noisejs for several seeds', () => {
    for (const seed of [0, 0.1234, 0.5, 0.999, 42, 4096]) {
      const ours = createNoise(seed)
      const theirs = new Noise(seed)
      for (let i = 0; i < 300; i++) {
        const x = i * 1.37 - 50
        const y = i * 0.73 + 11
        expect(ours.perlin2(x, y)).toBe(theirs.perlin2(x, y))
      }
    }
  })
})
