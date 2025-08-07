import { useNavigate } from '@tanstack/react-router'
import { MapDisplayType, useMapContext } from '@/features/map/context/map-context'
import { StoreListResponse, SearchItemResponse } from '@data/user-api-axios/api'
import searchService from '@/shared/services/search.service'
import storeService from '@/shared/services/store.service'
import parkingLotService from '@/shared/services/parking-lot.service'

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
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-2">검색 중입니다...</p>
      </div>
    )
  }

  if (naverError) {
    return (
      <div className="flex h-full items-center justify-center text-center">
        <p className="text-red-500">
          오류가 발생했습니다.
          <br />
          {naverError.message}
        </p>
      </div>
    )
  }

  if (!hasStores && !hasNaverResults) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-2">검색 결과가 없습니다.</p>
      </div>
    )
  }

  const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, '')

  return (
    <>
      {/* 가게 리스트 */}
      {hasStores && (
        <div className="mb-6">
          <h2 className="text-body-5 font-bold">추천 가게</h2>
          <ul className="divide-gray-08 mt-2 divide-y">
            {stores.map((store) => (
              <li
                key={store.storeId}
                className="cursor-pointer py-4"
                onClick={() =>
                  handleItemClick({ lat: store.lat, lng: store.lon, search: { storeId: store.storeId.toString() } })
                }
              >
                <h3 className="text-body-5 font-semibold">{store.name}</h3>
                <p className="mt-1 text-caption-2 text-gray-3">{store.address}</p>
                <div className="mt-2 flex gap-1">
                  {store.categories && store.categories[0]?.categoryName && (
                    <span className="bg-gray-08 rounded px-2 py-1 text-caption-2 text-gray-2">
                      {store.categories[0].categoryName}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {hasParkingLots && (
        <div className="mb-6">
          <h2 className="text-body-5 font-bold">추천 주차장</h2>
          <ul className="divide-gray-08 mt-2 divide-y">
            {parkings.map((parking) => (
              <li
                key={parking.parkingCode}
                className="cursor-pointer py-4"
                onClick={() =>
                  handleItemClick({ lat: parking.lat, lng: parking.lon, search: { parkingLotId: parking.parkingCode } })
                }
              >
                <h3 className="text-body-5 font-semibold">{parking.name}</h3>
                <p className="mt-1 text-caption-2 text-gray-3">{parking.address}</p>
                <div className="mt-2 flex gap-1">
                  {parking && parking.hourlyFee && (
                    <span className="bg-gray-08 rounded px-2 py-1 text-caption-2 text-gray-2">
                      1시간당 {parking.hourlyFee}원
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 네이버 검색 결과 */}
      {hasNaverResults && (
        <div>
          <hr className="my-4" />
          <ul className="divide-gray-08 mt-2 divide-y">
            {naverSearch.map((item, index) => (
              <div
                key={index}
                onClick={() => handleItemClick({ lat: item.lat / 10000000, lng: item.lon / 10000000 })}
                className="cursor-pointer"
              >
                <li className="py-4">
                  <h3 className="text-body-5 font-semibold">{stripHtml(item.title)}</h3>
                  <p className="mt-2 text-caption-2 text-gray-3">{item.roadAddress}</p>
                </li>
              </div>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
