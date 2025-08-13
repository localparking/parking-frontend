import React from 'react'
import { Clock, MapPin, Phone, type LucideIcon } from 'lucide-react'
import type { ParkingLotDetailResponse } from '@data/user-api-axios/api'

type ParkingLotHeaderInfo = Omit<ParkingLotDetailResponse, 'feePolicy' | 'operatingTable' | 'associatedStores'>

interface ParkingLotHeaderProps {
  info: ParkingLotHeaderInfo
}

function getParkingCapacityText(info: ParkingLotHeaderInfo): string {
  const hasCapacity = typeof info.capacity === 'number'
  const hasCurrent = typeof info.curCapacity === 'number'

  if (hasCapacity && hasCurrent) {
    return `주차 ${info.curCapacity}면 / 총 ${info.capacity}면`
  }
  if (hasCapacity) {
    return `총 ${info.capacity}면`
  }
  if (hasCurrent) {
    return `주차 ${info.curCapacity}면`
  }
  return '주차 정보 없음'
}

const CONGESTION_INFO = {
  여유: { label: '여유로움', className: 'bg-blue-50 text-blue-600' },
  보통: { label: '보통', className: 'bg-yellow-50 text-yellow-600' },
  혼잡: { label: '혼잡함', className: 'bg-red-50 text-red-600' },
} as const

export const ParkingLotHeader: React.FC<ParkingLotHeaderProps> = React.memo(({ info }) => {
  const congestion = info.congestion ? CONGESTION_INFO[info.congestion as keyof typeof CONGESTION_INFO] : undefined

  return (
    <div>
      <div className="flex items-start gap-2">
        <div className="h-[85px] w-[85px] flex-shrink-0">
          <img src="/icons/parking-icon.png" alt="주차장" className="rounded-full" />
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-caption-3 text-gray-2">{getParkingCapacityText(info)}</div>
          <div className="flex items-start gap-1">
            <h2 className="text-body-4 text-gray-1">{info.name}</h2>
            {congestion && (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap ${congestion.className}`}
              >
                {congestion.label}
              </span>
            )}
          </div>
          {info.tel && (
            <div className="flex w-fit gap-2">
              <Phone size={12} className="flex-shrink-0" />
              <span className="text-caption-3 text-gray-2">{info.tel}</span>
            </div>
          )}
          {info.todayClosingTime && (
            <div className="flex w-fit gap-2">
              <Clock size={12} className="flex-shrink-0" />
              <span className="text-caption-3 text-gray-2">{info.todayClosingTime}까지 영업</span>
            </div>
          )}

          {info.address && (
            <div className="flex w-fit gap-2">
              <MapPin size={12} className="flex-shrink-0" />
              <div className="text-caption-3 text-gray-2">{info.address}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

ParkingLotHeader.displayName = 'ParkingLotHeader'
