import type { ReactNode } from "react"
import { cn } from "../lib/utils.ts"

export interface NavApp {
  id: string
  label: string
  path: string
}

export interface GlobalNavProps {
  apps: NavApp[]
  activeAppId?: string
  userEmail?: string
  onSignOut?: () => void
  logo?: ReactNode
  className?: string
}

export function GlobalNav({
  apps,
  activeAppId,
  userEmail,
  onSignOut,
  logo,
  className,
}: GlobalNavProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between border-b border-border px-6 py-3",
        className
      )}
    >
      <div className="flex items-center gap-6">
        {logo && <div className="shrink-0">{logo}</div>}
        <nav className="flex items-center gap-1">
          {apps.map((app) => (
            <a
              key={app.id}
              href={app.path}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                app.id === activeAppId
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {app.label}
            </a>
          ))}
        </nav>
      </div>
      {userEmail && (
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">{userEmail}</span>
          {onSignOut && (
            <button
              onClick={onSignOut}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign out
            </button>
          )}
        </div>
      )}
    </header>
  )
}
