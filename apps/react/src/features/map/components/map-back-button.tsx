import { ChevronLeft } from 'lucide-react'
import { useNavigation } from '../hooks'

const MapBackButton = () => {
  const { navigateToMapList } = useNavigation()
  return (
    <div className={'absolute top-[calc(var(--spacing-safe-top)+70px)] left-6 z-10'}>
      <button
        className="flex h-12 w-12 items-center justify-center rounded-full bg-white/85 shadow-[inset_0_1px_8px_0_rgba(0,0,0,0.25)] hover:cursor-pointer"
        onClick={navigateToMapList}
      >
        <ChevronLeft className="h-[30px] w-[30px] text-gray-2" />
      </button>
    </div>
  )
}

export default MapBackButton
