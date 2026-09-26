import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import VxSiteFooter from '../src/components/chrome/VxSiteFooter.vue'
import { VxBuild } from '../src/composables/useBuild'

const links = (w: ReturnType<typeof mount>) => w.findAll('.vx-foot-meta a, .vx-foot-report').map((a) => [a.text(), a.attributes('href')])

describe('VxSiteFooter', () => {
  it('links the build to its commit and issues to the site repo', () => {
    const sha = '0123456789abcdef0123456789abcdef01234567'
    const w = mount(VxSiteFooter, { props: { site: 'vods' }, global: { plugins: [[VxBuild, { commit: sha, version: '0.0.0' }]] } })
    expect(links(w)).toEqual([
      ['0123456', `https://github.com/vEXOULZ/vexoulz-vods/commit/${sha}`],
      ['report an issue', 'https://github.com/vEXOULZ/vexoulz-vods/issues'],
    ])
  })

  it('shows a release version next to the commit, and nothing without build info', () => {
    const w = mount(VxSiteFooter, { props: { site: 'root' }, global: { plugins: [[VxBuild, { commit: 'abcdef123', version: '1.2.0' }]] } })
    expect(links(w)[0]?.[0]).toBe('v1.2.0 · abcdef1')
    expect(links(mount(VxSiteFooter, { props: { site: 'root' } }))).toEqual([['report an issue', 'https://github.com/vEXOULZ/rootvexoulznet/issues']])
  })
})
