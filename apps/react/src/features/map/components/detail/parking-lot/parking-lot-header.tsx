import React from 'react'
import { Phone } from 'lucide-react'
import { CongestionBadge } from './congestion-badge'
import type { ParkingLotDetailResponse } from '@data/user-api-axios/api'

type ParkingLotHeaderInfo = Omit<ParkingLotDetailResponse, 'feePolicy' | 'operatingTable' | 'associatedStores'>

interface ParkingLotHeaderProps {
  info: ParkingLotHeaderInfo
}

export const ParkingLotHeader: React.FC<ParkingLotHeaderProps> = React.memo(({ info }) => {
  return (
    <div>
      <div className="flex items-start gap-6">
        <div className="flex h-[82px] w-[82px] flex-shrink-0 items-center justify-center pb-0.5">
          <img src="/icons/parking-icon.png" alt="주차장" className="h-[82px] w-[82px]" />
        </div>

        <div className="flex flex-col">
          <div className="mb-1 text-xs text-gray-500">
            {info.capacity && info.curCapacity ? `주차 ${info.curCapacity}면 / ${info.capacity}면` : '주차 정보 없음'}
          </div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-sm font-semibold text-gray-900">{info.name}</h2>
            <CongestionBadge congestion={info.congestion} />
          </div>
          <div className="my-1 text-xs font-semibold text-gray-900">
            {info.isOpen ? '영업중' : '영업종료'} {info.todayClosingTime ? `${info.todayClosingTime}까지` : ''}
          </div>
          {info.tel && (
            <div className="flex items-center gap-2.5 rounded-full bg-gray-50 px-4 py-2">
              <div className="rounded-full p-1">
                <Phone size={12} />
              </div>
              <span className="text-xs font-semibold text-gray-900">{info.tel}</span>
            </div>
          )}
        </div>
      </div>
      <div className="mt-5 text-xs text-gray-500">{info.address || '주소 정보 없음'}</div>
    </div>
  )
})

ParkingLotHeader.displayName = 'ParkingLotHeader'
