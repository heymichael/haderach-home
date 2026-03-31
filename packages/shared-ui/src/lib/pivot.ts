const currencyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
})

function formatCurrency(value: number): string {
  return currencyFmt.format(value)
}

function formatMonthHeader(month: string): string {
  const [y, m] = month.split("-")
  const date = new Date(Number(y), Number(m) - 1)
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

type PivotRow = Record<string, string | number>

interface PivotInput {
  rowKey: string
  columnKey: string
  value: number
}

function pivotLongToWide(
  rows: PivotInput[],
  rowKeyField: string,
): { data: PivotRow[]; columnKeys: string[] } {
  const columnKeySet = new Set<string>()
  const rowMap = new Map<string, Record<string, number>>()

  for (const row of rows) {
    columnKeySet.add(row.columnKey)
    const existing = rowMap.get(row.rowKey) ?? {}
    existing[row.columnKey] = (existing[row.columnKey] ?? 0) + row.value
    rowMap.set(row.rowKey, existing)
  }

  const sortedColumnKeys = [...columnKeySet].sort()

  const data: PivotRow[] = [...rowMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, values]) => {
      const pivotRow: PivotRow = { [rowKeyField]: key }
      for (const col of sortedColumnKeys) {
        pivotRow[col] = values[col] ?? 0
      }
      return pivotRow
    })

  return { data, columnKeys: sortedColumnKeys }
}

export { formatCurrency, formatMonthHeader, pivotLongToWide }
export type { PivotRow, PivotInput }
