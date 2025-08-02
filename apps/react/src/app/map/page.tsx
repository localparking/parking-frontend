// page.tsx
import React from 'react'
import { useBottomSheet } from '@/features/map/hooks/use-bottom-sheet'
import { createFileRoute } from '@tanstack/react-router'
import { MapControl, MapMarkers, MapTypeToggle } from '@/features/map/components'
import { useMapContext } from '@/features/map/context/map-context'
import { useQuery } from '@tanstack/react-query'
import { ParkingApi, StoreApi } from '@data/user-api-axios/api'
import apiInstance from '@/shared/libs/api'

export const Route = createFileRoute('/map/')({
  component: Map,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      parkingLotId: (search.parkingLotId as string) || undefined,
      storeId: (search.storeId as string) || undefined,
    }
  },
})

import { StoreContent, ParkingLotContent } from '@/features/map/components'
import { ParkingLotDetail, StoreDetail } from '@/features/map/components/detail'

function Map() {
  const { distanceLevel, mapDisplayType } = useMapContext()
  const { open, close, BottomSheetComponent } = useBottomSheet()
  const { parkingLotId, storeId } = Route.useSearch()
  const parkingApi = new ParkingApi(undefined, '', apiInstance)
  const storeApi = new StoreApi(undefined, '', apiInstance)

  // 주차장 상세 정보 쿼리
  const { data: parkingLotResponse, isLoading: isParkingLotLoading } = useQuery({
    queryKey: ['parkingLot', parkingLotId],
    queryFn: async () => {
      const { data } = await parkingApi.getParkingLotDetail({ parkingCode: parkingLotId! })
      return data
    },
    enabled: !!parkingLotId,
  })

  // 매장 상세 정보 쿼리
  const { data: storeResponse, isLoading: isStoreLoading } = useQuery({
    queryKey: ['store', storeId],
    queryFn: async () => {
      const { data } = await storeApi.getStoreDetail({ storeId: parseInt(storeId!) })
      return data
    },
    enabled: !!storeId,
  })

  // 바텀시트 내용 결정 및 업데이트
  React.useEffect(() => {
    let content: React.ReactNode

    if (parkingLotId) {
      // 주차장 상세 화면
      if (isParkingLotLoading) {
        content = (
          <div className="flex h-[400px] items-center justify-center">
            <div className="text-sm text-gray-500">로딩 중...</div>
          </div>
        )
      } else if (parkingLotResponse?.data) {
        content = <ParkingLotDetail key={`parking-detail-${parkingLotId}`} parkingLot={parkingLotResponse.data} />
      } else {
        content = (
          <div className="flex h-[400px] items-center justify-center">
            <div className="text-sm text-red-500">주차장 정보를 불러올 수 없습니다.</div>
          </div>
        )
      }
    } else if (storeId) {
      // 매장 상세 화면
      if (isStoreLoading) {
        content = (
          <div className="flex h-[400px] items-center justify-center">
            <div className="text-sm text-gray-500">로딩 중...</div>
          </div>
        )
      } else if (storeResponse?.data) {
        content = <StoreDetail key={`store-detail-${storeId}`} store={storeResponse.data} />
      } else {
        content = (
          <div className="flex h-[400px] items-center justify-center">
            <div className="text-sm text-red-500">매장 정보를 불러올 수 없습니다.</div>
          </div>
        )
      }
    } else {
      // 기본 리스트 화면
      content =
        mapDisplayType === 'store' ? (
          <StoreContent key="store-content" />
        ) : (
          <ParkingLotContent key="parking-lot-content" />
        )
    }

    open(content)
  }, [
    mapDisplayType,
    parkingLotId,
    storeId,
    parkingLotResponse,
    isParkingLotLoading,
    storeResponse,
    isStoreLoading,
    open,
  ])
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
