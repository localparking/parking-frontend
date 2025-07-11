import { createFileRoute } from '@tanstack/react-router'
import { MapFeature } from '@/features/map/components'

export const Route = createFileRoute('/map/')({
  component: Map,
})

function Map() {
  return <MapFeature />
}
