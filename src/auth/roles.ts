export interface AppEntry {
  id: string
  label: string
  path: string
}

export const APP_CATALOG: AppEntry[] = [
  { id: "card", label: "Card", path: "/card/" },
  { id: "stocks", label: "Commodities", path: "/stocks/" },
  { id: "vendors", label: "Vendors", path: "/vendors/" },
]

export const APP_GRANTING_ROLES: Record<string, string[]> = {
  card: ["admin", "member", "card_member"],
  stocks: ["admin", "member", "stocks_member"],
  vendors: ["admin", "member", "vendors_member"],
}

export function hasAppAccess(userRoles: string[], appId: string): boolean {
  const grantingRoles = APP_GRANTING_ROLES[appId] ?? []
  return userRoles.some((r) => grantingRoles.includes(r))
}

export function getAccessibleApps(userRoles: string[]): AppEntry[] {
  return APP_CATALOG.filter((app) => hasAppAccess(userRoles, app.id))
}

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
