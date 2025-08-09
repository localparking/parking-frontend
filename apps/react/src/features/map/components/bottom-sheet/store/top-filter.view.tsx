import React, { useMemo } from 'react'
import { SlidersHorizontal, RefreshCw } from 'lucide-react'
import { useCategoryContext } from '@/shared/context/category-context'
import { useMapContext } from '../../../context/map-context'
import { StoreSearchRequestSortEnum } from '@data/user-api-axios/api'
import { cn } from '@ui/common/lib/utils'
import { getCategoryIconPath } from '@/shared/utils/category'

interface StoreTopFilterProps {
  onFilterIconClick: () => void
  onRefresh: () => void
}

export const StoreTopFilter: React.FC<StoreTopFilterProps> = ({ onFilterIconClick, onRefresh }) => {
  const { categoryTree, parentIdToPrefixMap } = useCategoryContext()
  const { storeSearchParams, setStoreSearchParams } = useMapContext()

  const parentCategories = useMemo(
    () => categoryTree.filter((category) => category.parentId === null || category.parentId === undefined),
    [categoryTree]
  )

  return (
    <div className="px-6 py-3">
      <div className="mb-4 flex items-center justify-start gap-2">
        <button onClick={onFilterIconClick} className="flex text-gray-1">
          <SlidersHorizontal size={16} />
        </button>
        <div className="flex gap-2 overflow-x-auto text-caption-2 scrollbar-hide">
          {parentCategories.map((category) => (
            <button
              key={category.categoryId}
              onClick={() =>
                setStoreSearchParams((prev) => ({
                  ...prev,
                  categoryIds: prev.categoryIds?.includes(category.categoryId) ? undefined : [category.categoryId],
                  page: 0,
                }))
              }
              className={cn(
                'flex h-[31px] flex-shrink-0 items-center justify-center gap-x-1 rounded-[50px] border px-2 py-[6px] transition-colors',
                {
                  'border-gray-1 bg-gray-1 text-white': storeSearchParams.categoryIds?.includes(category.categoryId),
                  'border-gray-300 text-gray-700 hover:bg-gray-50': !storeSearchParams.categoryIds?.includes(
                    category.categoryId
                  ),
                }
              )}
            >
              <img
                src={getCategoryIconPath(category.categoryId, parentIdToPrefixMap)}
                alt={category.categoryName}
                className="h-5 w-5"
              />
              <span>{category.categoryName}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between text-caption-2 text-gray-2">
        <div className="flex items-center gap-[14px]">
          <button
            onClick={() =>
              setStoreSearchParams((prev) => ({ ...prev, sort: StoreSearchRequestSortEnum.Distance, page: 0 }))
            }
            className={storeSearchParams.sort === StoreSearchRequestSortEnum.Distance ? 'text-gray-1' : ''}
          >
            거리순
          </button>
          <button
            onClick={() =>
              setStoreSearchParams((prev) => ({ ...prev, sort: StoreSearchRequestSortEnum.Price, page: 0 }))
            }
            className={storeSearchParams.sort === StoreSearchRequestSortEnum.Price ? 'text-gray-1' : ''}
          >
            가격순
          </button>
        </div>
        <button onClick={onRefresh} className="flex items-center gap-[3px]">
          <RefreshCw size={12} className="text-gray-3" />
          <span>새로고침</span>
        </button>
      </div>
    </div>
  )
}
