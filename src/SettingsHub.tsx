import {
  ADMIN_CATALOG,
  ADMIN_GRANTING_ROLES,
} from "@haderach/shared-ui"

const SETTINGS_ROLES = new Set(["admin", "finance_admin"])

interface Props {
  roles: string[]
}

export function SettingsHub({ roles }: Props) {
  const hasAccess = roles.some((r) => SETTINGS_ROLES.has(r))

  if (!hasAccess) {
    return (
      <div className="pt-16 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Access Denied</h1>
        <p className="mt-2 text-foreground-muted">
          You don't have permission to access Settings.
        </p>
      </div>
    )
  }

  const visibleApps = ADMIN_CATALOG.filter((app) => {
    const grantingRoles = ADMIN_GRANTING_ROLES[app.id] ?? []
    return roles.some((r) => grantingRoles.includes(r))
  })

  return (
    <div className="w-full max-w-lg pt-16 px-6">
      <h1 className="text-2xl font-semibold text-foreground mb-8">Settings</h1>

      <div className="space-y-2">
        {visibleApps.map((app) => (
          <a
            key={app.id}
            href={app.path}
            className="flex items-center justify-between rounded-lg border border-border bg-surface px-5 py-4 transition-colors hover:border-border-hover hover:bg-surface-hover"
          >
            <span className="text-base font-medium text-foreground">
              {app.label}
            </span>
            <svg
              className="h-5 w-5 text-foreground-muted shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
            </svg>
          </a>
        ))}
      </div>
    </div>
  )
}
