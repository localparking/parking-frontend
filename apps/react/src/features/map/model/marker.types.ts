import type { NaverLatLng, NaverMap, NaverMarker, NaverSize, NaverPoint } from './map.types'

export interface MarkerData {
  id: string
  lat: number
  lng: number
  title?: string
  address?: string
  iconUrl?: string
}

export interface AddressMarkerData extends Omit<MarkerData, 'lat' | 'lng'> {
  address: string
}

export interface MarkerIconOptions {
  url?: string
  content?: string
  size?: NaverSize
  origin?: NaverPoint
  anchor: NaverPoint
}

export interface CustomMarkerOptions {
  position: NaverLatLng
  map: NaverMap
  title: string
  iconUrl?: string
}

export interface LocationMarkerOptions {
  position: NaverLatLng
  map: NaverMap
  title: string
  color: string
}

export interface MarkerCreateResult {
  marker: NaverMarker
  data: MarkerData
}

export interface MarkerDisplayResult {
  successful: NaverMarker[]
  failed: { data: MarkerData | AddressMarkerData; error: string }[]
  total: number
}
