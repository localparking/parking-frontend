import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { ParkingLotSearchRequestSortEnum, StoreSearchRequestSortEnum } from '@data/user-api-axios/api'
import { useNaverMap, UseNaverMapResult } from '../hooks/use-naver-map'
import { useBottomSheet } from '@/shared/context/bottom-sheet-context'

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

  // 필터 리셋 유틸
  resetStoreFilters: () => void
  resetParkingLotFilters: () => void
}

const MapContext = createContext<MapContextType | undefined>(undefined)

export function MapProvider({ children }: { children: ReactNode }) {
  const { activeSnapIndex, setActiveSnapIndex } = useBottomSheet()
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

  useEffect(() => {
    if (!naverMap.isMapReady || !naverMap.mapInstance) return

    const handleInteraction = () => {
      if (activeSnapIndex === 0) {
        setActiveSnapIndex(1)
      } else if (activeSnapIndex === 1) {
        setActiveSnapIndex(2)
      }
    }

    const clickListener = naver.maps.Event.addListener(naverMap.mapInstance, 'click', handleInteraction)
    const dragStartListener = naver.maps.Event.addListener(naverMap.mapInstance, 'dragstart', handleInteraction)

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      naver.maps.Event.removeListener(clickListener)
      naver.maps.Event.removeListener(dragStartListener)
    }
  }, [naverMap.isMapReady, naverMap.mapInstance, activeSnapIndex, setActiveSnapIndex])

  const resetStoreFilters = () => {
    setStoreSearchParams((prev) => ({ sort: prev.sort, page: 0 }))
  }

  const resetParkingLotFilters = () => {
    setParkingLotSearchParams((prev) => ({ sort: prev.sort, page: 0 }))
  }

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

        resetStoreFilters,
        resetParkingLotFilters,
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
