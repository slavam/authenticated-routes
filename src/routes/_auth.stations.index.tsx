import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/_auth/stations/')({
    component: StationsIndexComponent,
})

function StationsIndexComponent() {
    // return null //<div>Select a station.</div>
}
