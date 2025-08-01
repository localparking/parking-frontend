import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { StoreDetail } from '@/features/map/components/detail'
import { useQuery } from '@tanstack/react-query'
import storeService from '@/shared/services/store.service'

export const Route = createFileRoute('/map/store/$storeId/')({
  component: StoreDetailPage,
})

function StoreDetailPage() {
  const { storeId } = Route.useParams()

  const {
    data: store,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['store', storeId],
    queryFn: async () => {
      const { data } = await storeService.findStoreDetail({ storeId: parseInt(storeId) })
      return data
    },
    enabled: !!storeId,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4">
          <div className="text-center">로딩 중...</div>
        </div>
      </div>
    )
  }

  if (error || !store) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4">
          <div className="text-center text-red-600">가게 정보를 불러올 수 없습니다.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-gray-900">가게 상세 정보</h1>
        <p className="text-gray-600">가게 ID: {storeId}</p>
        <StoreDetail store={store} />
      </div>
    </div>
  )
}
