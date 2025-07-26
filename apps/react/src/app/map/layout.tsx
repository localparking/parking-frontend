import { MarkerData } from '@/features/map'
import { MapProvider } from '@/features/map/context/map-context'
import { createFileRoute, Outlet } from '@tanstack/react-router'

interface MapContainerProps {
  markers?: MarkerData[]
}

export const Route = createFileRoute('/map')({
  component: RootComponent,
})

function MapLayout() {
  return (
    <div className="h-full w-full">
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
