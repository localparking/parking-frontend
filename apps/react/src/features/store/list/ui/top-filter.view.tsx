import React, { useCallback } from 'react'
import { SlidersHorizontal, RefreshCw } from 'lucide-react'
import { useMapContext } from '@/features/map/context/map-context'
import { StoreSearchRequestSortEnum } from '@data/user-api-axios/api'
import { cn } from '@ui/common/lib/utils'
import { useCategoryContext } from '@/shared/context/category-context'
import { StoreCategoryIcon } from '@/shared/ui/custom-icons'

interface StoreTopFilterProps {
  onFilterIconClick: () => void
  onRefresh: () => void
}

export const StoreTopFilter: React.FC<StoreTopFilterProps> = ({ onFilterIconClick, onRefresh }) => {
  const { categoryTree } = useCategoryContext()
  const { storeSearchParams, setStoreSearchParams } = useMapContext()

  // 단일/토글 선택을 명확히: 해제 시 []로
  const isSelected = useCallback(
    (id: number) => storeSearchParams.categoryIds?.includes(id) ?? false,
    [storeSearchParams.categoryIds]
  )

  const handleCategoryClick = useCallback(
    (id: number) => {
      const selected = storeSearchParams.categoryIds ?? []
      const nextSelected = selected.includes(id) ? [] : [id] // 단일 선택
      setStoreSearchParams((prev) => ({
        ...prev,
        categoryIds: nextSelected, // 해제 시 [] 유지
        page: 0,
      }))
    },
    [setStoreSearchParams, storeSearchParams.categoryIds]
  )

  const setSort = useCallback(
    (sort: StoreSearchRequestSortEnum) => {
      if (storeSearchParams.sort === sort) return
      setStoreSearchParams((prev) => ({ ...prev, sort, page: 0 }))
    },
    [setStoreSearchParams, storeSearchParams.sort]
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <button onClick={onFilterIconClick} className="flex text-gray-1" aria-label="필터 열기" type="button">
          <SlidersHorizontal size={16} />
        </button>

        <div className="flex gap-2 overflow-x-auto text-caption-2 scrollbar-hide" aria-label="상위 카테고리">
          {categoryTree.map((category) => {
            const selected = isSelected(category.categoryId)
            return (
              <button
                key={category.categoryId}
                type="button"
                onClick={() => handleCategoryClick(category.categoryId)}
                aria-pressed={selected}
                data-selected={selected ? '' : undefined}
                className={cn(
                  'flex items-center justify-center gap-x-1 rounded-[50px] border px-2 py-[6px] whitespace-nowrap hover:cursor-pointer',
                  selected ? 'border-gray-1 bg-gray-1 text-white' : 'border-gray-3 text-gray-700 hover:bg-gray-50'
                )}
              >
                <div className="h-5 w-5 rounded-full bg-white">
                  <StoreCategoryIcon category={category} className="h-5 w-5" />
                </div>
                <span>{category.categoryName}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-between text-caption-2 text-gray-2">
        <div className="flex items-center gap-[14px]" role="group" aria-label="정렬 옵션">
          <button
            type="button"
            onClick={() => setSort(StoreSearchRequestSortEnum.Distance)}
            className={storeSearchParams.sort === StoreSearchRequestSortEnum.Distance ? 'text-gray-1' : ''}
            aria-pressed={storeSearchParams.sort === StoreSearchRequestSortEnum.Distance}
          >
            거리순
          </button>
          <button
            type="button"
            onClick={() => setSort(StoreSearchRequestSortEnum.Price)}
            className={storeSearchParams.sort === StoreSearchRequestSortEnum.Price ? 'text-gray-1' : ''}
            aria-pressed={storeSearchParams.sort === StoreSearchRequestSortEnum.Price}
          >
            가격순
          </button>
        </div>

        <button type="button" onClick={onRefresh} className="flex items-center gap-[3px]" aria-label="결과 새로고침">
          <RefreshCw size={12} className="text-gray-3" />
          <span>새로고침</span>
        </button>
      </div>
    </div>
  )
}
