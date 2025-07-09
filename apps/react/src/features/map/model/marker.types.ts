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

export interface MarkerDisplayResult {
  successful: NaverMarker[]
  failed: { data: MarkerData | AddressMarkerData; error: string }[]
  total: number
}
