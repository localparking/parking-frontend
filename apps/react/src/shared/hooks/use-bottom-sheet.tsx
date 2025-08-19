import React, { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ParkingApi, StoreApi, ParkingLotDetailResponse, StoreDetailResponse } from '@data/user-api-axios/api'
import apiInstance from '@/shared/libs/api'
import { useMapContext } from '@/features/map/context/map-context'
import { useBottomSheet } from '@/shared/context/bottom-sheet-context'
import { ParkingLotDetail } from '@/features/parking-lot/detail/parking-lot-detail'
import { ParkingLotContent } from '@/features/parking-lot/list/parking.surface'
import { StoreDetail } from '@/features/store/detail/store-detail'
import { StoreContent } from '@/features/store/list/store.surface'

interface StatusIndicatorProps {
  message: string
  isError?: boolean
}

// 로딩 및 에러 상태를 표시하는 헬퍼 컴포넌트
const StatusIndicator = ({ message, isError = false }: StatusIndicatorProps) => (
  <div className={`flex h-[400px] items-center justify-center text-sm ${isError ? 'text-red-500' : 'text-gray-500'}`}>
    {message}
  </div>
)

interface DetailViewProps<T> {
  isLoading: boolean
  data: T | undefined
  render: (data: T) => React.ReactNode
  errorMsg: string
}

// 상세 정보 컴포넌트를 렌더링하는 헬퍼 컴포넌트
const DetailView = <T,>({ isLoading, data, render, errorMsg }: DetailViewProps<T>) => {
  if (isLoading) return <StatusIndicator message="로딩 중..." />
  if (data) return <>{render(data)}</>
  return <StatusIndicator message={errorMsg} isError />
}

export const useBottomSheetContent = (storeId?: string, parkingLotId?: string) => {
  const { mapDisplayType } = useMapContext()
  const { setContent, setActiveSnapIndex } = useBottomSheet()
  const parkingApi = new ParkingApi(undefined, '', apiInstance)
  const storeApi = new StoreApi(undefined, '', apiInstance)

  const { data: parkingLotResponse, isLoading: isParkingLotLoading } = useQuery({
    queryKey: ['parkingLot', parkingLotId],
    queryFn: () => parkingApi.getParkingLotDetail({ parkingCode: parkingLotId! }).then((res) => res.data),
    enabled: !!parkingLotId,
  })

  const { data: storeResponse, isLoading: isStoreLoading } = useQuery({
    queryKey: ['store', storeId],
    queryFn: () => storeApi.getStoreDetail({ storeId: parseInt(storeId!) }).then((res) => res.data),
    enabled: !!storeId,
  })

  // 1. 상세 보기 전용 useEffect
  useEffect(() => {
    if (!parkingLotId && !storeId) return

    let detailContent: React.ReactNode
    if (parkingLotId) {
      detailContent = (
        <DetailView<ParkingLotDetailResponse>
          isLoading={isParkingLotLoading}
          data={parkingLotResponse?.data}
          render={(data) => <ParkingLotDetail key={`parking-${parkingLotId}`} parkingLot={data} />}
          errorMsg="주차장 정보를 불러올 수 없습니다."
        />
      )
    } else if (storeId) {
      detailContent = (
        <DetailView<StoreDetailResponse>
          isLoading={isStoreLoading}
          data={storeResponse?.data}
          render={(data) => <StoreDetail key={`store-${storeId}`} store={data} />}
          errorMsg="매장 정보를 불러올 수 없습니다."
        />
      )
    }

    setContent(detailContent)
    setActiveSnapIndex(0)
  }, [
    parkingLotId,
    storeId,
    parkingLotResponse,
    isParkingLotLoading,
    storeResponse,
    isStoreLoading,
    setContent,
    setActiveSnapIndex,
  ])

  // 2. 목록 보기 전용 useEffect
  useEffect(() => {
    if (parkingLotId || storeId) return

    const listContent = mapDisplayType === 'store' ? <StoreContent /> : <ParkingLotContent />
    setContent(listContent)
  }, [mapDisplayType, parkingLotId, storeId, setContent])
}
