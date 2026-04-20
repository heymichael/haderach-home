import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { agentFetch } from './agent-fetch.ts'

// Tiny in-memory localStorage shim so the X-Active-Org wiring path
// (active-org.ts) works under JSDOM, which by default ships a no-op
// stub for localStorage.
function installLocalStorageShim() {
  const store = new Map<string, string>()
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => { store.set(k, String(v)) },
    removeItem: (k: string) => { store.delete(k) },
    clear: () => { store.clear() },
    key: (i: number) => Array.from(store.keys())[i] ?? null,
    get length() { return store.size },
  })
  return store
}

describe('agentFetch', () => {
  const mockGetIdToken = vi.fn().mockResolvedValue('test-token-123')

  beforeEach(() => {
    vi.restoreAllMocks()
    mockGetIdToken.mockResolvedValue('test-token-123')
    installLocalStorageShim()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('prepends /agent/api to the path', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('ok'))

    await agentFetch('/users', mockGetIdToken)

    expect(spy).toHaveBeenCalledOnce()
    const [url] = spy.mock.calls[0]
    expect(url).toBe('/agent/api/users')
  })

  it('attaches Authorization header with bearer token', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('ok'))

    await agentFetch('/users', mockGetIdToken)

    const [, init] = spy.mock.calls[0]
    const headers = init?.headers as Headers
    expect(headers.get('Authorization')).toBe('Bearer test-token-123')
  })

  it('passes through request init options', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('ok'))

    await agentFetch('/users', mockGetIdToken, {
      method: 'POST',
      body: JSON.stringify({ name: 'test' }),
    })

    const [, init] = spy.mock.calls[0]
    expect(init?.method).toBe('POST')
    expect(init?.body).toBe(JSON.stringify({ name: 'test' }))
  })

  it('merges caller-provided headers with auth header', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('ok'))

    await agentFetch('/users', mockGetIdToken, {
      headers: { 'Content-Type': 'application/json' },
    })

    const [, init] = spy.mock.calls[0]
    const headers = init?.headers as Headers
    expect(headers.get('Authorization')).toBe('Bearer test-token-123')
    expect(headers.get('Content-Type')).toBe('application/json')
  })

  it('calls getIdToken before making the fetch', async () => {
    const callOrder: string[] = []
    mockGetIdToken.mockImplementation(async () => {
      callOrder.push('getIdToken')
      return 'token'
    })
    vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
      callOrder.push('fetch')
      return new Response('ok')
    })

    await agentFetch('/test', mockGetIdToken)

    expect(callOrder).toEqual(['getIdToken', 'fetch'])
  })

  it('returns the fetch Response', async () => {
    const mockResponse = new Response(JSON.stringify({ id: 1 }), { status: 200 })
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse)

    const result = await agentFetch('/users/1', mockGetIdToken)

    expect(result).toBe(mockResponse)
  })

  // Multi-org tenancy (task 254 phase 7 / strategy 197-r2). The agent
  // backend resolves caller scope from X-Active-Org per request. When
  // the slug is absent, the backend auto-defaults to the user's lone
  // membership (every prod user is single-membership today), so omitting
  // the header is the correct legacy-compatible behavior.
  describe('X-Active-Org header', () => {
    it('omits X-Active-Org when no slug is persisted', async () => {
      const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('ok'))

      await agentFetch('/vendors', mockGetIdToken)

      const [, init] = spy.mock.calls[0]
      const headers = init?.headers as Headers
      expect(headers.has('X-Active-Org')).toBe(false)
    })

    it('attaches X-Active-Org when active-org localStorage is populated', async () => {
      localStorage.setItem('haderach.activeOrgSlug', 'arcade')
      const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('ok'))

      await agentFetch('/vendors', mockGetIdToken)

      const [, init] = spy.mock.calls[0]
      const headers = init?.headers as Headers
      expect(headers.get('X-Active-Org')).toBe('arcade')
    })

    it('reflects the most recent slug when localStorage changes between calls', async () => {
      const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('ok'))

      localStorage.setItem('haderach.activeOrgSlug', 'arcade')
      await agentFetch('/vendors', mockGetIdToken)
      localStorage.setItem('haderach.activeOrgSlug', 'haderach')
      await agentFetch('/cms/items', mockGetIdToken)

      const firstHeaders = spy.mock.calls[0][1]?.headers as Headers
      const secondHeaders = spy.mock.calls[1][1]?.headers as Headers
      expect(firstHeaders.get('X-Active-Org')).toBe('arcade')
      expect(secondHeaders.get('X-Active-Org')).toBe('haderach')
    })

    it('does not attach the header when localStorage throws', async () => {
      vi.stubGlobal('localStorage', {
        getItem: () => { throw new Error('SecurityError') },
        setItem: () => { throw new Error('SecurityError') },
        removeItem: () => { throw new Error('SecurityError') },
      })
      const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('ok'))

      await agentFetch('/vendors', mockGetIdToken)

      const [, init] = spy.mock.calls[0]
      const headers = init?.headers as Headers
      expect(headers.has('X-Active-Org')).toBe(false)
    })
  })
})
