import { createFileRoute } from '@tanstack/react-router'
import { MapControl } from '@/features/map/components/map-controll'
import { MapMarkers } from '@/features/map/components/map-marker'
import { MapTypeToggle } from '@/features/map/components/map-type-toggle'

export const Route = createFileRoute('/map/')({
  component: Map,
})

function Map() {
  return (
    <div>
      <div id="map" className="h-screen" />
      <MapTypeToggle />
      <MapControl />
      <MapMarkers />
      {/* <Search /> */}
      {/* <BottomSheet /> */}
    </div>
  )
}
