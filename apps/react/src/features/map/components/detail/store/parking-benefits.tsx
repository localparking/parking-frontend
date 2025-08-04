import React from 'react'
import type { ParkingBenefitDto } from '@data/user-api-axios/api'
import { formatPrice } from '@/shared/utils/format'

interface ParkingBenefitsProps {
  benefits: ParkingBenefitDto[]
}

export const ParkingBenefits: React.FC<ParkingBenefitsProps> = React.memo(({ benefits }) => {
  if (benefits.length === 0) return null

  return (
    <div className="space-y-2.5">
      <h4 className="text-xs font-semibold text-gray-900">주차 정보 상세</h4>
      <div className="space-y-2.5">
        {benefits.map((benefit) => (
          <div key={benefit.benefitId} className="rounded-md bg-gray-900 px-5 py-1.5 text-center">
            <span className="text-xs leading-[20px] font-bold text-white">
              {formatPrice(benefit.purchaseAmount)} 구매시 {benefit.discountMin}시간 무료 주차
            </span>
          </div>
        ))}
      </div>
    </div>
  )
})

ParkingBenefits.displayName = 'ParkingBenefits'
