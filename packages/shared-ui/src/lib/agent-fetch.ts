import { getStoredActiveOrgSlug } from '../auth/active-org.ts'

const BASE = '/agent/api'

export async function agentFetch(
  path: string,
  getIdToken: () => Promise<string>,
  init?: RequestInit,
): Promise<Response> {
  const token = await getIdToken()
  const headers = new Headers(init?.headers)
  headers.set('Authorization', `Bearer ${token}`)
  // Multi-org tenancy (task 254 phase 7 / strategy 197-r2): the agent
  // backend resolves caller scope from this header per request. Omitted
  // when no slug is persisted yet — the backend auto-defaults to the
  // user's lone membership in that case (auth.py _resolve_active_org_slug).
  const activeOrgSlug = getStoredActiveOrgSlug()
  if (activeOrgSlug) {
    headers.set('X-Active-Org', activeOrgSlug)
  }
  return fetch(`${BASE}${path}`, { ...init, headers })
}
