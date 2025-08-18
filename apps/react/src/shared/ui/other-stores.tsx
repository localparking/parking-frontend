import React from 'react'
import type { AssociatedStoreDto } from '@data/user-api-axios/api'
import { cn } from '@ui/common/lib/utils'
import StatusBadge from '@/shared/ui/status-badge'

interface OtherStoresProps {
  stores: AssociatedStoreDto[]
}

const OtherStoreCard: React.FC<{ store: AssociatedStoreDto }> = React.memo(({ store }) => {
  return (
    <div className="flex min-h-[74px] min-w-[142px] flex-col justify-center gap-0.5 rounded-[15px] border border-gray-3 px-1.5 py-5">
      <div className="text-caption-4 text-gray-2">{store.categories?.[0]?.categoryName || '카테고리'}</div>
      <div className="flex items-start justify-between gap-1">
        <div className="text-caption-4 text-gray-1">{store.storeName || '상호명'}</div>
        <StatusBadge isOpen={store.isOpen} />
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
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {stores.map((store) => (
          <OtherStoreCard key={store.storeId ?? `${store.storeName}`} store={store} />
        ))}
      </div>
    </div>
  )
})

OtherStores.displayName = 'OtherStores'
