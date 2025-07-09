import React from 'react'
import { useMap } from '../hooks/use-map'
import { useMapNavigation } from '../hooks/use-map-navigation'
import { useMarkers } from '../hooks/use-markers'
import { geocodeAddress } from '../services'

export const MapContainer: React.FC = () => {
  const { isMapLoaded, locationError, moveToCurrentLocation } = useMap()
  const { moveTo, fitToCoordinates } = useMapNavigation()
  const { addMarkers, addMarkersFromAddresses } = useMarkers()

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

    try {
      await addMarkersFromAddresses(addressMarkers)
      const coordinates = await Promise.all(
        addressMarkers.map(async (marker) => {
          const result = await geocodeAddress(marker.address)
          return { lat: result.lat, lng: result.lng }
        })
      )

      fitToCoordinates(coordinates, 50)
      console.log('여러 주소 기반 마커들이 생성되었습니다.')
    } catch (error) {
      console.error('주소 기반 마커 생성 중 오류:', error)
    }
  }

  // 여러 좌표를 포함하는 fitToCoordinates 예시
  const showFitToCoordinatesExample = () => {
    const touristSpots = [
      { lat: 37.5666103, lng: 126.9783882 }, // 서울시청
      { lat: 37.4979, lng: 127.0276 }, // 강남역
      { lat: 37.5633352, lng: 126.9872743 }, // 명동
      { lat: 37.5788408, lng: 126.9770162 }, // 경복궁
      { lat: 37.5208, lng: 127.1232 }, // 롯데월드타워
      { lat: 37.5111111, lng: 127.1111111 }, // 롯데월드타워
    ]

    fitToCoordinates(touristSpots, 50)

    const markerData = touristSpots.map((spot, index) => ({
      id: `tourist-spot-${index + 1}`,
      lat: spot.lat,
      lng: spot.lng,
      title: ['서울시청', '강남역', '명동', '경복궁', '롯데월드타워'][index],
    }))

    addMarkers(markerData)
    console.log('서울 주요 관광지들이 모두 보이도록 지도 범위가 조정되었습니다.')
  }
  // todo: 위 testcode 추후 삭제
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <div id="map" style={{ width: '100%', height: '100%' }} />

      {!isMapLoaded && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '20px',
            borderRadius: '8px',
            zIndex: 1000,
          }}
        >
          지도를 로딩 중입니다...
        </div>
      )}

      {locationError && (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#ff5722',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            zIndex: 1000,
            maxWidth: '90%',
            textAlign: 'center',
          }}
        >
          {locationError}
        </div>
      )}

      {/* 지도 이동 컨트롤 패널 */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 1000,
        }}
      >
        <button
          onClick={() => moveTo(37.5665, 126.978, 15)}
          disabled={!isMapLoaded}
          style={{
            padding: '8px 12px',
            backgroundColor: isMapLoaded ? '#1976d2' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isMapLoaded ? 'pointer' : 'not-allowed',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            fontSize: '12px',
            fontWeight: '500',
          }}
        >
          서울시청 이동
        </button>

        <button
          onClick={() => moveTo(37.4979, 127.0276, 15)}
          disabled={!isMapLoaded}
          style={{
            padding: '8px 12px',
            backgroundColor: isMapLoaded ? '#1976d2' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isMapLoaded ? 'pointer' : 'not-allowed',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            fontSize: '12px',
            fontWeight: '500',
          }}
        >
          강남역 이동
        </button>

        <button
          onClick={addMultipleAddressMarkers}
          disabled={!isMapLoaded}
          style={{
            padding: '8px 12px',
            backgroundColor: isMapLoaded ? '#ff9800' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isMapLoaded ? 'pointer' : 'not-allowed',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            fontSize: '12px',
            fontWeight: '500',
          }}
        >
          주소 마커 생성 및 이동
        </button>

        <button
          onClick={showFitToCoordinatesExample}
          disabled={!isMapLoaded}
          style={{
            padding: '8px 12px',
            backgroundColor: isMapLoaded ? '#9c27b0' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isMapLoaded ? 'pointer' : 'not-allowed',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            fontSize: '12px',
            fontWeight: '500',
          }}
        >
          관광지 마커 생성 및 이동
        </button>
      </div>

      {/* 현재 위치로 이동 버튼 */}
      <button
        onClick={moveToCurrentLocation}
        disabled={!isMapLoaded}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          padding: '12px',
          backgroundColor: isMapLoaded ? '#4285f4' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          cursor: isMapLoaded ? 'pointer' : 'not-allowed',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          zIndex: 1000,
        }}
      >
        📍
      </button>
    </div>
  )
}
