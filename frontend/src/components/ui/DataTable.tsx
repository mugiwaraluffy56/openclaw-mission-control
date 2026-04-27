import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

export interface Column<T> {
  key: string
  header: string
  width?: string
  sortable?: boolean
  render: (row: T) => React.ReactNode
}

interface Props<T> {
  columns: Column<T>[]
  data: T[]
  getKey: (row: T) => string
  onRowClick?: (row: T) => void
  className?: string
  emptyMessage?: string
  selectable?: boolean
  selectedKeys?: Set<string>
  onSelectionChange?: (keys: Set<string>) => void
}

export function DataTable<T>({
  columns, data, getKey, onRowClick, className, emptyMessage = 'No data',
  selectable, selectedKeys = new Set(), onSelectionChange,
}: Props<T>) {
  const [sorting, setSorting] = useState<SortingState>([])

  const tableColumns: ColumnDef<T>[] = columns.map((col) => ({
    id: col.key,
    header: col.header,
    enableSorting: !!col.sortable,
    accessorFn: (row) => {
      const value = (row as Record<string, unknown>)[col.key]
      return typeof value === 'string' || typeof value === 'number' ? value : ''
    },
    cell: ({ row }) => col.render(row.original),
    meta: { width: col.width },
  }))

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: getKey,
  })

  const toggleAll = () => {
    if (!onSelectionChange) return
    if (selectedKeys.size === data.length) onSelectionChange(new Set())
    else onSelectionChange(new Set(data.map(getKey)))
  }

  const toggleRow = (key: string) => {
    if (!onSelectionChange) return
    const next = new Set(selectedKeys)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    onSelectionChange(next)
  }

  return (
    <div className={clsx('bg-surface-1 border border-border-1 rounded-xl overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-1">
              {selectable && (
                <th className="w-10 px-3 py-2.5">
                  <input
                    type="checkbox"
                    checked={data.length > 0 && selectedKeys.size === data.length}
                    onChange={toggleAll}
                    className="accent-violet-600 w-3.5 h-3.5 cursor-pointer"
                  />
                </th>
              )}
              {table.getHeaderGroups()[0]?.headers.map((header) => (
                <th
                  key={header.id}
                  className={clsx(
                    'px-3 py-2.5 text-left text-2xs font-semibold uppercase tracking-wider text-zinc-600',
                    header.column.getCanSort() && 'cursor-pointer hover:text-zinc-400 select-none',
                    (header.column.columnDef.meta as { width?: string } | undefined)?.width
                  )}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center gap-1">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanSort() && header.column.getIsSorted() && (
                      header.column.getIsSorted() === 'asc' ? <ChevronUp size={10} className="text-violet-400" /> : <ChevronDown size={10} className="text-violet-400" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="text-center py-12 text-xs text-zinc-600">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((tableRow) => {
                const row = tableRow.original
                const key = tableRow.id
                const selected = selectedKeys.has(key)
                return (
                  <tr
                    key={key}
                    onClick={() => onRowClick?.(row)}
                    className={clsx(
                      'border-b border-border-1 last:border-0 transition-colors',
                      onRowClick && 'cursor-pointer hover:bg-surface-2',
                      selected && 'bg-violet-500/5'
                    )}
                  >
                    {selectable && (
                      <td className="w-10 px-3 py-2" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleRow(key)}
                          className="accent-violet-600 w-3.5 h-3.5 cursor-pointer"
                        />
                      </td>
                    )}
                    {tableRow.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-3 py-2.5 text-xs text-zinc-400">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
