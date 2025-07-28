import { MapProvider, useMapContext } from '@/features/map/context/map-context'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/map')({
  component: RootComponent,
})

function MapLayout() {
  const { isMapReady } = useMapContext()
  return (
    <div className="h-full w-full">
      {!isMapReady && (
        <div className="absolute top-1/2 left-1/2 z-[1000] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white/90 p-5">
          지도를 로딩 중입니다...
        </div>
      )}

      <Outlet />
    </div>
  )
}

export function RootComponent() {
  return (
    <MapProvider>
      <MapLayout />
    </MapProvider>
  )
}
