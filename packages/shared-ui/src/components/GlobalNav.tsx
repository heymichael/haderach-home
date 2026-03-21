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
  onSignIn?: () => void
  onSignOut?: () => void
  logo?: ReactNode
  className?: string
}

function UserAvatar({ email, className }: { email: string; className?: string }) {
  const initial = email.charAt(0).toUpperCase()

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-sm font-medium text-neutral-600 select-none",
              className,
            )}
            aria-label={email}
          >
            {initial}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
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
          Apps
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
  onSignIn,
  onSignOut,
  logo,
  className,
}: GlobalNavProps) {
  const hasApps = apps && apps.length > 0

  return (
    <header
      className={cn(
        "grid grid-cols-[1fr_auto_1fr] items-center bg-white px-6 py-3",
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
            <UserAvatar email={userEmail} />
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
