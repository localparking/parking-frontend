import type { LocationData, NaverLatLng, NaverMap, NaverMarker, MarkerData, GeocodeResponse } from '../model'

// 마커 아이콘 생성
export const createLocationIcon = (color: string) => {
  if (!window.naver) throw new Error('네이버 지도 API가 로드되지 않았습니다')

  return {
    content: `<div style="background: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
    anchor: new window.naver.maps.Point(10, 10),
  }
}

export const createCustomMarkerIcon = (iconUrl: string) => {
  if (!window.naver) throw new Error('네이버 지도 API가 로드되지 않았습니다')

  return {
    url: iconUrl,
    size: new window.naver.maps.Size(22, 36),
    origin: new window.naver.maps.Point(0, 0),
    anchor: new window.naver.maps.Point(11, 35),
  }
}

// 위치 마커 생성
export const createLocationMarker = (
  position: NaverLatLng,
  map: NaverMap,
  title: string,
  color: string
): NaverMarker => {
  if (!window.naver) throw new Error('네이버 지도 API가 로드되지 않았습니다')

  return new window.naver.maps.Marker({
    position,
    map,
    title,
    icon: createLocationIcon(color),
  })
}

export const createCustomMarker = (
  position: NaverLatLng,
  map: NaverMap,
  title: string,
  iconUrl?: string
): NaverMarker => {
  if (!window.naver) throw new Error('네이버 지도 API가 로드되지 않았습니다')

  const markerOptions = {
    position,
    map,
    title,
    ...(iconUrl && { icon: createCustomMarkerIcon(iconUrl) }),
  }

  return new window.naver.maps.Marker(markerOptions)
}

export const geocodeAddress = (address: string): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!window.naver?.maps?.Service) {
      reject(new Error('네이버 지도 API가 로드되지 않았습니다'))
      return
    }

    window.naver.maps.Service.geocode({ query: address }, (status: string, response: GeocodeResponse) => {
      // 응답 객체 내부의 실제 상태 확인
      const actualStatus = response?.v2?.status
      if (actualStatus !== 'OK') {
        reject(new Error(`지오코딩 실패. 응답 상태: ${actualStatus}`))
        return
      }

      const items = response?.v2?.addresses

      if (!items || items.length === 0) {
        reject(new Error('검색 결과가 없습니다'))
        return
      }

      const firstAddress = items[0]

      if (!firstAddress || !firstAddress.x || !firstAddress.y) {
        reject(new Error('좌표 정보가 없습니다'))
        return
      }

      const lng = parseFloat(firstAddress.x)
      const lat = parseFloat(firstAddress.y)

      if (isNaN(lng) || isNaN(lat)) {
        reject(new Error('잘못된 좌표 형식입니다'))
        return
      }

      console.log(`주소 변환 성공: ${address} -> (${lat}, ${lng})`)
      resolve({ lat, lng })
    })
  })
}

export const displayMarkers = (markers: MarkerData[], map: NaverMap): NaverMarker[] => {
  if (!window.naver) throw new Error('네이버 지도 API가 로드되지 않았습니다')

  return markers.map((markerData) => {
    const position = new window.naver.maps.LatLng(markerData.lat, markerData.lng)

    return createCustomMarker(position, map, markerData.title || `마커 ${markerData.id}`, markerData.iconUrl)
  })
}

export const displayMarkersFromAddresses = async (
  markers: (Omit<MarkerData, 'lat' | 'lng'> & { address: string })[],
  map: NaverMap
): Promise<NaverMarker[]> => {
  const markerPromises = markers.map(async (markerData) => {
    try {
      const { lat, lng } = await geocodeAddress(markerData.address)
      const position = new window.naver.maps.LatLng(lat, lng)
      const marker = createCustomMarker(position, map, markerData.title || `마커 ${markerData.id}`, markerData.iconUrl)
      return marker
    } catch (error) {
      console.error(`마커 생성 실패 [${markerData.address}]:`, error)
      return null
    }
  })

  const results = await Promise.all(markerPromises)
  return results.filter((marker): marker is NaverMarker => marker !== null)
}

// 네이티브 위치 정보로 지도 업데이트
export const updateMapWithNativeLocation = (locationData: LocationData) => {
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

// 위치 정보 요청 함수 (웹 fallback)
export const getCurrentLocation = (): Promise<GeolocationPosition> => {
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

// 지도 초기화 함수
export const initializeMap = async (
  initialCenter?: { lat: number; lng: number },
  initialZoom: number = 15
): Promise<NaverMap | null> => {
  const mapContainer = document.getElementById('map')
  if (!mapContainer || !window.naver) {
    console.error('지도 컨테이너 또는 네이버 지도 API를 찾을 수 없습니다')
    return null
  }

  try {
    // 기본 위치는 서울시청으로 설정 (더 범용적)
    const defaultCenter = initialCenter || { lat: 37.5665, lng: 126.978 }
    const position = new window.naver.maps.LatLng(defaultCenter.lat, defaultCenter.lng)

    const map = new window.naver.maps.Map('map', {
      center: position,
      zoom: initialZoom,
      mapDataControl: false,
    })

    window.currentMap = map

    console.log('지도가 성공적으로 초기화되었습니다.')
    return map
  } catch (error) {
    console.error('지도 초기화 중 오류 발생:', error)
    return null
  }
}

// 네이버 지도 API 로드
export const loadNaverMapScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.naver?.maps) {
      resolve()
      return
    }

    const naverMapClientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID

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
