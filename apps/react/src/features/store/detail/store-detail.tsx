import React from 'react'
import { StoreDetailResponse } from '@data/user-api-axios/api'
import { StoreHeader, ParkingBenefits, ParkingLotCard } from '.'
import { OtherStores } from '@/shared/ui/other-stores'

interface StoreDetailProps {
  store: StoreDetailResponse
}

export const StoreDetail: React.FC<StoreDetailProps> = ({ store }) => {
  const { parkingBenefits, associatedParkingLots, ...basicInfo } = store

  const mainParkingLot = associatedParkingLots?.[0]
  const hasOtherStores = mainParkingLot?.otherStores && mainParkingLot.otherStores.length > 0

  return (
    <div className="h-full space-y-6 overflow-y-auto p-6 scrollbar-hide">
      {/* 1. 상점 헤더 */}
      <StoreHeader info={basicInfo} />

      {/* 2. 주차 혜택 */}
      <ParkingBenefits benefits={parkingBenefits} />

      {/* 3. 연관 주차장 && 주차 가능 안내*/}
      {mainParkingLot && <ParkingLotCard parkingLot={mainParkingLot} />}

      {/* 4. 같은 주차장 내 다른 매장 */}
      {hasOtherStores && <OtherStores stores={mainParkingLot.otherStores} />}
    </div>
  )
}
