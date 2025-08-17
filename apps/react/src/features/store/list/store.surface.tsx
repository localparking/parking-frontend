import React from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import storeService from '@/shared/services/store.service'
import { StoreFilter, StoreList, StoreTopFilter } from '.'
import { ListSurface } from '@/shared/ui/list-surface'
import { useMapContext } from '@/features/map'

export const StoreContent: React.FC = () => {
  const { storeSearchParams, naverMap } = useMapContext()
  const { queryCenter, distanceLevel } = naverMap

  const useDataQuery = () =>
    useInfiniteQuery({
      queryKey: ['stores', 'list', storeSearchParams, queryCenter, distanceLevel],
      initialPageParam: 0,
      queryFn: ({ pageParam }) =>
        storeService.postStoreMapSearch({
          ...storeSearchParams,
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
      enabled: true,
    })

  return (
    <ListSurface
      useDataQuery={useDataQuery}
      TopFilterComponent={StoreTopFilter}
      FilterPanelComponent={StoreFilter}
      ListComponent={StoreList}
      loadingMessage="매장 목록을 불러오는 중..."
      errorMessage="에러가 발생했습니다."
    />
  )
}
