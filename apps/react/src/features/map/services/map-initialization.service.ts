import type { NaverMap, MapInitOptions, Coordinates } from '../model'

export const loadNaverMapScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.naver?.maps) {
      resolve()
      return
    }

    const naverMapClientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID

    if (!naverMapClientId) {
      reject(new Error('네이버 지도 API 키가 설정되지 않았습니다.'))
      return
    }

    const mapScript = document.createElement('script')
    mapScript.onload = () => {
      console.log('네이버 지도 API 로드 완료')
      resolve()
    }
    mapScript.onerror = () => {
      console.error('네이버 지도 API 로드 실패')
      reject(new Error('네이버 지도 API 로드 실패'))
    }
    mapScript.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${naverMapClientId}&submodules=geocoder`
    document.head.appendChild(mapScript)
  })
}

export const initializeMap = async (options?: MapInitOptions): Promise<NaverMap | null> => {
  const mapContainer = document.getElementById('map')
  if (!mapContainer || !window.naver) {
    console.error('지도 컨테이너 또는 네이버 지도 API를 찾을 수 없습니다')
    return null
  }

  try {
    // 기본 설정
    const defaultOptions: Required<MapInitOptions> = {
      center: { lat: 37.5665, lng: 126.978 }, // 서울시청
      zoom: 15,
      mapDataControl: false,
    }

    const finalOptions = { ...defaultOptions, ...options }
    const position = new window.naver.maps.LatLng(finalOptions.center.lat, finalOptions.center.lng)

    const map = new window.naver.maps.Map('map', {
      center: position,
      zoom: finalOptions.zoom,
      mapDataControl: finalOptions.mapDataControl,
    })

    window.currentMap = map

    console.log('지도가 성공적으로 초기화되었습니다.', finalOptions)
    return map
  } catch (error) {
    console.error('지도 초기화 중 오류 발생:', error)
    return null
  }
}

export const isMapReady = (): boolean => {
  return !!(window.naver?.maps && window.currentMap)
}

export const isMapContainerReady = (): boolean => {
  return !!document.getElementById('map')
}
