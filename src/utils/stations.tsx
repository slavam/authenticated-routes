import { queryOptions, useQuery } from '@tanstack/react-query'

export type Station = {
  sindex: number,
  station_name: string
  // index: string
  // name: string
  // lat: string
  // lon: string
  // time_shift: string
  // points_count: string
}

export const stationsQueryOptions = () =>
  queryOptions({
    queryKey: ['stations'],
    queryFn: async (): Promise<Station[]> => {
      const res = await fetch('http://10.54.1.30:8640/stations.json')
      const json = await res.json()
      return json
    },
    staleTime: 5 * 60_000, // 5 мин — данные статичные
  })

export function useStations() {
  return useQuery(stationsQueryOptions())
}
