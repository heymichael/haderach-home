import {
  type ReactNode,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react"
import { cn } from "../lib/utils.ts"
import type { PaneId } from "./pane-toolbar.tsx"

export interface PaneLayoutHandle {
  togglePane: (id: PaneId) => void
}

export interface PaneLayoutProps {
  chatContent: ReactNode
  analyticsContent: ReactNode
  dataContent: ReactNode
  chatOpen: boolean
  detailPane: "analytics" | "data" | null
  onLayoutChange: (chat: boolean, detail: "analytics" | "data" | null) => void
  className?: string
}

export const PaneLayout = forwardRef<PaneLayoutHandle, PaneLayoutProps>(
  function PaneLayout(
    {
      chatContent,
      analyticsContent,
      dataContent,
      chatOpen,
      detailPane,
      onLayoutChange,
      className,
    },
    ref,
  ) {
    const togglePane = useCallback(
      (id: PaneId) => {
        if (id === "chat") {
          if (chatOpen) {
            onLayoutChange(false, detailPane)
          } else {
            onLayoutChange(true, detailPane)
          }
        } else {
          const clickedDetail = id as "analytics" | "data"
          if (detailPane === clickedDetail) {
            onLayoutChange(chatOpen, null)
          } else {
            onLayoutChange(chatOpen, clickedDetail)
          }
        }
      },
      [chatOpen, detailPane, onLayoutChange],
    )

    useImperativeHandle(ref, () => ({ togglePane }), [togglePane])

    const bothOpen = chatOpen && detailPane !== null
    const chatOnly = chatOpen && detailPane === null
    const detailOnly = !chatOpen && detailPane !== null

    return (
      <div className={cn("flex flex-1 overflow-hidden", className)}>
        {/* Chat — always mounted, visibility controlled by CSS */}
        <div
          className={cn(
            "flex flex-col overflow-hidden transition-[width,flex] duration-200",
            chatOnly && "w-[30%]",
            bothOpen && "w-[30%] shrink-0",
            detailOnly && "hidden",
            !chatOpen && !detailPane && "w-[30%]",
          )}
        >
          {chatContent}
        </div>

        {/* Resize handle — only visible when both panes are open */}
        {bothOpen && (
          <div className="flex w-2 cursor-col-resize items-center justify-center transition-colors hover:bg-chrome-hover/50">
            <div className="h-8 w-0.5 rounded-full bg-chrome-border" />
          </div>
        )}

        {/* Detail pane */}
        <div
          className={cn(
            "flex flex-col overflow-hidden transition-[width,flex] duration-200",
            (bothOpen || detailOnly) && "flex-1",
            chatOnly && "flex-1",
            !chatOpen && !detailPane && "flex-1",
          )}
        >
          {/* Analytics — always mounted, hidden when not active */}
          <div className={cn("flex flex-1 flex-col overflow-hidden", detailPane !== "analytics" && "hidden")}>
            {analyticsContent}
          </div>
          {/* Data — always mounted, hidden when not active */}
          <div className={cn("flex flex-1 flex-col overflow-hidden", detailPane !== "data" && "hidden")}>
            {dataContent}
          </div>
        </div>
      </div>
    )
  },
)
