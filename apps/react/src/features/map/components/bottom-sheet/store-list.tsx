import React, { useRef, useCallback, useMemo } from 'react'
import { PageResponseStoreListResponse, StoreListResponse } from '@data/user-api-axios/api'
import { useCategoryContext } from '@/shared/context/category-context'
import { cn } from '@ui/common/lib/utils'

const ICON_MAP = {
  cafe: '/icons/cafe-icon.png',
  food: '/icons/food-icon.png',
  culture: '/icons/culture-icon.png',
  leisure: '/icons/leisure-icon.png',
  shopping: '/icons/shopping-icon.png',
  parking: '/icons/parking-icon.png',
} as const

const getStoreIcon = (store: StoreListResponse, prefixMap: Map<number, string>): string => {
  const parentCategoryId = store.categories?.[0]?.parentId
  const prefix = parentCategoryId ? prefixMap.get(parentCategoryId) : 'food'
  return ICON_MAP[prefix as keyof typeof ICON_MAP] || ICON_MAP.food
}

interface StoreListProps {
  pages: PageResponseStoreListResponse[] | undefined
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onFetchNextPage: () => void
}

export const StoreList: React.FC<StoreListProps> = ({ pages, hasNextPage, isFetchingNextPage, onFetchNextPage }) => {
  const { parentIdToPrefixMap } = useCategoryContext()
  const stores = useMemo(() => pages?.flatMap((page) => page.content || []) || [], [pages])

  // 무한스크롤을 위한 Intersection Observer
  const observer = useRef<IntersectionObserver | undefined>(undefined)
  const lastStoreElementRef = useCallback(
    (node: HTMLLIElement | null) => {
      if (isFetchingNextPage) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting && hasNextPage) {
          onFetchNextPage()
        }
      })
      if (node) observer.current.observe(node)
    },
    [isFetchingNextPage, hasNextPage, onFetchNextPage]
  )

  if (stores.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-center text-gray-500">
          <p className="text-sm">주변에 가게가 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <ul className="space-y-1">
        {stores.map((store, index) => (
          <li
            key={store.storeId}
            className="mx-4 my-2"
            ref={index === stores.length - 1 ? lastStoreElementRef : undefined}
          >
            <div className="flex gap-3 rounded-lg border border-white bg-white p-3 shadow-sm">
              {/* 카테고리 아이콘 영역 */}
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                  {/* 카테고리별 아이콘 (마커와 동일한 방식) */}
                  <img
                    src={getStoreIcon(store, parentIdToPrefixMap)}
                    alt={store.categories?.[0]?.categoryName || '스토어'}
                    className="h-8 w-8"
                  />
                </div>
              </div>

              {/* 스토어 정보 영역 */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1">
                  {/* 카테고리명 */}
                  {store.categories && store.categories.length > 0 && store.categories[0]?.categoryName && (
                    <p className="text-[10px] text-gray-500">{store.categories[0].categoryName}</p>
                  )}

                  {/* 상호명과 영업상태 */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">{store.name}</h3>
                    {/* 영업 상태 - isOpen으로 판단 */}
                    <span
                      className={cn(
                        'rounded-full px-2 py-1 text-[10px] font-semibold',
                        store.isOpen ? 'bg-gray-50 text-gray-1' : 'bg-red-50 text-red-600'
                      )}
                    >
                      {store.isOpen ? '영업중' : '영업마감'}
                    </span>
                  </div>

                  {/* 주차 혜택 정보 */}
                  <p className="text-xs text-gray-500">
                    {store.discountMin && store.purchaseAmount
                      ? `${store.purchaseAmount}원 이상 구매시 ${store.discountMin}분 무료 주차`
                      : '주차 혜택 정보 없음'}
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* 로딩 인디케이터 */}
      {isFetchingNextPage && (
        <div className="p-4 text-center">
          <div className="text-sm text-gray-500">더 불러오는 중...</div>
        </div>
      )}
    </div>
  )
}
