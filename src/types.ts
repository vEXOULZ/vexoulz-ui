export type SiteId = 'root' | 'vods' | 'dtp'

export interface SiteInfo {
  id: SiteId | 'shop'
  host: string
  what: string
  href: string
  external?: boolean
}

/** The vexoulz network, as listed in every site switcher. */
export const SITES: readonly SiteInfo[] = [
  { id: 'root', host: 'vexoulz.net', what: 'links, socials, stream status', href: 'https://vexoulz.net' },
  { id: 'vods', host: 'vods.vexoulz.net', what: 'past broadcasts + chat replay', href: 'https://vods.vexoulz.net' },
  { id: 'dtp', host: 'dtp.vexoulz.net', what: 'chat bot, commands, docs', href: 'https://dtp.vexoulz.net' },
  { id: 'shop', host: 'shop.vexoulz.net', what: 'merch', href: 'https://shop.vexoulz.net', external: true },
]

export interface NavItem {
  label: string
  /** Router location (uses RouterLink when vue-router is installed). */
  to?: string
  /** Plain link. */
  href?: string
  /** Force the current-page style (RouterLink sets it automatically). */
  current?: boolean
}

export type Tone = 'info' | 'ok' | 'warn' | 'error'

export interface Option<T = string> {
  value: T
  label: string
  sub?: string
  disabled?: boolean
}

export interface Chapter {
  name: string
  start: number
  end: number
  restricted?: boolean
}

export interface AccountUser {
  name: string
  /** The user's Twitch chat colour, if they set one. */
  color?: string | null
  avatar?: string
}

export interface DatePreset {
  label: string
  /** Days back from today; 0 clears both ends, -1 means "this year". */
  days: number
}

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  align?: 'left' | 'right'
  mono?: boolean
  muted?: boolean
  width?: string
}

export interface SortState {
  key: string
  dir: 'asc' | 'desc'
}

/** A game for VxPosters: a name, or a name plus its box-art URL. */
export type PosterGame = string | { name: string; image?: string }
