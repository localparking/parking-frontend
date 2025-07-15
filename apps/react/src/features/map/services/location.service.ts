import type { LocationData, CurrentLocation, GeolocationOptions } from '../model'
import { createLocationIcon } from './marker.service'

export const updateMapWithNativeLocation = (locationData: LocationData) => {
  if (!window.currentMap || !window.naver) return

  const { latitude, longitude } = locationData
  const newCenter = new window.naver.maps.LatLng(latitude, longitude)

  window.currentMap.setCenter(newCenter)
  window.currentMap.setZoom(15)

  if (window.currentLocationMarker) {
    window.currentLocationMarker.setMap(null)
  }

  window.currentLocationMarker = new window.naver.maps.Marker({
    position: newCenter,
    map: window.currentMap,
    title: '현재 위치',
    icon: createLocationIcon('#4285f4'),
  })

  console.log('네이티브 위치로 지도 업데이트 완료:', { latitude, longitude })
}

export const getCurrentLocation = (options?: GeolocationOptions): Promise<CurrentLocation> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('이 브라우저는 위치 정보를 지원하지 않습니다.'))
      return
    }

    const defaultOptions: GeolocationOptions = {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 30000,
      ...options,
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('웹 위치 정보 획득 성공:', position.coords)
        resolve(position as CurrentLocation)
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
      defaultOptions
    )
  })
}
