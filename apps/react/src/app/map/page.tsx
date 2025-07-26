import { createFileRoute } from '@tanstack/react-router'
import { MapFeature } from '@/features/map/components'
import { useMapContext } from '@/features/map/context/map-context'
import { isMapReady } from '@/features/map/hooks/use-initialize-map'

export const Route = createFileRoute('/map/')({
  component: Map,
})

function Map() {
  return (
    <div>
      <div id="map" className="h-screen" />

      {!isMapReady && (
        <div className="absolute top-1/2 left-1/2 z-[1000] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white/90 p-5">
          지도를 로딩 중입니다...
        </div>
      )}
      <div />
      <MapFeature />
    </div>
  )
}
