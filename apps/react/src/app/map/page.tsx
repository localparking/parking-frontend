import { createFileRoute } from '@tanstack/react-router'
import { MapControl, MapMarkers, MapTypeToggle } from '@/features/map/components'
import { useMapContext } from '@/features/map/context/map-context'
import { useBottomSheet } from '@/shared/context/bottom-sheet-context'
import MapSearchInputBox from '@/features/map/components/map-search'
import BottomSheet from '@/shared/ui/custom-bottom-sheet'
import { z } from 'zod'
import { useBottomSheetContent } from '@/shared/hooks/use-bottom-sheet'
import MapBackButton from '@/features/map/components/map-back-button'

const searchSchema = z.object({
  parkingLotId: z.string().optional(),
  storeId: z.string().optional(),
})

export const Route = createFileRoute('/map/')({
  component: Map,
  validateSearch: searchSchema,
})

function Map() {
  const { naverMap } = useMapContext()
  const { parkingLotId, storeId } = Route.useSearch()

  // URL 파라미터와 지도 타입에 따라 BottomSheet 내용을 업데이트하는 훅 호출
  useBottomSheetContent(storeId, parkingLotId)

  return (
    <>
      <MapSearchInputBox />
      {parkingLotId || (storeId && <MapBackButton />)}
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

      <BottomSheet />
    </>
  )
}
