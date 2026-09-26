// The vexoulz network: every site, in one list. The site switchers (header and footer), the page frame's sky seed
// and each site's accent colour all come from here, so adding a site is one entry below; removing one is deleting
// its entry (the type checker then points at anything still naming it).

export interface SiteInfo {
  id: string
  host: string
  /** One line for the switcher. */
  what: string
  href: string
  /** The site's accent colour. Sites built on this library have one; links elsewhere (the shop) don't. */
  accent?: string
  /** Hosted somewhere else: opens as an outside link. */
  external?: boolean
  /** Left out of the switchers (not live yet). A page on that site still shows itself as "here". */
  hidden?: boolean
  /** The site's GitHub repo (`owner/name`): the footer links its build and "report an issue" there. */
  repo?: string
}

export const SITES = [
  { id: 'root', host: 'vexoulz.net', what: 'links, socials, stream status', href: 'https://vexoulz.net', accent: '#d5e0ff', repo: 'vEXOULZ/rootvexoulznet' },
  // Vods green is kept apart from --vx-ok by being brighter and more saturated.
  { id: 'vods', host: 'vods.vexoulz.net', what: 'past broadcasts + chat replay', href: 'https://vods.vexoulz.net', accent: '#74e39a', repo: 'vEXOULZ/vexoulz-vods' },
  { id: 'dtp', host: 'dtp.vexoulz.net', what: 'chat bot, commands, docs', href: 'https://dtp.vexoulz.net', accent: '#c9b27c', hidden: true, repo: 'vEXOULZ/doomtp-web' },
  { id: 'shop', host: 'shop.vexoulz.net', what: 'merch', href: 'https://shop.vexoulz.net', external: true },
] as const satisfies readonly SiteInfo[]

type Site = (typeof SITES)[number]
/** A site built on this library: every entry with an accent. */
export type SiteId = Extract<Site, { accent: string }>['id']
/** Any entry in the network, including outside links. */
export type NetworkSiteId = Site['id']

/** An entry, with its id narrowed to the network's ids. */
export type NetworkSite = SiteInfo & { id: NetworkSiteId }
const ALL: readonly NetworkSite[] = SITES
const byId = new Map(ALL.map((s) => [s.id, s]))
export const siteInfo = (id: NetworkSiteId): NetworkSite => byId.get(id)!

/** The entries a switcher lists: everything not hidden, plus the current site even when it is. */
export const switcherSites = (current?: string): NetworkSite[] => ALL.filter((s) => !s.hidden || s.id === current)

/**
 * The accent rules for every site: `--vx-accent-<id>` on :root, `[data-site=<id>]` switching `--vx-accent`, and a
 * `.vx-accent-<id>` text colour. Generated from SITES so a new site needs no CSS of its own.
 */
export function siteAccentCss(): string {
  const withAccent = SITES.filter((s): s is Extract<Site, { accent: string }> => 'accent' in s)
  return [
    `:root { ${withAccent.map((s) => `--vx-accent-${s.id}: ${s.accent};`).join(' ')} }`,
    ...withAccent.map((s) => `[data-site='${s.id}'] { --vx-accent: var(--vx-accent-${s.id}); }`),
    ...withAccent.map((s) => `.vx-accent-${s.id} { color: var(--vx-accent-${s.id}); }`),
  ].join('\n')
}

/** Adds the accent rules to the page once (VxSiteShell calls it). */
export function ensureSiteAccents(doc: Document | undefined = typeof document === 'undefined' ? undefined : document) {
  if (!doc || doc.getElementById('vx-site-accents')) return
  const style = doc.createElement('style')
  style.id = 'vx-site-accents'
  style.textContent = siteAccentCss()
  doc.head.prepend(style) // first, so a site's own CSS can still override it
}
