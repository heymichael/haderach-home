import { useState, useMemo } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  flexRender,
} from "@tanstack/react-table"
import type { ColumnDef, SortingState, ColumnSizingState, ColumnFiltersState } from "@tanstack/react-table"
import { Download, Search, X } from "lucide-react"

import { cn } from "../../lib/utils.ts"
import { Button } from "./button.tsx"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table.tsx"

function downloadCsv<TData>(data: TData[], columns: ColumnDef<TData, unknown>[], filename: string) {
  const accessorCols = columns.filter(
    (col): col is ColumnDef<TData, unknown> & { accessorKey: string } =>
      "accessorKey" in col && typeof (col as unknown as Record<string, unknown>).accessorKey === "string",
  )

  const header = accessorCols.map((c) => c.accessorKey).join(",")
  const rows = data.map((row) =>
    accessorCols
      .map((c) => {
        const val = (row as Record<string, unknown>)[c.accessorKey]
        return val === undefined || val === null ? "" : String(val)
      })
      .join(","),
  )

  const csv = [header, ...rows].join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  csvFilename?: string
  emptyMessage?: string
  pinFirstColumn?: boolean
  enableSearch?: boolean
  enableColumnFilters?: boolean
  getRowId?: (row: TData) => string
}

export function DataTable<TData>({
  columns,
  data,
  csvFilename,
  emptyMessage = "No results.",
  pinFirstColumn = false,
  enableSearch = false,
  enableColumnFilters = false,
  getRowId,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [search, setSearch] = useState("")

  const accessorKeys = useMemo(
    () =>
      columns
        .filter((c) => "accessorKey" in c)
        .map((c) => (c as unknown as { accessorKey: string }).accessorKey),
    [columns],
  )

  const filteredData = useMemo(() => {
    if (!enableSearch || !search) return data
    const lower = search.toLowerCase()
    return data.filter((row) => {
      const rec = row as Record<string, unknown>
      return accessorKeys.some((key) => {
        const val = rec[key]
        return val !== undefined && val !== null && String(val).toLowerCase().includes(lower)
      })
    })
  }, [data, enableSearch, search, accessorKeys])

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onColumnSizingChange: setColumnSizing,
    columnResizeMode: "onChange",
    state: { sorting, columnSizing, columnFilters },
    getRowId,
  })

  const stickyColIdx = pinFirstColumn ? 0 : -1
  const rows = table.getRowModel().rows

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="rounded-xl border border-border flex-1 min-h-0 flex flex-col bg-card text-card-foreground shadow-sm">
        {enableSearch && (
          <div className="flex items-end gap-2 border-b border-border mx-4 mt-4 mb-0 pb-2 h-12">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground mb-0.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
            />
            {search && (
              <>
                <span className="text-xs text-muted-foreground shrink-0">
                  {filteredData.length} of {data.length}
                </span>
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        )}

        <div className="flex-1 min-h-0 overflow-auto px-4">
          <Table className="table-fixed" style={{ minWidth: table.getTotalSize() }}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header, idx) => (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "sticky top-0 z-10 bg-background group h-12 align-bottom pb-2",
                        idx === stickyColIdx && "sticky left-0 z-20",
                      )}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      {header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={cn(
                            "absolute top-0 -right-1 z-30 w-3 h-full cursor-col-resize select-none touch-none",
                            "after:absolute after:top-0 after:left-1/2 after:-translate-x-1/2 after:w-0.5 after:h-full after:bg-transparent group-hover:after:bg-border",
                            header.column.getIsResizing() && "after:!bg-primary",
                          )}
                        />
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {rows.length > 0 ? (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell, idx) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          idx === stickyColIdx && "sticky left-0 z-[5] bg-background",
                        )}
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {search ? "No matching results" : emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {csvFilename && (
        <div className="flex justify-end shrink-0 mt-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground"
            onClick={() => downloadCsv(data, columns, csvFilename)}
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
        </div>
      )}
    </div>
  )
}
