import React, { useMemo } from 'react'
import { formatTime } from '@/shared/utils/format'
import type { ParkingLotDetailResponse } from '@data/user-api-axios/api'

interface OperatingHoursProps {
  operatingTable: NonNullable<ParkingLotDetailResponse['operatingTable']>
}

export const OperatingHours: React.FC<OperatingHoursProps> = React.memo(({ operatingTable }) => {
  const hoursMap = useMemo(() => {
    const map = new Map<string, { begin: string; end: string } | undefined>()
    operatingTable.forEach((item) => {
      map.set(item.label, item.slot)
    })
    return map
  }, [operatingTable])

  const weekday = hoursMap.get('평일')
  const weekend = hoursMap.get('주말')
  const holiday = hoursMap.get('공휴일')

  return (
    <div>
      <h4 className="pb-1 text-xs font-semibold text-gray-900">운영시간</h4>
      <div className="flex flex-wrap gap-[10px]">
        <div className="flex h-full w-full items-center justify-between gap-[30px]">
          <div className="flex h-full w-full items-center justify-between gap-[30px]">
            <span className="text-xs leading-[20px] font-semibold text-gray-500">평일</span>
            <span className="text-xs leading-[20px] font-semibold text-gray-500">
              {weekday ? formatTime(weekday) : '정보 없음'}
            </span>
          </div>
          <div className="flex w-full items-center justify-between gap-[30px]">
            <span className="text-xs leading-[20px] font-semibold text-gray-500">주말</span>
            <span className="text-xs leading-[20px] font-semibold text-gray-500">
              {weekend ? formatTime(weekend) : '정보 없음'}
            </span>
          </div>
        </div>
        <div className="flex w-[calc(50%-15px)] items-center justify-between">
          <div className="flex w-full items-center justify-between gap-[30px] whitespace-nowrap">
            <span className="text-xs leading-[20px] font-semibold text-gray-500">공휴일</span>
            <span className="text-xs leading-[20px] font-semibold text-gray-500">
              {holiday ? formatTime(holiday) : '정보 없음'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
})

OperatingHours.displayName = 'OperatingHours'
