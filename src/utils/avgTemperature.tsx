import { queryOptions, useQuery } from '@tanstack/react-query'

export type CsdnData = {
  // "id": 29175019,
  "moment": number,
  "point": number,
  // "point_at": 1786103400,
  "value": string,
  "station": number,
  // "place": null,
  // "lat": null,
  // "lon": null,
  // "stream": 1,
  // "code": 11002,
  // "unit": "m/s",
  // "message_id": 715563,
  "source": number,
  // "packet": 29175018,
  // "created_at": 1786103435,
  // "qlty": null,
  // "alarm": null,
  // "bseq": 360066,
  // "rec_flag": 3,
  // "proc": 1,
  // "period": 600,
  // "pkind": 4,
  // "height": 10,
  // "sens_type": null,
  // "sens_id": null,
  "meas_hash": number
}
const points = '0,10800,21600,32400,43200,54000,64800,75600'
const stations = '34519,34524,34622,34721,34615,34712'
export const avgTemperatureQueryOptions = () =>
  queryOptions({
    queryKey: ['avgTemperature'],
    queryFn: async (): Promise<CsdnData[]> => {
      let reportDate = 1786103410
      const res = await fetch(`http://10.54.1.30:8640/get?stations=${stations}&quality=1&source=100,10202&hashes=795976906,1451382247&point=${points}&notbefore=${reportDate}&notafter=${+reportDate + 22 * 60 * 60}`)
      const json = await res.json()
      return json
    },
    staleTime: 5 * 60_000, // 5 мин — данные статичные
  })

export function useAvgTemperature() {
  return useQuery(avgTemperatureQueryOptions())
}
