import React from 'react'
import { StoreListResponse, PageResponseStoreListResponse } from '@data/user-api-axios/api'
import { useCategoryContext } from '@/shared/context/category-context'
import { cn } from '@ui/common/lib/utils'
import { useNavigation, useMapContext } from '@/features/map'
import { getStoreIconPath } from '@/shared/utils/category'
import { InfiniteListView } from '../generic/infinite-list-view'

interface StoreListProps {
  pages: PageResponseStoreListResponse[] | undefined
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onFetchNextPage: () => void
}

const StoreItem: React.FC<{ store: StoreListResponse }> = ({ store }) => {
  const { parentIdToPrefixMap } = useCategoryContext()
  const { navigateToStoreDetail } = useNavigation()
  const { moveTo } = useMapContext().naverMap

  return (
    <div
      className="flex cursor-pointer gap-3 rounded-lg border border-white bg-white p-3"
      onClick={() => {
        moveTo({ lat: store.lat, lng: store.lon })
        navigateToStoreDetail(store.storeId.toString())
      }}
    >
      <div className="flex-shrink-0">
        <div className="flex h-15 w-15 items-center justify-center rounded-full bg-green-50">
          <img
            src={getStoreIconPath(store, parentIdToPrefixMap)}
            alt={store.categories?.[0]?.categoryName || '스토어'}
            className="h-15 w-15"
          />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-1">
          {store.categories?.[0]?.categoryName && (
            <p className="text-[10px] text-gray-500">{store.categories[0].categoryName}</p>
          )}
          <div className="flex items-center justify-start gap-[5px]">
            <h3 className="text-body-4 text-gray-1">{store.name}</h3>
            <span
              className={cn('rounded-full px-2 py-1 text-[10px] font-semibold', {
                'bg-blue-50 text-blue-600': store.isOpen,
                'bg-red-50 text-red-600': !store.isOpen,
              })}
            >
              {store.isOpen ? '영업중' : '영업마감'}
            </span>
          </div>
          <p className="text-caption-2 text-gray-2">
            {store.discountMin && store.purchaseAmount
              ? `${store.purchaseAmount}원 이상 구매시 ${store.discountMin}분 무료 주차`
              : '주차 혜택 정보 없음'}
          </p>
        </div>
      </div>
    </div>
  )
}

export const StoreList: React.FC<StoreListProps> = (props) => {
  return (
    <InfiniteListView<StoreListResponse>
      {...props}
      getKey={(store) => store.storeId}
      renderItem={(store) => <StoreItem store={store} />}
      emptyMessage="주변에 가게가 없습니다."
      className="space-y-1"
    />
  )
}
