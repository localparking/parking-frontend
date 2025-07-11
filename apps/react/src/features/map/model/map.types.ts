import { GeocodeResponse } from './geocoding.types'

export interface NaverLatLng {
  lat(): number
  lng(): number
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
  fitBounds(bounds: NaverLatLngBounds, margin?: { top: number; right: number; bottom: number; left: number }): void
}

export interface NaverLatLngBounds {
  extend(position: NaverLatLng): void
}

export interface NaverMaps {
  LatLng: new (lat: number, lng: number) => NaverLatLng
  LatLngBounds: new () => NaverLatLngBounds
  Marker: new (options: MarkerOptions) => NaverMarker
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

export interface Coordinates {
  lat: number
  lng: number
}

export interface MapInitOptions {
  center?: Coordinates
  zoom?: number
  mapDataControl?: boolean
}

// 임시로 필요한 타입들 (나중에 분리할 예정)
export interface NaverMarker {
  setMap(map: NaverMap | null): void
}

export interface MarkerOptions {
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
}

declare global {
  interface Window {
    naver?: {
      maps: NaverMaps
    }
    currentMap?: NaverMap
    currentLocationMarker?: NaverMarker
  }
}
