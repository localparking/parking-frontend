import React from 'react'
import { Button } from '@ui/common/components/button'
import { MapPin, Plus, Minus } from 'lucide-react'
import { useMapContext } from '@/features/map/context/map-context'

export const MapControl: React.FC = () => {
  const { moveToCurrentLocation, mapInstance, setZoom, isMapReady } = useMapContext()

  const handleZoomIn = () => {
    if (!mapInstance) return
    const currentZoom = mapInstance.getZoom()
    setZoom(currentZoom + 1)
  }

  const handleZoomOut = () => {
    if (!mapInstance) return
    const currentZoom = mapInstance.getZoom()
    setZoom(currentZoom - 1)
  }

  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
      {/* 현재 위치 버튼 */}
      <Button
        variant="outline"
        size="icon"
        onClick={moveToCurrentLocation}
        disabled={!isMapReady}
        className="bg-white/90 shadow-lg backdrop-blur-sm hover:bg-white"
        title="현재 위치로 이동"
      >
        <MapPin className="h-4 w-4" />
      </Button>

      {/* 줌 컨트롤 */}
      <div className="flex flex-col gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          disabled={!isMapReady}
          className="bg-white/90 shadow-lg backdrop-blur-sm hover:bg-white"
          title="확대"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          disabled={!isMapReady}
          className="bg-white/90 shadow-lg backdrop-blur-sm hover:bg-white"
          title="축소"
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
