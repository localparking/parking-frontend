import React from 'react'
import { StoreDetailResponse } from '@data/user-api-axios/api'

interface StoreDetailProps {
  store: StoreDetailResponse
}

export const StoreDetail: React.FC<StoreDetailProps> = ({ store }) => {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      {/* TODO: 가게 상세 정보 구현 */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">{store.name}</h2>
        <p className="text-sm text-gray-600">TODO: 주소 정보 표시</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">영업시간</span>
          <span className="text-sm font-medium">TODO: 영업시간 정보 표시</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">전화번호</span>
          <span className="text-sm font-medium">{store.tel || '정보 없음'}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">주소</span>
          <span className="text-sm font-medium">{store.address || '정보 없음'}</span>
        </div>
      </div>
    </div>
  )
}
