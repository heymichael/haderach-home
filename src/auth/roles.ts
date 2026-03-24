import { APP_CATALOG } from "@haderach/shared-ui"

export { APP_CATALOG, APP_GRANTING_ROLES, hasAppAccess, getAccessibleApps } from "@haderach/shared-ui"
export type { NavApp as AppEntry } from "@haderach/shared-ui"

export function getReturnTo(): string | null {
  const params = new URLSearchParams(window.location.search)
  const raw = params.get("returnTo")
  if (!raw || !raw.startsWith("/")) return null
  return raw
}

export function returnToAppId(returnTo: string): string | null {
  for (const app of APP_CATALOG) {
    if (returnTo.startsWith(app.path)) return app.id
  }
  return null
}
