import { useState } from "react"
import { ArrowUpDown, ListFilter, Check, Search, X } from "lucide-react"
import type { Column } from "@tanstack/react-table"

import { cn } from "../../lib/utils.ts"
import { Button } from "./button.tsx"
import { Popover, PopoverTrigger, PopoverContent } from "./popover.tsx"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface FilterableHeaderProps<TData = any> {
  column: Column<TData, unknown>
  label: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FilterableHeader<TData = any>({ column, label }: FilterableHeaderProps<TData>) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const sortedUniqueValues = Array.from(column.getFacetedUniqueValues().keys())
    .filter((v): v is string => v != null && v !== "")
    .sort((a, b) => a.localeCompare(b))

  const filterValue = (column.getFilterValue() as string[] | undefined) ?? []
  const isFiltered = filterValue.length > 0

  const filtered = search
    ? sortedUniqueValues.filter((v) => v.toLowerCase().includes(search.toLowerCase()))
    : sortedUniqueValues

  const toggle = (val: string) => {
    const next = filterValue.includes(val)
      ? filterValue.filter((v) => v !== val)
      : [...filterValue, val]
    column.setFilterValue(next.length ? next : undefined)
  }

  const clearFilter = () => column.setFilterValue(undefined)

  return (
    <div className="flex items-center gap-0.5">
      <Button
        variant="ghost"
        size="sm"
        className="text-xs font-medium"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {label}
        <ArrowUpDown className="h-3.5 w-3.5" />
      </Button>

      <Popover open={open} onOpenChange={(v) => { setOpen(v); if (!v) setSearch("") }}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center rounded-sm p-1 transition-colors hover:bg-accent",
              isFiltered ? "text-primary" : "text-muted-foreground",
            )}
            aria-label={`Filter ${label}`}
          >
            <ListFilter className="h-3.5 w-3.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-56 p-0">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${label.toLowerCase()}…`}
              className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
              autoFocus
            />
            {search && (
              <button type="button" onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="border-b border-border px-3 py-1.5">
            <button type="button" onClick={clearFilter} className="text-xs font-medium text-primary hover:text-primary/80">
              Clear filter
            </button>
          </div>

          <div className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <p className="px-3 py-2 text-xs text-muted-foreground">No results</p>
            )}
            {filtered.map((val) => {
              const selected = filterValue.includes(val)
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => toggle(val)}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-1.5 text-xs hover:bg-accent/50 text-left",
                    selected && "bg-accent/30",
                  )}
                >
                  <div className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-input",
                    selected ? "border-primary bg-primary text-primary-foreground" : "",
                  )}>
                    {selected && <Check className="h-3 w-3" />}
                  </div>
                  <span className="truncate">{val}</span>
                </button>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

const setFilterFn = (row: { getValue: (id: string) => unknown }, columnId: string, filterValue: string[]) => {
  if (!filterValue?.length) return true
  const raw = row.getValue(columnId)
  const val = (raw as string) ?? ""
  const hasValue = val !== ""
  if (filterValue.includes("*")) return hasValue
  if (filterValue.includes("")) return !hasValue
  return filterValue.includes(val)
}

export { FilterableHeader, setFilterFn }
export type { FilterableHeaderProps }
