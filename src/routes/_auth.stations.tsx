import { createFileRoute, ErrorComponent } from '@tanstack/react-router'
import { stationsQueryOptions, useStations } from '../utils/stations'

export const Route = createFileRoute('/_auth/stations')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(stationsQueryOptions())
  },
  component: StationList,
})

function StationList() {
  const { data, isPending, isError, error } = useStations()

  if (isPending) return <div className="p-4">Загрузка...</div>
  if (isError) return <ErrorComponent error={error} />
  if (!data) return <div className="p-4">Нет данных</div>  // ← защита

  return (
    <ul className="list-disc pl-4">
      {data.map(s => <li key={s.sindex}>{s.station_name}</li>)}
    </ul>
  )
}



