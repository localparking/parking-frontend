import { StoreListResponse, CategoryDto } from '@data/user-api-axios/api'

// 아이콘 매핑 상수
export const ICON_MAP = {
  cafe: '/icons/cafe-icon.png',
  food: '/icons/food-icon.png',
  culture: '/icons/culture-icon.png',
  leisure: '/icons/leisure-icon.png',
  shopping: '/icons/shopping-icon.png',
  parking: '/icons/parking-icon.png',
  store: '/icons/store-icon.png',
} as const

// 부모 카테고리 기반으로 아이콘 경로를 반환하는 유틸리티 함수
export const getStoreIconPath = (store: StoreListResponse, parentIdToPrefixMap: Map<number, string>): string => {
  const parentCategoryId = store.categories?.[0]?.parentId
  const prefix = parentCategoryId ? parentIdToPrefixMap.get(parentCategoryId) || 'store' : 'store'
  return ICON_MAP[prefix as keyof typeof ICON_MAP] || ICON_MAP.store
}

// 연관된 스토어용 아이콘 경로 반환 함수
export const getAssociatedStoreIconPath = (
  store: { categories?: Array<CategoryDto> },
  parentIdToPrefixMap: Map<number, string>
): string => {
  const parentCategoryId = store.categories?.[0]?.parentId
  const prefix = parentCategoryId ? parentIdToPrefixMap.get(parentCategoryId) || 'store' : 'store'
  return ICON_MAP[prefix as keyof typeof ICON_MAP] || ICON_MAP.store
}

// 카테고리 ID로 아이콘 경로를 반환하는 함수
export const getCategoryIconPath = (categoryId: number, parentIdToPrefixMap: Map<number, string>): string => {
  const prefix = parentIdToPrefixMap.get(categoryId) || 'store'
  return ICON_MAP[prefix as keyof typeof ICON_MAP] || ICON_MAP.store
}
