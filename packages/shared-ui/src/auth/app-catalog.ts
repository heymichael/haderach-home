import type { NavApp } from "../components/GlobalNav.tsx"

export const APP_CATALOG: NavApp[] = [
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

export function getAccessibleApps(userRoles: string[]): NavApp[] {
  return APP_CATALOG.filter((app) => hasAppAccess(userRoles, app.id))
}
