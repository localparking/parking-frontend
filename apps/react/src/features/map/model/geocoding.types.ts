export interface GeocodeResponse {
  v2: {
    status: string
    meta: {
      totalCount: number
      page: number
      count: number
    }
    addresses: GeocodeAddress[]
    errorMessage: string
  }
}

export interface GeocodeAddress {
  roadAddress: string
  jibunAddress: string
  englishAddress: string
  x: string // 경도
  y: string // 위도
  distance: number
  addressElements: AddressElement[]
}

export interface AddressElement {
  types: string[]
  longName: string
  shortName: string
  code: string
}

export interface GeocodeResult {
  lat: number
  lng: number
  address: GeocodeAddress
}
