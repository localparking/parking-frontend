import React from 'react'
import { ParkingLotDetailResponse } from '@data/user-api-axios/api'
import { ParkingLotHeader, ParkingFeeInfo, OperatingHours } from '.'
import { OtherStores } from '@/shared/ui/other-stores'

interface ParkingLotDetailProps {
  parkingLot: ParkingLotDetailResponse
}

export const ParkingLotDetail: React.FC<ParkingLotDetailProps> = ({ parkingLot }) => {
  const { feePolicy, operatingTable, associatedStores, ...basicInfo } = parkingLot

  const hasOperatingTable = operatingTable && operatingTable.length > 0
  const hasAssociatedStores = associatedStores && associatedStores.length > 0

  return (
    <div className="space-y-6 overflow-y-auto p-6 scrollbar-hide">
      {/* 1. 주차장 기본 정보 */}
      <ParkingLotHeader info={basicInfo} />

      {/* 2. 주차 요금 정보 */}
      <ParkingFeeInfo feePolicy={feePolicy} />

      {/* 3. 운영 시간 */}
      {hasOperatingTable && <OperatingHours operatingTable={operatingTable} />}

      {/* 4. 연관 상점 */}
      {hasAssociatedStores && <OtherStores stores={associatedStores} />}
    </div>
  )
}
