import { inject, provide, ref, type InjectionKey, type Ref } from 'vue'
import type { SiteId } from '../types'

export const SITE_KEY: InjectionKey<Ref<SiteId>> = Symbol('vx-site')

export function provideSite(site: Ref<SiteId>) {
  provide(SITE_KEY, site)
}

/** The current site id (from the nearest VxSiteShell), defaulting to root. */
export function useSite(): Ref<SiteId> {
  return inject(SITE_KEY, ref<SiteId>('root'))
}
