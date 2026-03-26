import type { NavApp } from "../components/GlobalNav.tsx"

export const APP_CATALOG: NavApp[] = [
  { id: "card", label: "Card", path: "/card/" },
  { id: "stocks", label: "Commodities", path: "/stocks/" },
  { id: "vendors", label: "Vendors", path: "/vendors/" },
]

export const APP_GRANTING_ROLES: Record<string, string[]> = {
  card: ["haderach_user"],
  stocks: ["user", "admin"],
  vendors: ["user", "admin"],
}

export const ADMIN_CATALOG: NavApp[] = [
  { id: "system_administration", label: "System", path: "/admin/system/" },
  { id: "finance_administration", label: "Finance", path: "/admin/finance/" },
]

export const ADMIN_GRANTING_ROLES: Record<string, string[]> = {
  system_administration: ["admin"],
  finance_administration: ["finance_admin"],
}

export function hasAppAccess(userRoles: string[], appId: string): boolean {
  const grantingRoles =
    APP_GRANTING_ROLES[appId] ?? ADMIN_GRANTING_ROLES[appId] ?? []
  return userRoles.some((r) => grantingRoles.includes(r))
}

export function getAccessibleApps(userRoles: string[]): NavApp[] {
  return APP_CATALOG.filter((app) => hasAppAccess(userRoles, app.id))
}

export function getAccessibleAdminApps(userRoles: string[]): NavApp[] {
  return ADMIN_CATALOG.filter((app) => hasAppAccess(userRoles, app.id))
}
