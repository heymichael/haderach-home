import { agentFetch } from '../lib/agent-fetch.ts'

export interface BaseUserDoc {
  roles: string[]
  firstName: string
  lastName: string
}

export type UserDoc = BaseUserDoc & Record<string, unknown>

export async function fetchUserDoc(
  getIdToken: () => Promise<string>,
): Promise<UserDoc> {
  const empty: UserDoc = { roles: [], firstName: '', lastName: '' }
  try {
    const res = await agentFetch('/me', getIdToken)
    if (!res.ok) return empty
    const data = await res.json() as Record<string, unknown>
    const roles = Array.isArray(data.roles)
      ? data.roles.filter((r): r is string => typeof r === 'string')
      : []
    return {
      ...data,
      roles,
      firstName: typeof data.firstName === 'string' ? data.firstName : '',
      lastName: typeof data.lastName === 'string' ? data.lastName : '',
    }
  } catch {
    return empty
  }
}

export function buildDisplayName(
  firstName: string,
  lastName: string,
): string | undefined {
  const full = [firstName, lastName].filter(Boolean).join(' ')
  return full || undefined
}
