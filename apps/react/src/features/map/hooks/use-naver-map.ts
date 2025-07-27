import { isWebView } from '@/shared/utils/webview'
import { useState, useEffect, useRef, useCallback } from 'react'
import { getDistance } from '../utils/geo'

// 훅이 반환할 지도 정보의 타입을 정의합니다.
export interface MapInfo {
  center: naver.maps.LatLngObjectLiteral
  zoom: number
}

// 훅의 반환 타입을 정의합니다.
interface UseNaverMapResult {
  mapInstance: naver.maps.Map | null
  currentMapInfo: MapInfo
  queryCenter: MapInfo['center'] | null
  moveTo: (position: naver.maps.CoordLiteral, zoom?: number) => void
  setZoom: (newZoom: number) => void
  moveToCurrentLocation: () => void
  isMapReady: boolean
}

export const useNaverMap = (mapId = 'map'): UseNaverMapResult => {
  const mapInstanceRef = useRef<naver.maps.Map | null>(null)
  const [isMapReady, setIsMapReady] = useState<boolean>(false)
  const [queryCenter, setQueryCenter] = useState<MapInfo['center'] | null>(null)
  const [currentMapInfo, setCurrentMapInfo] = useState<MapInfo>({
    center: { lat: 37.498095, lng: 127.02761 }, // 기본 위치 (서울 강남구)
    zoom: 15,
  })

  // Naver Map 스크립트를 동적으로 로드하는 함수
  const loadNaverMapScript = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      // 스크립트가 이미 로드되었다면 즉시 resolve
      if (window.naver?.maps) {
        return resolve()
      }
      if (document.getElementById('naver-map-script')) {
        return resolve()
      }

      const naverMapClientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID
      if (!naverMapClientId) {
        return reject(new Error('VITE_NAVER_MAP_CLIENT_ID가 설정되지 않았습니다.'))
      }

      const script = document.createElement('script')
      script.id = 'naver-map-script'
      script.type = 'text/javascript'
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${naverMapClientId}&submodules=geocoder`
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Naver Map 스크립트 로드에 실패했습니다.'))
      document.head.appendChild(script)
    })
  }, [])

  // 특정 위치와 줌 레벨로 지도를 부드럽게 이동시키는 함수
  const moveTo = useCallback((position: naver.maps.CoordLiteral, zoom?: number) => {
    const map = mapInstanceRef.current
    if (!map) return

    // morph 메서드는 좌표 이동과 줌 변경을 부드럽게 처리합니다.
    map.morph(position, zoom)
  }, [])

  // 줌 레벨을 설정하는 함수
  const setZoom = useCallback((newZoom: number) => {
    const map = mapInstanceRef.current
    if (!map) return
    map.setZoom(newZoom, true) // true: 부드러운 전환 효과 적용
  }, [])

  /**
   * TODO 사용자의 현재 GPS 위치로 지도를 이동시킵니다.
   * WEB / WebView 환경 분기처리 필수
   */
  const moveToCurrentLocation = useCallback(() => {
    const map = mapInstanceRef.current
    if (!map) return

    if (isWebView()) {
      // bridge 기반 현재 위치정보 요청해 가져옵니다.
    } else {
      // 브라우저 Geolocation API를 사용하여 현재 위치를 가져옵니다.
    }
    // moveTo({ lat: 37.498095, lng: 127.02761 }, 15) // 예시로 강남구 위치로 이동
    // 실제로는 위치정보를 통해 현재 위치를 받아와야 합니다.
  }, [])

  useEffect(() => {
    if (!isMapReady) return

    // 첫 로딩 시, queryCenter를 현재 지도 중심으로 초기화
    if (!queryCenter) {
      setQueryCenter(currentMapInfo.center)
      return
    }

    // 마지막으로 API를 호출했던 좌표(queryCenter)와 현재 지도 중심 좌표(currentMapInfo.center) 사이의 거리를 계산
    const distance = getDistance(queryCenter.lat, queryCenter.lng, currentMapInfo.center.lat, currentMapInfo.center.lng)

    // 거리가 200m를 초과하면 API 호출 기준 좌표를 업데이트
    if (distance > 200) {
      setQueryCenter(currentMapInfo.center)
    }
  }, [currentMapInfo.center, isMapReady, queryCenter])

  // 최초 마운트 시 스크립트 로드 및 지도 초기화
  useEffect(() => {
    const initializeMap = async () => {
      await loadNaverMapScript()

      const mapContainer = document.getElementById(mapId)
      if (!mapContainer || !naver) return

      const mapOptions: naver.maps.MapOptions = {
        center: currentMapInfo.center,
        zoom: currentMapInfo.zoom,
        mapDataControl: false,
      }

      const map = new naver.maps.Map(mapId, mapOptions)
      mapInstanceRef.current = map
      setIsMapReady(true)
    }

    initializeMap()
  }, [mapId])

  // 지도가 준비되면, 상태 동기화를 위한 이벤트 리스너를 등록
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!isMapReady || !map) return

    // idle 이벤트는 지도 이동/줌이 완전히 끝났을 때 발생
    const idleListener = naver.maps.Event.addListener(map, 'idle', () => {
      const newCenter = map.getCenter()
      const newZoom = map.getZoom()

      setCurrentMapInfo({
        center: { lat: newCenter.y, lng: newCenter.x },
        zoom: newZoom,
      })
    })

    // 현재 사용자 위치로 이동
    moveToCurrentLocation()

    // 컴포넌트 언마운트 시 이벤트 리스너 메모리 해제
    return () => {
      naver.maps.Event.removeListener(idleListener)
    }
  }, [isMapReady])

  return {
    mapInstance: mapInstanceRef.current,
    currentMapInfo,
    queryCenter,
    moveTo,
    setZoom,
    moveToCurrentLocation,
    isMapReady,
  }
}
