import { inject, type App, type InjectionKey } from 'vue'

/** Which build of a site is running, shown in the footer. Each site fills it in at build time (see the README). */
export interface BuildInfo {
  /** Full commit hash the site was built from; the footer shows the first 7 characters. */
  commit?: string
  /** A release version, for sites that tag releases; left out (or 0.0.0) shows the commit only. */
  version?: string
}

export const BUILD_KEY: InjectionKey<BuildInfo> = Symbol('vx-build')

/** `app.use(VxBuild, { commit: __COMMIT__ })` in a site's main.ts. */
export const VxBuild = {
  install(app: App, info: BuildInfo = {}) {
    app.provide(BUILD_KEY, info)
  },
}

export function useBuild(): BuildInfo {
  return inject(BUILD_KEY, {})
}
