import * as React from "react"
import { Check, Search, X } from "lucide-react"
import { cn } from "../../lib/utils.ts"

interface MultiSelectItem {
  id: string
  label: string
}

interface MultiSelectProps<T extends MultiSelectItem = MultiSelectItem> {
  items: T[]
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  searchPlaceholder?: string
  renderItem?: (item: T) => React.ReactNode
  variant?: "default" | "underline"
  className?: string
}

function MultiSelect<T extends MultiSelectItem = MultiSelectItem>({
  items,
  selectedIds,
  onSelectionChange,
  searchPlaceholder = "Search…",
  renderItem,
  variant = "default",
  className,
}: MultiSelectProps<T>) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  const filtered = React.useMemo(() => {
    if (!search) return items
    const lower = search.toLowerCase()
    return items.filter((item) => item.label.toLowerCase().includes(lower))
  }, [items, search])

  const selectedInItems = React.useMemo(() => {
    const itemIds = new Set(items.map((i) => i.id))
    return selectedIds.filter((id) => itemIds.has(id)).length
  }, [items, selectedIds])

  const allSelected = selectedInItems === items.length && items.length > 0

  function toggleItem(id: string) {
    onSelectionChange(
      selectedIds.includes(id)
        ? selectedIds.filter((s) => s !== id)
        : [...selectedIds, id],
    )
  }

  function selectAll() {
    const filteredIds = filtered.map((item) => item.id)
    const merged = Array.from(new Set([...selectedIds, ...filteredIds]))
    onSelectionChange(merged)
  }

  function clearAll() {
    const filteredIds = new Set(filtered.map((item) => item.id))
    onSelectionChange(selectedIds.filter((id) => !filteredIds.has(id)))
  }

  function resetToAll(e: React.MouseEvent) {
    e.stopPropagation()
    onSelectionChange(items.map((i) => i.id))
  }

  const summaryText = allSelected
    ? "All"
    : selectedInItems === 0
      ? "None"
      : "Multiple"

  return (
    <div ref={containerRef} data-slot="multi-select" className={cn("relative", className)}>
      <div
        className={cn(
          "flex w-full items-center bg-transparent text-xs transition-colors",
          variant === "underline"
            ? "h-8 border-b border-border px-0 pb-1"
            : "h-9 rounded-md border border-input px-3 py-1 shadow-xs",
          selectedInItems === 0 && "text-muted-foreground",
        )}
      >
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex-1 truncate text-left"
        >
          {summaryText}
        </button>
        {!allSelected && (
          <button
            type="button"
            onClick={resetToAll}
            className="ml-1 shrink-0 rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
            aria-label="Reset to all"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute z-50 mt-1 min-w-full w-max max-w-[280px] rounded-md border border-border bg-surface shadow-lg">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
              autoFocus
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={selectAll}
                className="text-xs font-medium text-primary hover:text-primary/80"
              >
                Select all
              </button>
              {selectedIds.length > 0 && (
                <>
                  <span className="text-xs text-muted-foreground">·</span>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-xs font-medium text-primary hover:text-primary/80"
                  >
                    Clear
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-2 text-xs text-muted-foreground">No results</p>
            ) : (
              (() => {
                const selectedItems = filtered.filter((item) => selectedIds.includes(item.id))
                const unselectedItems = filtered.filter((item) => !selectedIds.includes(item.id))
                const sorted = [...selectedItems, ...unselectedItems]
                const showSeparator = selectedItems.length > 0 && unselectedItems.length > 0

                return sorted.map((item, idx) => {
                  const selected = selectedIds.includes(item.id)
                  const isSeparator = showSeparator && idx === selectedItems.length
                  return (
                    <React.Fragment key={item.id}>
                      {isSeparator && (
                        <div className="my-1 border-t border-border-subtle" />
                      )}
                      <button
                        type="button"
                        onClick={() => toggleItem(item.id)}
                        className={cn(
                          "flex w-full items-center gap-2 px-3 py-1.5 text-xs hover:bg-accent/50 text-left",
                          selected && "bg-accent/30",
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-input",
                            selected && "border-primary bg-primary text-primary-foreground",
                          )}
                        >
                          {selected && <Check className="h-3 w-3" />}
                        </div>
                        <span className="truncate">
                          {renderItem ? renderItem(item) : item.label}
                        </span>
                      </button>
                    </React.Fragment>
                  )
                })
              })()
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export { MultiSelect }
export type { MultiSelectItem, MultiSelectProps }
