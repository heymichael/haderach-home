export interface NavApp {
  id: string
  label: string
  path: string
  icon?: string
  railEnabled?: boolean
}

export const APP_CATALOG: NavApp[] = [
  { id: "card", label: "Card", path: "/card/", icon: "credit-card", railEnabled: false },
  { id: "vendors", label: "Vendors", path: "/vendors/", icon: "truck", railEnabled: true },
  { id: "stocks", label: "Commodities", path: "/stocks/", icon: "layers", railEnabled: true },
]

export const APP_GRANTING_ROLES: Record<string, string[]> = {
  card: ["haderach_user"],
  stocks: ["user", "admin"],
  vendors: ["user", "admin"],
}

export const ADMIN_CATALOG: NavApp[] = [
  { id: "system_administration", label: "System", path: "/admin/system/" },
  { id: "vendor_administration", label: "Vendors", path: "/admin/vendors/" },
]

export const ADMIN_GRANTING_ROLES: Record<string, string[]> = {
  system_administration: ["admin"],
  vendor_administration: ["finance_admin"],
}

export function hasAppAccess(userRoles: string[], appId: string): boolean {
  const grantingRoles =
    APP_GRANTING_ROLES[appId] ?? ADMIN_GRANTING_ROLES[appId] ?? []
  return userRoles.some((r) => grantingRoles.includes(r))
}

export function getAccessibleApps(userRoles: string[]): NavApp[] {
  return APP_CATALOG.filter((app) => hasAppAccess(userRoles, app.id))
}

export function getAccessibleRailApps(userRoles: string[]): NavApp[] {
  return APP_CATALOG.filter((app) => app.railEnabled && hasAppAccess(userRoles, app.id))
}

export function getAccessibleAdminApps(userRoles: string[]): NavApp[] {
  return ADMIN_CATALOG.filter((app) => hasAppAccess(userRoles, app.id))
}
