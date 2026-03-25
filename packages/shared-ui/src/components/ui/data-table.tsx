import { useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table"
import type { ColumnDef, SortingState, ColumnSizingState } from "@tanstack/react-table"
import { Download } from "lucide-react"

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
}

export function DataTable<TData>({
  columns,
  data,
  csvFilename,
  emptyMessage = "No results.",
  pinFirstColumn = false,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnSizingChange: setColumnSizing,
    columnResizeMode: "onChange",
    state: { sorting, columnSizing },
  })

  return (
    <div className="flex flex-col flex-1 min-h-0 space-y-3">
      {csvFilename && (
        <div className="flex justify-end shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadCsv(data, columns, csvFilename)}
          >
            <Download />
            Download CSV
          </Button>
        </div>
      )}

      <div className="rounded-lg border border-border flex-1 min-h-0 overflow-auto">
        <Table className="table-fixed" style={{ minWidth: table.getTotalSize() }}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, idx) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "sticky top-0 z-10 bg-background relative group",
                      pinFirstColumn && idx === 0 && "sticky left-0 z-20",
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell, idx) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        pinFirstColumn && idx === 0 && "sticky left-0 z-[5] bg-background",
                      )}
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
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
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
