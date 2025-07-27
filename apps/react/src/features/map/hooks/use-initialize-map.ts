import { useState, useEffect, useRef, useCallback } from 'react'

// 훅이 반환할 지도 정보의 타입을 정의합니다.
interface MapInfo {
  center: {
    lat: number
    lng: number
  }
  zoom: number
}

// 훅의 반환 타입을 정의합니다.
interface UseNaverMapResult {
  mapInstance: naver.maps.Map | null
  currentMapInfo: MapInfo
  moveTo: (position: naver.maps.Coord, zoom?: number) => void
  isMapReady: boolean
}

export const useNaverMap = (mapId = 'map'): UseNaverMapResult => {
  const mapInstanceRef = useRef<naver.maps.Map | null>(null)
  const [isMapReady, setIsMapReady] = useState<boolean>(false)
  const [currentMapInfo, setCurrentMapInfo] = useState<MapInfo>({
    center: { lat: 37.5665, lng: 126.978 },
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
  const moveTo = useCallback((position: naver.maps.Coord, zoom?: number) => {
    const map = mapInstanceRef.current
    if (!map) return

    // morph 메서드는 좌표 이동과 줌 변경을 부드럽게 처리합니다.
    map.morph(position, zoom)
  }, [])

  // 최초 마운트 시 스크립트 로드 및 지도 초기화
  useEffect(() => {
    const initializeMap = async () => {
      await loadNaverMapScript()

      const mapContainer = document.getElementById(mapId)
      if (!mapContainer || !naver) return

      const { center, zoom } = currentMapInfo
      const mapOptions: naver.maps.MapOptions = {
        center: { x: center.lng, y: center.lat },
        zoom: zoom,
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

    // 컴포넌트 언마운트 시 이벤트 리스너 메모리 해제
    return () => {
      naver.maps.Event.removeListener(idleListener)
    }
  }, [isMapReady])

  return {
    mapInstance: mapInstanceRef.current,
    currentMapInfo,
    moveTo,
    isMapReady,
  }
}
