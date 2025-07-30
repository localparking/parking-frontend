import { isWebView } from '@/shared/utils/webview'
import { bridge } from '@/shared/bridge'
import { LocationData, LocationResult } from '@bridge/types'

const DEFAULT_LOCATION: LocationData = {
  latitude: 37.498095,
  longitude: 127.02761,
  accuracy: 0,
}

/**
 * 현재 위치를 가져오는 서비스
 * Web/WebView 환경을 자동으로 분기처리
 */
export const getCurrentLocation = async (): Promise<LocationResult> => {
  try {
    if (isWebView()) {
      return await getWebViewLocation()
    } else {
      return await getBrowserLocation()
    }
  } catch (error) {
    console.error('위치 가져오기 실패:', error)
    return { success: false, data: null }
  }
}

/**
 * WebView 환경에서 bridge를 통해 현재 위치 가져오기
 */
const getWebViewLocation = async (): Promise<LocationResult> => {
  try {
    const result = await bridge.getCurrentLocation()
    return result
  } catch (error) {
    console.error('WebView 위치 가져오기 실패:', error)
    return { success: false, data: null }
  }
}

/**
 * 브라우저 환경에서 Geolocation API로 현재 위치 가져오기
 */
const getBrowserLocation = (): Promise<LocationResult> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ success: false, data: null })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords
        resolve({
          success: true,
          data: { latitude, longitude, accuracy: accuracy || 0 },
        })
      },
      (error) => {
        console.error('브라우저 위치 가져오기 실패:', error)
        resolve({ success: false, data: null })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    )
  })
}

/**
 * 기본 위치 반환
 */
export const getDefaultLocation = (): LocationData => DEFAULT_LOCATION
