import { createFileRoute } from '@tanstack/react-router'
import React, { useEffect, useRef, useState } from 'react'

// 네이버 지도 관련 타입 정의
interface NaverLatLng {
  lat(): number
  lng(): number
}

interface NaverMarker {
  setMap(map: NaverMap | null): void
}

interface NaverPoint {
  x: number
  y: number
}

interface NaverMap {
  setCenter(center: NaverLatLng): void
  setZoom(level: number): void
}

interface NaverMaps {
  LatLng: new (lat: number, lng: number) => NaverLatLng
  Marker: new (options: {
    position: NaverLatLng
    map: NaverMap | null
    title?: string
    icon?: {
      content: string
      anchor: NaverPoint
    }
  }) => NaverMarker
  Point: new (x: number, y: number) => NaverPoint
  Map: new (
    elementId: string,
    options: {
      center: NaverLatLng
      zoom: number
      mapDataControl: boolean
    }
  ) => NaverMap
}

declare global {
  interface Window {
    naver?: {
      maps: NaverMaps
    }
    currentMap?: NaverMap
    currentLocationMarker?: NaverMarker
    nativeLocationData?: LocationData
  }
}

// 위치 데이터 타입
type LocationData = {
  latitude: number
  longitude: number
  accuracy: number
}

// 마커 아이콘 생성
const createLocationIcon = (color: string) => {
  if (!window.naver) throw new Error('네이버 지도 API가 로드되지 않았습니다')

  return {
    content: `<div style="background: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
    anchor: new window.naver.maps.Point(10, 10),
  }
}

// 네이티브 위치 정보로 지도 업데이트
function updateMapWithNativeLocation(locationData: LocationData) {
  if (!window.currentMap || !window.naver) return

  const { latitude, longitude } = locationData
  const newCenter = new window.naver.maps.LatLng(latitude, longitude)

  // 지도 중심 이동
  window.currentMap.setCenter(newCenter)
  window.currentMap.setZoom(15)

  // 기존 위치 마커 제거
  if (window.currentLocationMarker) {
    window.currentLocationMarker.setMap(null)
  }

  // 새로운 위치 마커 생성
  window.currentLocationMarker = new window.naver.maps.Marker({
    position: newCenter,
    map: window.currentMap,
    title: '현재 위치',
    icon: createLocationIcon('#4285f4'),
  })

  console.log('네이티브 위치로 지도 업데이트 완료:', { latitude, longitude })
}

export const Route = createFileRoute('/map/')({
  component: Map,
})

function Map() {
  const mapRef = useRef<NaverMap | null>(null)
  const markersRef = useRef<NaverMarker[]>([])
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  // 웹뷰 메시지 수신 리스너 설정
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data)
        console.log('메시지 수신:', data)

        if (data.type === 'setLocationData' && data.payload) {
          console.log('네이티브로부터 위치 정보 수신:', data.payload)
          window.nativeLocationData = data.payload

          // 지도가 이미 로드되어 있다면 즉시 위치 업데이트
          if (window.currentMap && window.naver) {
            updateMapWithNativeLocation(data.payload)
          }
        }
      } catch (error) {
        console.warn('메시지 파싱 실패:', error)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // 지도와 마커들을 정리하는 함수
  const cleanupMap = () => {
    // 기존 마커들 제거
    markersRef.current.forEach((marker) => {
      marker.setMap(null)
    })
    markersRef.current = []

    // 전역 위치 마커 정리
    if (window.currentLocationMarker) {
      window.currentLocationMarker.setMap(null)
      window.currentLocationMarker = undefined
    }

    // 지도 객체 정리
    mapRef.current = null
    window.currentMap = undefined

    setIsMapLoaded(false)
    setLocationError(null)
    console.log('지도 리소스가 정리되었습니다.')
  }

  // 위치 정보 요청 함수 (웹 fallback)
  const getCurrentLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('이 브라우저는 위치 정보를 지원하지 않습니다.'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('웹 위치 정보 획득 성공:', position.coords)
          resolve(position)
        },
        (error) => {
          console.error('위치 정보 획득 실패:', error)
          let errorMessage = '위치 정보를 가져올 수 없습니다.'

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = '위치 접근 권한이 거부되었습니다.'
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = '위치 정보를 사용할 수 없습니다.'
              break
            case error.TIMEOUT:
              errorMessage = '위치 정보 요청 시간이 초과되었습니다.'
              break
          }

          setLocationError(errorMessage)
          reject(new Error(errorMessage))
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 30000,
        }
      )
    })
  }

  // 위치 마커 생성
  const createLocationMarker = (position: NaverLatLng, map: NaverMap, title: string, color: string) => {
    if (!window.naver) throw new Error('네이버 지도 API가 로드되지 않았습니다')

    return new window.naver.maps.Marker({
      position,
      map,
      title,
      icon: createLocationIcon(color),
    })
  }

  // 지도 초기화 함수
  const initMap = async () => {
    cleanupMap()

    const mapContainer = document.getElementById('map')
    if (!mapContainer || !window.naver) {
      console.error('지도 컨테이너 또는 네이버 지도 API를 찾을 수 없습니다')
      return
    }

    try {
      // 기본 위치 (판교)
      const defaultPosition = new window.naver.maps.LatLng(37.3595704, 127.105399)

      const map = new window.naver.maps.Map('map', {
        center: defaultPosition,
        zoom: 15,
        mapDataControl: false,
      })

      mapRef.current = map
      window.currentMap = map

      // 기본 마커 표시 (주차장 위치)
      const defaultMarker = new window.naver.maps.Marker({
        position: defaultPosition,
        map: map,
        title: '주차장 위치',
      })
      markersRef.current.push(defaultMarker)

      setIsMapLoaded(true)
      console.log('지도가 성공적으로 초기화되었습니다.')

      // 네이티브 위치 정보가 이미 있다면 우선 사용
      if (window.nativeLocationData) {
        console.log('기존 네이티브 위치 정보 사용:', window.nativeLocationData)
        updateMapWithNativeLocation(window.nativeLocationData)
      } else {
        // 네이티브 위치 정보가 없으면 웹 위치 정보로 fallback
        try {
          const position = await getCurrentLocation()
          const currentLocation = new window.naver.maps.LatLng(position.coords.latitude, position.coords.longitude)

          const currentLocationMarker = createLocationMarker(currentLocation, map, '현재 위치 (웹)', '#34a853')
          markersRef.current.push(currentLocationMarker)
          window.currentLocationMarker = currentLocationMarker

          map.setCenter(currentLocation)
          console.log('현재 위치로 지도 중심을 이동했습니다.')
          setLocationError(null)
        } catch (locationError) {
          console.warn('현재 위치를 가져올 수 없어 기본 위치를 사용합니다.')
        }
      }
    } catch (error) {
      console.error('지도 초기화 중 오류 발생:', error)
    }
  }

  useEffect(() => {
    if (window.naver?.maps) {
      initMap()
    } else {
      const mapScript = document.createElement('script')
      mapScript.onload = () => {
        console.log('네이버 지도 API 로드 완료')
        initMap()
      }
      mapScript.onerror = () => {
        console.error('네이버 지도 API 로드 실패')
      }
      mapScript.src = 'https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=v2t71cg2fk'
      document.head.appendChild(mapScript)
    }

    return cleanupMap
  }, [])

  // 현재 위치로 돌아가는 함수
  const onClickUserLocation = async () => {
    if (!isMapLoaded || !window.currentMap || !window.naver) {
      console.warn('지도가 아직 로드되지 않았습니다.')
      return
    }

    // 네이티브 위치 정보 우선 사용
    if (window.nativeLocationData) {
      updateMapWithNativeLocation(window.nativeLocationData)
      console.log('네이티브 현재 위치로 이동했습니다.')
      return
    }

    // 네이티브 위치 정보가 없으면 웹 위치 정보 사용
    try {
      const position = await getCurrentLocation()
      const currentLocation = new window.naver.maps.LatLng(position.coords.latitude, position.coords.longitude)

      window.currentMap.setCenter(currentLocation)
      window.currentMap.setZoom(15)

      // 기존 위치 마커 제거 후 새로 생성
      if (window.currentLocationMarker) {
        window.currentLocationMarker.setMap(null)
      }

      window.currentLocationMarker = createLocationMarker(
        currentLocation,
        window.currentMap,
        '현재 위치 (웹)',
        '#34a853'
      )

      console.log('현재 위치로 이동했습니다.')
      setLocationError(null)
    } catch (error) {
      console.error('현재 위치로 이동할 수 없습니다:', error)
      setLocationError('현재 위치를 가져올 수 없습니다.')
    }
  }

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

      <button
        onClick={onClickUserLocation}
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
