import React from 'react'
import { cn } from '@ui/common/lib/utils'
import type { AssociatedParkingLotDto } from '@data/user-api-axios/api'
import { formatPrice } from '@/shared/utils/format'

const ParkingLotCard: React.FC<{ parkingLot: AssociatedParkingLotDto }> = React.memo(({ parkingLot }) => {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex flex-col gap-1">
        <div className="flex">
          <span className="text-caption-3 text-gray-2">
            주차 {parkingLot.capacity ? `${parkingLot.capacity}면` : '정보 없음'}
          </span>
        </div>
        <div className="flex items-start gap-2">
          <span className="] text-body-4 text-gray-1">{parkingLot.name || '주차장명'}</span>
          <span
            className={cn(
              'mt-1 rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap',
              parkingLot.isOpen ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
            )}
          >
            {parkingLot.isOpen ? '영업중' : '영업종료'}
          </span>
        </div>
        {typeof parkingLot.curCapacity === 'number' && parkingLot.curCapacity > 0 && (
          <div className="text-caption-2 text-gray-2">현재 {parkingLot.curCapacity}자리 주차 가능해요!</div>
        )}
      </div>
      <div className="flex flex-col items-center gap-0.5 rounded-[5px] bg-gray-4 px-1.5 py-1 whitespace-nowrap">
        <span className="text-caption-3 text-gray-2">1시간당 요금</span>
        <span className="text-caption-2 text-gray-1">{formatPrice(parkingLot.hourlyFee || 0)}</span>
      </div>
    </div>
  )
})

ParkingLotCard.displayName = 'ParkingLotCard'

export { ParkingLotCard }
