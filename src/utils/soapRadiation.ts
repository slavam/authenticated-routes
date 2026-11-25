import { queryOptions, useQuery } from '@tanstack/react-query'

export type SoapRadiationObservation = {
  id: number
  created_at: string
  meas_time: string
  station: string | number
  value: number | string
}

export type SoapRadiationParams = {
  stations: string | number
  notbefore: string
  notafter: string
  limit: number | string
}

export const soapRadiationQueryOptions = (qParams: SoapRadiationParams) =>
  queryOptions({
    // Параметры в ключе — иначе при их смене данные не перезапросятся
    queryKey: ['radiation', qParams],
    queryFn: async (): Promise<SoapRadiationObservation[]> => {
      const url = new URL(
        'http://10.54.1.11:8083/observations/observations'
      )
      url.searchParams.set('min_quality', '1')
      url.searchParams.set('sources', '1300')
      url.searchParams.set('hashes', '-1881179977')
      url.searchParams.set('limit', String(qParams.limit))
      url.searchParams.set('stations', String(qParams.stations))
      url.searchParams.set('after', qParams.notbefore)
      url.searchParams.set('before', qParams.notafter)

      const res = await fetch(url.toString())
      if (!res.ok) {
        throw new Error(`Failed to load radiation: ${res.status}`)
      }
      return res.json()
    },
    staleTime: 5 * 60_000, // 5 мин
  })

export function useSoapRadiation(qParams: SoapRadiationParams) {
  return useQuery(soapRadiationQueryOptions(qParams))
}