import { cn } from "../lib/utils.ts"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./ui/dropdown-menu.tsx"
import type { NavApp } from "../auth/app-catalog.ts"
import {
  Truck,
  BarChart3,
  CreditCard,
  Layers,
  PanelLeft,
  type LucideIcon,
} from "lucide-react"

const ICON_MAP: Record<string, LucideIcon> = {
  truck: Truck,
  "bar-chart-3": BarChart3,
  "credit-card": CreditCard,
  layers: Layers,
}

function getInitials(displayName?: string, email?: string): string {
  if (displayName) {
    const parts = displayName.trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return parts[0][0].toUpperCase()
  }
  if (email) return email.charAt(0).toUpperCase()
  return "H"
}

function getFirstName(displayName?: string): string {
  if (!displayName) return ""
  return displayName.trim().split(/\s+/)[0]
}

function AvatarImage({
  email,
  photoURL,
  displayName,
  className,
}: {
  email: string
  photoURL?: string
  displayName?: string
  className?: string
}) {
  const initials = getInitials(displayName, email)
  const label = displayName || email

  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt={label}
        referrerPolicy="no-referrer"
        className={cn(
          "size-8 shrink-0 rounded-full object-cover",
          className,
        )}
      />
    )
  }

  return (
    <div
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full bg-chrome-avatar text-[0.625rem] font-semibold leading-none text-white select-none",
        className,
      )}
      aria-label={label}
    >
      {initials}
    </div>
  )
}

export interface AppRailProps {
  apps: NavApp[]
  activeAppId?: string
  expanded: boolean
  onToggle: () => void
  userEmail?: string
  userPhotoURL?: string
  userDisplayName?: string
  onSignOut?: () => void
  className?: string
}

export function AppRail({
  apps,
  activeAppId,
  expanded,
  onToggle,
  userEmail,
  userPhotoURL,
  userDisplayName,
  onSignOut,
  className,
}: AppRailProps) {
  const railApps = apps.filter((a) => a.railEnabled)

  return (
    <nav
      className={cn(
        "flex h-screen flex-col border-r border-chrome-border bg-chrome-bg transition-[width] duration-200 ease-in-out",
        expanded ? "w-[220px]" : "w-20",
        className,
      )}
    >
      {/* Logo + toggle */}
      <div className="flex h-16 items-center gap-2 px-4">
        <a href="/" className="flex shrink-0 items-center">
          {expanded ? (
            <img
              className="h-8 w-auto shrink-0"
              src="/assets/landing/logo_lockup.svg"
              alt="Haderach"
            />
          ) : (
            <img
              className="h-8 w-8 shrink-0"
              src="/assets/landing/logo.svg"
              alt="Haderach"
            />
          )}
        </a>
        <button
          onClick={onToggle}
          className="ml-auto inline-flex items-center justify-center rounded-md p-2 text-chrome-text-strong hover:bg-chrome-hover hover:text-chrome-text-hover"
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          <PanelLeft className="h-5 w-5" />
        </button>
      </div>

      {/* Domain icons */}
      <div className="flex flex-1 flex-col items-stretch justify-center gap-1.5 px-3">
        {railApps.map((app) => {
          const Icon = ICON_MAP[app.icon ?? ""] ?? Truck
          const isActive = app.id === activeAppId

          return (
            <a
              key={app.id}
              href={app.path}
              className={cn(
                "group relative flex items-center rounded-md py-3 text-base font-medium transition-colors",
                expanded ? "gap-3 px-3" : "justify-center px-0",
                isActive
                  ? "text-chrome-text-hover"
                  : "text-chrome-text-muted hover:bg-chrome-hover hover:text-chrome-text-hover",
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-sm bg-chrome-text-hover" />
              )}
              <Icon className={cn("shrink-0", expanded ? "h-6 w-6" : "h-7 w-7")} />
              {expanded && (
                <span className="truncate">{app.label}</span>
              )}
            </a>
          )
        })}
      </div>

      {/* User avatar */}
      {userEmail && (
        <div className="border-t border-chrome-border px-3 py-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-3 py-1.5 outline-none hover:bg-chrome-hover focus-visible:ring-2 focus-visible:ring-chrome-text-muted",
                  !expanded && "justify-center px-0",
                )}
                aria-label="User menu"
              >
                <AvatarImage
                  email={userEmail}
                  photoURL={userPhotoURL}
                  displayName={userDisplayName}
                />
                {expanded && (
                  <div className="flex flex-col gap-0 overflow-hidden text-left">
                    <span className="truncate text-xs font-medium text-chrome-text-strong">
                      {getFirstName(userDisplayName)}
                    </span>
                    <span className="truncate text-[0.65rem] text-chrome-text-muted">
                      Beta Plan
                    </span>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="start"
              className="min-w-[220px] bg-chrome-bg text-chrome-text-strong border-chrome-border shadow-lg"
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-center gap-3 py-1">
                  <AvatarImage
                    email={userEmail}
                    photoURL={userPhotoURL}
                    displayName={userDisplayName}
                  />
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    {userDisplayName && (
                      <span className="truncate text-sm font-medium text-chrome-text-strong">
                        {userDisplayName}
                      </span>
                    )}
                    <span className="truncate text-xs text-chrome-text-muted">
                      {userEmail}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-chrome-border" />
              <DropdownMenuItem asChild>
                <a
                  href="/admin/"
                  className="cursor-pointer focus:bg-chrome-hover focus:text-chrome-text-hover"
                >
                  Settings
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-chrome-border" />
              {onSignOut && (
                <DropdownMenuItem
                  onClick={onSignOut}
                  className="cursor-pointer focus:bg-chrome-hover focus:text-chrome-text-hover"
                >
                  Log out
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </nav>
  )
}
