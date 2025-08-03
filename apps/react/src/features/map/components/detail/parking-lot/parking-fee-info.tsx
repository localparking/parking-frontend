import React from 'react'
import { formatPrice } from '@/shared/utils/format'
import type { ParkingLotDetailResponse } from '@data/user-api-axios/api'

interface ParkingFeeInfoProps {
  feePolicy: ParkingLotDetailResponse['feePolicy']
}

const FeeInfoRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded-md bg-gray-900 px-5 py-1.5 text-center">
    <span className="text-xs leading-[20px] font-bold text-white">{children}</span>
  </div>
)

export const ParkingFeeInfo: React.FC<ParkingFeeInfoProps> = React.memo(({ feePolicy }) => {
  const items: Array<string | null> = [
    feePolicy.baseTimeMin ? `기본 무료 회차 ${feePolicy.baseTimeMin}분` : null,
    feePolicy.baseFee ? `기본요금 ${feePolicy.baseTimeMin || 30}분 ${formatPrice(feePolicy.baseFee)}` : null,
    feePolicy.additionalFee
      ? `추가요금 ${feePolicy.additionalTimeMin || 10}분당 ${formatPrice(feePolicy.additionalFee)}`
      : null,
    feePolicy.dayPassFee ? `1일 최대요금 ${formatPrice(feePolicy.dayPassFee)}` : null,
  ]

  if (items.every((item) => item === null)) return null

  return (
    <div className="space-y-2.5">
      <h4 className="text-xs font-semibold text-gray-900">주차 정보 상세</h4>
      <div className="space-y-2.5">
        {items.map((text, idx) => (text ? <FeeInfoRow key={idx}>{text}</FeeInfoRow> : null))}
      </div>
    </div>
  )
})

ParkingFeeInfo.displayName = 'ParkingFeeInfo'
