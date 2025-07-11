import React, { useState } from 'react'
import { MapContainer } from './map-container'
import { useMap } from '../hooks/use-map'
import { useMapNavigation } from '../hooks/use-map-navigation'
import { useMarkers } from '../hooks/use-markers'
import { geocodeAddress } from '../services'
import { MarkerData } from '../model/marker.types'

export const MapFeature: React.FC = () => {
  const { isMapLoaded, moveToCurrentLocation } = useMap()
  const { moveTo, fitToCoordinates } = useMapNavigation()
  const { addMarkersFromAddresses } = useMarkers()

  const [markers, setMarkers] = useState<MarkerData[]>([])

  // 중복 마커 체크 (좌표 기반)
  const isDuplicateMarker = (newMarker: MarkerData, existingMarkers: MarkerData[]): boolean => {
    return existingMarkers.some(
      (marker) =>
        Math.abs(marker.lat - newMarker.lat) < 0.0001 && // 약 10m 정확도
        Math.abs(marker.lng - newMarker.lng) < 0.0001
    )
  }

  // 중복 제거된 마커들만 추가
  const addUniqueMarkers = (newMarkers: MarkerData[]) => {
    setMarkers((prev) => {
      const uniqueMarkers = newMarkers.filter((newMarker) => !isDuplicateMarker(newMarker, prev))

      if (uniqueMarkers.length === 0) {
        console.log('모든 마커가 이미 존재합니다.')
        return prev
      }

      console.log(`${uniqueMarkers.length}개의 새로운 마커가 추가됩니다.`)
      return [...prev, ...uniqueMarkers]
    })
  }

  // 여러 주소로 마커들 생성 예시
  const addMultipleAddressMarkers = async () => {
    const addressMarkers = [
      {
        id: `address-1-${Date.now()}`,
        address: '서울특별시 중구 명동길 74',
        title: '명동 성당',
      },
      {
        id: `address-2-${Date.now()}`,
        address: '서울특별시 중구 세종대로 110',
        title: '서울시청 (주소 기반)',
      },
      {
        id: `address-3-${Date.now()}`,
        address: '서울특별시 종로구 사직로 161',
        title: '경복궁 (주소 기반)',
      },
    ]

    await addMarkersFromAddresses(addressMarkers)
    const coordinates = await Promise.all(
      addressMarkers.map(async (marker) => {
        const result = await geocodeAddress(marker.address)
        return { lat: result.lat, lng: result.lng }
      })
    )

    const newMarkers = coordinates.map((coord, index) => {
      const marker = addressMarkers[index]
      return {
        id: marker?.id || `address-${index}`,
        lat: coord.lat,
        lng: coord.lng,
        title: marker?.title || `마커 ${index + 1}`,
      }
    })

    addUniqueMarkers(newMarkers)
    fitToCoordinates(coordinates, 50)
  }

  // 여러 좌표를 포함하는 fitToCoordinates 예시
  const showFitToCoordinatesExample = () => {
    const touristSpots = [
      { lat: 37.5666103, lng: 126.9783882, title: '서울시청' },
      { lat: 37.4979, lng: 127.0276, title: '강남역' },
      { lat: 37.5633352, lng: 126.9872743, title: '명동' },
      { lat: 37.5788408, lng: 126.9770162, title: '경복궁' },
      { lat: 37.5208, lng: 127.1232, title: '롯데월드타워' },
    ]

    const coordinates = touristSpots.map((spot) => ({ lat: spot.lat, lng: spot.lng }))
    fitToCoordinates(coordinates, 50)

    const newMarkers = touristSpots.map((spot, index) => ({
      id: `tourist-spot-${index + 1}-${Date.now()}`,
      lat: spot.lat,
      lng: spot.lng,
      title: spot.title,
    }))

    addUniqueMarkers(newMarkers)
  }

  const clearAllMarkers = () => {
    setMarkers([])
    console.log('모든 마커가 삭제되었습니다.')
  }

  return (
    <MapContainer markers={markers}>
      <div className="absolute top-5 right-5 z-[1000] flex flex-col gap-2">
        <div className="rounded-md bg-white/90 px-3 py-2 text-body-03 font-medium text-gray-800 shadow-lg">
          마커 개수: {markers.length}
        </div>
        <button
          onClick={() => moveTo(37.5665, 126.978, 15)}
          disabled={!isMapLoaded}
          className={`rounded-md border-none px-3 py-2 text-body-03 font-medium text-white shadow-lg transition-all duration-200 ${
            isMapLoaded ? 'bg-blue-600 hover:bg-blue-700 active:scale-95 active:bg-blue-800' : 'bg-gray-400 opacity-50'
          }`}
        >
          서울시청 이동
        </button>
        <button
          onClick={() => moveTo(37.4979, 127.0276, 15)}
          disabled={!isMapLoaded}
          className={`rounded-md border-none px-3 py-2 text-body-03 font-medium text-white shadow-lg transition-all duration-200 ${
            isMapLoaded ? 'bg-blue-600 hover:bg-blue-700 active:scale-95 active:bg-blue-800' : 'bg-gray-400 opacity-50'
          }`}
        >
          강남역 이동
        </button>
        <button
          onClick={addMultipleAddressMarkers}
          disabled={!isMapLoaded}
          className={`rounded-md border-none px-3 py-2 text-body-03 font-medium text-white shadow-lg transition-all duration-200 ${
            isMapLoaded
              ? 'bg-orange-500 hover:bg-orange-600 active:scale-95 active:bg-orange-700'
              : 'bg-gray-400 opacity-50'
          }`}
        >
          주소 마커 생성 및 이동
        </button>
        <button
          onClick={showFitToCoordinatesExample}
          disabled={!isMapLoaded}
          className={`rounded-md border-none px-3 py-2 text-body-03 font-medium text-white shadow-lg transition-all duration-200 ${
            isMapLoaded
              ? 'bg-purple-600 hover:bg-purple-700 active:scale-95 active:bg-purple-800'
              : 'bg-gray-400 opacity-50'
          }`}
        >
          관광지 마커 생성 및 이동
        </button>
        <button
          onClick={clearAllMarkers}
          disabled={!isMapLoaded}
          className={`rounded-md border-none px-3 py-2 text-body-03 font-medium text-white shadow-lg transition-all duration-200 ${
            isMapLoaded ? 'bg-red-500 hover:bg-red-600 active:scale-95 active:bg-red-700' : 'bg-gray-400 opacity-50'
          }`}
        >
          마커 모두 삭제
        </button>
      </div>

      {/* 현재 위치로 이동 버튼 */}
      <button
        onClick={moveToCurrentLocation}
        disabled={!isMapLoaded}
        className={`absolute right-5 bottom-5 z-[1000] rounded-full border-none p-3 text-white shadow-lg transition-all duration-200 ${
          isMapLoaded ? 'bg-blue-500 hover:bg-blue-600 active:scale-90 active:bg-blue-700' : 'bg-gray-400 opacity-50'
        }`}
      >
        📍
      </button>
    </MapContainer>
  )
}
