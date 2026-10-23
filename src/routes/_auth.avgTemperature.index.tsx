import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/_auth/avgTemperature/')({
  component: AvgTemperatureIndexComponent,
})

function AvgTemperatureIndexComponent() {
}