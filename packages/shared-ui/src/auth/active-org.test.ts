import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  pickInitialActiveOrg,
  resolveActiveOrgSlug,
  getStoredActiveOrgSlug,
  setStoredActiveOrgSlug,
  clearStoredActiveOrgSlug,
} from './active-org.ts'
import type { UserDoc, UserOrgMembership } from './user-doc.ts'

// JSDOM 29 ships localStorage as a no-op stub by default; override it
// with a tiny in-memory shim per test so the helpers behave like a real
// browser. The `throws` test re-stubs to exercise the catch path.
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

const HADERACH: UserOrgMembership = {
  slug: 'haderach',
  name: 'Haderach',
  enabledApps: ['site', 'system_administration'],
}
const ARCADE: UserOrgMembership = {
  slug: 'arcade',
  name: 'Arcade',
  enabledApps: ['expenses', 'vendors', 'vendor_administration', 'system_administration'],
}

function makeDoc(orgs: UserOrgMembership[]): UserDoc {
  return { roles: [], firstName: '', lastName: '', orgs }
}

describe('pickInitialActiveOrg', () => {
  it('returns kind=none for zero memberships', () => {
    expect(pickInitialActiveOrg([])).toEqual({ kind: 'none' })
  })

  it('auto-selects when the user has exactly one membership', () => {
    expect(pickInitialActiveOrg([HADERACH])).toEqual({
      kind: 'auto',
      slug: 'haderach',
    })
  })

  it('restores a previously persisted slug when still a member', () => {
    expect(pickInitialActiveOrg([HADERACH, ARCADE], 'arcade')).toEqual({
      kind: 'restored',
      slug: 'arcade',
    })
  })

  it('falls back to picker when persisted slug is no longer a membership', () => {
    expect(pickInitialActiveOrg([HADERACH, ARCADE], 'departed-org')).toEqual({
      kind: 'needs-picker',
      orgs: [HADERACH, ARCADE],
    })
  })

  it('falls back to picker when no persisted slug exists', () => {
    expect(pickInitialActiveOrg([HADERACH, ARCADE])).toEqual({
      kind: 'needs-picker',
      orgs: [HADERACH, ARCADE],
    })
  })
})

describe('localStorage helpers', () => {
  beforeEach(() => {
    installLocalStorageShim()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('round-trips a slug through localStorage', () => {
    expect(getStoredActiveOrgSlug()).toBeUndefined()
    setStoredActiveOrgSlug('haderach')
    expect(getStoredActiveOrgSlug()).toBe('haderach')
    clearStoredActiveOrgSlug()
    expect(getStoredActiveOrgSlug()).toBeUndefined()
  })

  it('returns undefined when localStorage throws', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => { throw new Error('SecurityError') },
      setItem: () => { throw new Error('SecurityError') },
      removeItem: () => { throw new Error('SecurityError') },
    })
    expect(getStoredActiveOrgSlug()).toBeUndefined()
    expect(() => setStoredActiveOrgSlug('haderach')).not.toThrow()
    expect(() => clearStoredActiveOrgSlug()).not.toThrow()
  })
})

describe('resolveActiveOrgSlug', () => {
  beforeEach(() => {
    installLocalStorageShim()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns and persists the auto-selected slug for single-membership users', () => {
    const slug = resolveActiveOrgSlug(makeDoc([HADERACH]))
    expect(slug).toBe('haderach')
    expect(getStoredActiveOrgSlug()).toBe('haderach')
  })

  it('restores a persisted choice for multi-membership users', () => {
    setStoredActiveOrgSlug('arcade')
    const slug = resolveActiveOrgSlug(makeDoc([HADERACH, ARCADE]))
    expect(slug).toBe('arcade')
  })

  it('returns undefined when a multi-membership user has no valid persisted choice', () => {
    const slug = resolveActiveOrgSlug(makeDoc([HADERACH, ARCADE]))
    expect(slug).toBeUndefined()
  })

  it('returns undefined for zero-membership users', () => {
    const slug = resolveActiveOrgSlug(makeDoc([]))
    expect(slug).toBeUndefined()
  })
})
