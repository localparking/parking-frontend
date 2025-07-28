import { createContext, useContext, useState, ReactNode } from 'react'
import {
  PageResponseStoreListResponse,
  ParkingLotSearchRequestSortEnum,
  StoreSearchRequestSortEnum,
} from '@data/user-api-axios/api'
import { MapInfo, useNaverMap } from '../hooks/use-naver-map'
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

enum MapDisplayType {
  STORE = 'store',
  PARKING_LOT = 'parkingLot',
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
  // --- useNaverMap에서 직접 제공하는 상태 및 함수 ---
  isMapReady: boolean
  mapInstance: naver.maps.Map | null
  currentMapInfo: MapInfo
  queryCenter: MapInfo['center'] | null
  moveToCurrentLocation: () => void
  setZoom: (newZoom: number) => void
  moveTo: (position: naver.maps.CoordLiteral, zoom?: number) => void

  // --- MapProvider에서 관리하는 앱의 비즈니스 로직 상태 및 함수 ---
  mapDisplayType: MapDisplayType
  setMapDisplayType: React.Dispatch<React.SetStateAction<MapDisplayType>>
  storeSearchParams: StoreSearchParams
  setStoreSearchParams: React.Dispatch<React.SetStateAction<StoreSearchParams>>
  parkingLotSearchParams: ParkingLotSearchParams
  setParkingLotSearchParams: React.Dispatch<React.SetStateAction<ParkingLotSearchParams>>

  // --- API 데이터 관련 상태 ---
  storeData?: PageResponseStoreListResponse
  isStoreDataLoading: boolean
  storeDataError?: Error | null
}

const MapContext = createContext<MapContextType | undefined>(undefined)

export function MapProvider({ children }: { children: ReactNode }) {
  const { isMapReady, mapInstance, currentMapInfo, queryCenter, moveTo, setZoom, moveToCurrentLocation } =
    useNaverMap('map')

  const [mapDisplayType, setMapDisplayType] = useState<MapDisplayType>(MapDisplayType.STORE)
  const [storeSearchParams, setStoreSearchParams] = useState<StoreSearchParams>({
    sort: StoreSearchRequestSortEnum.Distance,
    page: 0,
  })
  const [parkingLotSearchParams, setParkingLotSearchParams] = useState<ParkingLotSearchParams>({
    sort: ParkingLotSearchRequestSortEnum.Distance,
    page: 0,
  })

  // TODO: useInfiniteQuery로 변경 필요 (무한 스크롤)
  const {
    data: storeData,
    isLoading: isStoreDataLoading,
    error: storeDataError,
  } = useQuery({
    queryKey: ['stores', 'mapSearch', storeSearchParams, queryCenter],
    queryFn: async () => {
      if (!isMapReady || !queryCenter) {
        return null
      }

      const { data } = await storeService.postStoreMapSearch({
        ...storeSearchParams,
        lat: queryCenter.lat,
        lon: queryCenter.lng,
      })
      return data
    },
    select: (data) => data?.data,
    enabled: isMapReady && mapDisplayType === MapDisplayType.STORE && !!queryCenter,
  })

  return (
    <MapContext.Provider
      value={{
        // useNaverMap에서 온 값들
        isMapReady,
        mapInstance,
        currentMapInfo,
        queryCenter,
        moveToCurrentLocation,
        setZoom,
        moveTo,

        // Provider가 직접 관리하는 값들
        mapDisplayType,
        setMapDisplayType,
        storeSearchParams,
        setStoreSearchParams,
        parkingLotSearchParams,
        setParkingLotSearchParams,

        // useQuery에서 온 값들
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
