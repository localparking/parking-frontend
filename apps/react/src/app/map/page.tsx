import { createFileRoute } from '@tanstack/react-router'
import { MapControl, MapMarkers, MapTypeToggle } from '@/features/map/components'
import { useMapContext } from '@/features/map/context/map-context'
import MapSearchInputBox from '@/features/map/components/map-search'
import BottomSheet from '@/shared/ui/custom-bottom-sheet'
import { z } from 'zod'
import { useBottomSheetContent } from '@/shared/hooks/use-bottom-sheet'
import MapBackButton from '@/features/map/components/map-back-button'
import { useState } from 'react'
import { OrderStatusBottomSheet } from '@/features/map/components/order-status-bottom-sheet'
import Button from '@/shared/ui/button'
import parkingLotService from '@/shared/services/parking-lot.service'
import { AiRecommendationSheet } from '@/features/map/components/ai-recommendation-sheet'

const searchSchema = z.object({
  parkingLotId: z.string().optional(),
  storeId: z.string().optional(),
})

export const Route = createFileRoute('/map/')({
  component: Map,
  validateSearch: searchSchema,
  loader: async ({ context }) => {
    if (context.auth.authenticated) {
      try {
        const data = await parkingLotService.getParkingStatus()
        return data.data.data
      } catch {}
    }
    return null
  },
})

function Map() {
  const data = Route.useLoaderData()
  const { naverMap } = useMapContext()
  const { parkingLotId, storeId } = Route.useSearch()
  const [isStatusSheetOpen, setStatusSheetOpen] = useState(false)
  const [isAiSheetOpen, setAiSheetOpen] = useState(false)

  useBottomSheetContent(storeId, parkingLotId)

  return (
    <>
      <MapSearchInputBox />
      {(parkingLotId || storeId) && <MapBackButton />}
      <MapTypeToggle />
      <MapControl />
      <MapMarkers />

      {naverMap.distanceLevel === null && (
        <div
          className="absolute top-34 left-1/2 z-10 -translate-x-1/2 rounded-lg bg-black/60 p-3 shadow-lg"
          aria-live="polite"
        >
          <p className="text-center text-caption-2 text-white">
            지도를 확대하여
            <br />
            주변 정보를 확인하세요
          </p>
        </div>
      )}

      <BottomSheet />

      {data && (
        <div className="fixed bottom-[120px] left-1/2 z-10 w-full max-w-sm -translate-x-1/2 px-6">
          <Button onClick={() => setStatusSheetOpen(true)}>주문 현황 보기</Button>
        </div>
      )}

      {!data && (
        <div className="fixed bottom-[120px] left-1/2 z-10 w-full max-w-sm -translate-x-1/2 px-6">
          <Button onClick={() => setAiSheetOpen(true)}>AI 추천 보기</Button>
        </div>
      )}

      {data && isStatusSheetOpen && <OrderStatusBottomSheet data={data} onClose={() => setStatusSheetOpen(false)} />}
      <AiRecommendationSheet open={isAiSheetOpen} onClose={() => setAiSheetOpen(false)} />
    </>
  )
}
