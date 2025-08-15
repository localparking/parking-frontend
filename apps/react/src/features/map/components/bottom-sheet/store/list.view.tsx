import React, { useRef, useMemo, useEffect } from 'react'
import { PageResponseStoreListResponse } from '@data/user-api-axios/api'
import { useCategoryContext } from '@/shared/context/category-context'
import { cn } from '@ui/common/lib/utils'
import { useNavigation } from '@/features/map'
import { useMapContext } from '@/features/map'
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
  const { moveTo } = useMapContext().naverMap

  const observerTarget = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!onFetchNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          onFetchNextPage()
        }
      },
      { threshold: 1.0 } // 타겟이 100% 보였을 때 콜백 실행{ threshold: 1.0 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    // 컴포넌트가 언마운트되거나, 의존성이 변경되어 effect가 재실행되기 전에 관찰을 중단
    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [onFetchNextPage, hasNextPage, isFetchingNextPage])

  if (stores.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-center text-gray-500">
          <p className="text-caption-2">주변에 가게가 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <ul className="space-y-1">
        {stores.map((store) => (
          <li key={store.storeId} className="mx-4 my-2">
            <div
              className="flex cursor-pointer gap-3 rounded-lg border border-white bg-white p-3"
              onClick={() => {
                moveTo({ lat: store.lat, lng: store.lon })
                navigateToStoreDetail(store.storeId.toString())
              }}
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
                    <h3 className="text-body-4 text-gray-1">{store.name}</h3>
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
                  <p className="text-caption-2 text-gray-2">
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

      <div
        ref={observerTarget}
        className={cn('h-1', { invisible: isFetchingNextPage || !hasNextPage })}
        // 로딩 중이거나 더 이상 페이지가 없을 때는 높이를 0으로 만들어 보이지 않게 처리
      />
      {isFetchingNextPage && (
        <div className="p-4 text-center">
          <div className="text-caption-2 text-gray-2">더 불러오는 중...</div>
        </div>
      )}
    </div>
  )
}
