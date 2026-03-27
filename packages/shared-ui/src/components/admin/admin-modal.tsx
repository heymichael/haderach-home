import * as React from "react"
import { X } from "lucide-react"
import { cn } from "../../lib/utils.ts"

interface AdminModalProps {
  title: string
  onClose: () => void
  children: React.ReactNode
  footer?: React.ReactNode
  maxWidth?: string
  className?: string
}

function AdminModal({
  title,
  onClose,
  children,
  footer,
  maxWidth = "max-w-lg",
  className,
}: AdminModalProps) {
  return (
    <div data-slot="admin-modal" className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className={cn(
          "relative bg-surface rounded-xl border border-border shadow-lg w-full mx-4 max-h-[85vh] flex flex-col",
          maxWidth,
          className,
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>

        {footer && (
          <div className="px-6 py-4 border-t border-border shrink-0">{footer}</div>
        )}
      </div>
    </div>
  )
}

export { AdminModal }
export type { AdminModalProps }
