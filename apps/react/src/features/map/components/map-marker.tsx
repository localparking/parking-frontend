import { useEffect, useRef } from 'react'
import { MapDisplayType, useMapContext } from '../context/map-context'
import { useCategoryContext } from '@/shared/context/category-context'
import { StoreListResponse, ParkingLotListResponse } from '@data/user-api-axios/api'
import { getMarkerIconUrl } from '../utils/marker-assets'
import { useQuery } from '@tanstack/react-query'
import storeService from '@/shared/services/store.service'
import parkingLotService from '@/shared/services/parking-lot.service'

const getMarkerAssetForStore = (store: StoreListResponse, prefixMap: Map<number, string>): string => {
  const parentCategoryId = store.categories?.[0]?.parentId
  const categoryPrefix = parentCategoryId ? prefixMap.get(parentCategoryId) || 'store' : 'store'

  let stateSuffix = 'basic'
  if (store.storeType === 'COALITION') {
    stateSuffix = 'partner'
  } else if (store.discountMin && store.discountMin > 0) {
    stateSuffix = 'detail'
  }
  return `${categoryPrefix}-${stateSuffix}.svg`
}

const createStoreMarkerOptions = (
  store: StoreListResponse,
  prefixMap: Map<number, string>,
  mapInstance: naver.maps.Map
): naver.maps.MarkerOptions => {
  const iconFileName = getMarkerAssetForStore(store, prefixMap)
  const iconUrl = getMarkerIconUrl(iconFileName)
  return {
    position: { lat: store.lat, lng: store.lon },
    map: mapInstance,
    icon: {
      url: iconUrl,
      size: new window.naver.maps.Size(40, 40),
      scaledSize: new window.naver.maps.Size(40, 40),
      anchor: new window.naver.maps.Point(20, 40),
    },
  }
}

const createParkingLotMarkerOptions = (
  parkingLot: ParkingLotListResponse,
  mapInstance: naver.maps.Map
): naver.maps.MarkerOptions => {
  const iconUrl = getMarkerIconUrl('parking-detail.svg')
  return {
    position: { lat: parkingLot.lat, lng: parkingLot.lon },
    map: mapInstance,
    icon: {
      url: iconUrl,
      size: new window.naver.maps.Size(40, 40),
      scaledSize: new window.naver.maps.Size(40, 40),
      anchor: new window.naver.maps.Point(20, 40),
    },
  }
}

export const MapMarkers = () => {
  const { mapInstance, mapDisplayType, queryCenter, storeSearchParams, parkingLotSearchParams, isMapReady } =
    useMapContext()
  const { parentIdToPrefixMap } = useCategoryContext()

  const { data: storeData } = useQuery({
    queryKey: ['stores', 'mapSearch', storeSearchParams, queryCenter],
    queryFn: async () => {
      if (!queryCenter) return null
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

  const { data: parkingLotData } = useQuery({
    queryKey: ['parkingLots', 'mapSearch', parkingLotSearchParams, queryCenter],
    queryFn: async () => {
      if (!queryCenter) return null
      const { data } = await parkingLotService.postParkingLotMapSearch({
        ...parkingLotSearchParams,
        lat: queryCenter.lat,
        lon: queryCenter.lng,
      })
      return data
    },
    select: (data) => data?.data,
    enabled: isMapReady && mapDisplayType === MapDisplayType.PARKING_LOT && !!queryCenter,
  })

  const markersRef = useRef<naver.maps.Marker[]>([])
  const listenersRef = useRef<naver.maps.MapEventListener[]>([])

  useEffect(() => {
    if (!mapInstance) return

    listenersRef.current.forEach((listener) => window.naver.maps.Event.removeListener(listener))
    listenersRef.current = []
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    const currentData =
      mapDisplayType === 'store' ? storeData?.content : mapDisplayType === 'parkingLot' ? parkingLotData?.content : null

    if (!currentData) {
      return
    }

    const newMarkers = currentData.map((item) => {
      let marker: naver.maps.Marker

      if (mapDisplayType === 'store') {
        const store = item as StoreListResponse
        const options = createStoreMarkerOptions(store, parentIdToPrefixMap, mapInstance)
        marker = new window.naver.maps.Marker(options)

        const listener = window.naver.maps.Event.addListener(marker, 'click', () => {
          console.log(`Store ID: ${store.storeId}, Name: ${store.name}`)
          //Todo 가게 상세 페이지로 이동
        })
        listenersRef.current.push(listener)
      } else {
        const parkingLot = item as ParkingLotListResponse
        const options = createParkingLotMarkerOptions(parkingLot, mapInstance)
        marker = new window.naver.maps.Marker(options)

        const listener = window.naver.maps.Event.addListener(marker, 'click', () => {
          console.log(`${parkingLot.name} 주차장 마커 클릭됨`)
          //Todo 주차장 상세 페이지로 이동
        })
        listenersRef.current.push(listener)
      }
      return marker
    })

    markersRef.current = newMarkers
  }, [mapInstance, mapDisplayType, storeData, parkingLotData, parentIdToPrefixMap])

  return null
}
