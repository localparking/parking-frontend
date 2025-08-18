import { StoreListResponse, ParkingLotListResponse } from '@data/user-api-axios/api'
import { getMarkerIconUrl } from './marker-assets'

export interface StoreWithMarker extends StoreListResponse {
  markerIconUrl: string
}

export interface ParkingLotWithMarker extends ParkingLotListResponse {
  markerIconUrl: string
}

export const getStoreMarkerIconUrl = (store: StoreListResponse, prefixMap: Map<number, string>): string => {
  const parentCategoryId = store.categories?.[0]?.parentId
  const categoryPrefix = parentCategoryId
    ? prefixMap.get(parentCategoryId)
    : prefixMap.get(store.categories?.[0]?.categoryId || 0)

  let stateSuffix = 'basic'
  if (store.storeType === 'COALITION') {
    stateSuffix = 'partner'
  } else if (store.discountMin && store.discountMin > 0) {
    stateSuffix = 'detail'
  }
  const iconFileName = `${categoryPrefix}-${stateSuffix}.svg`
  return getMarkerIconUrl(iconFileName)
}
