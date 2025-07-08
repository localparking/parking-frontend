export interface NaverLatLng {
  lat(): number
  lng(): number
}

export interface NaverMarker {
  setMap(map: NaverMap | null): void
}

export interface NaverPoint {
  x: number
  y: number
}

export interface NaverSize {
  width: number
  height: number
}

export interface NaverMap {
  setCenter(center: NaverLatLng): void
  setZoom(level: number): void
}

export interface NaverMaps {
  LatLng: new (lat: number, lng: number) => NaverLatLng
  Marker: new (options: {
    position: NaverLatLng
    map: NaverMap | null
    title?: string
    icon?: {
      url?: string
      content?: string
      size?: NaverSize
      origin?: NaverPoint
      anchor: NaverPoint
    }
  }) => NaverMarker
  Point: new (x: number, y: number) => NaverPoint
  Size: new (width: number, height: number) => NaverSize
  Map: new (
    elementId: string,
    options: {
      center: NaverLatLng
      zoom: number
      mapDataControl: boolean
    }
  ) => NaverMap
  Service: {
    geocode: (options: { query: string }, callback: (status: string, response: GeocodeResponse) => void) => void
    Status: {
      OK: string
    }
  }
}

export type LocationData = {
  latitude: number
  longitude: number
  accuracy: number
}

export type MarkerData = {
  id: string
  lat: number
  lng: number
  title?: string
  address?: string
  iconUrl?: string
}

export interface GeocodeResponse {
  v2: {
    status: string
    meta: {
      totalCount: number
      page: number
      count: number
    }
    addresses: Array<{
      roadAddress: string
      jibunAddress: string
      englishAddress: string
      x: string // 경도
      y: string // 위도
      distance: number
      addressElements: Array<{
        types: string[]
        longName: string
        shortName: string
        code: string
      }>
    }>
    errorMessage: string
  }
}

declare global {
  interface Window {
    naver?: {
      maps: NaverMaps
    }
    currentMap?: NaverMap
    currentLocationMarker?: NaverMarker
    nativeLocationData?: LocationData
  }
}

export interface WebViewMessage {
  type: string
  payload?: LocationData
}
