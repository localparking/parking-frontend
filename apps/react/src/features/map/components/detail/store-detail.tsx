import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { StoreDetailResponse } from '@data/user-api-axios/api'
import { useNavigation } from '../../hooks/use-navigation'

import { StoreHeader } from './store/store-header'
import { ParkingBenefits } from './store/parking-benefits'
import { AssociatedParkingLots } from './store/associated-parking-lots'
import { OtherStores } from './store/other-stores'

interface StoreDetailProps {
  store: StoreDetailResponse
}

export const StoreDetail: React.FC<StoreDetailProps> = ({ store }) => {
  const { navigateToMapList } = useNavigation()

  const { parkingBenefits, associatedParkingLots, ...basicInfo } = store

  const hasParkingBenefits = parkingBenefits && parkingBenefits.length > 0
  const hasAssociatedParkingLots = associatedParkingLots && associatedParkingLots.length > 0

  const mainParkingLot = associatedParkingLots?.[0]
  const hasOtherStores = mainParkingLot?.otherStores && mainParkingLot.otherStores.length > 0

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-t-[40px] bg-white px-8">
      <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-8">
        <div className="absolute top-8 left-10">
          <button onClick={navigateToMapList}>
            <ArrowLeft size={18} />
          </button>
        </div>

        {/* 1. 상점 헤더 */}
        <StoreHeader info={basicInfo} />

        {/* 2. 주차 혜택 */}
        {hasParkingBenefits && <ParkingBenefits benefits={parkingBenefits} />}

        {/* 3. 연관 주차장 */}
        {hasAssociatedParkingLots && <AssociatedParkingLots parkingLots={associatedParkingLots} />}

        {/* 4. 주차 가능 안내 */}
        {mainParkingLot?.curCapacity && (
          <div className="text-xs font-semibold text-gray-900">
            현재 {mainParkingLot.curCapacity}자리 주차 가능해요!
          </div>
        )}

        {/* 5. 같은 주차장 내 다른 가게 */}
        {hasOtherStores && <OtherStores stores={mainParkingLot.otherStores!} />}
      </div>
    </div>
  )
}
