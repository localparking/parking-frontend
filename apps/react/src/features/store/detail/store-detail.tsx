import React from 'react'
import { StoreDetailResponse } from '@data/user-api-axios/api'
import { StoreHeader, ParkingBenefits, ParkingLotCard } from '.'
import { OtherStores } from '@/shared/ui/other-stores'
import { useNavigate } from '@tanstack/react-router'

interface StoreDetailProps {
  store: StoreDetailResponse
}

export const StoreDetail: React.FC<StoreDetailProps> = ({ store }) => {
  const { parkingBenefits, associatedParkingLots, ...basicInfo } = store
  const navigate = useNavigate()

  const mainParkingLot = associatedParkingLots?.[0]
  const hasOtherStores = mainParkingLot?.otherStores && mainParkingLot.otherStores.length > 0

  return (
    <div className="relative h-full space-y-6 overflow-y-auto p-6 scrollbar-hide">
      {/* 1. 상점 헤더 */}
      <StoreHeader info={basicInfo} />

      {/* 2. 주차 혜택 */}
      <ParkingBenefits benefits={parkingBenefits} />

      {/* 3. 연관 주차장 && 주차 가능 안내*/}
      {mainParkingLot && <ParkingLotCard parkingLot={mainParkingLot} />}

      {/* 4. 같은 주차장 내 다른 매장 */}
      {hasOtherStores && <OtherStores stores={mainParkingLot.otherStores} />}

      <button
        className="fixed bottom-safe-bottom left-1/2 mb-7 -translate-x-1/2 rounded-[15px] bg-primary-1 px-[67px] py-1"
        onClick={() => navigate({ to: '/detail/store', search: { storeId: store.storeId } })}
      >
        <p className="text-caption-1 whitespace-nowrap text-white">주문하러 가기</p>
      </button>
    </div>
  )
}
