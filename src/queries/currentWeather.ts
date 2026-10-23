import { queryOptions, useQuery } from '@tanstack/react-query'

export interface Observation {
    meas_hash: number
    value: string
}

export const currentWeatherQueryOptions = (params: {
    station: string
    notbefore: number
    notafter: number
}) =>
    queryOptions({
        queryKey: ['currentWeather', params],
        queryFn: async ({ signal }): Promise<Observation[]> => {
            // const qs = new URLSearchParams({
            //     station: params.station,
            //     notbefore: String(params.notbefore),
            //     notafter: String(params.notafter),
            // })
            const query = `http://10.54.1.30:8640/get?limit=100&stations=${params.station}&notbefore=${params.notbefore}&notafter=${params.notafter}&streams=1&source=10202`
            const res = await fetch(query, { signal })
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            return res.json()
        },
        staleTime: 60_000,
    })

export function useCurrentWeatherQuery(params: { station: string; notbefore: number; notafter: number }) {
    return useQuery(currentWeatherQueryOptions(params))
}