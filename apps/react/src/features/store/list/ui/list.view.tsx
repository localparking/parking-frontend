import React from 'react'
import { StoreListResponse, PageResponseStoreListResponse } from '@data/user-api-axios/api'
import { useNavigation, useMapContext } from '@/features/map'
import { InfiniteListView } from '@/shared/ui'
import StatusBadge from '@/shared/ui/status-badge'
import { StoreCategoryIcon } from '@/shared/ui/custom-icons'

// --- 타입 및 Item 컴포넌트 정의 ---
interface StoreListProps {
  pages: PageResponseStoreListResponse[] | undefined
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onFetchNextPage: () => void
}

const StoreItem: React.FC<{ store: StoreListResponse }> = ({ store }) => {
  const { navigateToStoreDetail } = useNavigation()
  const { moveTo } = useMapContext().naverMap

  return (
    <div
      className="flex cursor-pointer gap-3 py-3"
      onClick={() => {
        moveTo({ lat: store.lat, lng: store.lon })
        navigateToStoreDetail(store.storeId.toString())
      }}
    >
      <div className="flex h-15 w-15 items-center justify-center rounded-full bg-green-50">
        <StoreCategoryIcon category={store.categories?.[0]} className="h-[60px] w-[60px]" />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        {store.categories?.[0]?.categoryName && (
          <p className="text-caption-3 text-gray-500">{store.categories[0].categoryName}</p>
        )}
        <div className="flex items-center justify-start gap-[5px] pr-[55px]">
          <h3 className="text-body-4 text-gray-1">{store.name}</h3>
          <StatusBadge isOpen={store.isOpen} />
        </div>
        <p className="text-caption-2 text-gray-2">
          {store.discountMin && store.purchaseAmount
            ? `${store.purchaseAmount.toLocaleString()}원 이상 구매시 ${store.discountMin}분 무료 주차`
            : ''}
        </p>
      </div>
    </div>
  )
}

// --- 메인 컴포넌트와 Item static 멤버 결합 ---
export const StoreList: React.FC<StoreListProps> & { Item: typeof StoreItem } = (props) => {
  return (
    <InfiniteListView<StoreListResponse>
      {...props}
      getKey={(store) => store.storeId}
      renderItem={(store) => <StoreItem store={store} />}
      emptyMessage="주변에 매장이 없습니다."
    />
  )
}

StoreList.Item = StoreItem
