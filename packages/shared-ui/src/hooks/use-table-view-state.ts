import { useState, useEffect, useCallback, useMemo } from "react"
import type { ColumnFiltersState } from "@tanstack/react-table"

export interface TableViewState {
  visibleColumns: string[] | undefined
  setVisibleColumns: (cols: string[] | undefined) => void
  columnFilters: ColumnFiltersState
  setColumnFilters: (filters: ColumnFiltersState) => void
  resetColumns: () => void
  clearFilters: () => void
  isCustomView: boolean
  hasActiveFilters: boolean
}

function readSession<T>(key: string): T | undefined {
  try {
    const raw = sessionStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : undefined
  } catch {
    return undefined
  }
}

function writeSession(key: string, value: unknown) {
  try {
    if (value === undefined || value === null) {
      sessionStorage.removeItem(key)
    } else {
      sessionStorage.setItem(key, JSON.stringify(value))
    }
  } catch {
    // sessionStorage may be unavailable (private browsing, quota)
  }
}

export function useTableViewState(
  tableId: string,
  defaultColumns: string[],
): TableViewState {
  const colsKey = `${tableId}:viewColumns`
  const filtersKey = `${tableId}:columnFilters`

  const [visibleColumns, setVisibleColumnsRaw] = useState<string[] | undefined>(
    () => readSession<string[]>(colsKey),
  )
  const [columnFilters, setColumnFiltersRaw] = useState<ColumnFiltersState>(
    () => readSession<ColumnFiltersState>(filtersKey) ?? [],
  )

  useEffect(() => {
    writeSession(colsKey, visibleColumns)
  }, [colsKey, visibleColumns])

  useEffect(() => {
    writeSession(filtersKey, columnFilters.length > 0 ? columnFilters : undefined)
  }, [filtersKey, columnFilters])

  const setVisibleColumns = useCallback(
    (cols: string[] | undefined) => setVisibleColumnsRaw(cols),
    [],
  )

  const setColumnFilters = useCallback(
    (filters: ColumnFiltersState) => setColumnFiltersRaw(filters),
    [],
  )

  const resetColumns = useCallback(() => {
    setVisibleColumnsRaw(undefined)
    sessionStorage.removeItem(colsKey)
  }, [colsKey])

  const clearFilters = useCallback(() => {
    setColumnFiltersRaw([])
    sessionStorage.removeItem(filtersKey)
  }, [filtersKey])

  const defaultSet = useMemo(() => new Set(defaultColumns), [defaultColumns])

  const isCustomView = useMemo(() => {
    if (!visibleColumns) return false
    if (visibleColumns.length !== defaultColumns.length) return true
    return visibleColumns.some((c) => !defaultSet.has(c))
  }, [visibleColumns, defaultColumns.length, defaultSet])

  const hasActiveFilters = columnFilters.length > 0

  return {
    visibleColumns,
    setVisibleColumns,
    columnFilters,
    setColumnFilters,
    resetColumns,
    clearFilters,
    isCustomView,
    hasActiveFilters,
  }
}
