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

const createStoreMarkerOptions = (store: StoreWithMarker, mapInstance: naver.maps.Map): naver.maps.MarkerOptions => {
  const htmlContent = ReactDOMServer.renderToString(
    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-2 bg-white">
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
    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-2 bg-white">
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
  })

  const markersRef = useRef<naver.maps.Marker[]>([])
  const listenersRef = useRef<naver.maps.MapEventListener[]>([])

  useEffect(() => {
    if (!mapInstance) return

    listenersRef.current.forEach((listener) => naver.maps.Event.removeListener(listener))
    listenersRef.current = []
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    const currentData =
      mapDisplayType === MapDisplayType.STORE
        ? storeData?.content
        : mapDisplayType === MapDisplayType.PARKING_LOT
          ? parkingLotData?.content
          : null

    if (!currentData) return

    const newMarkers = currentData.map((item) => {
      let marker: naver.maps.Marker

      if (mapDisplayType === MapDisplayType.STORE) {
        const store = item as StoreWithMarker
        const options = createStoreMarkerOptions(store, mapInstance)
        marker = new naver.maps.Marker(options)

        const listener = naver.maps.Event.addListener(marker, 'click', () => {
          navigateToStoreDetail(store.storeId.toString())
        })
        listenersRef.current.push(listener)
      } else {
        const parkingLot = item as ParkingLotWithMarker
        const options = createParkingLotMarkerOptions(parkingLot, mapInstance)
        marker = new naver.maps.Marker(options)

        const listener = naver.maps.Event.addListener(marker, 'click', () => {
          navigateToParkingLotDetail(parkingLot.parkingCode)
        })
        listenersRef.current.push(listener)
      }
      return marker
    })

    markersRef.current = newMarkers
  }, [mapInstance, mapDisplayType, storeData, parkingLotData, navigateToStoreDetail, navigateToParkingLotDetail])

  return null
}
