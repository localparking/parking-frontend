import React, { useCallback } from 'react'
import { SlidersHorizontal, RefreshCw } from 'lucide-react'
import { useMapContext } from '@/features/map/context/map-context'
import { ParkingLotSearchRequestSortEnum } from '@data/user-api-axios/api'
import { FilterItem } from '@/shared/ui/filter-item'

interface ParkingLotTopFilterProps {
  onFilterIconClick: () => void
  onRefresh: () => void
}

const FEE_OPTIONS = [
  { label: '무료', value: 0 },
  { label: '1,000원', value: 1000 },
  { label: '2,000원', value: 2000 },
  { label: '3,000원', value: 3000 },
  { label: '4,000원', value: 4000 },
  { label: '5,000원', value: 5000 },
] as const

export const ParkingLotTopFilter: React.FC<ParkingLotTopFilterProps> = ({ onFilterIconClick, onRefresh }) => {
  const { parkingLotSearchParams, setParkingLotSearchParams } = useMapContext()
  const selectedFee = parkingLotSearchParams.maxFeePerHour
  const selectedSort = parkingLotSearchParams.sort

  const handleFeeToggle = useCallback(
    (fee: number) => {
      setParkingLotSearchParams((prev) => {
        const next = prev.maxFeePerHour === fee ? undefined : fee
        return { ...prev, maxFeePerHour: next, page: 0 }
      })
    },
    [setParkingLotSearchParams]
  )

  const setSort = useCallback(
    (sort: ParkingLotSearchRequestSortEnum) => {
      setParkingLotSearchParams((prev) => {
        if (prev.sort === sort) return prev
        return { ...prev, sort, page: 0 }
      })
    },
    [setParkingLotSearchParams]
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onFilterIconClick}
          className="flex items-center rounded text-gray-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
          aria-label="필터 열기"
        >
          <SlidersHorizontal size={16} />
        </button>

        <div className="flex gap-2 overflow-x-auto text-caption-2 scrollbar-hide" aria-label="시간당 최대 요금 선택">
          {FEE_OPTIONS.map(({ label, value }) => (
            <FilterItem
              key={value}
              isSelected={selectedFee === value}
              onClick={() => handleFeeToggle(value)}
              className="text-caption-2"
              label={label}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-caption-2 text-gray-2">
        <div className="flex items-center gap-[14px]" role="group" aria-label="정렬 옵션">
          <button
            type="button"
            onClick={() => setSort(ParkingLotSearchRequestSortEnum.Distance)}
            className={selectedSort === ParkingLotSearchRequestSortEnum.Distance ? 'text-gray-1' : ''}
            aria-pressed={selectedSort === ParkingLotSearchRequestSortEnum.Distance}
          >
            거리순
          </button>
          <button
            type="button"
            onClick={() => setSort(ParkingLotSearchRequestSortEnum.Price)}
            className={selectedSort === ParkingLotSearchRequestSortEnum.Price ? 'text-gray-1' : ''}
            aria-pressed={selectedSort === ParkingLotSearchRequestSortEnum.Price}
          >
            가격순
          </button>
        </div>

        <button type="button" onClick={onRefresh} className="flex items-center gap-[3px]" aria-label="결과 새로고침">
          <RefreshCw size={12} className="text-gray-3" />
          <span>새로고침</span>
        </button>
      </div>
    </div>
  )
}
