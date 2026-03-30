import * as React from "react"
import { Check, ChevronsUpDown, Search, X } from "lucide-react"
import { cn } from "../../lib/utils.ts"

interface MultiSelectItem {
  id: string
  label: string
}

interface MultiSelectProps<T extends MultiSelectItem = MultiSelectItem> {
  items: T[]
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  renderItem?: (item: T) => React.ReactNode
  className?: string
}

function MultiSelect<T extends MultiSelectItem = MultiSelectItem>({
  items,
  selectedIds,
  onSelectionChange,
  placeholder = "Select items…",
  searchPlaceholder = "Search…",
  renderItem,
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

  const summaryText =
    selectedIds.length === 0
      ? placeholder
      : `${selectedIds.length} selected`

  return (
    <div ref={containerRef} data-slot="multi-select" className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          selectedIds.length === 0 && "text-muted-foreground",
        )}
      >
        <span className="truncate">{summaryText}</span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 min-w-full w-max max-w-[280px] rounded-md border border-border bg-surface shadow-lg">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
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
              <p className="px-3 py-2 text-sm text-muted-foreground">No results</p>
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
