/** Small seeded PRNG (mulberry32): same seed, same sequence. */
export function mulberry32(seed: number): () => number {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** FNV-1a string hash, used to turn a hostname into a seed. */
export function hashString(s: string): number {
  let x = 2166136261
  for (const c of s) x = Math.imul(x ^ c.charCodeAt(0), 16777619)
  return x >>> 0
}
