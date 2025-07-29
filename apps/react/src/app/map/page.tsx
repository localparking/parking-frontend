import { createFileRoute } from '@tanstack/react-router'
import { MapControl } from '@/features/map/components/map-controll'
import { MapMarkers } from '@/features/map/components/map-marker'
import { MapTypeToggle } from '@/features/map/components/map-type-toggle'
import { useMapContext } from '@/features/map/context/map-context'

export const Route = createFileRoute('/map/')({
  component: Map,
})

function Map() {
  const { searchLevel } = useMapContext()

  return (
    <div className="relative">
      <div id="map" className="h-screen" />
      <MapTypeToggle />
      <MapControl />
      <MapMarkers />

      {searchLevel === null && (
        <div
          className="absolute top-20 left-1/2 z-10 -translate-x-1/2 rounded-lg bg-black/60 p-3 text-sm text-white shadow-lg"
          aria-live="polite"
        >
          지도를 확대하여 주변 정보를 확인하세요.
        </div>
      )}

      {/* <Search /> */}
      {/* <BottomSheet /> */}
    </div>
  )
}
