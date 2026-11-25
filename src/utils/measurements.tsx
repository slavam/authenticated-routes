import { queryOptions, useQuery } from '@tanstack/react-query'

export type Measurement = {
    bufrcode: string
    meas_hash: string
    caption: string
    unit: string
}

export const measurementsQueryOptions = () =>
    queryOptions({
        queryKey: ['measurements'],
        queryFn: async (): Promise<Measurement[]> => {
            const res = await fetch('http://10.54.1.30:8640/measurement.json')
            if (!res.ok) {
                throw new Error(`Failed to load measurements: ${res.status}`)
            }
            return res.json()
        },
        staleTime: 5 * 60_000, // 5 мин — данные статичные, как у станций
    })

export function useMeasurements() {
    return useQuery(measurementsQueryOptions())
}