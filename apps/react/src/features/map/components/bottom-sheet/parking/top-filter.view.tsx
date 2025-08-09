import React from 'react'
import { SlidersHorizontal, RefreshCw } from 'lucide-react'
import { useMapContext } from '../../../context/map-context'
import { ParkingLotSearchRequestSortEnum } from '@data/user-api-axios/api'
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
  { label: '5,000원', value: 5000 },
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
    <div className="px-6 py-3">
      <div className="mb-4 flex items-center justify-start gap-2">
        <button onClick={onFilterIconClick} className="flex items-center text-gray-1">
          <SlidersHorizontal size={16} />
        </button>
        <div className="flex gap-2 overflow-x-auto text-caption-2">
          {FEE_OPTIONS.map(({ label, value }) => {
            const isSelected = parkingLotSearchParams.maxFeePerHour === value
            return (
              <button
                key={String(value)}
                onClick={() => handleFeeToggle(value)}
                className={cn(
                  'flex h-[31px] flex-shrink-0 items-center justify-center gap-x-1 rounded-[50px] border px-2 py-[6px] transition-colors',
                  {
                    'border-gray-1 bg-gray-1 text-white': isSelected,
                    'border-gray-300 text-gray-700 hover:bg-gray-50': !isSelected,
                  }
                )}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>
      <div className="flex items-center justify-between text-caption-2 text-gray-2">
        <div className="flex items-center gap-[14px]">
          <button
            onClick={() =>
              setParkingLotSearchParams((prev) => ({
                ...prev,
                sort: ParkingLotSearchRequestSortEnum.Distance,
                page: 0,
              }))
            }
            className={parkingLotSearchParams.sort === ParkingLotSearchRequestSortEnum.Distance ? 'text-gray-1' : ''}
          >
            거리순
          </button>
          <button
            onClick={() =>
              setParkingLotSearchParams((prev) => ({ ...prev, sort: ParkingLotSearchRequestSortEnum.Price, page: 0 }))
            }
            className={parkingLotSearchParams.sort === ParkingLotSearchRequestSortEnum.Price ? 'text-gray-1' : ''}
          >
            가격순
          </button>
        </div>
        <button onClick={onRefresh} className="flex items-center gap-[3px]">
          <RefreshCw size={12} className="text-gray-3" />
          <span>새로고침</span>
        </button>
      </div>
    </div>
  )
}
