import { BottomSheetProvider } from '@/shared/context/bottom-sheet-context'
import { MapProvider, useMapContext } from '@/features/map/context/map-context'
import { createFileRoute, Outlet, useRouterState } from '@tanstack/react-router'

export const Route = createFileRoute('/map')({
  component: RootComponent,
})

function MapLayout() {
  const { naverMap } = useMapContext()
  const { location } = useRouterState()
  const isMapVisible = location.pathname === '/map'

  return (
    <div className="relative w-full flex-1">
      <div
        id="map"
        className="fixed top-0 left-0 h-dvh w-full max-w-[768px]"
        style={{ visibility: isMapVisible ? 'visible' : 'hidden' }}
      />

      {!naverMap.isMapReady && isMapVisible && (
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
      <BottomSheetProvider>
        <MapLayout />
      </BottomSheetProvider>
    </MapProvider>
  )
}
