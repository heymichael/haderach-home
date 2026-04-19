import { agentFetch } from '../lib/agent-fetch.ts'

/**
 * One org membership as surfaced by the agent's `/me` endpoint.
 *
 * Mirrors the jsonb row produced by the `user_context` view (agent
 * migration 021) and shipped by `_context_row_to_user` in pg_client.py.
 * `enabledApps` is the per-org feature gate — apps not in this list are
 * hidden in nav and rejected by the agent backend regardless of role.
 */
export interface UserOrgMembership {
  slug: string
  name: string
  enabledApps: string[]
}

export interface BaseUserDoc {
  roles: string[]
  firstName: string
  lastName: string
  /**
   * Orgs the user is a member of. Single-element today (every user has
   * exactly one membership), but the schema is multi-org-ready and the
   * sign-in picker (Phase 6) will render against this array when it
   * grows past one.
   */
  orgs: UserOrgMembership[]
  /**
   * Slug of the org currently active for this session. Resolved client-
   * side from `orgs` (auto-default when single, picker-driven when
   * multi) and sent on every agent request as `X-Active-Org` (Phase 7).
   * Undefined while the user has zero memberships or hasn't picked yet.
   */
  activeOrgSlug?: string
}

export type UserDoc = BaseUserDoc & Record<string, unknown>

function parseOrgs(value: unknown): UserOrgMembership[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((entry): UserOrgMembership[] => {
    if (!entry || typeof entry !== 'object') return []
    const o = entry as Record<string, unknown>
    if (typeof o.slug !== 'string' || typeof o.name !== 'string') return []
    const enabledApps = Array.isArray(o.enabledApps)
      ? o.enabledApps.filter((a): a is string => typeof a === 'string')
      : []
    return [{ slug: o.slug, name: o.name, enabledApps }]
  })
}

export async function fetchUserDoc(
  getIdToken: () => Promise<string>,
): Promise<UserDoc> {
  const empty: UserDoc = {
    roles: [],
    firstName: '',
    lastName: '',
    orgs: [],
  }
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
      orgs: parseOrgs(data.orgs),
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
