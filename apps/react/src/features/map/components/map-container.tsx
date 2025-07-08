import React from 'react'
import { useMap } from '../hooks/use-map'
import { useMapNavigation } from '../hooks/use-map-navigation'
import { useMarkers } from '../hooks/use-markers'

export const MapContainer: React.FC = () => {
  const { isMapLoaded, locationError, moveToCurrentLocation } = useMap()
  const { moveTo, getMapCenter, getMapZoom, fitToCoordinates } = useMapNavigation()
  const { addMarkers, getMarkerCount } = useMarkers()

  // (지도 중심점에) 마커 추가 예시
  const addMarkerAtCenter = () => {
    const center = getMapCenter()
    if (!center) {
      console.warn('지도 중심점을 가져올 수 없습니다.')
      return
    }

    const markerData = [
      {
        id: `center-marker-${Date.now()}`,
        lat: center.lat,
        lng: center.lng,
        title: `마커 ${getMarkerCount() + 1} (${center.lat.toFixed(4)}, ${center.lng.toFixed(4)})`,
      },
    ]

    addMarkers(markerData)
    console.log('지도 중심점에 마커가 추가되었습니다:', center)
  }

  // 여러 좌표를 포함하는 fitToCoordinates 예시
  const showFitToCoordinatesExample = () => {
    const touristSpots = [
      { lat: 37.5665, lng: 126.978 }, // 서울시청
      { lat: 37.4979, lng: 127.0276 }, // 강남역
      { lat: 37.5547, lng: 126.9706 }, // 명동
      { lat: 37.5796, lng: 126.977 }, // 경복궁
      { lat: 37.5208, lng: 127.1232 }, // 롯데월드타워
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
          서울시청
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
          강남역
        </button>

        <button
          onClick={() => {
            const center = getMapCenter()
            const zoom = getMapZoom()
            console.log('현재 지도 위치:', center, '줌:', zoom)
            alert(`위도: ${center?.lat.toFixed(6)}\n경도: ${center?.lng.toFixed(6)}\n줌: ${zoom}`)
          }}
          disabled={!isMapLoaded}
          style={{
            padding: '8px 12px',
            backgroundColor: isMapLoaded ? '#f57c00' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isMapLoaded ? 'pointer' : 'not-allowed',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            fontSize: '12px',
            fontWeight: '500',
          }}
        >
          현재 위치 정보
        </button>

        <button
          onClick={addMarkerAtCenter}
          disabled={!isMapLoaded}
          style={{
            padding: '8px 12px',
            backgroundColor: isMapLoaded ? '#e91e63' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isMapLoaded ? 'pointer' : 'not-allowed',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            fontSize: '12px',
            fontWeight: '500',
          }}
        >
          중심점에 마커 추가
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
          서울 관광지 보기
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
