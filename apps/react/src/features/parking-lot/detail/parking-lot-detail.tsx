import React from 'react'
import { ParkingLotDetailResponse } from '@data/user-api-axios/api'
import { ArrowLeft } from 'lucide-react'
import { useNavigation } from '@/features/map/hooks'
import { ParkingLotHeader, ParkingFeeInfo, OperatingHours, OtherStores } from '.'

interface ParkingLotDetailProps {
  parkingLot: ParkingLotDetailResponse
}

export const ParkingLotDetail: React.FC<ParkingLotDetailProps> = ({ parkingLot }) => {
  const { navigateToMapList } = useNavigation()

  const { feePolicy, operatingTable, associatedStores, ...basicInfo } = parkingLot

  const hasFeePolicy = !!feePolicy
  const hasOperatingTable = operatingTable && operatingTable.length > 0
  const hasAssociatedStores = associatedStores && associatedStores.length > 0

  return (
    <div className="flex h-full flex-col rounded-t-[50px] bg-white px-8">
      <div className="flex-1 space-y-6 overflow-y-auto px-4 pb-8">
        <div className="absolute top-8 left-10">
          <button onClick={navigateToMapList}>
            <ArrowLeft size={18} />
          </button>
        </div>

        {/* 1. 주차장 기본 정보 */}
        <ParkingLotHeader info={basicInfo} />

        {/* 2. 주차 요금 정보 */}
        {hasFeePolicy && <ParkingFeeInfo feePolicy={feePolicy} />}

        {/* 3. 운영 시간 */}
        {hasOperatingTable && <OperatingHours operatingTable={operatingTable} />}

        {/* 4. 연관 상점 */}
        {hasAssociatedStores && <OtherStores stores={associatedStores} />}
      </div>
    </div>
  )
}
