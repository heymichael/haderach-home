import { useCallback, useState } from "react"
import { Copy, Check, Download } from "lucide-react"

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "./ui/table.tsx"

export interface ChatTablePayload {
  metric: string
  columns: string[]
  rows: (string | number)[][]
  filename: string
  filters?: Record<string, string>
}

const fmt = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
})

function formatCell(value: string | number): string {
  return typeof value === "number" ? fmt.format(value) : String(value)
}

function buildTsv(columns: string[], rows: (string | number)[][]): string {
  const header = columns.join("\t")
  const body = rows.map((r) => r.join("\t")).join("\n")
  return `${header}\n${body}`
}

function buildCsv(columns: string[], rows: (string | number)[][]): string {
  const escape = (v: string | number) => {
    const s = String(v)
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"`
      : s
  }
  const header = columns.map(escape).join(",")
  const body = rows.map((r) => r.map(escape).join(",")).join("\n")
  return `${header}\n${body}`
}

const MAX_VISIBLE_ROWS = 6

export function ChatTable({ metric, columns, rows, filename, filters }: ChatTablePayload) {
  const [copied, setCopied] = useState(false)
  const scrollable = rows.length > MAX_VISIBLE_ROWS
  const firstRow = rows[0] ?? []
  const isNumericCol = columns.map((_, ci) => typeof firstRow[ci] === "number")

  const handleCopy = useCallback(async () => {
    const tsv = buildTsv(columns, rows)
    await navigator.clipboard.writeText(tsv)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [columns, rows])

  const handleDownload = useCallback(() => {
    const csv = buildCsv(columns, rows)
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [columns, rows, filename])

  return (
    <div className="mt-2 inline-block rounded-md border border-border bg-background text-xs">
      <div
        className="relative flex items-center justify-center gap-2 px-3 py-1.5 border-b border-border"
        style={{ backgroundColor: "rgba(0,0,0,0.07)" }}
      >
        <div className="absolute right-2 flex items-center gap-1">
          <button
            type="button"
            onClick={handleCopy}
            className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Copy table"
          >
            {copied
              ? <Check className="h-3.5 w-3.5 text-emerald-500" />
              : <Copy className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Download CSV"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        </div>
        <span className="font-semibold text-foreground">{metric}</span>
      </div>
      {filters && Object.keys(filters).length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 px-3 py-1 border-b border-border text-[11px] text-muted-foreground" style={{ backgroundColor: "rgba(0,0,0,0.07)" }}>
          {Object.entries(filters).map(([label, value]) => (
            <span key={label}><span className="font-medium">{label}:</span> {value}</span>
          ))}
        </div>
      )}
      <div
        className={scrollable ? "max-h-[13rem] overflow-y-auto" : undefined}
      >
        <Table className="w-auto">
          <TableHeader>
            <TableRow style={{ backgroundColor: "rgba(0,0,0,0.07)" }}>
              {columns.map((col, ci) => (
                <TableHead key={col} className={`h-8 px-3 text-xs font-semibold ${isNumericCol[ci] ? "text-right" : "text-left"}`}>
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, ri) => (
              <TableRow key={ri}>
                {row.map((cell, ci) => (
                  <TableCell
                    key={ci}
                    className={`px-3 py-1.5 ${typeof cell === "number" ? "text-right tabular-nums" : ""}`}
                  >
                    {formatCell(cell)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
