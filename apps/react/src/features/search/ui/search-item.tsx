import { useMapContext, useNavigation } from '@/features/map'
import StatusBadge from '@/shared/ui/status-badge'
import { formatPrice } from '@/shared/utils'
import { ParkingLotListResponse, StoreListResponse } from '@data/user-api-axios/api'

interface SearchStoreItemProps {
  store: StoreListResponse
}

export function SearchStoreItem({ store }: SearchStoreItemProps) {
  const { navigateToStoreDetail } = useNavigation()
  const { moveTo } = useMapContext().naverMap

  return (
    <div
      className="flex cursor-pointer gap-3 py-3"
      onClick={() => {
        moveTo({ lat: store.lat, lng: store.lon })
        navigateToStoreDetail(store.storeId.toString())
      }}
    >
      <div className="flex flex-1 flex-col gap-1">
        {store.categories?.[0]?.categoryName && (
          <p className="text-caption-3 text-gray-500">{store.categories[0].categoryName}</p>
        )}
        <div className="flex items-center justify-start gap-[5px] pr-[55px]">
          <h3 className="text-body-4 text-gray-1">{store.name}</h3>
          <StatusBadge isOpen={store.isOpen} />
        </div>
        <p className="text-caption-2 text-gray-2">{store.address}</p>
      </div>
    </div>
  )
}

interface SearchParkingItemProps {
  parking: ParkingLotListResponse
}

export function SearchParkingItem({ parking }: SearchParkingItemProps) {
  const { navigateToParkingLotDetail } = useNavigation()
  const { moveTo } = useMapContext().naverMap

  return (
    <div
      className="flex cursor-pointer items-center gap-6 py-6"
      onClick={() => {
        moveTo({ lat: parking.lat, lng: parking.lon })
        navigateToParkingLotDetail(parking.parkingCode)
      }}
    >
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <h3 className="text-body-4 text-gray-1">{parking.name}</h3>
          <StatusBadge isOpen={parking.isOpen} />
        </div>
        <p className="text-caption-2 text-gray-2">{parking.address}</p>
      </div>

      <div className="flex h-fit flex-col items-center gap-0.5 rounded-[5px] bg-gray-4 px-1.5 py-1">
        <span className="text-caption-3 text-gray-2">1시간당 요금</span>
        <span className="text-caption-2 text-gray-1">{formatPrice(parking.hourlyFee || 0)}</span>
      </div>
    </div>
  )
}
