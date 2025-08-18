import React from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import parkingLotService from '@/shared/services/parking-lot.service'
import { useMapContext } from '@/features/map'
import { ListSurface } from '@/shared/ui/list-surface'
import { ParkingLotFilter, ParkingLotList, ParkingLotTopFilter } from '.'
import { ParkingLotListResponse } from '@data/user-api-axios/api'

export const ParkingLotContent: React.FC = () => {
  const { parkingLotSearchParams } = useMapContext()
  const { isMapReady, queryCenter, distanceLevel } = useMapContext().naverMap

  const useDataQuery = () =>
    useInfiniteQuery({
      queryKey: ['parkingLots', 'list', parkingLotSearchParams, queryCenter, distanceLevel],
      initialPageParam: 0,
      queryFn: ({ pageParam }) =>
        parkingLotService.postParkingLotMapSearch({
          ...parkingLotSearchParams,
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
      enabled: isMapReady && !!queryCenter && distanceLevel !== null,
      placeholderData: (previousData) => previousData,
    })

  return (
    <ListSurface useDataQuery={useDataQuery}>
      <ListSurface.Header>
        <ParkingLotTopFilter />
      </ListSurface.Header>

      <ListSurface.Panel>
        <ParkingLotFilter />
      </ListSurface.Panel>

      <ListSurface.Content
        renderItem={(item: ParkingLotListResponse) => <ParkingLotList.Item parkingLot={item} />}
        getKey={(item: ParkingLotListResponse) => item.parkingCode}
        emptyMessage="주변에 주차장이 없습니다."
        loadingMessage="주차장 목록을 불러오는 중..."
        errorMessage="에러가 발생했습니다."
      />
    </ListSurface>
  )
}
