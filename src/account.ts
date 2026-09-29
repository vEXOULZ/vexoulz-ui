// `@vexoulz/ui/account`: the shared *.vexoulz.net sign-in, from a site's side.
//
// vexoulz-auth holds one session for all the sites (a cookie on its own host, which the sites' credentialed
// fetches carry). A site creates one Account with the service's base URL, installs it, and reads it anywhere
// with useAccount(). Without a base URL (a friend's instance, a dev server with no auth) the account is
// disabled: signed out, and VxAccountMenu shows its "Sign in" button greyed out.
//
//   const account = createAccount({ authBase: import.meta.env.VITE_AUTH_BASE })
//   app.use(account)
//   ...
//   const account = useAccount()
//   <VxAccountMenu :user="account.menuUser.value" :disabled="!account.enabled"
//                  @sign-in="account.signIn()" @sign-out="account.signOut({ everywhere: true })" />
import { computed, inject, readonly, ref, type App, type ComputedRef, type InjectionKey, type Ref } from 'vue'
import type { AccountUser } from './types'

/** The signed-in user, as vexoulz-auth's `/v1/me` answers. */
export interface AuthUser {
  id: string
  login: string
  displayName: string
  avatar: string | null
  /** Twitch chat colour, if they set one. */
  color: string | null
}

export interface Account {
  /** False when no auth service is configured: the site is always signed out. */
  readonly enabled: boolean
  /** The service's base URL, without a trailing slash ('' when disabled). */
  readonly base: string
  readonly user: Readonly<Ref<AuthUser | null>>
  /** `user` in the shape VxAccountMenu takes. */
  readonly menuUser: ComputedRef<AccountUser | null>
  /** True once the first `/v1/me` answered (or failed): until then a signed-out look may be wrong. */
  readonly ready: Readonly<Ref<boolean>>
  /** The CSRF token writes to the service must send as `X-Vexoulz-CSRF`; null when signed out. */
  csrf(): string | null
  /** Asks the service who is signed in. A failed request keeps what was known. */
  refresh(): Promise<AuthUser | null>
  /** Sends the page through Twitch (or straight back, if already signed in) to `returnTo` (default: here). */
  signIn(returnTo?: string): void
  /** Ends this browser's session, or every session of the user on every site. */
  signOut(opts?: { everywhere?: boolean }): Promise<void>
  /** A credentialed request to the service, with the CSRF header on writes. */
  request(path: string, init?: RequestInit): Promise<Response>
  install(app: App): void
}

export const CSRF_HEADER = 'X-Vexoulz-CSRF'
export const ACCOUNT_KEY: InjectionKey<Account> = Symbol('vx-account')
/** How stale the known user may be before a tab coming back into view asks again. */
export const RECHECK_MS = 60_000

export interface AccountOptions {
  /** vexoulz-auth's base URL; empty or missing disables sign-in. */
  authBase?: string | null
  fetch?: typeof fetch
  /** Where signIn() sends the page (tests replace it). */
  navigate?: (url: string) => void
  now?: () => number
}

export function createAccount(options: AccountOptions = {}): Account {
  const base = (options.authBase ?? '').trim().replace(/\/+$/, '')
  const enabled = base !== ''
  const doFetch = options.fetch ?? ((input, init) => fetch(input, init))
  const navigate = options.navigate ?? ((url: string) => window.location.assign(url))
  const now = options.now ?? Date.now

  const user = ref<AuthUser | null>(null)
  const ready = ref(!enabled)
  let token: string | null = null
  let checkedAt = -Infinity
  let pending: Promise<AuthUser | null> | null = null

  function request(path: string, init: RequestInit = {}): Promise<Response> {
    const headers = new Headers(init.headers)
    const method = (init.method ?? 'GET').toUpperCase()
    if (method !== 'GET' && method !== 'HEAD' && token) headers.set(CSRF_HEADER, token)
    return doFetch(base + path, { ...init, headers, credentials: 'include' })
  }

  async function check(): Promise<AuthUser | null> {
    try {
      const res = await request('/v1/me', { headers: { Accept: 'application/json' } })
      if (res.ok) {
        const body = await res.json()
        token = body.csrf ?? null
        user.value = {
          id: String(body.id),
          login: body.login,
          displayName: body.displayName || body.login,
          avatar: body.avatar ?? null,
          color: body.color ?? null,
        }
      } else if (res.status === 401) {
        token = null
        user.value = null
      }
      checkedAt = now()
    } catch {
      // Unreachable: keep what we had and try again next time.
    } finally {
      ready.value = true
    }
    return user.value
  }

  function refresh(): Promise<AuthUser | null> {
    if (!enabled) return Promise.resolve(null)
    pending ??= check().finally(() => (pending = null))
    return pending
  }

  function signIn(returnTo?: string) {
    if (!enabled) return
    const back = returnTo ?? window.location.href
    navigate(`${base}/login?return=${encodeURIComponent(back)}`)
  }

  async function signOut(opts: { everywhere?: boolean } = {}) {
    if (!enabled) return
    try {
      await request(opts.everywhere ? '/v1/logout?everywhere=1' : '/v1/logout', { method: 'POST' })
    } finally {
      token = null
      user.value = null
    }
  }

  const account: Account = {
    enabled,
    base,
    user: readonly(user) as Readonly<Ref<AuthUser | null>>,
    menuUser: computed(() =>
      user.value ? { name: user.value.displayName, color: user.value.color, avatar: user.value.avatar ?? undefined } : null,
    ),
    ready: readonly(ready),
    csrf: () => token,
    refresh,
    signIn,
    signOut,
    request,
    install(app: App) {
      app.provide(ACCOUNT_KEY, account)
      if (!enabled || typeof document === 'undefined') return
      void refresh()
      // Signing out everywhere on another site shows up here when the tab comes back into view.
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && now() - checkedAt >= RECHECK_MS) void refresh()
      })
    },
  }
  return account
}

let fallback: Account | null = null

/** The Account the app installed, or a disabled one if it installed none. */
export function useAccount(): Account {
  return inject(ACCOUNT_KEY, null) ?? (fallback ??= createAccount())
}
