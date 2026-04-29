import { cn } from "../lib/utils.ts"
import { MessageSquare, Gauge, Database, Clock, Users, Image } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./ui/tooltip.tsx"

export type PaneId = "chat" | "analytics" | "data" | "schedule" | "admin" | "media"

interface PaneDef {
  id: PaneId
  label: string
  icon: LucideIcon
}

const PANE_DEFS: PaneDef[] = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "analytics", label: "Dashboard", icon: Gauge },
  { id: "data", label: "Collections", icon: Database },
  { id: "schedule", label: "Schedule", icon: Clock },
  { id: "admin", label: "Admin", icon: Users },
  { id: "media", label: "Media", icon: Image },
]

export interface PaneToolbarProps {
  activePanes: Record<PaneId, boolean>
  onPaneToggle: (id: PaneId) => void
  panes?: PaneId[]
  className?: string
}

export function PaneToolbar({
  activePanes,
  onPaneToggle,
  panes,
  className,
}: PaneToolbarProps) {
  const visiblePanes = panes
    ? PANE_DEFS.filter((p) => panes.includes(p.id))
    : PANE_DEFS

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className={cn(
          "flex h-14 shrink-0 items-center justify-center gap-4",
          className,
        )}
      >
        {visiblePanes.map(({ id, label, icon: Icon }) => {
          const isActive = activePanes[id]

          return (
            <Tooltip key={id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onPaneToggle(id)}
                  className={cn(
                    "inline-flex items-center justify-center rounded-md p-2.5 transition-colors",
                    isActive
                      ? "bg-accent text-chrome-text-hover"
                      : "text-chrome-text-muted hover:bg-chrome-hover hover:text-chrome-text-hover",
                  )}
                  aria-label={`Toggle ${label}`}
                  aria-pressed={isActive}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={4}>
                {label}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </TooltipProvider>
  )
}
