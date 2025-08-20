import { useEffect, useRef } from 'react'
import { MapDisplayType, useMapContext } from '@/features/map/context/map-context'
import { useQuery } from '@tanstack/react-query'
import storeService from '@/shared/services/store.service'
import parkingLotService from '@/shared/services/parking-lot.service'
import { useNavigation } from '@/features/map/hooks'
import { StoreWithMarker, ParkingLotWithMarker } from '../utils/marker-icon'
import ReactDOMServer from 'react-dom/server'
import { StoreCategoryIcon } from '@/shared/ui/custom-icons'
import ParkingIcon from '@/assets/icons/parking.png'
import { cn } from '@ui/common/lib/utils'

const createStoreMarkerOptions = (store: StoreWithMarker, mapInstance: naver.maps.Map): naver.maps.MarkerOptions => {
  const htmlContent = ReactDOMServer.renderToString(
    <div
      className={cn(
        'absolute flex h-10 w-10 items-center justify-center rounded-full border border-gray-2 bg-white',
        store.storeType === 'PRODUCT_DETAIL' && 'z-10 border-primary-1 bg-primary-2'
      )}
    >
      <StoreCategoryIcon category={store.categories?.[0]} className="h-8 w-8" />
    </div>
  )

  return {
    position: { lat: store.lat, lng: store.lon },
    map: mapInstance,
    icon: {
      content: htmlContent,
      size: new naver.maps.Size(32, 32),
      scaledSize: new naver.maps.Size(32, 32),
      anchor: new naver.maps.Point(16, 32),
    },
  }
}

const createParkingLotMarkerOptions = (
  parkingLot: ParkingLotWithMarker,
  mapInstance: naver.maps.Map
): naver.maps.MarkerOptions => {
  const htmlContent = ReactDOMServer.renderToString(
    <div
      className={cn(
        'absolute flex h-10 w-10 items-center justify-center rounded-full border border-gray-2 bg-white',
        parkingLot.isRealtime && 'z-10 border-primary-1 bg-primary-2'
      )}
    >
      <img src={ParkingIcon} className="h-8 w-8" />
    </div>
  )

  return {
    position: { lat: parkingLot.lat, lng: parkingLot.lon },
    map: mapInstance,
    icon: {
      content: htmlContent,
      size: new naver.maps.Size(40, 40),
      scaledSize: new naver.maps.Size(40, 40),
      anchor: new naver.maps.Point(20, 40),
    },
  }
}

export const MapMarkers = () => {
  const { mapDisplayType, storeSearchParams, parkingLotSearchParams } = useMapContext()
  const { mapInstance, isMapReady, queryCenter, distanceLevel } = useMapContext().naverMap
  const { navigateToStoreDetail, navigateToParkingLotDetail } = useNavigation()

  const { data: storeData } = useQuery({
    queryKey: ['stores', 'mapSearch', storeSearchParams, queryCenter, distanceLevel],
    queryFn: async () => {
      if (!queryCenter || distanceLevel === null) return null
      const { data } = await storeService.postStoreMapSearch({
        ...storeSearchParams,
        lat: queryCenter.lat,
        lon: queryCenter.lng,
        distanceLevel,
      })
      return data
    },
    select: (data) => {
      if (!data?.data) return undefined
      const content = data.data.content?.map((store) => ({ ...store })) || []
      return { ...data.data, content }
    },
    enabled: isMapReady && mapDisplayType === MapDisplayType.STORE && !!queryCenter && distanceLevel !== null,
    placeholderData: (previousData) => previousData,
  })

  const { data: parkingLotData } = useQuery({
    queryKey: ['parkingLots', 'mapSearch', parkingLotSearchParams, queryCenter, distanceLevel],
    queryFn: async () => {
      if (!queryCenter || distanceLevel === null) return null
      const { data } = await parkingLotService.postParkingLotMapSearch({
        ...parkingLotSearchParams,
        lat: queryCenter.lat,
        lon: queryCenter.lng,
        distanceLevel,
      })
      return data
    },
    select: (data) => {
      if (!data?.data) return undefined
      const content = data.data.content?.map((lot) => ({ ...lot })) || []
      return { ...data.data, content }
    },
    enabled: isMapReady && mapDisplayType === MapDisplayType.PARKING_LOT && !!queryCenter && distanceLevel !== null,
    placeholderData: (previousData) => previousData,
  })

  const markersRef = useRef<Map<string | number, { marker: naver.maps.Marker; listener: naver.maps.MapEventListener }>>(
    new Map()
  )

  useEffect(() => {
    if (!mapInstance) return

    const currentData =
      mapDisplayType === MapDisplayType.STORE
        ? storeData?.content
        : mapDisplayType === MapDisplayType.PARKING_LOT
          ? parkingLotData?.content
          : []

    const newMarkerIds = new Set(
      currentData?.map((item) => (mapDisplayType === MapDisplayType.STORE ? item.storeId : item.parkingCode))
    )

    // 1. 기존 마커 중 새로운 데이터에 없는 마커 제거
    markersRef.current.forEach((value, id) => {
      if (!newMarkerIds.has(id)) {
        naver.maps.Event.removeListener(value.listener)
        value.marker.setMap(null)
        markersRef.current.delete(id)
      }
    })

    // 2. 새로운 데이터 중 기존에 없는 마커 추가
    currentData?.forEach((item) => {
      const id = mapDisplayType === MapDisplayType.STORE ? item.storeId : item.parkingCode
      if (!markersRef.current.has(id)) {
        let marker: naver.maps.Marker
        let listener: naver.maps.MapEventListener

        if (mapDisplayType === MapDisplayType.STORE) {
          const store = item as StoreWithMarker
          marker = new naver.maps.Marker(createStoreMarkerOptions(store, mapInstance))
          listener = naver.maps.Event.addListener(marker, 'click', () => {
            navigateToStoreDetail(store.storeId.toString())
          })
        } else {
          const parkingLot = item as ParkingLotWithMarker
          marker = new naver.maps.Marker(createParkingLotMarkerOptions(parkingLot, mapInstance))
          listener = naver.maps.Event.addListener(marker, 'click', () => {
            navigateToParkingLotDetail(parkingLot.parkingCode)
          })
        }
        markersRef.current.set(id, { marker, listener })
      }
    })
  }, [mapInstance, mapDisplayType, storeData, parkingLotData, navigateToStoreDetail, navigateToParkingLotDetail])

  // 컴포넌트 언마운트 시 모든 마커와 리스너 정리
  useEffect(() => {
    return () => {
      markersRef.current.forEach((value) => {
        naver.maps.Event.removeListener(value.listener)
        value.marker.setMap(null)
      })
      markersRef.current.clear()
    }
  }, [])

  return null
}
