import React from 'react'
import { formatTime } from '@/shared/utils/format'
import type { ParkingLotDetailResponse } from '@data/user-api-axios/api'
import { Clock } from 'lucide-react'

interface OperatingHoursProps {
  operatingTable: NonNullable<ParkingLotDetailResponse['operatingTable']>
}

export const OperatingHours: React.FC<OperatingHoursProps> = React.memo(({ operatingTable }) => {
  const mapOperatingLabel = (label: string): string => {
    switch (label) {
      case '평일':
        return '평일 (월,화,수,목,금)'
      case '주말':
        return '주말 (토,일)'
      case '공휴일':
        return '공휴일'
      default:
        return label
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-body-5 text-gray-1">운영시간</h3>
      <ul className="space-y-2">
        {operatingTable.map((item) => (
          <li key={item.label} className="flex items-center justify-between">
            <span className="text-caption-2 text-gray-2">{mapOperatingLabel(item.label)}</span>
            <span className="flex items-center gap-1 rounded-[5px] bg-gray-4 px-2 py-1 text-caption-4 text-gray-1">
              <Clock size={12} />
              {item.slot ? formatTime(item.slot) : '정보 없음'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
})

OperatingHours.displayName = 'OperatingHours'
