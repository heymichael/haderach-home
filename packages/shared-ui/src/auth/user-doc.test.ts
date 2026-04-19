import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchUserDoc } from './user-doc.ts'

const ORGS = [
  {
    slug: 'haderach',
    name: 'Haderach',
    enabledApps: ['site', 'system_administration'],
  },
]

describe('fetchUserDoc', () => {
  const getIdToken = vi.fn().mockResolvedValue('test-token')

  beforeEach(() => {
    vi.restoreAllMocks()
    getIdToken.mockResolvedValue('test-token')
  })

  it('parses orgs out of the /me response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          email: 'michael@haderach.ai',
          firstName: 'Michael',
          lastName: 'Mader',
          roles: ['admin'],
          orgs: ORGS,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )

    const doc = await fetchUserDoc(getIdToken)

    expect(doc.orgs).toEqual(ORGS)
    expect(doc.roles).toEqual(['admin'])
    expect(doc.firstName).toBe('Michael')
  })

  it('defaults orgs to empty array when /me omits the field', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({ email: 'x@example.com', roles: [] }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )

    const doc = await fetchUserDoc(getIdToken)

    expect(doc.orgs).toEqual([])
  })

  it('drops malformed org entries while keeping valid ones', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          email: 'x@example.com',
          roles: [],
          orgs: [
            ORGS[0],
            { slug: 'broken' /* missing name */ },
            { name: 'Nameless' /* missing slug */ },
            null,
            'not-an-object',
            { slug: 'no-apps', name: 'NoApps' },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )

    const doc = await fetchUserDoc(getIdToken)

    expect(doc.orgs).toEqual([
      ORGS[0],
      { slug: 'no-apps', name: 'NoApps', enabledApps: [] },
    ])
  })

  it('returns an empty doc on network failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network down'))

    const doc = await fetchUserDoc(getIdToken)

    expect(doc).toEqual({
      roles: [],
      firstName: '',
      lastName: '',
      orgs: [],
    })
  })

  it('returns an empty doc on non-2xx response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('', { status: 500 }))

    const doc = await fetchUserDoc(getIdToken)

    expect(doc.orgs).toEqual([])
    expect(doc.roles).toEqual([])
  })
})
