import { useCurrentWeatherQuery } from '../queries/currentWeather'
import { useState } from 'react'
import Select from 'react-select'
import type { StylesConfig } from 'react-select'
import { Spinner } from '../components/Spinner'
import Table from 'react-bootstrap/Table'

type StationOption = {
  label: string
  value: string
}
export const CurrentWeather = () => {
  const selectStyles: StylesConfig<StationOption, false> = {
    // Стили для самого поля выбора
    control: (base, state) => ({
      ...base,
      backgroundColor: '#fff', // Или ваш цвет фона
      borderColor: state.isFocused ? '#80bdff' : '#ced4da', // Цвет рамки
      boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(0,123,255,.25)' : 'none',
      '&:hover': {
        borderColor: '#80bdff',
      },
    }),
    // Стили для выпадающего меню
    menu: (base) => ({
      ...base,
      backgroundColor: '#fff',
      zIndex: 9999, // Чтобы меню не перекрывалось другими элементами
    }),
    // Стили для обычных опций (текст)
    option: (base, state) => ({
      ...base,
      color: '#212529', // Тёмный текст, чтобы было видно на белом фоне
      backgroundColor: state.isSelected
        ? '#0d6efd' // Синий фон для выбранной опции
        : state.isFocused
          ? '#e9ecef' // Светло-серый фон при наведении
          : '#fff',   // Белый фон по умолчанию
      '&:active': {
        backgroundColor: '#0d6efd',
        color: '#fff',
      },
    }),
    // Стиль для текста выбранного значения в поле
    singleValue: (base) => ({
      ...base,
      color: '#212529',
    }),
    // Стиль для плейсхолдера
    placeholder: (base) => ({
      ...base,
      color: '#6c757d',
    }),
  }
  const stations = [
    { label: 'Донецк', value: '34519' },
    { label: 'Дебальцево', value: '34524' },
    { label: 'Амвросиевка', value: '34622' },
    { label: 'Седово', value: '34721' },
    { label: 'Волноваха', value: '34615' },
    { label: 'Мариуполь', value: '34712' }
  ]
  let s
  const observedAt = () => {
    s = new Date().toISOString().slice(0, 15).replace('T', ' ') + '0:00'
    return new Date(s).getTime() / 1000 + 3600 * 3
  }
  const meteoStations = stations //.slice(3, 9)
  const [station, setStation] = useState(meteoStations[0])

  let qParams = {
    station: station.value,
    notbefore: observedAt(),
    notafter: observedAt() + 600
  }
  const {
    data: observations = [],
    isLoading,
    isSuccess,
  } = useCurrentWeatherQuery(qParams)
  let temperature
  let windDirection
  let windSpeed
  let humidity
  let aboutPrecipitation = false
  const absoluteZero = 273.15
  let content
  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess && observations) {
    observations.forEach((data) => {
      let measurement = data.meas_hash
      switch (measurement) {
        case 1451382247:
          temperature = (+data.value - absoluteZero).toFixed(1)
          break
        case -789901366:
          windDirection = data.value
          break
        case 1345858116:
          windSpeed = data.value
          break
        case -996973625:
          humidity = data.value
          break
        case 882721309:
          aboutPrecipitation = +data.value > 0.0
          break
      }
    })
    content = <div className='font-bold text-lg'>
      <ul className="list-disc pl-4" >
        <li key='1' className="whitespace-nowrap">
          Температура: <b>{temperature}°C</b>
        </li>
        <li key='2' className="whitespace-nowrap">
          Направление ветра: <b>{windDirection}°</b>
        </li>
        <li key='3' className="whitespace-nowrap">
          Скорость ветра: <b>{windSpeed} м/с</b>
        </li>
        <li key='4' className="whitespace-nowrap">
          Относительная влажность: <b>{humidity}%</b>
        </li>
        <li key='5' className='witespace-nowrap'>
          {aboutPrecipitation ? "Осадки на станции" : "На станции без осадков"}
        </li>
      </ul>
    </div>
  } else content = <h1>Данные не найдены</h1>
  return (
    <div className="col-md-6 offset-md-3 mt-5">
      <h4>Погода на метеостанции {station.label} по состоянию на {s} UTC</h4>
      <Table striped bordered hover variant="secondary">
        <thead>
          <tr>
            <td>
              <Select
                styles={selectStyles}
                className="border rounded-md p-2 w-full"
                value={station}
                onChange={(val) => val && setStation(val)}
                options={meteoStations}
                id="select-station"
                isClearable={false}
              />
            </td>
          </tr>
        </thead>
      </Table>
      {content}
    </div>
  )
}