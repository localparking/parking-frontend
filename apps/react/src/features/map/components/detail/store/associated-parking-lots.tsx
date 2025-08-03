import React from 'react'
import { formatPrice } from '@/shared/utils/format'
import { cn } from '@ui/common/lib/utils'
import type { AssociatedParkingLotDto } from '@data/user-api-axios/api'

interface AssociatedParkingLotsProps {
  parkingLots: AssociatedParkingLotDto[]
}

const ParkingLotCard: React.FC<{ parkingLot: AssociatedParkingLotDto }> = React.memo(({ parkingLot }) => {
  return (
    <div className="flex flex-col gap-[5px] rounded-lg">
      <div className="flex w-full items-center justify-between">
        <span className="text-xs text-gray-500">
          주차 {parkingLot.capacity ? `${parkingLot.capacity}면` : '정보 없음'}
        </span>
        <span className="text-xs text-gray-900">1시간 요금</span>
      </div>
      <div className="flex flex-col">
        <div className="flex w-full items-start justify-between gap-1">
          <div className="flex items-start gap-1">
            <span className="text-sm font-semibold text-gray-900">{parkingLot.name || '주차장명'}</span>
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-center text-xs font-semibold whitespace-nowrap',
                parkingLot.isOpen ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
              )}
            >
              {parkingLot.isOpen ? '영업중' : '영업종료'}
            </span>
          </div>
          <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold whitespace-nowrap text-green-600">
            {formatPrice(parkingLot.hourlyFee || 0)}
          </span>
        </div>
        {parkingLot.curCapacity !== undefined && parkingLot.curCapacity > 0 && (
          <div className="flex items-center">
            <span className="text-xs font-medium text-gray-2">현재 {parkingLot.curCapacity}자리 주차 가능해요!</span>
          </div>
        )}
      </div>
    </div>
  )
})

ParkingLotCard.displayName = 'ParkingLotCard'

export const AssociatedParkingLots: React.FC<AssociatedParkingLotsProps> = React.memo(({ parkingLots }) => {
  if (parkingLots.length === 0) return null

  return (
    <div className="space-y-2.5">
      {parkingLots.map((lot) => (
        <ParkingLotCard key={lot.parkingCode} parkingLot={lot} />
      ))}
    </div>
  )
})

AssociatedParkingLots.displayName = 'AssociatedParkingLots'
