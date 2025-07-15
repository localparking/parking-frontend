import type { NaverLatLng, NaverMap, NaverMarker, MarkerData, AddressMarkerData, MarkerDisplayResult } from '../model'
import { geocodeAddress } from './geocoding.service'

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

export const displayMarkers = (markers: MarkerData[], map: NaverMap): NaverMarker[] => {
  if (!window.naver) throw new Error('네이버 지도 API가 로드되지 않았습니다')

  return markers.map((markerData) => {
    const position = new window.naver.maps.LatLng(markerData.lat, markerData.lng)
    return createCustomMarker(position, map, markerData.title || `마커 ${markerData.id}`, markerData.iconUrl)
  })
}

export const displayMarkersFromAddresses = async (
  markers: AddressMarkerData[],
  map: NaverMap
): Promise<MarkerDisplayResult> => {
  const results: NaverMarker[] = []
  const errors: { data: AddressMarkerData; error: string }[] = []

  for (const markerData of markers) {
    try {
      console.log(`지오코딩 시작: ${markerData.address}`)

      const geocodeResult = await geocodeAddress(markerData.address)
      const { lat, lng } = geocodeResult

      console.log(`마커 생성 시작: ${markerData.title || markerData.id}`)
      const position = new window.naver.maps.LatLng(lat, lng)
      const marker = createCustomMarker(position, map, markerData.title || `마커 ${markerData.id}`, markerData.iconUrl)

      results.push(marker)
      console.log(`마커 생성 성공: ${markerData.title || markerData.id}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류'
      console.error(`마커 생성 실패 [${markerData.address}]:`, error)
      errors.push({ data: markerData, error: errorMessage })
    }
  }

  return {
    successful: results,
    failed: errors,
    total: markers.length,
  }
}
