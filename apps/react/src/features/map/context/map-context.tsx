import { createContext, useContext, useState, ReactNode } from 'react'
import {
  PageResponseStoreListResponse,
  ParkingLotSearchRequestSortEnum,
  ResponseDtoPageResponseStoreListResponse,
  StoreSearchRequestSortEnum,
} from '@data/user-api-axios/api'
import { useNaverMap } from '../hooks/use-naver-map'
import storeService from '@/shared/services/store.service'
import { useQuery } from '@tanstack/react-query'

enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

enum Congestion {
  LOW = '여유',
  MEDIUM = '보통',
  HIGH = '혼잡',
}

interface StoreSearchParams {
  sort: StoreSearchRequestSortEnum
  categoryId?: number
  maxFreeMin?: number
  isOpen?: boolean
  is24Hours?: boolean
  checkDayOfWeek?: DayOfWeek
  checkTime?: string
  page: number
}

interface ParkingLotSearchParams {
  sort: ParkingLotSearchRequestSortEnum
  isFree?: boolean
  isRealtime?: boolean
  congestion?: Congestion[]
  maxFeePerHour?: number
  isOpen?: boolean
  is24Hours?: boolean
  checkDayOfWeek?: DayOfWeek
  checkTime?: string
  page: number
}

interface MapContextType {
  isMapReady: boolean
  storeSearchParams: StoreSearchParams
  setStoreSearchParams: React.Dispatch<React.SetStateAction<StoreSearchParams>>
  parkingLotSearchParams: ParkingLotSearchParams
  setParkingLotSearchParams: React.Dispatch<React.SetStateAction<ParkingLotSearchParams>>
  storeData?: PageResponseStoreListResponse
  isStoreDataLoading: boolean
  storeDataError?: Error | null
}

const MapContext = createContext<MapContextType | undefined>(undefined)

export function MapProvider({ children }: { children: ReactNode }) {
  const [storeSearchParams, setStoreSearchParams] = useState<StoreSearchParams>({
    sort: StoreSearchRequestSortEnum.Distance,
    page: 0,
  })
  const [parkingLotSearchParams, setParkingLotSearchParams] = useState<ParkingLotSearchParams>({
    sort: ParkingLotSearchRequestSortEnum.Distance,
    page: 0,
  })

  const { moveTo, currentMapInfo, isMapReady } = useNaverMap()

  const {
    data: storeData,
    isLoading: isStoreDataLoading,
    error: storeDataError,
  } = useQuery({
    queryKey: ['stores', 'mapSearch', storeSearchParams, currentMapInfo.center],
    queryFn: async () => {
      const { data } = await storeService.postStoreMapSearch({
        ...storeSearchParams,
        lat: currentMapInfo.center.lat,
        lon: currentMapInfo.center.lng,
      })
      return data
    },
    select: (data: ResponseDtoPageResponseStoreListResponse) => data.data,
    enabled: isMapReady,
  })

  return (
    <MapContext.Provider
      value={{
        isMapReady,
        storeSearchParams,
        setStoreSearchParams,
        parkingLotSearchParams,
        setParkingLotSearchParams,
        storeData,
        isStoreDataLoading,
        storeDataError,
      }}
    >
      {children}
    </MapContext.Provider>
  )
}

// 커스텀 훅
export function useMapContext() {
  const context = useContext(MapContext)
  if (context === undefined) {
    throw new Error('useMapContext must be used within a MapProvider')
  }
  return context
}
