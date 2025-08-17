import React from 'react'
import { ParkingLotListResponse, PageResponseParkingLotListResponse } from '@data/user-api-axios/api'
import { cn } from '@ui/common/lib/utils'
import { useNavigation, useMapContext } from '@/features/map'
import { formatPrice } from '@/shared/utils/format'
import { InfiniteListView } from '../generic/infinite-list-view'

interface ParkingLotListProps {
  pages: PageResponseParkingLotListResponse[] | undefined
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onFetchNextPage: () => void
}

const ParkingLotItem: React.FC<{ parkingLot: ParkingLotListResponse }> = ({ parkingLot }) => {
  const { navigateToParkingLotDetail } = useNavigation()
  const { moveTo } = useMapContext().naverMap

  return (
    <div
      className="cursor-pointer rounded-lg border border-white bg-white p-3"
      onClick={() => {
        moveTo({ lat: parkingLot.lat, lng: parkingLot.lon })
        navigateToParkingLotDetail(parkingLot.parkingCode)
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="text-[10px] text-gray-500">
            {parkingLot.curCapacity
              ? `주차 ${parkingLot.curCapacity}면 / ${parkingLot.capacity}면`
              : `주차 ${parkingLot.capacity}면`}
          </div>
          <div className="flex items-center gap-1">
            <h3 className="text-body-4 text-gray-1">{parkingLot.name}</h3>
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                parkingLot.isOpen ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
              )}
            >
              {parkingLot.isOpen ? '영업중' : '영업종료'}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-0.5 rounded-[5px] bg-gray-4 px-1.5 py-1">
          <span className="text-caption-3 text-gray-2">1시간당 요금</span>
          <span className="text-caption-2 text-gray-1">{formatPrice(parkingLot.hourlyFee || 0)}</span>
        </div>
      </div>
    </div>
  )
}

export const ParkingLotList: React.FC<ParkingLotListProps> = (props) => {
  return (
    <InfiniteListView<ParkingLotListResponse>
      {...props}
      getKey={(lot) => lot.parkingCode}
      renderItem={(lot) => <ParkingLotItem parkingLot={lot} />}
      emptyMessage="주변에 주차장이 없습니다."
      className="space-y-2.5"
    />
  )
}
