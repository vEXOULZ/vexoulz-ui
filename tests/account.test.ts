import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { createAccount, CSRF_HEADER, RECHECK_MS, useAccount, type Account } from '../src/account'

const ME = { id: '42', login: 'vex', displayName: 'Vex', avatar: 'https://img/a.png', color: '#ff0000', csrf: 't0k', expiresAt: 'x' }

function json(status: number, body: unknown = {}) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}

function service(answer: () => Response | Promise<Response>) {
  const calls: { url: string; init: RequestInit }[] = []
  const fetch = vi.fn(async (url: RequestInfo | URL, init: RequestInit = {}) => {
    calls.push({ url: String(url), init })
    return answer()
  }) as unknown as typeof globalThis.fetch
  return { fetch, calls }
}

describe('createAccount', () => {
  it('is disabled and signed out without a base URL', async () => {
    const navigate = vi.fn()
    const account = createAccount({ authBase: '  ', navigate })
    expect(account.enabled).toBe(false)
    expect(account.ready.value).toBe(true)
    expect(await account.refresh()).toBeNull()
    account.signIn()
    expect(navigate).not.toHaveBeenCalled()
  })

  it('reads the signed-in user with a credentialed request', async () => {
    const { fetch, calls } = service(() => json(200, ME))
    const account = createAccount({ authBase: 'https://auth.example/', fetch })
    expect(account.ready.value).toBe(false)
    const user = await account.refresh()
    expect(calls[0].url).toBe('https://auth.example/v1/me')
    expect(calls[0].init.credentials).toBe('include')
    expect(user).toEqual({ id: '42', login: 'vex', displayName: 'Vex', avatar: 'https://img/a.png', color: '#ff0000' })
    expect(account.menuUser.value).toEqual({ name: 'Vex', color: '#ff0000', avatar: 'https://img/a.png' })
    expect(account.csrf()).toBe('t0k')
    expect(account.ready.value).toBe(true)
  })

  it('keeps what it knew when the service is unreachable, and forgets on 401', async () => {
    let answer: () => Response = () => json(200, ME)
    const { fetch } = service(() => answer())
    const account = createAccount({ authBase: 'https://auth.example', fetch })
    await account.refresh()
    answer = () => {
      throw new TypeError('offline')
    }
    expect((await account.refresh())?.login).toBe('vex')
    answer = () => json(401, { error: 'signed_out' })
    expect(await account.refresh()).toBeNull()
    expect(account.csrf()).toBeNull()
  })

  it('shares one request between concurrent refreshes', async () => {
    const { fetch, calls } = service(() => json(200, ME))
    const account = createAccount({ authBase: 'https://auth.example', fetch })
    await Promise.all([account.refresh(), account.refresh()])
    expect(calls).toHaveLength(1)
  })

  it('signs in through the service back to the page', () => {
    const navigate = vi.fn()
    const account = createAccount({ authBase: 'https://auth.example', navigate })
    account.signIn('https://vods.example/watch/1?t=30')
    expect(navigate).toHaveBeenCalledWith('https://auth.example/login?return=https%3A%2F%2Fvods.example%2Fwatch%2F1%3Ft%3D30')
  })

  it('signs out with the CSRF token, here or everywhere', async () => {
    const { fetch, calls } = service(() => (calls.length === 1 ? json(200, ME) : new Response(null, { status: 204 })))
    const account = createAccount({ authBase: 'https://auth.example', fetch })
    await account.refresh()
    await account.signOut({ everywhere: true })
    expect(calls[1].url).toBe('https://auth.example/v1/logout?everywhere=1')
    expect(calls[1].init.method).toBe('POST')
    expect(new Headers(calls[1].init.headers).get(CSRF_HEADER)).toBe('t0k')
    expect(account.user.value).toBeNull()
  })

  it('sends the CSRF header on writes only', async () => {
    const { fetch, calls } = service(() => json(200, ME))
    const account = createAccount({ authBase: 'https://auth.example', fetch })
    await account.refresh()
    await account.request('/v1/progress')
    await account.request('/v1/progress/1', { method: 'PUT', body: '{}' })
    expect(new Headers(calls[1].init.headers).has(CSRF_HEADER)).toBe(false)
    expect(new Headers(calls[2].init.headers).get(CSRF_HEADER)).toBe('t0k')
  })
})

describe('install and useAccount', () => {
  function mountWith(account?: Account) {
    let seen: Account | null = null
    const Probe = defineComponent({
      setup() {
        seen = useAccount()
        return () => h('div')
      },
    })
    mount(Probe, { global: { plugins: account ? [account] : [] } })
    return seen as unknown as Account
  }

  it('provides the installed account and checks it at once', async () => {
    const { fetch, calls } = service(() => json(200, ME))
    const account = createAccount({ authBase: 'https://auth.example', fetch })
    expect(mountWith(account)).toBe(account)
    expect(calls).toHaveLength(1)
  })

  it('falls back to a disabled account', () => {
    expect(mountWith().enabled).toBe(false)
  })

  it('checks again when the tab comes back after a while', async () => {
    let t = 0
    const { fetch, calls } = service(() => json(200, ME))
    const account = createAccount({ authBase: 'https://auth.example', fetch, now: () => t })
    mountWith(account)
    await account.refresh()
    document.dispatchEvent(new Event('visibilitychange'))
    expect(calls).toHaveLength(1)
    t += RECHECK_MS
    document.dispatchEvent(new Event('visibilitychange'))
    expect(calls).toHaveLength(2)
  })
})
