import { useNavigate } from '@tanstack/react-router'
import { MapDisplayType, useMapContext } from '@/features/map/context/map-context'
import { StoreListResponse, SearchItemResponse } from '@data/user-api-axios/api'
import searchService from '@/shared/services/search.service'
import storeService from '@/shared/services/store.service'
import parkingLotService from '@/shared/services/parking-lot.service'
import StatusBadge from '@/shared/ui/status-badge'
import { SearchParkingItem, SearchStoreItem } from './ui/search-item'

interface SearchResultsProps {
  query: string
}

export const SearchResults = ({ query }: SearchResultsProps) => {
  const { setSearchKeyword, searchKeyword, storeSearchParams, parkingLotSearchParams, mapDisplayType } = useMapContext()
  const { distanceLevel, currentMapInfo, moveTo } = useMapContext().naverMap

  const { data: storeData } = storeService.useStoreKeywordSearch({
    body: {
      query: searchKeyword,
      distanceLevel: distanceLevel || 15,
      lat: currentMapInfo.center.lat,
      lon: currentMapInfo.center.lng,
      ...storeSearchParams,
    },
    enabled: !!searchKeyword && searchKeyword.length > 0 && mapDisplayType === MapDisplayType.STORE,
  })

  const { data: parkingLotData } = parkingLotService.useParkingLotKeywordSearch({
    body: {
      query: searchKeyword,
      distanceLevel: distanceLevel || 15,
      lat: currentMapInfo.center.lat,
      lon: currentMapInfo.center.lng,
      ...parkingLotSearchParams,
    },
    enabled: !!searchKeyword && searchKeyword.length > 0 && mapDisplayType === MapDisplayType.PARKING_LOT,
  })

  const { data: naverSearch, isLoading: naverLoading, error: naverError } = searchService.useNaverSearch(query)

  const navigate = useNavigate()

  const handleItemClick = ({
    lat,
    lng,
    search,
  }: {
    lat: number
    lng: number
    search?: { parkingLotId?: string; storeId?: string }
  }) => {
    moveTo({ lat, lng }, 15)
    setSearchKeyword(query)
    navigate({ to: '/map', replace: true, search })
  }

  const hasStores = storeData && storeData.length > 0
  const hasParkingLots = parkingLotData && parkingLotData.length > 0
  const hasNaverResults = naverSearch && naverSearch.length > 0
  const stores = hasStores ? storeData.slice(0, 3) : []
  const parkings = hasParkingLots ? parkingLotData.slice(0, 3) : []

  if (naverLoading) {
    return (
      <div className="flex h-full justify-center">
        <p className="pt-12 text-gray-2">검색 중입니다...</p>
      </div>
    )
  }

  if (naverError) {
    return (
      <div className="flex h-full justify-center">
        <p className="pt-12 text-red-500">
          오류가 발생했습니다.
          <br />
          {naverError.message}
        </p>
      </div>
    )
  }

  if (!hasStores && !hasNaverResults) {
    return (
      <div className="flex h-full justify-center">
        <p className="pt-12 text-gray-2">검색 결과가 없습니다.</p>
      </div>
    )
  }

  const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, '')

  return (
    <>
      {/* 매장 리스트 */}
      {hasStores && (
        <div className="mb-6">
          <h2 className="text-body-4">추천 매장</h2>

          {stores.map((store) => (
            <SearchStoreItem key={store.storeId} store={store} />
          ))}
        </div>
      )}

      {hasParkingLots && (
        <div className="mb-6">
          <h2 className="text-body-5 font-bold">추천 주차장</h2>
          {parkings.map((parking) => (
            <SearchParkingItem key={parking.parkingCode} parking={parking} />
          ))}
        </div>
      )}

      {/* 네이버 검색 결과 */}
      {hasNaverResults && (
        <div>
          <h2 className="text-body-4">검색 결과</h2>
          {naverSearch.map((item, index) => (
            <div
              key={index}
              onClick={() => handleItemClick({ lat: item.lat / 10000000, lng: item.lon / 10000000 })}
              className="cursor-pointer"
            >
              <div className="py-4">
                <h3 className="text-body-5 font-semibold">{stripHtml(item.title)}</h3>
                <p className="mt-2 text-caption-2 text-gray-3">{item.roadAddress}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
