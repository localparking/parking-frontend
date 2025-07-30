import bridge from '@/shared/bridge'
import { useBridge } from '@webview-bridge/react'
import { useMapContext } from '../context/map-context'
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
    text: '혜택가게',
  },
  {
    type: MapDisplayType.PARKING_LOT,
    icon: CircleParking,
    text: '주차장',
  },
]

export const MapTypeToggle = () => {
  const { mapDisplayType, setMapDisplayType, insets } = useMapContext()

  const handleToggle = (type: MapDisplayType) => {
    setMapDisplayType(type)
  }

  return (
    <div className={'absolute right-9 z-10'} style={{ top: insets?.top + 55 }}>
      <div className="flex flex-col gap-2.5">
        {toggleOptions.map((option) => {
          const IconComponent = option.icon
          const isSelected = mapDisplayType === option.type

          return (
            <button
              key={option.type}
              onClick={() => handleToggle(option.type)}
              className={`flex flex-col items-center rounded-[50px] border border-white/25 px-1 pt-[14px] shadow-[0px_0px_3.36px_0px_rgba(0,0,0,0.25)] transition-all duration-200 ${
                isSelected ? 'bg-[rgba(113,113,113,0.8)]' : 'bg-[rgba(255,255,255,0.55)]'
              }`}
              style={{ height: '57.44px' }}
            >
              <div className="mb-1">
                <IconComponent size={16} color={isSelected ? 'white' : '#222222'} />
              </div>
              <span
                className={`text-[8px] leading-[2.5em] font-semibold ${isSelected ? 'text-white' : 'text-[#222222]'}`}
              >
                {option.text}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
