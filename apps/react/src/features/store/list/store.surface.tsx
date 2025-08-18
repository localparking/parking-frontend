import React from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import storeService from '@/shared/services/store.service'
import { StoreFilter, StoreList, StoreTopFilter } from '.'
import { ListSurface } from '@/shared/ui/list-surface'
import { useMapContext } from '@/features/map'
import { StoreListResponse } from '@data/user-api-axios/api'

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
      getNextPageParam: (lastPage) => {
        const currentPage = lastPage.data?.data?.paging?.page || 0
        const totalPages = lastPage.data?.data?.paging?.totalPages || 0
        return currentPage < totalPages - 1 ? currentPage + 1 : undefined
      },
      enabled: !!queryCenter && distanceLevel !== null,
    })

  return (
    <ListSurface useDataQuery={useDataQuery}>
      <ListSurface.Header>
        <StoreTopFilter />
      </ListSurface.Header>

      <ListSurface.Panel>
        <StoreFilter />
      </ListSurface.Panel>

      <ListSurface.Content
        renderItem={(item: StoreListResponse) => <StoreList.Item store={item} />}
        getKey={(item: StoreListResponse) => item.storeId}
        emptyMessage="주변에 매장이 없습니다."
        loadingMessage="매장 목록을 불러오는 중..."
        errorMessage="에러가 발생했습니다."
      />
    </ListSurface>
  )
}
