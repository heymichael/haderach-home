import { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from "react"
import Markdown from "react-markdown"
import { Send, Loader2, PanelRightClose, Download, Paperclip, X, ThumbsUp, ThumbsDown } from "lucide-react"

import { cn } from "../lib/utils.ts"
import { agentFetch } from "../lib/agent-fetch.ts"
import { Button } from "./ui/button.tsx"
import { Separator } from "./ui/separator.tsx"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "./ui/dialog.tsx"
import { ChatTable } from "./chat-table.tsx"
import type { ChatTablePayload } from "./chat-table.tsx"

export interface ChatChoice {
  id: string
  label: string
  meta?: Record<string, unknown>
}

export interface ChatMessage {
  role: "user" | "assistant" | "tool"
  content: string | null
  hidden?: boolean
  choices?: ChatChoice[]
  downloads?: ChatDownload[]
  tables?: ChatTablePayload[]
  tool_calls?: Array<{ id: string; type: string; function: { name: string; arguments: string } }>
  tool_call_id?: string
}

export interface ChatPendingAction {
  type: string
  [key: string]: unknown
}

interface ChatDisambiguation {
  candidates: Array<{ id: string; name: string }>
  original_args?: Record<string, unknown>
}

interface ChatDownload {
  filename: string
  content: string
  mime: string
}

interface ChatResponse {
  reply: string
  tool_calls_executed: string[]
  pending_actions?: ChatPendingAction[]
  disambiguation?: ChatDisambiguation | null
  downloads?: ChatDownload[]
  tables?: ChatTablePayload[]
  session_id?: string
  tool_messages?: Array<Record<string, unknown>>
}

export interface ChatPanelHandle {
  addMessage: (msg: ChatMessage) => void
}

export interface TableViewContext {
  visibleColumns?: string[]
  activeFilters?: Array<{ column: string; values: string[] }>
  dataPaneOpen?: boolean
}

export interface ChatPanelProps {
  open?: boolean
  onClose?: () => void
  mode?: "standalone" | "panel"
  appContext: string
  extraContext?: Record<string, unknown>
  tableViewContext?: TableViewContext
  getIdToken?: () => Promise<string>
  onToolResult?: (toolNames: string[]) => void
  onPendingAction?: (actions: ChatPendingAction[]) => void
  title?: string
  disabled?: boolean
  placeholderMessage?: string
  inputPlaceholder?: string
}

export const ChatPanel = forwardRef<ChatPanelHandle, ChatPanelProps>(function ChatPanel({
  open = true,
  onClose,
  mode = "standalone",
  appContext,
  extraContext,
  tableViewContext,
  getIdToken,
  onToolResult,
  onPendingAction,
  title = "Agent",
  disabled = false,
  placeholderMessage = "Chat capabilities coming soon.",
  inputPlaceholder = "How can I help you manage vendors?",
}, ref) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [attachment, setAttachment] = useState<{ filename: string; content: string; mime: string } | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [feedbackMap, setFeedbackMap] = useState<Record<number, boolean>>({})
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false)
  const [feedbackDialogSeq, setFeedbackDialogSeq] = useState<number>(0)
  const [feedbackComment, setFeedbackComment] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => ({
    addMessage: (msg: ChatMessage) => setMessages((prev) => [...prev, msg]),
  }), [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (open) textareaRef.current?.focus()
  }, [open])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setAttachment({ filename: file.name, content: reader.result as string, mime: file.type || "text/csv" })
    }
    reader.readAsText(file)
    e.target.value = ""
  }, [])

  const sendMessages = useCallback(async (outgoing: ChatMessage[]) => {
    if (loading || disabled || !getIdToken) return

    setMessages((prev) => [...prev, ...outgoing])
    setLoading(true)

    const allMessages = [...messages, ...outgoing]

    try {
      const payload: Record<string, unknown> = {
        messages: allMessages.map((m) => {
          const msg: Record<string, unknown> = { role: m.role }
          if (m.content != null) msg.content = m.content
          if (m.tool_calls) msg.tool_calls = m.tool_calls
          if (m.tool_call_id) msg.tool_call_id = m.tool_call_id
          return msg
        }),
        context: { app: appContext, ...extraContext, ...(tableViewContext && { tableView: tableViewContext }) },
      }
      if (sessionId) {
        payload.session_id = sessionId
      }
      if (attachment) {
        payload.attachments = [attachment]
      }
      const resp = await agentFetch("/chat", getIdToken, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!resp.ok) {
        const errText = await resp.text()
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error ${resp.status}: ${errText}` },
        ])
        return
      }

      const data: ChatResponse = await resp.json()

      if (data.session_id) {
        setSessionId(data.session_id)
      }

      const assistantMsg: ChatMessage = { role: "assistant", content: data.reply }
      if (data.disambiguation?.candidates?.length) {
        assistantMsg.choices = data.disambiguation.candidates.map((c) => ({
          id: c.id,
          label: c.name,
          meta: data.disambiguation?.original_args ?? undefined,
        }))
      }
      if (data.downloads?.length) {
        assistantMsg.downloads = data.downloads
      }
      if (data.tables?.length) {
        assistantMsg.tables = data.tables
      }
      const newMessages: ChatMessage[] = []
      if (data.tool_messages?.length) {
        for (const tm of data.tool_messages) {
          newMessages.push({
            role: tm.role as ChatMessage["role"],
            content: (tm.content as string) ?? null,
            hidden: true,
            tool_calls: tm.tool_calls as ChatMessage["tool_calls"],
            tool_call_id: tm.tool_call_id as string | undefined,
          })
        }
      }
      newMessages.push(assistantMsg)
      setMessages((prev) => [...prev, ...newMessages])

      if (data.pending_actions?.length) {
        onPendingAction?.(data.pending_actions)
      } else if (data.tool_calls_executed.length > 0) {
        onToolResult?.(data.tool_calls_executed)
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Network error: ${err instanceof Error ? err.message : err}` },
      ])
    } finally {
      setLoading(false)
    }
  }, [loading, disabled, messages, getIdToken, appContext, extraContext, tableViewContext, onToolResult, onPendingAction, attachment, sessionId])

  const send = useCallback(() => {
    const text = input.trim()
    if (!text && !attachment) return
    const content = text || (attachment ? `Uploading ${attachment.filename}` : "")
    setInput("")
    setAttachment(null)
    sendMessages([{ role: "user", content }])
  }, [input, attachment, sendMessages])

  const handleChoiceClick = useCallback((choice: ChatChoice) => {
    setMessages((prev) => prev.map((m) =>
      m.choices ? { ...m, choices: undefined } : m
    ))
    const fieldArgs = choice.meta ?? {}
    const argsStr = Object.entries(fieldArgs)
      .map(([k, v]) => `${k}="${v}"`)
      .join(", ")
    const instruction = `Call modify_vendor with identifier="${choice.id}"${argsStr ? `, ${argsStr}` : ""}. Use this exact UUID as the identifier.`
    sendMessages([
      { role: "user", content: choice.label },
      { role: "user", content: instruction, hidden: true },
    ])
  }, [sendMessages])

  const triggerDownload = useCallback((dl: ChatDownload) => {
    const blob = new Blob([dl.content], { type: dl.mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = dl.filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [])

  const clearChat = useCallback(() => {
    setMessages([])
    setSessionId(null)
    setFeedbackMap({})
  }, [])

  const submitFeedback = useCallback(async (messageSeq: number, signal: boolean, comment?: string) => {
    if (!sessionId || !getIdToken) return
    try {
      await agentFetch("/feedback", getIdToken, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          message_seq: messageSeq,
          signal,
          comment: comment || null,
        }),
      })
    } catch {
      // fire-and-forget; don't disrupt the chat experience
    }
  }, [sessionId, getIdToken])

  const handleFeedback = useCallback((messageSeq: number, signal: boolean) => {
    setFeedbackMap((prev) => ({ ...prev, [messageSeq]: signal }))

    if (signal) {
      submitFeedback(messageSeq, true)
    } else {
      setFeedbackDialogSeq(messageSeq)
      setFeedbackComment("")
      setFeedbackDialogOpen(true)
    }
  }, [submitFeedback])

  const handleFeedbackCommentSubmit = useCallback(() => {
    submitFeedback(feedbackDialogSeq, false, feedbackComment)
    setFeedbackDialogOpen(false)
  }, [submitFeedback, feedbackDialogSeq, feedbackComment])

  const isPanel = mode === "panel"

  if (!isPanel && !open) return null

  return (
    <div className={cn(
      "flex flex-col",
      isPanel
        ? "m-2 flex-1 min-h-0 rounded-xl border border-border bg-card shadow-sm"
        : "h-full w-[25rem] border-l border-border bg-background",
    )}>
        {!isPanel && (
          <div className="flex h-12 items-center gap-2 border-b px-4">
            <Button variant="ghost" size="icon" className="size-7" onClick={onClose} aria-label="Close chat">
              <PanelRightClose />
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <h2 className="text-sm font-semibold">{title}</h2>
            {messages.length > 0 && (
              <button
                type="button"
                className="ml-auto text-xs text-muted-foreground hover:text-foreground"
                onClick={clearChat}
              >
                Clear
              </button>
            )}
          </div>
        )}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 pt-3 pb-3 space-y-3">
          {disabled && messages.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted-foreground italic">{placeholderMessage}</p>
            </div>
          )}
          {(() => {
            const visible = messages
              .map((m, originalIdx) => ({ ...m, originalIdx }))
              .filter((m) => !m.hidden)
            const lastAssistantIdx = visible.reduce(
              (acc, vm, i) => (vm.role === "assistant" ? i : acc),
              -1,
            )
            return visible.map((vm, i) => (
              <div key={vm.originalIdx}>
                <div
                  className={cn(
                    "max-w-[90%] rounded-lg px-3 py-2 text-sm leading-relaxed",
                    vm.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-muted text-foreground chat-markdown",
                  )}
                >
                  {vm.role === "assistant" ? (
                    <>
                      <Markdown
                        components={{
                          a: ({ href, children }) => (
                            <a href={href} target="_blank" rel="noopener noreferrer" className="underline text-primary">
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {vm.content}
                      </Markdown>
                      {vm.tables && vm.tables.length > 0 && vm.tables.map((t, ti) => (
                        <ChatTable key={ti} {...t} />
                      ))}
                      {vm.choices && vm.choices.length > 0 && (
                        <div className="mt-2 flex flex-col gap-1">
                          {vm.choices.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => handleChoiceClick(c)}
                              disabled={loading}
                              className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-left text-xs hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
                            >
                              <span className="size-3 shrink-0 rounded-full border-2 border-primary" />
                              {c.label}
                            </button>
                          ))}
                        </div>
                      )}
                      {vm.downloads && vm.downloads.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {vm.downloads.map((dl) => (
                            <button
                              key={dl.filename}
                              type="button"
                              onClick={() => triggerDownload(dl)}
                              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                              <Download className="h-3.5 w-3.5" />
                              {dl.filename}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    vm.content
                  )}
                </div>
                {vm.role === "assistant" && (
                  <div className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                    <button
                      type="button"
                      onClick={() => handleFeedback(vm.originalIdx, true)}
                      className={cn("rounded p-0.5 transition-colors", feedbackMap[vm.originalIdx] === true ? "text-primary" : "hover:text-foreground")}
                      aria-label="Good response"
                    >
                      <ThumbsUp
                        className="h-3.5 w-3.5"
                        {...(feedbackMap[vm.originalIdx] === true ? { fill: "currentColor" } : {})}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFeedback(vm.originalIdx, false)}
                      className={cn("rounded p-0.5 transition-colors", feedbackMap[vm.originalIdx] === false ? "text-primary" : "hover:text-foreground")}
                      aria-label="Bad response"
                    >
                      <ThumbsDown
                        className="h-3.5 w-3.5"
                        {...(feedbackMap[vm.originalIdx] === false ? { fill: "currentColor" } : {})}
                      />
                    </button>
                    {i === lastAssistantIdx && messages.length > 0 && (
                      <button
                        type="button"
                        onClick={clearChat}
                        className="ml-auto text-xs text-primary hover:text-primary-hover transition-colors"
                      >
                        clear chat
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          })()}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Thinking…
            </div>
          )}
        </div>

        <div className="px-3 pb-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileSelect}
          />
          {attachment && (
            <div className="mb-1.5 flex items-center gap-1.5 rounded-md border border-border bg-muted px-2.5 py-1 text-xs text-muted-foreground">
              <Paperclip className="h-3 w-3 shrink-0" />
              <span className="truncate">{attachment.filename}</span>
              <button
                type="button"
                onClick={() => setAttachment(null)}
                className="ml-auto shrink-0 rounded-sm p-0.5 hover:bg-accent hover:text-foreground"
                aria-label="Remove attachment"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  send()
                }
              }}
              placeholder={inputPlaceholder}
              disabled={loading || disabled}
              rows={5}
              className="w-full resize-none rounded-md border border-input bg-background pl-3 pr-12 py-2 text-sm leading-relaxed placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
            />
            <div className="absolute right-2.5 top-1.5 bottom-1.5 flex flex-col items-center justify-end gap-1">
              <Button
                size="icon"
                variant="ghost"
                disabled={loading || disabled}
                onClick={() => fileInputRef.current?.click()}
                className="size-7"
                aria-label="Attach file"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                disabled={loading || disabled || (!input.trim() && !attachment)}
                onClick={send}
                className="size-7"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>What went wrong?</DialogTitle>
            </DialogHeader>
            <textarea
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              placeholder="Tell us what went wrong…"
              rows={3}
              className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost" size="sm">Skip</Button>
              </DialogClose>
              <Button size="sm" onClick={handleFeedbackCommentSubmit}>
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  )
})
