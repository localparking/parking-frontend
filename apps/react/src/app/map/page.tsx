import { createFileRoute } from '@tanstack/react-router'
import { MapControl } from '@/features/map/components/map-controll'

export const Route = createFileRoute('/map/')({
  component: Map,
})

function Map() {
  return (
    <div>
      <div id="map" className="h-screen" />
      <MapControl />

      {/* <MapMarkers /> */}
      {/* <Search /> */}
      {/* <MapControll /> */}
      {/* <BottomSheet /> */}
    </div>
  )
}
