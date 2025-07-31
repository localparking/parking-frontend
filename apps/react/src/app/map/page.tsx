// page.tsx
import React from 'react'
import { useBottomSheet } from '@/features/map/hooks/use-bottom-sheet'
import { createFileRoute } from '@tanstack/react-router'
import { MapControl, MapMarkers, MapTypeToggle } from '@/features/map/components'
import { useMapContext } from '@/features/map/context/map-context'

export const Route = createFileRoute('/map/')({
  component: Map,
})

import { StoreContent, ParkingLotContent } from '@/features/map/components'

function Map() {
  const { distanceLevel } = useMapContext()
  const { open, close, BottomSheetComponent } = useBottomSheet()

  const { mapDisplayType } = useMapContext()

  // mapDisplayType 변경을 감지하여 바텀시트 내용 업데이트
  React.useEffect(() => {
    const content =
      mapDisplayType === 'store' ? (
        <StoreContent key="store-content" />
      ) : (
        <ParkingLotContent key="parking-lot-content" />
      )
    open(content)
  }, [mapDisplayType, open])
  return (
    <div className="relative">
      <div id="map" className="h-screen" />
      <MapTypeToggle />
      <MapControl />
      <MapMarkers />
      {distanceLevel === null && (
        <div
          className="absolute top-20 left-1/2 z-10 -translate-x-1/2 rounded-lg bg-black/60 p-3 text-sm text-white shadow-lg"
          aria-live="polite"
        >
          지도를 확대하여 주변 정보를 확인하세요.
        </div>
      )}

      {BottomSheetComponent}
      {/* <Search /> */}
    </div>
  )
}
