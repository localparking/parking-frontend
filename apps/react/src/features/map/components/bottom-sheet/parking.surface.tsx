import React, { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMapContext } from '../../context/map-context'
import parkingLotService from '@/shared/services/parking-lot.service'
import { ParkingLotFilter } from './parking/filter.panel'
import { ParkingLotList } from './parking/list.view'
import { ParkingLotTopFilter } from './parking/top-filter.view'

export const ParkingLotContent: React.FC = () => {
  const { parkingLotSearchParams } = useMapContext()
  const { isMapReady, queryCenter, distanceLevel } = useMapContext().naverMap

  const [isFilterMode, setIsFilterMode] = React.useState(false)

  const queryKey = useMemo(
    () => ['parkingLots', 'list', parkingLotSearchParams, queryCenter, distanceLevel],
    [parkingLotSearchParams, queryCenter, distanceLevel]
  )

  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, refetch } = useInfiniteQuery({
    queryKey,
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      parkingLotService.postParkingLotMapSearch({
        ...parkingLotSearchParams,
        page: pageParam,
        lat: queryCenter!.lat,
        lon: queryCenter!.lng,
        distanceLevel: distanceLevel!,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = lastPage.data?.data?.paging?.page || 0
      const totalPages = lastPage.data?.data?.paging?.totalPages || 0
      return currentPage < totalPages - 1 ? allPages.length : undefined
    },
    enabled: isMapReady && !!queryCenter && distanceLevel !== null,
  })

  if (isFetching && !isFetchingNextPage) {
    return (
      <div className="flex flex-1 justify-center text-center text-gray-500">
        <p className="text-caption-2">주차장 목록을 불러오는 중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="mb-2 text-2xl">❌</div>
          <p className="text-caption-2">에러가 발생했습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col rounded-t-[40px] bg-white">
      {isFilterMode ? (
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex-1"></div>
            <h3 className="flex-1 text-center text-base font-semibold whitespace-nowrap text-gray-900">
              내 주변 주차장 설정
            </h3>
            <div className="flex flex-1 justify-end">
              <button onClick={() => setIsFilterMode(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <ParkingLotFilter onClose={() => setIsFilterMode(false)} />
          </div>
        </div>
      ) : (
        <>
          <ParkingLotTopFilter onFilterIconClick={() => setIsFilterMode(true)} onRefresh={refetch} />
          <div className="flex-1 overflow-y-auto">
            <ParkingLotList
              pages={data?.pages.map((p) => p.data!.data!)}
              hasNextPage={!!hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              onFetchNextPage={fetchNextPage}
            />
          </div>
        </>
      )}
    </div>
  )
}
