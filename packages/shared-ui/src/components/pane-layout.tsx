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

export type DetailPaneId = "analytics" | "data" | "schedule" | "admin" | "media"

export interface PaneLayoutProps {
  chatContent: ReactNode
  analyticsContent?: ReactNode
  dataContent: ReactNode
  scheduleContent?: ReactNode
  adminContent?: ReactNode
  mediaContent?: ReactNode
  chatOpen: boolean
  detailPane: DetailPaneId | null
  onLayoutChange: (chat: boolean, detail: DetailPaneId | null) => void
  className?: string
}

export const PaneLayout = forwardRef<PaneLayoutHandle, PaneLayoutProps>(
  function PaneLayout(
    {
      chatContent,
      analyticsContent,
      dataContent,
      scheduleContent,
      adminContent,
      mediaContent,
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
          const clickedDetail = id as DetailPaneId
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
            chatOnly && "flex-1",
            bothOpen && "w-[30%] shrink-0",
            detailOnly && "hidden",
            !chatOpen && !detailPane && "hidden",
          )}
        >
          {chatContent}
        </div>

        {/* Spacer between panes */}
        {bothOpen && <div className="w-2 shrink-0" />}

        {/* Detail pane */}
        <div
          className={cn(
            "flex flex-col overflow-hidden transition-[width,flex] duration-200",
            (bothOpen || detailOnly) && "flex-1",
            chatOnly && "hidden",
            !chatOpen && !detailPane && "hidden",
          )}
        >
          {/* Analytics — mounted only when content is provided */}
          {analyticsContent != null && (
            <div className={cn("flex flex-1 flex-col overflow-hidden", detailPane !== "analytics" && "hidden")}>
              {analyticsContent}
            </div>
          )}
          {/* Data — always mounted, hidden when not active */}
          <div className={cn("flex flex-1 flex-col overflow-hidden", detailPane !== "data" && "hidden")}>
            {dataContent}
          </div>
          {/* Schedule — mounted only when content is provided */}
          {scheduleContent != null && (
            <div className={cn("flex flex-1 flex-col overflow-hidden", detailPane !== "schedule" && "hidden")}>
              {scheduleContent}
            </div>
          )}
          {/* Admin — mounted only when content is provided */}
          {adminContent != null && (
            <div className={cn("flex flex-1 flex-col overflow-hidden", detailPane !== "admin" && "hidden")}>
              {adminContent}
            </div>
          )}
          {/* Media — mounted only when content is provided */}
          {mediaContent != null && (
            <div className={cn("flex flex-1 flex-col overflow-hidden", detailPane !== "media" && "hidden")}>
              {mediaContent}
            </div>
          )}
        </div>
      </div>
    )
  },
)
