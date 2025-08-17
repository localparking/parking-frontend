import React from 'react'
import type { AssociatedStoreDto } from '@data/user-api-axios/api'
import { cn } from '@ui/common/lib/utils'

interface OtherStoresProps {
  stores: AssociatedStoreDto[]
}

const OtherStoreCard: React.FC<{ store: AssociatedStoreDto }> = React.memo(({ store }) => {
  return (
    <div className="flex h-[74px] w-[102px] flex-col justify-center gap-0.5 rounded-[15px] border border-gray-3 bg-white px-3 py-2">
      <div className="text-[6px] text-gray-2">{store.categories?.[0]?.categoryName || '카테고리'}</div>
      <div className="flex items-start justify-between gap-1">
        <div className="text-[8px] text-gray-1">{store.storeName || '상호명'}</div>
        <span
          className={cn(
            'rounded-full px-1 py-0.5 text-[6px] font-semibold whitespace-nowrap',
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
    <div className="space-y-2">
      <h3 className="text-body-5 text-gray-1">같은 주차장 내 다른 매장</h3>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {stores.map((store) => (
          <OtherStoreCard key={store.storeId ?? `${store.storeName}`} store={store} />
        ))}
      </div>
    </div>
  )
})

OtherStores.displayName = 'OtherStores'
