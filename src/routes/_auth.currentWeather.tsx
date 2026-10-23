import { createFileRoute } from '@tanstack/react-router'
import { CurrentWeather } from '../components/currentWeather'

export const Route = createFileRoute('/_auth/currentWeather')({
  component: CurrentWeather,
})

