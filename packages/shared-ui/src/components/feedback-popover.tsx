import { useState, useCallback } from "react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "./ui/popover.tsx"
import { Button } from "./ui/button.tsx"
import { cn } from "../lib/utils.ts"
import { agentFetch } from "../lib/agent-fetch.ts"
import { MessageSquarePlus } from "lucide-react"
import type { PaneId } from "./pane-toolbar.tsx"

export interface FeedbackPopoverProps {
  appId: string
  openPanes?: Record<PaneId, boolean> | null
  getIdToken: () => Promise<string>
  className?: string
}

type Phase = "form" | "submitting" | "thanks"

export function FeedbackPopover({
  appId,
  openPanes,
  getIdToken,
  className,
}: FeedbackPopoverProps) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState("")
  const [phase, setPhase] = useState<Phase>("form")

  const reset = useCallback(() => {
    setText("")
    setPhase("form")
  }, [])

  const handleOpenChange = useCallback(
    (next: boolean) => {
      setOpen(next)
      if (!next) reset()
    },
    [reset],
  )

  const handleSubmit = useCallback(async () => {
    if (!text.trim()) return
    setPhase("submitting")
    try {
      await agentFetch("/feedback/site", getIdToken, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          app_id: appId,
          open_panes: openPanes ?? null,
          feedback_text: text.trim(),
        }),
      })
      setPhase("thanks")
      setTimeout(() => {
        setOpen(false)
        reset()
      }, 1500)
    } catch {
      setPhase("form")
    }
  }, [text, appId, openPanes, getIdToken, reset])

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex w-full items-center gap-3 whitespace-nowrap rounded-md px-3 py-3 text-base font-medium transition-colors",
            "text-chrome-text-muted hover:bg-chrome-hover hover:text-chrome-text-hover",
            className,
          )}
          aria-label="Send feedback"
        >
          <div className="flex size-8 shrink-0 items-center justify-center">
            <MessageSquarePlus className="h-6 w-6" />
          </div>
          <span className="truncate">Feedback</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        className="w-72 bg-chrome-bg text-chrome-text-strong border-chrome-border shadow-lg"
      >
        {phase === "thanks" ? (
          <p className="py-4 text-center text-sm font-medium">
            Thanks for your feedback!
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium">Send feedback</p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's on your mind?"
              rows={4}
              className="w-full resize-none rounded-md border border-chrome-border bg-transparent px-3 py-2 text-sm placeholder:text-chrome-text-muted focus:outline-none focus:ring-1 focus:ring-chrome-text-muted"
              disabled={phase === "submitting"}
            />
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!text.trim() || phase === "submitting"}
              className="self-end"
            >
              {phase === "submitting" ? "Sending..." : "Submit"}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
