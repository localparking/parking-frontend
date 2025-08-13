import React from 'react'
import { formatTime } from '@/shared/utils/format'
import type { ParkingLotDetailResponse } from '@data/user-api-axios/api'

interface OperatingHoursProps {
  operatingTable: NonNullable<ParkingLotDetailResponse['operatingTable']>
}

export const OperatingHours: React.FC<OperatingHoursProps> = React.memo(({ operatingTable }) => {
  return (
    <div>
      <h4 className="pb-1 text-xs font-semibold text-gray-900">운영시간</h4>
      <div className="grid grid-cols-2 gap-[10px] text-caption-1 text-gray-500">
        {operatingTable.map((item) => (
          <div className="flex justify-between" key={item.label}>
            <span>{item.label}</span>
            <span>{item.slot ? formatTime(item.slot) : '정보 없음'}</span>
          </div>
        ))}
      </div>
    </div>
  )
})

OperatingHours.displayName = 'OperatingHours'
