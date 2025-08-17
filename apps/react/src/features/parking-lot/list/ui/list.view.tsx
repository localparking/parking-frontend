import React from 'react'
import { ParkingLotListResponse, PageResponseParkingLotListResponse } from '@data/user-api-axios/api'
import { useNavigation, useMapContext } from '@/features/map'
import { formatPrice } from '@/shared/utils/format'
import { InfiniteListView } from '@/shared/ui'
import StatusBadge from '@/shared/ui/status-badge'

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
      className="flex cursor-pointer items-center gap-6 py-6"
      onClick={() => {
        moveTo({ lat: parkingLot.lat, lng: parkingLot.lon })
        navigateToParkingLotDetail(parkingLot.parkingCode)
      }}
    >
      <div className="flex flex-1 flex-col gap-1">
        <div className="text-caption-3 text-gray-500">
          {parkingLot.curCapacity
            ? `주차 ${parkingLot.curCapacity}면 / ${parkingLot.capacity}면`
            : `주차 ${parkingLot.capacity}면`}
        </div>

        <div className="flex items-center gap-2">
          <h3 className="text-body-4 text-gray-1">{parkingLot.name}</h3>
          <StatusBadge isOpen={parkingLot.isOpen} />
        </div>
      </div>

      <div className="flex h-fit flex-col items-center gap-0.5 rounded-[5px] bg-gray-4 px-1.5 py-1">
        <span className="text-caption-3 text-gray-2">1시간당 요금</span>
        <span className="text-caption-2 text-gray-1">{formatPrice(parkingLot.hourlyFee || 0)}</span>
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
    />
  )
}
