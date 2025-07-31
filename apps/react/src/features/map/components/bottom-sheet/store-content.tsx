import React, { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMapContext } from '../../context/map-context'
import storeService from '@/shared/services/store.service'

import { StoreList } from './store-list'
import { StoreFilter } from './store-filter'
import { StoreTopFilter } from './store-list-top'

export const StoreContent: React.FC = () => {
  const { queryCenter, storeSearchParams, distanceLevel } = useMapContext()

  const [isFilterMode, setIsFilterMode] = React.useState(false)

  const queryKey = useMemo(
    () => ['stores', 'list', storeSearchParams, queryCenter, distanceLevel],
    [storeSearchParams, queryCenter, distanceLevel]
  )

  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, refetch } = useInfiniteQuery({
    queryKey,
    initialPageParam: 0,
    queryFn: ({ pageParam }) => {
      return storeService.postStoreMapSearch({
        ...storeSearchParams,
        page: pageParam,
        lat: queryCenter!.lat,
        lon: queryCenter!.lng,
        distanceLevel: distanceLevel!,
      })
    },
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = lastPage.data?.data?.paging?.page || 0
      const totalPages = lastPage.data?.data?.paging?.totalPages || 0
      return currentPage < totalPages - 1 ? allPages.length : undefined
    },
    enabled: true,
  })

  if (isFetching && !isFetchingNextPage) {
    return (
      <div className="flex flex-1 justify-center text-center text-gray-500">
        <p className="text-sm">가게 목록을 불러오는 중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="mb-2 text-2xl">❌</div>
          <p className="text-sm">에러가 발생했습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col rounded-t-[40px] bg-white">
      {isFilterMode ? (
        // 필터 모드 UI
        <div className="flex flex-col">
          {/* 필터 헤더 */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div className="flex-1"></div>
            <h3 className="flex-1 text-center text-base font-semibold whitespace-nowrap text-gray-900">
              내 주변 조건 설정
            </h3>
            <div className="flex flex-1 justify-end">
              <button onClick={() => setIsFilterMode(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
          </div>

          {/* 필터 내용 */}
          <div className="flex-1 overflow-y-auto p-4">
            <StoreFilter onClose={() => setIsFilterMode(false)} />
          </div>
        </div>
      ) : (
        <>
          <StoreTopFilter onFilterIconClick={() => setIsFilterMode(true)} onRefresh={refetch} />
          <div className="flex-1 overflow-y-auto">
            <StoreList
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
