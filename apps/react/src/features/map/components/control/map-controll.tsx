import React from 'react'
import { Plus, Minus, LocateFixed } from 'lucide-react'
import { useMapContext } from '@/features/map/context/map-context'

const controlOptions = [
  {
    icon: Plus,
    onClick: 'zoomIn',
    title: '확대',
  },
  {
    icon: Minus,
    onClick: 'zoomOut',
    title: '축소',
  },
  {
    icon: LocateFixed,
    onClick: 'location',
    title: '현재 위치로 이동',
  },
]

export const MapControl: React.FC = () => {
  const { mapInstance, isMapReady, setZoom, moveToCurrentLocation } = useMapContext().naverMap

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

  const handleClick = (action: string) => {
    switch (action) {
      case 'zoomIn':
        handleZoomIn()
        break
      case 'zoomOut':
        handleZoomOut()
        break
      case 'location':
        moveToCurrentLocation()
        break
    }
  }

  return (
    <div className="absolute right-6 bottom-[calc(var(--spacing-safe-bottom)+110px)] z-10">
      <div className="flex flex-col gap-[5px]">
        {controlOptions.map((option, index) => {
          const IconComponent = option.icon
          const isLocationButton = option.onClick === 'location'

          return (
            <button
              key={index}
              onClick={() => handleClick(option.onClick)}
              disabled={!isMapReady}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/50 bg-white/25 shadow-[0px_0px_3.33px_0px_rgba(0,0,0,0.25)] backdrop-blur-[1.66px] transition-all duration-200 hover:bg-[rgba(255,255,255,0.35)] disabled:opacity-50"
              title={option.title}
            >
              <IconComponent size={28} color={isLocationButton ? '#00C800' : '#222222'} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
