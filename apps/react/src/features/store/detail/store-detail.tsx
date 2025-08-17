import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { StoreDetailResponse } from '@data/user-api-axios/api'
import { StoreHeader, ParkingBenefits, ParkingLotCard, OtherStores } from '.'
import { useNavigation } from '@/features/map'

interface StoreDetailProps {
  store: StoreDetailResponse
}

export const StoreDetail: React.FC<StoreDetailProps> = ({ store }) => {
  const { navigateToMapList } = useNavigation()

  const { parkingBenefits, associatedParkingLots, ...basicInfo } = store

  const hasParkingBenefits = parkingBenefits && parkingBenefits.length > 0

  const mainParkingLot = associatedParkingLots?.[0]
  const hasOtherStores = mainParkingLot?.otherStores && mainParkingLot.otherStores.length > 0

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-t-[40px] bg-white px-8">
      <div className="flex-1 space-y-6 overflow-y-auto px-4 pb-8">
        <div className="absolute top-8 left-10">
          <button onClick={navigateToMapList}>
            <ArrowLeft size={18} />
          </button>
        </div>

        {/* 1. 상점 헤더 */}
        <StoreHeader info={basicInfo} />

        {/* 2. 주차 혜택 */}
        {hasParkingBenefits && <ParkingBenefits benefits={parkingBenefits} />}

        {/* 3. 연관 주차장 && 주차 가능 안내*/}
        {mainParkingLot && <ParkingLotCard parkingLot={mainParkingLot} />}

        {/* 4. 같은 주차장 내 다른 가게 */}
        {hasOtherStores && <OtherStores stores={mainParkingLot.otherStores!} />}
      </div>
    </div>
  )
}
