import { useEffect, useRef, useState } from 'react'
import type { LocationData, NaverMap, NaverMarker, WebViewMessage } from '../model'
import {
  createLocationMarker,
  getCurrentLocation,
  initializeMap,
  loadNaverMapScript,
  updateMapWithNativeLocation,
} from '../services/map.service'

export const useMap = () => {
  const mapRef = useRef<NaverMap | null>(null)
  const markersRef = useRef<NaverMarker[]>([])
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

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

  // 지도 초기화 함수
  const initMap = async () => {
    cleanupMap()

    try {
      const map = await initializeMap()
      if (!map) return

      mapRef.current = map
      setIsMapLoaded(true)

      // 네이티브 위치 정보가 이미 있다면 우선 사용
      if (window.nativeLocationData) {
        console.log('기존 네이티브 위치 정보 사용:', window.nativeLocationData)
        updateMapWithNativeLocation(window.nativeLocationData)
      } else {
        // 네이티브 위치 정보가 없으면 웹 위치 정보로 fallback
        try {
          const position = await getCurrentLocation()
          const currentLocation = new window.naver!.maps.LatLng(position.coords.latitude, position.coords.longitude)

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

  // 현재 위치로 돌아가는 함수
  const moveToCurrentLocation = async () => {
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

  // 웹뷰 메시지 수신 리스너 설정
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data: WebViewMessage = JSON.parse(event.data)
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

  // 지도 초기화 효과
  useEffect(() => {
    const initializeMapWithScript = async () => {
      try {
        await loadNaverMapScript()
        await initMap()
      } catch (error) {
        console.error('지도 초기화 실패:', error)
      }
    }

    initializeMapWithScript()
    return cleanupMap
  }, [])

  return {
    isMapLoaded,
    locationError,
    moveToCurrentLocation,
    setLocationError,
  }
}
