import React from 'react'
import { cn } from '@ui/common/lib/utils'
import type { ParkingLotDetailResponse } from '@data/user-api-axios/api'
import { useCategoryContext } from '@/shared/context/category-context'
import { getAssociatedStoreIconPath } from '@/shared/utils/category'

interface AssociatedStoresProps {
  stores: NonNullable<ParkingLotDetailResponse['associatedStores']>
}

export const AssociatedStores: React.FC<AssociatedStoresProps> = React.memo(({ stores }) => {
  const { parentIdToPrefixMap } = useCategoryContext()

  if (stores.length === 0) return null

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-gray-900">같은 주차장 내 다른 가게</h3>
      <div className="flex gap-2.5 overflow-x-auto pb-2">
        {stores.map((store, index) => (
          <div
            key={store.storeId ?? index}
            className="flex min-w-[124px] items-center gap-2 rounded-2xl border border-gray-200 bg-white/20 p-2"
          >
            <div className="flex h-10 w-10 items-center justify-center">
              <img src={getAssociatedStoreIconPath(store, parentIdToPrefixMap)} alt="카테고리" className="h-10 w-10" />
            </div>

            <div className="flex flex-col items-start gap-0.5">
              <span className="text-[8px] text-gray-500">{store.categories?.[0]?.categoryName ?? '카테고리'}</span>
              <span className="text-[10px] font-semibold whitespace-nowrap text-gray-900">
                {store.storeName ?? '상호명'}
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
        ))}
      </div>
    </div>
  )
})

AssociatedStores.displayName = 'AssociatedStores'
