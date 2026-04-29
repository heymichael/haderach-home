/**
 * Active-org selection for the multi-org session model.
 *
 * Strategy 197-r2 / task 254 phase 2. The agent backend now resolves the
 * caller's `active_org_slug` per-request from an `X-Active-Org` header.
 * This module is the frontend half of that contract: it picks the right
 * slug to send.
 *
 * Today (April 2026) every user has exactly one membership, so the
 * picker code path is dead and `pickInitialActiveOrg` always returns
 * `{ kind: 'auto', ... }`. The shape exists because the schema is
 * multi-org-ready and the picker UI lands in phase 6 against this same
 * helper. Writing it now means the AuthGate wiring in phase 7 doesn't
 * need to be revisited when membership counts grow past one.
 *
 * No React here — this is pure data. The picker component (phase 6) and
 * the `agentFetch` wiring (phase 7) are the consumers.
 */

import type { UserDoc, UserOrgMembership } from './user-doc.ts'
import { clearBrandingCache, resetBrandingState } from '../lib/branding.ts'

const STORAGE_KEY = 'haderach.activeOrgSlug'

/**
 * Result of picking the initial active org from a user's memberships.
 *
 *  - `auto`         → single-membership user; slug auto-selected. Today's
 *                     only live branch.
 *  - `restored`     → multi-membership user; slug recovered from
 *                     localStorage and still valid (still a member).
 *  - `needs-picker` → multi-membership user with no valid persisted
 *                     selection. Phase 6 renders a picker against `orgs`.
 *  - `none`         → user has zero memberships. The agent backend will
 *                     reject any org-scoped endpoint downstream; calling
 *                     code typically routes to an "access denied" view.
 */
export type ActiveOrgSelection =
  | { kind: 'auto'; slug: string }
  | { kind: 'restored'; slug: string }
  | { kind: 'needs-picker'; orgs: UserOrgMembership[] }
  | { kind: 'none' }

export function getStoredActiveOrgSlug(): string | undefined {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v ?? undefined
  } catch {
    return undefined
  }
}

export function setStoredActiveOrgSlug(slug: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, slug)
  } catch {
    /* storage unavailable */
  }
  resetBrandingState()
}

export function clearStoredActiveOrgSlug(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* storage unavailable */
  }
  clearBrandingCache()
}

/**
 * Decide which org should be active given the user's memberships and
 * any previously persisted selection.
 *
 * Pure: does no IO. Pass `persistedSlug` from `getStoredActiveOrgSlug()`
 * at the call site so the function stays trivially testable.
 */
export function pickInitialActiveOrg(
  orgs: UserOrgMembership[],
  persistedSlug?: string,
): ActiveOrgSelection {
  if (orgs.length === 0) {
    return { kind: 'none' }
  }
  if (orgs.length === 1) {
    return { kind: 'auto', slug: orgs[0].slug }
  }
  if (persistedSlug && orgs.some((o) => o.slug === persistedSlug)) {
    return { kind: 'restored', slug: persistedSlug }
  }
  return { kind: 'needs-picker', orgs }
}

/**
 * Convenience for the AuthGate flow: extract `activeOrgSlug` directly
 * from a `UserDoc`, persisting the choice when one is made
 * automatically. Returns `undefined` when a picker is required or the
 * user has no memberships — the caller decides how to surface that.
 */
export function resolveActiveOrgSlug(userDoc: UserDoc): string | undefined {
  const selection = pickInitialActiveOrg(userDoc.orgs, getStoredActiveOrgSlug())
  switch (selection.kind) {
    case 'auto':
    case 'restored':
      setStoredActiveOrgSlug(selection.slug)
      return selection.slug
    case 'needs-picker':
    case 'none':
      return undefined
  }
}
