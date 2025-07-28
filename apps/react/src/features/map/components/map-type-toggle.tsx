import { useMapContext } from '../context/map-context'

enum MapDisplayType {
  STORE = 'store',
  PARKING_LOT = 'parkingLot',
}

export const MapTypeToggle = () => {
  const { mapDisplayType, setMapDisplayType } = useMapContext()

  const handleToggle = () => {
    setMapDisplayType(mapDisplayType === MapDisplayType.STORE ? MapDisplayType.PARKING_LOT : MapDisplayType.STORE)
  }

  return (
    <div className="absolute top-4 left-1/2 z-10 -translate-x-1/2 transform">
      <div className="rounded-full border border-gray-200 bg-white p-1 shadow-lg">
        <div className="flex items-center space-x-1">
          <button
            onClick={handleToggle}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
              mapDisplayType === MapDisplayType.STORE
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            가게
          </button>
          <button
            onClick={handleToggle}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
              mapDisplayType === MapDisplayType.PARKING_LOT
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            주차장
          </button>
        </div>
      </div>
    </div>
  )
}
