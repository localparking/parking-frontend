import { useQueryClient } from '@tanstack/react-query'
import { useMapContext } from '@/features/map/context/map-context'
import { Store, CircleParking } from 'lucide-react'
import { cn } from '@ui/common/lib/utils'

enum MapDisplayType {
  STORE = 'store',
  PARKING_LOT = 'parkingLot',
}

const toggleOptions = [
  {
    type: MapDisplayType.STORE,
    icon: Store,
    text: '매장',
  },
  {
    type: MapDisplayType.PARKING_LOT,
    icon: CircleParking,
    text: '주차장',
  },
]

export const MapTypeToggle = () => {
  const { mapDisplayType, setMapDisplayType, setSearchKeyword, resetStoreFilters, resetParkingLotFilters } =
    useMapContext()
  const queryClient = useQueryClient()

  const handleToggle = (type: MapDisplayType) => {
    if (type === MapDisplayType.STORE) {
      queryClient.invalidateQueries({ queryKey: ['storeMapSearch'] })
    } else {
      queryClient.invalidateQueries({ queryKey: ['parkingLotSearch'] })
    }
    setSearchKeyword('')
    resetStoreFilters()
    resetParkingLotFilters()
    setMapDisplayType(type)
  }

  return (
    <div className={'absolute top-[calc(var(--spacing-safe-top)+70px)] right-9 z-10'}>
      <div className="flex flex-col gap-[12px]">
        {toggleOptions.map((option) => {
          const IconComponent = option.icon
          const isSelected = mapDisplayType === option.type

          return (
            <button
              key={option.type}
              onClick={() => handleToggle(option.type)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 rounded-[50px] border border-white px-2.5 py-3 shadow-[0px_0px_3.36px_0px_rgba(0,0,0,0.25)]',
                isSelected ? 'bg-gray-2' : 'bg-[rgba(255,255,255,0.55)]'
              )}
            >
              <div>
                <IconComponent size={20} className={isSelected ? 'text-white' : 'text-gray-2'} />
              </div>
              <span className={cn('text-caption-4', isSelected ? 'text-white' : 'text-gray-2')}>{option.text}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
