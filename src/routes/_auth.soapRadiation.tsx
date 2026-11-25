import { useState } from 'react'
import classnames from 'classnames'
import { createFileRoute } from '@tanstack/react-router'
import Select from 'react-select'
import { Spinner } from '../components/Spinner'
import { stations } from '../utils/synopticDictionaries'
import { useSoapRadiation } from '../utils/soapRadiation'
import {
  RadiationSummary,
  RadiationTable,
} from '../components/RadiationTable'

export const Route = createFileRoute('/_auth/soapRadiation')({
  component: SoapRadiationRoute,
})

function SoapRadiationRoute() {
  const [station, setStation] = useState(stations[1])
  const [date1, setDate1] = useState(
    new Date().toISOString().substring(0, 11) + '00:00'
  )
  const [date2, setDate2] = useState(new Date().toISOString().substring(0, 16))
  const [limit, setLimit] = useState(10)

  const {
    data: observations = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useSoapRadiation({
    stations: station.value,
    notbefore: date1,
    notafter: date2,
    limit,
  })

  const eventDate1Changed = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.validity.valid) return
    setDate1(e.target.value + ':00')
  }
  const eventDate2Changed = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.validity.valid) return
    setDate2(e.target.value + ':00')
  }
  const limitChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    setLimit(Number(e.target.value))

  let content: React.ReactNode = null
  if (isLoading) {
    content = (
      <div className="py-10 flex justify-center">
        <Spinner text="Loading..." />
      </div>
    )
  } else if (isSuccess) {
    const containerClassname = classnames('space-y-4', {
      'opacity-60 pointer-events-none': isFetching,
    })
    content = (
      <div className={containerClassname}>
        <RadiationSummary observations={observations} />
        <RadiationTable observations={observations} />
      </div>
    )
  } else if (isError) {
    content = (
      <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
        {error.toString()}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 text-foreground">
      <h1 className="text-2xl font-bold tracking-tight">
        Измеренный уровень радиации
      </h1>

      {/* Параметры поиска — отдельная «карточка» */}
      <section className="rounded-lg border border-border bg-card shadow-sm">
        <header className="border-b border-border px-4 py-3">
          <h2 className="text-lg font-semibold">Параметры поиска</h2>
        </header>
        <div className="grid gap-4 px-4 py-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-foreground/80">Станция</span>
            <Select
              value={station}
              onChange={(val) => setStation(val!)}
              options={stations}
              id="select-station"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-foreground/80">
              Начальная дата
            </span>
            <input
              type="datetime-local"
              id="date-from"
              onChange={eventDate1Changed}
              pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
              defaultValue={date1}
              className="rounded-md border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-foreground/80">Конечная дата</span>
            <input
              type="datetime-local"
              id="date-to"
              onChange={eventDate2Changed}
              pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-2][0-9]:[0-9]{2}"
              defaultValue={date2}
              className="rounded-md border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-foreground/80">Лимит</span>
            <input
              size={4}
              type="number"
              value={limit}
              onChange={limitChanged}
              id="select-limit"
              className="rounded-md border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        </div>
      </section>

      {/* Найденные записи — отдельная «карточка» */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Найденные записи</h2>
        {content}
      </section>
    </div>
  )
}