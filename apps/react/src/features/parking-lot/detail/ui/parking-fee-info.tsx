import React from 'react'
import { formatPrice } from '@/shared/utils/format'
import type { ParkingLotDetailResponse } from '@data/user-api-axios/api'
import { CircleDollarSign } from 'lucide-react'

interface ParkingFeeInfoProps {
  feePolicy: ParkingLotDetailResponse['feePolicy']
}

const isValidFee = (value: unknown): value is number => typeof value === 'number' && value > 0

export const ParkingFeeInfo: React.FC<ParkingFeeInfoProps> = React.memo(({ feePolicy }) => {
  const feeDescriptors = [
    {
      shouldRender: isValidFee(feePolicy.baseTimeMin) && isValidFee(feePolicy.baseFee),
      label: `기본요금 ${feePolicy.baseTimeMin}분`,
      badgeValue: feePolicy.baseFee,
    },
    {
      shouldRender: isValidFee(feePolicy.additionalTimeMin) && isValidFee(feePolicy.additionalFee),
      label: `추가요금 ${feePolicy.additionalTimeMin}분당`,
      badgeValue: feePolicy.additionalFee,
    },
    {
      shouldRender: isValidFee(feePolicy.dayPassFee),
      label: '1일 최대요금',
      badgeValue: feePolicy.dayPassFee,
    },
    {
      shouldRender: isValidFee(feePolicy.monthlyPassFee),
      label: '월 정기권',
      badgeValue: feePolicy.monthlyPassFee,
    },
  ]

  const visibleFeeItems = feeDescriptors
    .filter((item) => item.shouldRender)
    .map((item) => ({
      label: item.label,
      badge: formatPrice(item.badgeValue!),
    }))

  if (visibleFeeItems.length === 0) {
    return null
  }

  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-body-5">주차 정보 상세</h3>
      {visibleFeeItems.length === 0 && (
        <div className="flex h-12 w-full items-center justify-center">
          <p className="text-caption-2 text-gray-2">주차 요금 정보가 없습니다.</p>
        </div>
      )}

      <ul className="space-y-2">
        {visibleFeeItems.map((item) => (
          <li key={item.label} className="flex items-center justify-between">
            <span className="text-caption-2 text-gray-2">{item.label}</span>
            <span className="flex gap-1 rounded-[5px] bg-primary-3 px-2 py-1 text-caption-4 text-primary-1">
              <CircleDollarSign size={12} className="flex-shrink-0" />
              {item.badge}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
})

ParkingFeeInfo.displayName = 'ParkingFeeInfo'
