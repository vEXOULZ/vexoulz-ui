import { describe, expect, it } from 'vitest'
import { SITES, ensureSiteAccents, siteAccentCss, siteInfo, switcherSites } from '../src/sites'

describe('the site list', () => {
  it('leaves hidden sites out of the switcher, except on themselves', () => {
    const hidden = SITES.filter((s) => 'hidden' in s && s.hidden).map((s) => s.id)
    expect(switcherSites('root').map((s) => s.id)).not.toContain(hidden[0])
    if (hidden[0]) expect(switcherSites(hidden[0]).map((s) => s.id)).toContain(hidden[0])
  })

  it('generates every accent rule from the list', () => {
    const css = siteAccentCss()
    for (const s of SITES) {
      if ('accent' in s) {
        expect(css).toContain(`--vx-accent-${s.id}: ${s.accent};`)
        expect(css).toContain(`[data-site='${s.id}'] { --vx-accent: var(--vx-accent-${s.id}); }`)
        expect(css).toContain(`.vx-accent-${s.id} {`)
      } else {
        expect(css).not.toContain(`vx-accent-${s.id}`)
      }
    }
  })

  it('adds the rules to a page once', () => {
    ensureSiteAccents()
    ensureSiteAccents()
    expect(document.querySelectorAll('#vx-site-accents')).toHaveLength(1)
  })

  it('finds a site by id', () => {
    expect(siteInfo('vods').host).toBe('vods.vexoulz.net')
  })
})
