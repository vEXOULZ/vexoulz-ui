import { describe, expect, it } from 'vitest'
import { contrastOnBlack, gameColor, initials, readableOnBlack, twitchColor, TWITCH_DEFAULT_COLORS } from '../src/utils/color'

const toHex = (s: string) =>
  '#' + (s.match(/\d+/g) ?? []).map((n) => Number(n).toString(16).padStart(2, '0')).join('')

describe('colours', () => {
  it('gives each game a stable colour', () => {
    expect(gameColor('Balatro')).toBe(gameColor('Balatro'))
    expect(gameColor('Balatro')).toMatch(/^hsl\(\d+ 38% 62%\)$/)
    expect(gameColor('Balatro')).not.toBe(gameColor('DOOM Eternal'))
  })

  it('makes poster initials', () => {
    expect(initials('Hollow Knight')).toBe('HK')
    expect(initials('the legend of zelda breath')).toBe('TLO')
    expect(initials('  Balatro ')).toBe('B')
  })

  it('lifts dark chat colours to 4.5:1 on black', () => {
    expect(contrastOnBlack('#0000FF')).toBeLessThan(4.5)
    expect(contrastOnBlack(toHex(readableOnBlack('#0000FF')))).toBeGreaterThanOrEqual(4.5)
    // Already readable colours are unchanged
    expect(readableOnBlack('#00FF7F')).toBe('rgb(0 255 127)')
  })

  it('uses the chatter colour, else a Twitch default for the name', () => {
    expect(twitchColor('someone', '#8A2BE2', 'raw')).toBe('#8A2BE2')
    expect(TWITCH_DEFAULT_COLORS).toContain(twitchColor('lurker42', null, 'raw'))
    expect(twitchColor('lurker42', null, 'raw')).toBe(twitchColor('lurker42', undefined, 'raw'))
  })
})
