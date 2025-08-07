import React, { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMapContext } from '../../context/map-context'
import storeService from '@/shared/services/store.service'

import { StoreList } from './store-list'
import { StoreFilter } from './store-filter'
import { StoreTopFilter } from './store-list-top'

export const StoreContent: React.FC = () => {
  const { storeSearchParams } = useMapContext()
  const { queryCenter, distanceLevel } = useMapContext().naverMap

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

  const renderContent = () => {
    if (isFetching && !isFetchingNextPage) {
      return (
        <div className="flex flex-1 items-center justify-center text-center text-gray-500">
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
      <StoreList
        pages={data?.pages.map((p) => p.data!.data!)}
        hasNextPage={!!hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onFetchNextPage={fetchNextPage}
      />
    )
  }

  return (
    <div className="flex h-full flex-col rounded-t-[40px] bg-white">
      {isFilterMode ? (
        <div className="flex flex-1 flex-col gap-[25px] px-4">
          <h3 className="text-center text-body-5">내 주변 조건 설정</h3>
          <StoreFilter onClose={() => setIsFilterMode(false)} />
        </div>
      ) : (
        <>
          <StoreTopFilter onFilterIconClick={() => setIsFilterMode(true)} onRefresh={refetch} />
          <div className="flex-1 overflow-y-auto">{renderContent()}</div>
        </>
      )}
    </div>
  )
}
