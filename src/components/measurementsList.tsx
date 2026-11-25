import { useMemo, useState } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table'

import { useMeasurements, type Measurement } from '../utils/measurements'

const columnHelper = createColumnHelper<Measurement>()

export function MeasurementsList() {
  const { data: measurements = [], isLoading, isError, error } = useMeasurements()

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'caption', desc: false },
  ])

  const columns = useMemo(
    () => [
      columnHelper.accessor('bufrcode', {
        header: 'Код',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('meas_hash', {
        header: 'Хеш',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('caption', {
        header: 'Название',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('unit', {
        header: 'Единица измерения',
        cell: (info) => info.getValue(),
      }),
    ],
    []
  )

  const table = useReactTable<Measurement>({
    data: measurements,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (isLoading) {
    return <div className="py-4 text-foreground/70">Загрузка измерений…</div>
  }

  if (isError) {
    return (
      <div className="py-4 text-red-600 dark:text-red-400">
        Ошибка загрузки: {error instanceof Error ? error.message : String(error)}
      </div>
    )
  }

  return (
    <section className="py-4">
      <h2 className="text-xl font-semibold mb-3 text-foreground">Измерения</h2>

      <div className="overflow-x-auto rounded-md border border-border">
        <table className="min-w-full text-sm text-foreground">
          <thead className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sortDir = header.column.getIsSorted()
                  return (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="border-b border-border px-3 py-2 text-left font-medium text-foreground cursor-pointer select-none hover:bg-muted/80 transition-colors"
                      title="Нажмите для сортировки"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {sortDir === 'asc' ? ' 🔼' : sortDir === 'desc' ? ' 🔽' : ' ↕️'}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="even:bg-muted/40 hover:bg-muted/60 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border-t border-border px-3 py-2 text-foreground"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 py-4 text-center text-foreground/60"
                >
                  Нет данных
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}