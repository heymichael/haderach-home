const BASE = '/agent/api'

export async function agentFetch(
  path: string,
  getIdToken: () => Promise<string>,
  init?: RequestInit,
): Promise<Response> {
  const token = await getIdToken()
  const headers = new Headers(init?.headers)
  headers.set('Authorization', `Bearer ${token}`)
  return fetch(`${BASE}${path}`, { ...init, headers })
}
