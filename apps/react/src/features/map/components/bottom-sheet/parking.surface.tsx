import React from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMapContext } from '../../context/map-context'
import parkingLotService from '@/shared/services/parking-lot.service'
import { ParkingLotFilter } from './parking/filter.panel'
import { ParkingLotList } from './parking/list.view'
import { ParkingLotTopFilter } from './parking/top-filter.view'
import { ListSurface } from './generic/list-surface'

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
    })

  return (
    <ListSurface
      useDataQuery={useDataQuery}
      TopFilterComponent={ParkingLotTopFilter}
      FilterPanelComponent={ParkingLotFilter}
      ListComponent={ParkingLotList}
      loadingMessage="주차장 목록을 불러오는 중..."
      errorMessage="에러가 발생했습니다."
    />
  )
}
