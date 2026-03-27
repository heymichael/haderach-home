import * as React from "react"
import { ArrowUp, ArrowDown, ArrowUpDown, Search, X } from "lucide-react"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "../ui/table.tsx"
import { Card, CardContent } from "../ui/card.tsx"
import { cn } from "../../lib/utils.ts"

interface UserTableColumn<T> {
  key: string
  header: string
  render: (user: T) => React.ReactNode
  sortValue?: (user: T) => string | number
  searchValue?: (user: T) => string
  className?: string
}

interface UserTableProps<T extends { email: string }> {
  users: T[]
  columns: UserTableColumn<T>[]
  onRowClick?: (user: T) => void
  loading?: boolean
  filterFn?: (user: T) => boolean
  className?: string
}

type SortDir = "asc" | "desc"

function UserTable<T extends { email: string }>({
  users,
  columns,
  onRowClick,
  loading = false,
  filterFn,
  className,
}: UserTableProps<T>) {
  const [sortKey, setSortKey] = React.useState<string | null>(null)
  const [sortDir, setSortDir] = React.useState<SortDir>("asc")
  const [search, setSearch] = React.useState("")

  const searchable = columns.some((c) => c.searchValue)
  const searchableColumns = React.useMemo(
    () => columns.filter((c) => c.searchValue),
    [columns],
  )

  const filtered = filterFn ? users.filter(filterFn) : users

  const searched = React.useMemo(() => {
    if (!search) return filtered
    const lower = search.toLowerCase()
    return filtered.filter((user) =>
      searchableColumns.some((col) =>
        col.searchValue!(user).toLowerCase().includes(lower),
      ),
    )
  }, [filtered, search, searchableColumns])

  const displayed = React.useMemo(() => {
    if (!sortKey) return searched
    const col = columns.find((c) => c.key === sortKey)
    if (!col?.sortValue) return searched
    const getter = col.sortValue
    const sorted = [...searched].sort((a, b) => {
      const va = getter(a)
      const vb = getter(b)
      if (va < vb) return sortDir === "asc" ? -1 : 1
      if (va > vb) return sortDir === "asc" ? 1 : -1
      return 0
    })
    return sorted
  }, [searched, sortKey, sortDir, columns])

  function handleSort(key: string) {
    const col = columns.find((c) => c.key === key)
    if (!col?.sortValue) return
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const colSpan = columns.length

  return (
    <Card className={cn("flex flex-col min-h-0", className)}>
      {searchable && (
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {search && (
            <>
              <span className="text-xs text-muted-foreground shrink-0">
                {searched.length} of {filtered.length}
              </span>
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      )}
      <CardContent className="p-0 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => {
                const sortable = !!col.sortValue
                const active = sortKey === col.key
                return (
                  <TableHead
                    key={col.key}
                    className={cn(
                      "sticky top-0 z-10 bg-background",
                      sortable && "cursor-pointer select-none hover:text-foreground",
                      col.className,
                    )}
                    onClick={sortable ? () => handleSort(col.key) : undefined}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.header}
                      {sortable && (
                        active
                          ? sortDir === "asc"
                            ? <ArrowUp className="h-3.5 w-3.5" />
                            : <ArrowDown className="h-3.5 w-3.5" />
                          : <ArrowUpDown className="h-3.5 w-3.5 opacity-30" />
                      )}
                    </span>
                  </TableHead>
                )
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && displayed.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colSpan} className="text-center py-8 text-muted-foreground">
                  Loading users…
                </TableCell>
              </TableRow>
            ) : displayed.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colSpan} className="text-center py-8 text-muted-foreground">
                  {search ? "No matching users" : "No users found"}
                </TableCell>
              </TableRow>
            ) : (
              displayed.map((user) => (
                <TableRow
                  key={user.email}
                  className={cn(onRowClick && "cursor-pointer hover:bg-accent/50")}
                  onClick={onRowClick ? () => onRowClick(user) : undefined}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.render(user)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export { UserTable }
export type { UserTableColumn, UserTableProps }
