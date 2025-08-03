import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { MapControl, MapMarkers, MapTypeToggle, ParkingLotContent, StoreContent } from '@/features/map/components'
import { MapDisplayType, useMapContext } from '@/features/map/context/map-context'
import MapSearchInputBox from '@/features/map/components/map-search'
import { useBottomSheet } from '@/features/map/hooks/use-bottom-sheet'

export const Route = createFileRoute('/map/')({
  component: Map,
})

function Map() {
  const { naverMap, mapDisplayType } = useMapContext()

  // ✅ BottomSheet 생성 로직을 여기로 이동시킵니다.
  const { BottomSheetComponent } = useBottomSheet({
    initialContent: mapDisplayType === MapDisplayType.STORE ? <StoreContent /> : <ParkingLotContent />,
  })

  return (
    <>
      <MapSearchInputBox />
      <MapTypeToggle />
      <MapControl />
      <MapMarkers />

      {naverMap.distanceLevel === null && (
        <div
          className="absolute top-20 left-1/2 z-10 -translate-x-1/2 rounded-lg bg-black/60 p-3 text-sm text-white shadow-lg"
          aria-live="polite"
        >
          지도를 확대하여 주변 정보를 확인하세요.
        </div>
      )}

      {BottomSheetComponent}
    </>
  )
}
