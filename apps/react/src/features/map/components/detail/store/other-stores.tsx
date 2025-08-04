import React from 'react'
import type { AssociatedStoreDto } from '@data/user-api-axios/api'
import { useCategoryContext } from '@/shared/context/category-context'
import { getAssociatedStoreIconPath } from '@/shared/utils/category'
import { cn } from '@ui/common/lib/utils'

interface OtherStoresProps {
  stores: AssociatedStoreDto[]
}

const OtherStoreCard: React.FC<{ store: AssociatedStoreDto }> = React.memo(({ store }) => {
  const { parentIdToPrefixMap } = useCategoryContext()
  return (
    <div className="flex min-w-[124px] items-center gap-2 rounded-2xl border border-gray-200 bg-white/20 p-2">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center">
        <img src={getAssociatedStoreIconPath(store, parentIdToPrefixMap)} alt="카테고리 아이콘" className="h-10 w-10" />
      </div>
      <div className="flex flex-col items-start gap-0.5">
        <span className="text-[8px] text-gray-500">{store.categories?.[0]?.categoryName || '카테고리'}</span>
        <span className="max-w-[90px] truncate text-[10px] font-semibold text-gray-900">
          {store.storeName || '상호명'}
        </span>
        <span
          className={cn(
            'w-fit rounded-full px-1.5 py-0.5 text-[8px] font-semibold',
            store.isOpen ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
          )}
        >
          {store.isOpen ? '영업중' : '영업종료'}
        </span>
      </div>
    </div>
  )
})

OtherStoreCard.displayName = 'OtherStoreCard'

export const OtherStores: React.FC<OtherStoresProps> = React.memo(({ stores }) => {
  if (stores.length === 0) return null

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-gray-900">같은 주차장 내 다른 가게</h3>
      <div className="flex gap-2.5 overflow-x-auto pb-2">
        {stores.map((store) => (
          <OtherStoreCard key={store.storeId ?? `${store.storeName}`} store={store} />
        ))}
      </div>
    </div>
  )
})

OtherStores.displayName = 'OtherStores'
