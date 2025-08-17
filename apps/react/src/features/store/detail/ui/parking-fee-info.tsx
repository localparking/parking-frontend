import React from 'react'
import type { ParkingBenefitDto } from '@data/user-api-axios/api'
import { formatPrice } from '@/shared/utils/format'
import { CircleParking } from 'lucide-react'

interface ParkingBenefitsProps {
  benefits: ParkingBenefitDto[]
}

export const ParkingBenefits: React.FC<ParkingBenefitsProps> = React.memo(({ benefits }) => {
  if (benefits.length === 0) return null

  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-body-5 text-gray-1">주차 정보 상세</h3>

      <ul className="space-y-2">
        {benefits.map((benefit) => (
          <li className="flex items-center justify-between">
            <span className="text-caption-2 text-gray-2"> {formatPrice(benefit.purchaseAmount)} 구매시</span>
            <span className="flex gap-1 rounded-[5px] bg-primary-3 px-2 py-1 text-caption-4 text-primary-1">
              <CircleParking size={12} className="flex-shrink-0" />
              {benefit.discountMin}시간 무료 주차
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
})

ParkingBenefits.displayName = 'ParkingBenefits'
