import React from 'react'
import { SlidersHorizontal, RefreshCw } from 'lucide-react'
import { useMapContext } from '../../context/map-context'
import { ParkingLotSearchRequestSortEnum } from '@data/user-api-axios/api'
import { FilterButtonGroup } from './filter-button'
import { cn } from '@ui/common/lib/utils'

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
]

export const ParkingLotTopFilter: React.FC<ParkingLotTopFilterProps> = ({ onFilterIconClick, onRefresh }) => {
  const { parkingLotSearchParams, setParkingLotSearchParams } = useMapContext()

  const handleFeeToggle = (fee: number) => {
    const currentFee = parkingLotSearchParams.maxFeePerHour
    const newFee = currentFee === fee ? undefined : fee
    setParkingLotSearchParams((prev) => ({
      ...prev,
      maxFeePerHour: newFee,
      page: 0,
    }))
  }

  return (
    <div className="border-b border-gray-100 px-4 py-3">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={onFilterIconClick} className="flex items-center gap-1 px-2 py-1 text-gray-600">
          <SlidersHorizontal size={16} />
        </button>
        <div className="flex overflow-x-auto">
          <FilterButtonGroup
            options={FEE_OPTIONS}
            selectedValue={parkingLotSearchParams.maxFeePerHour}
            onSelect={handleFeeToggle}
            className="flex gap-2 whitespace-nowrap"
          />
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              setParkingLotSearchParams((prev) => ({
                ...prev,
                sort: ParkingLotSearchRequestSortEnum.Distance,
                page: 0,
              }))
            }
            className={cn(
              'font-semibold',
              parkingLotSearchParams.sort === ParkingLotSearchRequestSortEnum.Distance ? 'text-gray-1' : ''
            )}
          >
            거리순
          </button>
          <button
            onClick={() =>
              setParkingLotSearchParams((prev) => ({ ...prev, sort: ParkingLotSearchRequestSortEnum.Price, page: 0 }))
            }
            className={cn(
              'font-semibold',
              parkingLotSearchParams.sort === ParkingLotSearchRequestSortEnum.Price ? 'text-gray-1' : ''
            )}
          >
            가격순
          </button>
        </div>
        <button onClick={onRefresh} className="flex items-center gap-1 hover:text-gray-700">
          <RefreshCw size={12} />
          <span>새로고침</span>
        </button>
      </div>
    </div>
  )
}
