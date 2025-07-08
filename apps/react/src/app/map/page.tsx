import { createFileRoute } from '@tanstack/react-router'
import { MapContainer } from '@/features/map'

export const Route = createFileRoute('/map/')({
  component: Map,
})

function Map() {
  return <MapContainer />
}
