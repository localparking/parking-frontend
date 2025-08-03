import { MapProvider, useMapContext } from '@/features/map/context/map-context'
import { createFileRoute, Outlet, useRouterState } from '@tanstack/react-router'

export const Route = createFileRoute('/map')({
  component: RootComponent,
})

function MapLayout() {
  const { isMapReady } = useMapContext()

  // 1. 현재 라우트의 상태, 특히 경로(pathname)를 가져옵니다.
  const { location } = useRouterState()
  const isMapVisible = location.pathname === '/map'

  return (
    <div className="relative h-screen w-full">
      <div
        id="map"
        className="absolute top-0 left-0 h-full w-full"
        style={{ display: isMapVisible ? 'block' : 'none' }}
      />

      {!isMapReady && isMapVisible && (
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
