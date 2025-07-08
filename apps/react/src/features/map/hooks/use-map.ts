import { useEffect, useRef, useState } from 'react'
import type { LocationData, NaverMap, NaverMarker, WebViewMessage } from '../model'
import {
  createLocationMarker,
  getCurrentLocation,
  initializeMap,
  loadNaverMapScript,
  updateMapWithNativeLocation,
} from '../services'

export const useMap = () => {
  const mapRef = useRef<NaverMap | null>(null)
  const markersRef = useRef<NaverMarker[]>([])
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  const cleanupMap = () => {
    markersRef.current.forEach((marker) => {
      marker.setMap(null)
    })
    markersRef.current = []

    if (window.currentLocationMarker) {
      window.currentLocationMarker.setMap(null)
      window.currentLocationMarker = undefined
    }

    mapRef.current = null
    window.currentMap = undefined

    setIsMapLoaded(false)
    setLocationError(null)
    console.log('지도 리소스가 정리되었습니다.')
  }

  const initMap = async () => {
    cleanupMap()

    try {
      const map = await initializeMap()
      if (!map) return

      mapRef.current = map
      setIsMapLoaded(true)

      if (window.nativeLocationData) {
        console.log('기존 네이티브 위치 정보 사용:', window.nativeLocationData)
        updateMapWithNativeLocation(window.nativeLocationData)
      } else {
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

  const moveToCurrentLocation = async () => {
    if (!isMapLoaded || !window.currentMap || !window.naver) {
      console.warn('지도가 아직 로드되지 않았습니다.')
      return
    }

    if (window.nativeLocationData) {
      updateMapWithNativeLocation(window.nativeLocationData)
      console.log('네이티브 현재 위치로 이동했습니다.')
      return
    }

    try {
      const position = await getCurrentLocation()
      const currentLocation = new window.naver.maps.LatLng(position.coords.latitude, position.coords.longitude)

      window.currentMap.setCenter(currentLocation)
      window.currentMap.setZoom(15)

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
