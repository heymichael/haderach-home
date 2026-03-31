import { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from "react"
import Markdown from "react-markdown"
import { Send, Loader2, PanelRightClose, RotateCcw } from "lucide-react"

import { cn } from "../lib/utils.ts"
import { agentFetch } from "../lib/agent-fetch.ts"
import { Button } from "./ui/button.tsx"
import { Separator } from "./ui/separator.tsx"

export interface ChatChoice {
  id: string
  label: string
  meta?: Record<string, unknown>
}

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
  hidden?: boolean
  choices?: ChatChoice[]
}

export interface ChatPendingAction {
  type: string
  [key: string]: unknown
}

interface ChatDisambiguation {
  candidates: Array<{ id: string; name: string }>
  original_args?: Record<string, unknown>
}

interface ChatResponse {
  reply: string
  tool_calls_executed: string[]
  pending_actions?: ChatPendingAction[]
  disambiguation?: ChatDisambiguation | null
}

export interface ChatPanelHandle {
  addMessage: (msg: ChatMessage) => void
}

export interface ChatPanelProps {
  open?: boolean
  onClose?: () => void
  mode?: "standalone" | "panel"
  appContext: string
  getIdToken?: () => Promise<string>
  onToolResult?: (toolNames: string[]) => void
  onPendingAction?: (actions: ChatPendingAction[]) => void
  title?: string
  disabled?: boolean
  placeholderMessage?: string
}

export const ChatPanel = forwardRef<ChatPanelHandle, ChatPanelProps>(function ChatPanel({
  open = true,
  onClose,
  mode = "standalone",
  appContext,
  getIdToken,
  onToolResult,
  onPendingAction,
  title = "Agent",
  disabled = false,
  placeholderMessage = "Chat capabilities coming soon.",
}, ref) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useImperativeHandle(ref, () => ({
    addMessage: (msg: ChatMessage) => setMessages((prev) => [...prev, msg]),
  }), [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (open) textareaRef.current?.focus()
  }, [open])

  const sendMessages = useCallback(async (outgoing: ChatMessage[]) => {
    if (loading || disabled || !getIdToken) return

    setMessages((prev) => [...prev, ...outgoing])
    setLoading(true)

    const allMessages = [...messages, ...outgoing]

    try {
      const resp = await agentFetch("/chat", getIdToken, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
          context: { app: appContext },
        }),
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

      const assistantMsg: ChatMessage = { role: "assistant", content: data.reply }
      if (data.disambiguation?.candidates?.length) {
        assistantMsg.choices = data.disambiguation.candidates.map((c) => ({
          id: c.id,
          label: c.name,
          meta: data.disambiguation?.original_args ?? undefined,
        }))
      }
      setMessages((prev) => [...prev, assistantMsg])

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
  }, [loading, disabled, messages, getIdToken, appContext, onToolResult, onPendingAction])

  const send = useCallback(() => {
    const text = input.trim()
    if (!text) return
    setInput("")
    sendMessages([{ role: "user", content: text }])
  }, [input, sendMessages])

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
                onClick={() => setMessages([])}
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
          {messages.filter((m) => !m.hidden).map((m, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[90%] rounded-lg px-3 py-2 text-sm leading-relaxed",
                m.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-muted text-foreground chat-markdown",
              )}
            >
              {m.role === "assistant" ? (
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
                    {m.content}
                  </Markdown>
                  {m.choices && m.choices.length > 0 && (
                    <div className="mt-2 flex flex-col gap-1">
                      {m.choices.map((c) => (
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
                </>
              ) : (
                m.content
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Thinking…
            </div>
          )}
        </div>

        <div className="relative px-3 pb-3">
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
            placeholder="Message the agent…"
            disabled={loading || disabled}
            rows={5}
            className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 pr-16 text-sm leading-relaxed placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
          />
          <div className="absolute top-3 right-4 flex flex-col gap-1">
            <Button
              size="icon"
              variant="ghost"
              disabled={loading || disabled || !input.trim()}
              onClick={send}
              className="size-7"
            >
              <Send className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setMessages([])}
              className="size-7"
              aria-label="Clear chat"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
  )
})
