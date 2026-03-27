import { describe, it, expect, vi, beforeEach } from 'vitest'
import { agentFetch } from './agent-fetch.ts'

describe('agentFetch', () => {
  const mockGetIdToken = vi.fn().mockResolvedValue('test-token-123')

  beforeEach(() => {
    vi.restoreAllMocks()
    mockGetIdToken.mockResolvedValue('test-token-123')
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
})
