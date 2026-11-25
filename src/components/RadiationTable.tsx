import { useMemo, useState } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table'
import Badge from 'react-bootstrap/Badge'
import { stations } from '../utils/synopticDictionaries'
import type { SoapRadiationObservation } from '../utils/soapRadiation'

const columnHelper = createColumnHelper<SoapRadiationObservation>()

const stationName = (value: string | number) =>
  stations.find((s) => +s.value === +value)?.label ?? String(value)

type Props = {
  observations: SoapRadiationObservation[]
}

export function RadiationTable({ observations }: Props) {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => info.getValue(),
        enableSorting: false,
      }),
      columnHelper.accessor('created_at', {
        header: 'Создана (UTC)',
        cell: (info) => info.getValue().replace('T', ' ').slice(0, -10),
        enableSorting: false,
      }),
      columnHelper.accessor('meas_time', {
        header: 'Наблюдение (UTC)',
        cell: (info) => info.getValue().replace('T', ' ').slice(0, -10),
        enableSorting: false,
      }),
      columnHelper.accessor('station', {
        header: 'Станция',
        cell: (info) => stationName(info.getValue()),
        enableSorting: false,
      }),
      columnHelper.accessor('value', {
        header: 'Значение (usv/h)',
        cell: (info) => info.getValue(),
        sortingFn: (rowA, rowB) => {
          const a = Number(rowA.original.value)
          const b = Number(rowB.original.value)
          return a === b ? 0 : a < b ? -1 : 1
        },
      }),
    ],
    []
  )

  const table = useReactTable<SoapRadiationObservation>({
    data: observations,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    enableSortingRemoval: true,
    enableMultiSort: false,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="overflow-x-auto rounded-lg border border-border shadow-sm">
      <table className="min-w-full text-sm text-foreground">
        <thead className="bg-muted">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort()
                const sortDir = header.column.getIsSorted()
                return (
                  <th
                    key={header.id}
                    onClick={
                      canSort
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                    className={[
                      'border-b border-border px-4 py-3 text-center font-semibold text-foreground/90',
                      'border-r border-border last:border-r-0',
                      canSort
                        ? 'cursor-pointer select-none hover:bg-muted/70 transition-colors'
                        : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    title={canSort ? 'Нажмите для сортировки' : undefined}
                  >
                    <span className="inline-flex items-center justify-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {canSort &&
                        (sortDir === 'asc'
                          ? '🔼'
                          : sortDir === 'desc'
                            ? '🔽'
                            : '↕️')}
                    </span>
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
              className="border-b border-border last:border-b-0 even:bg-muted/30 hover:bg-muted/60 transition-colors"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="border-r border-border px-4 py-2.5 text-center align-middle last:border-r-0"
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
                className="px-4 py-8 text-center text-foreground/60"
              >
                Нет данных
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export function RadiationSummary({
  observations,
}: {
  observations: SoapRadiationObservation[]
}) {
  const numRecords = observations.length
  const avgRadiation =
    numRecords > 0
      ? observations.reduce((acc, o) => acc + Number(o.value), 0) / numRecords
      : 0

  return (
    <div className="flex flex-wrap items-center gap-3 text-base text-foreground">
      <span className="font-medium">Найденные записи</span>
      <Badge bg="secondary">{numRecords}</Badge>
      <span className="font-medium">Среднее</span>
      <Badge bg="secondary">{avgRadiation.toFixed(2)}</Badge>
    </div>
  )
}