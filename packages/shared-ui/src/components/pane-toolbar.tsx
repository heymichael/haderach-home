import { cn } from "../lib/utils.ts"
import { MessageSquare, BarChart3, Database } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type PaneId = "chat" | "analytics" | "data"

interface PaneDef {
  id: PaneId
  label: string
  icon: LucideIcon
}

const PANE_DEFS: PaneDef[] = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "data", label: "Data", icon: Database },
]

export interface PaneToolbarProps {
  activePanes: Record<PaneId, boolean>
  onPaneToggle: (id: PaneId) => void
  className?: string
}

export function PaneToolbar({
  activePanes,
  onPaneToggle,
  className,
}: PaneToolbarProps) {
  return (
    <div
      className={cn(
        "flex h-14 shrink-0 items-center justify-center gap-2 border-b border-border",
        className,
      )}
    >
      {PANE_DEFS.map(({ id, label, icon: Icon }) => {
        const isActive = activePanes[id]

        return (
          <button
            key={id}
            onClick={() => onPaneToggle(id)}
            className={cn(
              "inline-flex items-center gap-2.5 rounded-md px-3.5 py-2 text-base font-medium transition-colors",
              isActive
                ? "bg-accent text-chrome-text-hover"
                : "text-chrome-text-muted hover:bg-chrome-hover hover:text-chrome-text-hover",
            )}
            aria-label={`Toggle ${label}`}
            aria-pressed={isActive}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {isActive && (
              <span className="animate-in fade-in slide-in-from-left-1 duration-150">
                {label}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
