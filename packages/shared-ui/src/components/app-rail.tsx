import { useState, useCallback } from "react"
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
import type { PaneId } from "./pane-toolbar.tsx"
import { usePrefetchApps } from "../hooks/use-prefetch-apps.ts"
import { useBranding } from "../lib/branding.ts"
import { FeedbackPopover } from "./feedback-popover.tsx"
import {
  Truck,
  Gauge,
  CreditCard,
  Layers,
  PanelLeft,
  Receipt,
  type LucideIcon,
} from "lucide-react"

const RAIL_STORAGE_KEY = "haderach-rail-expanded"

export function useRailExpanded(): [boolean, () => void] {
  const [expanded, setExpanded] = useState(true)

  const toggle = useCallback(() => {
    setExpanded((prev) => {
      const next = !prev
      try { localStorage.setItem(RAIL_STORAGE_KEY, String(next)) } catch { /* storage unavailable */ }
      return next
    })
  }, [])

  return [expanded, toggle]
}

const ICON_MAP: Record<string, LucideIcon> = {
  truck: Truck,
  gauge: Gauge,
  "credit-card": CreditCard,
  layers: Layers,
  receipt: Receipt,
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
  openPanes?: Record<PaneId, boolean> | null
  getIdToken?: () => Promise<string>
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
  openPanes,
  getIdToken,
  className,
}: AppRailProps) {
  const railApps = apps.filter((a) => a.railEnabled)
  usePrefetchApps(apps, activeAppId)
  const branding = useBranding()

  const lockupMode = branding?.lockupMode ?? "none"
  const logoSrc = branding?.logoSvg
    ? `data:image/svg+xml;utf8,${encodeURIComponent(branding.logoSvg)}`
    : "/assets/landing/logo.svg"
  const lockupSrc = branding?.lockupSvg
    ? `data:image/svg+xml;utf8,${encodeURIComponent(branding.lockupSvg)}`
    : null

  return (
    <nav
      className={cn(
        "flex h-screen flex-col overflow-hidden bg-chrome-bg transition-[width] duration-200 ease-in-out",
        expanded ? "w-[220px]" : "w-20",
        className,
      )}
    >
      {/* Logo + toggle */}
      <div className="flex h-14 shrink-0 items-center">
        {expanded && lockupMode === "swap" && lockupSrc ? (
          /* Lockup spans beyond the logo column; h-[28px] keeps the "A" the
             same pixel height as the h-9 standalone logo (282/370 ≈ 282/290). */
          <a href="/" className="flex shrink-0 items-center pl-8">
            <img className="h-[28px] shrink-0" src={lockupSrc} alt="Haderach" />
          </a>
        ) : (
          /* Logo column — fixed at collapsed rail width so the logo never shifts */
          <div className="flex w-20 shrink-0 items-center justify-center">
            {expanded ? (
              <a href="/">
                <img className="h-9 w-9 shrink-0" src={logoSrc} alt="Haderach" />
              </a>
            ) : (
              <button
                onClick={onToggle}
                className="group relative inline-flex items-center rounded-md hover:bg-chrome-hover"
                aria-label="Expand sidebar"
              >
                <img
                  className="h-9 w-9 shrink-0 transition-opacity duration-150 group-hover:opacity-0"
                  src={logoSrc}
                  alt="Haderach"
                />
                <PanelLeft className="absolute inset-0 m-auto h-5 w-5 text-chrome-text-strong opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
              </button>
            )}
          </div>
        )}
        {lockupMode === "text" && (
          <span className={cn(
            "-ml-3 whitespace-nowrap text-[0.95rem] font-semibold uppercase tracking-[0.04em] text-[#03666c] transition-opacity duration-200",
            expanded ? "opacity-100" : "opacity-0",
          )}>
            Haderach
          </span>
        )}
        <button
          onClick={onToggle}
          className={cn(
            "ml-auto mr-3 inline-flex shrink-0 items-center justify-center rounded-md p-2 text-chrome-text-strong hover:bg-chrome-hover hover:text-chrome-text-hover",
            !expanded && "hidden",
          )}
          aria-label="Collapse sidebar"
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
                "group relative flex items-center gap-3 whitespace-nowrap rounded-md px-3 py-3 text-base font-medium transition-colors",
                isActive
                  ? "text-chrome-text-hover"
                  : "text-chrome-text-muted hover:bg-chrome-hover hover:text-chrome-text-hover",
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-sm bg-chrome-text-hover" />
              )}
              <div className="flex size-8 shrink-0 items-center justify-center">
                <Icon className="h-6 w-6" />
              </div>
              <span className="truncate">{app.label}</span>
            </a>
          )
        })}
      </div>

      {/* Feedback + User avatar */}
      {activeAppId && getIdToken && (
        <div className="px-3">
          <FeedbackPopover
            appId={activeAppId}
            openPanes={openPanes}
            getIdToken={getIdToken}
          />
        </div>
      )}
      {userEmail && (
        <div className="px-3 py-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex w-full items-center gap-3 whitespace-nowrap rounded-md px-3 py-1.5 outline-none hover:bg-chrome-hover focus-visible:ring-2 focus-visible:ring-chrome-text-muted"
                aria-label="User menu"
              >
                <AvatarImage
                  email={userEmail}
                  photoURL={userPhotoURL}
                  displayName={userDisplayName}
                />
                <div className="flex flex-col gap-0 overflow-hidden text-left">
                  <span className="truncate text-xs font-medium text-chrome-text-strong">
                    {getFirstName(userDisplayName)}
                  </span>
                  <span className="truncate text-[0.65rem] text-chrome-text-muted">
                    Beta Plan
                  </span>
                </div>
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
