// page.tsx
import React, { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { MapControl, MapMarkers, MapTypeToggle } from '@/features/map/components'
import { useMapContext } from '@/features/map/context/map-context'
import BottomSheet from '@/shared/components/custom-bottom-sheet'

export const Route = createFileRoute('/map/')({
  component: Map,
})

import { StoreContent, ParkingLotContent } from '@/features/map/components'

function Map() {
  const { distanceLevel, mapDisplayType } = useMapContext()
  const [bottomSheetIndex, setBottomSheetIndex] = useState(0)

  const bottomSheetContent =
    mapDisplayType === 'store' ? <StoreContent key="store-content" /> : <ParkingLotContent key="parking-lot-content" />

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

      <BottomSheet activeSnapIndex={bottomSheetIndex} setActiveSnapIndex={setBottomSheetIndex}>
        {bottomSheetContent}
      </BottomSheet>
      {/* <Search /> */}
    </div>
  )
}
