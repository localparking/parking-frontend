import React from 'react'
import type { ParkingBenefitDto } from '@data/user-api-axios/api'
import { formatPrice } from '@/shared/utils/format'
import { CircleParking } from 'lucide-react'
import { cn } from '@ui/common/lib/utils'

interface ParkingBenefitsProps {
  benefits: ParkingBenefitDto[]
  title?: string
  className?: string
}

export const ParkingBenefits: React.FC<ParkingBenefitsProps> = React.memo(
  ({ benefits, title = '주차 정보 상세', className }) => {
    return (
      <section className="flex flex-col gap-2">
        <h3 className={cn('text-body-5 text-gray-1', className)}>{title}</h3>

        {benefits.length === 0 && (
          <div className="flex h-12 w-full items-center justify-center">
            <p className="text-caption-2 text-gray-2">주차 혜택이 없습니다.</p>
          </div>
        )}

        <ul className="space-y-2">
          {benefits.map((benefit) => (
            <li className="flex items-center justify-between" key={benefit.benefitId}>
              <span className="text-caption-2 text-gray-2"> {formatPrice(benefit.purchaseAmount)} 구매시</span>
              <span className="flex w-25 items-center gap-1 rounded-[5px] bg-primary-3 px-2 py-1 text-caption-4 text-primary-1">
                <CircleParking size={12} />
                {Math.floor(benefit.discountMin / 60)}시간 무료 주차
              </span>
            </li>
          ))}
        </ul>
      </section>
    )
  }
)

ParkingBenefits.displayName = 'ParkingBenefits'
