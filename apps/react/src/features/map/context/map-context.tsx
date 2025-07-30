import { createContext, useContext, useState, ReactNode } from 'react'
import { ParkingLotSearchRequestSortEnum, StoreSearchRequestSortEnum } from '@data/user-api-axios/api'
import { MapInfo, useNaverMap, DistanceLevel } from '../hooks/use-naver-map'
import bridge from '@/shared/bridge'
import { useBridge } from '@webview-bridge/react'

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

export enum MapDisplayType {
  STORE = 'store',
  PARKING_LOT = 'parkingLot',
}

export interface StoreSearchParams {
  sort: StoreSearchRequestSortEnum
  categoryId?: number
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
  isMapReady: boolean
  mapInstance: naver.maps.Map | null
  currentMapInfo: MapInfo
  queryCenter: MapInfo['center'] | null
  moveToCurrentLocation: () => void
  setZoom: (newZoom: number) => void
  moveTo: (position: naver.maps.LatLngObjectLiteral, zoom?: number) => void
  distanceLevel: DistanceLevel

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
}

const MapContext = createContext<MapContextType | undefined>(undefined)

export function MapProvider({ children }: { children: ReactNode }) {
  const {
    isMapReady,
    mapInstance,
    currentMapInfo,
    queryCenter,
    moveTo,
    setZoom,
    moveToCurrentLocation,
    distanceLevel,
  } = useNaverMap('map')

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

  const insets = useBridge(bridge.store, (state) => state.intent)

  return (
    <MapContext.Provider
      value={{
        isMapReady,
        mapInstance,
        currentMapInfo,
        queryCenter,
        moveToCurrentLocation,
        setZoom,
        moveTo,
        distanceLevel,
        mapDisplayType,
        setMapDisplayType,
        storeSearchParams,
        setStoreSearchParams,
        parkingLotSearchParams,
        setParkingLotSearchParams,
        searchKeyword,
        setSearchKeyword,
        insets,
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
