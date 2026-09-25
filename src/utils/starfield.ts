// Star generation for VxStarfield: the same spectral classes and perlin clumping as the original stars_bg.js,
// seeded so a hostname always draws the same sky.
import { createNoise } from './perlin'
import { hashString, mulberry32 } from './random'

export type Spectrum = 'classic' | 'bright' | 'mono'
export type MeteorRate = 'rare' | 'normal' | 'frequent'

export interface StarfieldOptions {
  /** Stars per 10 000 px². */
  density: number
  /** 0 = uniform, 1 = full perlin clumping. */
  cluster: number
  spectrum: Spectrum
  twinkle: boolean
  /** Pointer parallax. */
  pointer: boolean
  /** Parallax strength in px. */
  parallax: number
  meteors: boolean
  meteorRate: MeteorRate
  drift: boolean
  band: boolean
  glow: boolean
}

/** The look picked in the lab (v4). */
export const STARFIELD_DEFAULTS: StarfieldOptions = {
  density: 3.2,
  cluster: 1,
  spectrum: 'classic',
  twinkle: true,
  pointer: true,
  parallax: 14,
  meteors: true,
  meteorRate: 'normal',
  drift: false,
  band: false,
  glow: false,
}

// [cumulative probability, colour, size multiplier]; "classic" is the table from stars_bg.js
type SpectralClass = readonly [number, string, number]
export const SPECTRA: Record<Spectrum, readonly SpectralClass[]> = {
  classic: [[0.0000006, '#92b5ff', 6.6], [0.0024, '#a2c0ff', 1.8], [0.0122, '#d5e0ff', 1.4], [0.06, '#f9f5ff', 1.15], [0.152, '#ffede3', 0.96], [0.24, '#ffdab5', 0.7], [1, '#ffb56c', 0.5]],
  bright: [[0.01, '#92b5ff', 2.2], [0.06, '#a2c0ff', 1.8], [0.16, '#d5e0ff', 1.4], [0.36, '#f9f5ff', 1.15], [0.58, '#ffede3', 0.96], [0.78, '#ffdab5', 0.7], [1, '#ffb56c', 0.5]],
  mono: [[0.0024, '#e9edff', 1.8], [0.0122, '#e9edff', 1.4], [0.06, '#e9edff', 1.15], [0.24, '#e9edff', 0.9], [1, '#e9edff', 0.6]],
}

/** Seconds between meteors, [min, max]. */
export const METEOR_GAPS: Record<MeteorRate, readonly [number, number]> = { rare: [12, 30], normal: [4, 13], frequent: [1.2, 4] }

export interface Star {
  x: number
  y: number
  size: number
  color: string
  depth: number
  period: number
  phase: number
}

/** Distance from the milky-way band, a diagonal across the first screenful. */
function bandDist(x: number, y: number, w: number, h: number) {
  const vh = Math.min(h, 900)
  const x1 = 0, y1 = vh * 0.85, x2 = w, y2 = vh * 0.05
  const dx = x2 - x1, dy = y2 - y1
  return Math.abs(dy * x - dx * y + x2 * y1 - y2 * x1) / Math.hypot(dx, dy)
}

/** Deterministic stars for a seed and size. Also returns the rng so the nebula continues the same sequence. */
export function generateStars(seed: string, w: number, h: number, o: StarfieldOptions) {
  const rnd = mulberry32(hashString(seed))
  const noise = createNoise(rnd())
  const spectrum = SPECTRA[o.spectrum] ?? SPECTRA.classic
  const bandW = Math.min(w, 900) * 0.16
  const target = Math.round((o.density * w * h) / 10000)
  const stars: Star[] = []
  for (let tries = 0; stars.length < target && tries < target * 25; tries++) {
    const x = rnd() * w, y = rnd() * h
    let chance = 1 - o.cluster + o.cluster * ((noise.perlin2(x / 140, y / 140) + 0.5) / 1.5)
    if (o.band) chance *= 0.3 + 1.4 * Math.exp(-((bandDist(x, y, w, h) / bandW) ** 2))
    if (rnd() > chance) continue
    const roll = rnd()
    const [, color, mult] = spectrum.find(([p]) => roll < p) ?? spectrum[spectrum.length - 1]!
    const size = Math.floor(2 * mult * rnd()) + 1
    stars.push({ x, y, size, color, depth: 0.2 + rnd() * 0.8, period: rnd() * 5 + 1, phase: rnd() * Math.PI * 2 })
  }
  return { stars, rnd, bandW }
}
