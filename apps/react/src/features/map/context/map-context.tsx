import { createContext, useContext, useState, ReactNode } from 'react'
import { ParkingLotSearchRequestSortEnum, StoreSearchRequestSortEnum } from '@data/user-api-axios/api'
import { useNaverMap, UseNaverMapResult } from '../hooks/use-naver-map'
import bridge from '@/shared/bridge'
import { useBridge } from '@webview-bridge/react'
import storeService from '@/shared/services/store.service'

export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export enum Congestion {
  LOW = '여유',
  MEDIUM = '보통',
  HIGH = '혼잡',
}

export enum MapDisplayType {
  STORE = 'store',
  PARKING_LOT = 'parkingLot',
}

export interface StoreSearchParams {
  sort: StoreSearchRequestSortEnum
  categoryIds?: number[]
  maxFreeMin?: number
  isOpen?: boolean
  is24Hours?: boolean
  checkDayOfWeek?: DayOfWeek
  checkTime?: string
  page: number
}

export interface ParkingLotSearchParams {
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
  naverMap: UseNaverMapResult

  // --- MapProvider에서 관리하는 앱의 비즈니스 로직 상태 및 함수 ---
  mapDisplayType: MapDisplayType
  setMapDisplayType: React.Dispatch<React.SetStateAction<MapDisplayType>>
  storeSearchParams: StoreSearchParams
  setStoreSearchParams: React.Dispatch<React.SetStateAction<StoreSearchParams>>
  parkingLotSearchParams: ParkingLotSearchParams
  setParkingLotSearchParams: React.Dispatch<React.SetStateAction<ParkingLotSearchParams>>

  // 검색어 상태 관리
  searchKeyword: string
  setSearchKeyword: React.Dispatch<React.SetStateAction<string>>

  // 브릿지에서 전달받은 인셋 정보
  insets: {
    top: number
    right: number
    bottom: number
    left: number
  }

  storeSearch: any // Store 검색 결과 데이터, 구체적인 타입은 필요에 따라 정의할 수 있습니다
}

const MapContext = createContext<MapContextType | undefined>(undefined)

export function MapProvider({ children }: { children: ReactNode }) {
  const naverMap = useNaverMap('map')

  const [mapDisplayType, setMapDisplayType] = useState<MapDisplayType>(MapDisplayType.STORE)
  const [storeSearchParams, setStoreSearchParams] = useState<StoreSearchParams>({
    sort: StoreSearchRequestSortEnum.Distance,
    page: 0,
  })
  const [parkingLotSearchParams, setParkingLotSearchParams] = useState<ParkingLotSearchParams>({
    sort: ParkingLotSearchRequestSortEnum.Distance,
    page: 0,
  })
  const [searchKeyword, setSearchKeyword] = useState<string>('')

  const {
    data: storeSearch,
    isLoading: storeLoading,
    error: storeError,
  } = storeService.useStoreMapSearch({
    query: searchKeyword,
    distanceLevel: naverMap.distanceLevel || 15,
    lat: naverMap.currentMapInfo.center.lat,
    lon: naverMap.currentMapInfo.center.lng,
    ...storeSearchParams,
  })

  const insets = useBridge(bridge.store, (state) => state.intent)

  return (
    <MapContext.Provider
      value={{
        naverMap,

        mapDisplayType,
        setMapDisplayType,

        storeSearchParams,
        setStoreSearchParams,

        parkingLotSearchParams,
        setParkingLotSearchParams,

        searchKeyword,
        setSearchKeyword,

        insets: {
          top: insets?.top || 36,
          right: insets?.right || 0,
          bottom: insets?.bottom || 0,
          left: insets?.left || 0,
        },

        storeSearch,
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
