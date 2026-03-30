import type { ReactNode } from "react"
import { cn } from "../lib/utils.ts"
import { Button } from "./ui/button.tsx"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./ui/dropdown-menu.tsx"
import type { NavApp } from "../auth/app-catalog.ts"
import { usePrefetchApps } from "../hooks/use-prefetch-apps.ts"

export interface GlobalNavProps {
  apps?: NavApp[]
  activeAppId?: string
  userEmail?: string
  userPhotoURL?: string
  userDisplayName?: string
  onSignIn?: () => void
  onSignOut?: () => void
  logo?: ReactNode
  className?: string
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

function UserDropdown({
  email,
  photoURL,
  displayName,
  onSignOut,
}: {
  email: string
  photoURL?: string
  displayName?: string
  onSignOut?: () => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-chrome-text-muted"
          aria-label="User menu"
        >
          <AvatarImage email={email} photoURL={photoURL} displayName={displayName} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[220px] bg-chrome-bg text-chrome-text-strong border-chrome-border shadow-lg"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3 py-1">
            <AvatarImage email={email} photoURL={photoURL} displayName={displayName} />
            <div className="flex flex-col gap-0.5 overflow-hidden">
              {displayName && (
                <span className="truncate text-sm font-medium text-chrome-text-strong">
                  {displayName}
                </span>
              )}
              <span className="truncate text-xs text-chrome-text-muted">
                {email}
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
  )
}

function AppsDropdown({ apps, activeAppId }: { apps: NavApp[]; activeAppId?: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-base text-chrome-text hover:text-chrome-text-hover hover:bg-chrome-hover focus-visible:outline-none focus-visible:ring-0"
        >
          Applications
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[160px] bg-chrome-bg text-chrome-text-strong border-chrome-border shadow-lg">
        {apps.map((app) => (
          <DropdownMenuItem key={app.id} asChild>
            <a
              href={app.path}
              className={cn(
                "cursor-pointer focus:bg-chrome-hover focus:text-chrome-text-hover",
                app.id === activeAppId && "font-medium",
              )}
            >
              {app.label}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function GlobalNav({
  apps,
  activeAppId,
  userEmail,
  userPhotoURL,
  userDisplayName,
  onSignIn,
  onSignOut,
  logo,
  className,
}: GlobalNavProps) {
  const hasApps = apps && apps.length > 0
  usePrefetchApps(apps ?? [], activeAppId)

  return (
    <header
      className={cn(
        "grid grid-cols-[1fr_auto_1fr] items-center border-b border-chrome-border bg-chrome-bg px-6 py-3",
        className,
      )}
    >
      <div className="flex items-center">
        {logo && (
          <a href="/" className="shrink-0">
            {logo}
          </a>
        )}
      </div>

      <div className="flex items-center justify-center">
        {hasApps && (
          <AppsDropdown apps={apps} activeAppId={activeAppId} />
        )}
      </div>

      <div className="flex items-center justify-end">
        {userEmail ? (
          <UserDropdown
            email={userEmail}
            photoURL={userPhotoURL}
            displayName={userDisplayName}
            onSignOut={onSignOut}
          />
        ) : (
          onSignIn && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSignIn}
              className="border-chrome-border text-chrome-text-strong hover:bg-chrome-subtle"
            >
              Sign in
            </Button>
          )
        )}
      </div>
    </header>
  )
}
