import { createFileRoute } from '@tanstack/react-router'
import { MeasurementsList } from '../components/measurementsList'

export const Route = createFileRoute('/_auth/measurements')({
    component: MeasurementsList,
})