import { Button } from "./ui/button.tsx"
import { cn } from "../lib/utils.ts"
import { BarChart3, Table2, Download } from "lucide-react"

export type ViewMode = "chart" | "table"

export interface ViewModeToggleProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  onDownload?: () => void
  className?: string
}

export function ViewModeToggle({
  viewMode,
  onViewModeChange,
  onDownload,
  className,
}: ViewModeToggleProps) {
  return (
    <div className={cn("ml-auto flex items-center gap-1 self-end", className)}>
      <Button
        variant="ghost"
        size="icon"
        className={cn("h-9 w-9", viewMode === "chart" && "bg-accent")}
        onClick={() => onViewModeChange("chart")}
        aria-label="Chart view"
      >
        <BarChart3 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn("h-9 w-9", viewMode === "table" && "bg-accent")}
        onClick={() => onViewModeChange("table")}
        aria-label="Table view"
      >
        <Table2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        onClick={onDownload}
        disabled={viewMode === "chart"}
        aria-label="Download CSV"
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  )
}
