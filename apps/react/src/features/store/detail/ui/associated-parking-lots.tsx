import React from 'react'
import { cn } from '@ui/common/lib/utils'
import type { AssociatedParkingLotDto } from '@data/user-api-axios/api'
import { formatPrice } from '@/shared/utils/format'
import StatusBadge from '@/shared/ui/status-badge'

const ParkingLotCard: React.FC<{ parkingLot: AssociatedParkingLotDto }> = React.memo(({ parkingLot }) => {
  return (
    <div>
      <h3 className="text-body-5">건물 주차장 정보</h3>
      <div className="flex items-center justify-between py-3">
        <div className="flex flex-col gap-1">
          <span className="text-caption-3 text-gray-2">
            주차 {parkingLot.capacity ? `${parkingLot.capacity}면` : '정보 없음'}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-body-4">{parkingLot.name || '주차장명'}</span>
            <StatusBadge isOpen={parkingLot.isOpen} />
          </div>
          {typeof parkingLot.curCapacity === 'number' && parkingLot.curCapacity > 0 && (
            <div className="text-caption-2 text-gray-2">현재 {parkingLot.curCapacity}자리 주차 가능해요!</div>
          )}
        </div>
        <div className="flex flex-col items-center gap-0.5 rounded-[5px] bg-gray-4 px-1.5 py-1 whitespace-nowrap">
          <span className="text-caption-3 text-gray-2">1시간당 요금</span>
          <span className="text-caption-2">{formatPrice(parkingLot.hourlyFee || 0)}</span>
        </div>
      </div>
    </div>
  )
})

ParkingLotCard.displayName = 'ParkingLotCard'

export { ParkingLotCard }
