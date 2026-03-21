import type { ReactNode } from "react"
import { cn } from "../lib/utils.ts"
import { Button } from "./ui/button.tsx"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu.tsx"
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip.tsx"

export interface NavApp {
  id: string
  label: string
  path: string
}

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

function UserAvatar({
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

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          {photoURL ? (
            <img
              src={photoURL}
              alt={label}
              referrerPolicy="no-referrer"
              className={cn(
                "size-8 shrink-0 rounded-full object-cover",
                className,
              )}
            />
          ) : (
            <div
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full bg-[#3d8b90] text-[0.625rem] font-semibold leading-none text-white select-none",
                className,
              )}
              aria-label={label}
            >
              {initials}
            </div>
          )}
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-neutral-100 text-neutral-700">
          {displayName && <p className="font-bold">{displayName}</p>}
          <p>{email}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function AppsDropdown({ apps, activeAppId }: { apps: NavApp[]; activeAppId?: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-base text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-0"
        >
          Applications
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[160px] border-neutral-200 shadow-lg">
        {apps.map((app) => (
          <DropdownMenuItem key={app.id} asChild>
            <a
              href={app.path}
              className={cn(
                "cursor-pointer",
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

  return (
    <header
      className={cn(
        "grid grid-cols-[1fr_auto_1fr] items-center border-b border-neutral-200 bg-white px-6 py-3",
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

      <div className="flex items-center justify-end gap-3">
        {userEmail ? (
          <>
            <UserAvatar email={userEmail} photoURL={userPhotoURL} displayName={userDisplayName} />
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
              >
                Sign out
              </button>
            )}
          </>
        ) : (
          onSignIn && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSignIn}
              className="border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            >
              Sign in
            </Button>
          )
        )}
      </div>
    </header>
  )
}
