import React from 'react'
import { formatPrice } from '@/shared/utils/format'
import type { AssociatedParkingLotDto } from '@data/user-api-axios/api'

interface AssociatedParkingLotsProps {
  parkingLots: AssociatedParkingLotDto[]
}

const ParkingLotCard: React.FC<{ parkingLot: AssociatedParkingLotDto }> = React.memo(({ parkingLot }) => {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-gray-200 bg-white p-3">
      <div className="flex w-full items-center justify-between">
        <span className="text-xs text-gray-500">
          주차 {parkingLot.capacity ? `${parkingLot.capacity}면` : '정보 없음'}
        </span>
        <span className="text-xs text-gray-900">1시간 요금</span>
      </div>
      <div className="flex w-full items-start justify-between gap-1">
        <span className="text-sm font-semibold text-gray-900">{parkingLot.name || '주차장명'}</span>
        <div className="flex items-center gap-1">
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-center text-xs font-semibold whitespace-nowrap text-gray-500">
            영업시간
          </span>
          <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold whitespace-nowrap text-green-600">
            {formatPrice(parkingLot.hourlyFee || 0)}
          </span>
        </div>
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
