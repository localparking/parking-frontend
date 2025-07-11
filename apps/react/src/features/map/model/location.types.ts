export interface LocationData {
  latitude: number
  longitude: number
  accuracy: number
}

export interface WebViewMessage {
  type: string
  payload?: LocationData
}

export interface GeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
}

export interface LocationError {
  code: number
  message: string
  PERMISSION_DENIED: number
  POSITION_UNAVAILABLE: number
  TIMEOUT: number
}

export interface CurrentLocation {
  coords: {
    latitude: number
    longitude: number
    accuracy: number
    altitude?: number
    altitudeAccuracy?: number
    heading?: number
    speed?: number
  }
  timestamp: number
}

declare global {
  interface Window {
    nativeLocationData?: LocationData
  }
}
