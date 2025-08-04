import React, { useRef, useCallback, useMemo } from 'react'
import { PageResponseStoreListResponse, StoreListResponse } from '@data/user-api-axios/api'
import { useCategoryContext } from '@/shared/context/category-context'
import { cn } from '@ui/common/lib/utils'
import { useNavigation } from '../../hooks/use-navigation'
import { getStoreIconPath } from '@/shared/utils/category'

interface StoreListProps {
  pages: PageResponseStoreListResponse[] | undefined
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onFetchNextPage: () => void
}

export const StoreList: React.FC<StoreListProps> = ({ pages, hasNextPage, isFetchingNextPage, onFetchNextPage }) => {
  const { parentIdToPrefixMap } = useCategoryContext()
  const stores = useMemo(() => pages?.flatMap((page) => page.content || []) || [], [pages])
  const { navigateToStoreDetail } = useNavigation()

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
            <div
              className="flex cursor-pointer gap-3 rounded-lg border border-white bg-white p-3 shadow-sm transition-shadow active:shadow-md"
              onClick={() => navigateToStoreDetail(store.storeId.toString())}
            >
              {/* 카테고리 아이콘 영역 */}
              <div className="flex-shrink-0">
                <div className="flex h-15 w-15 items-center justify-center rounded-full bg-green-50">
                  {/* 카테고리별 아이콘 (마커와 동일한 방식) */}
                  <img
                    src={getStoreIconPath(store, parentIdToPrefixMap)}
                    alt={store.categories?.[0]?.categoryName || '스토어'}
                    className="h-15 w-15"
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
                  <div className="flex items-center justify-start gap-[5px]">
                    <h3 className="text-sm font-semibold text-gray-900">{store.name}</h3>
                    {/* 영업 상태 - isOpen으로 판단 */}
                    <span
                      className={cn('rounded-full px-2 py-1 text-[10px] font-semibold', {
                        'bg-blue-50 text-blue-600': store.isOpen,
                        'bg-red-50 text-red-600': !store.isOpen,
                      })}
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
