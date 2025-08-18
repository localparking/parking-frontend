import React from 'react'
import { MapPin, Phone } from 'lucide-react'
import type { StoreDetailResponse } from '@data/user-api-axios/api'
import { StoreCategoryIcon } from '@/shared/ui/custom-icons'
import StatusBadge from '@/shared/ui/status-badge'

type StoreHeaderInfo = Omit<StoreDetailResponse, 'parkingBenefits' | 'associatedParkingLots'>

interface StoreHeaderProps {
  info: StoreHeaderInfo
}

export const StoreHeader: React.FC<StoreHeaderProps> = React.memo(({ info }) => {
  const mainCategory = info.categories?.[0]

  return (
    <div>
      <div className="flex gap-3">
        <StoreCategoryIcon category={mainCategory} className="flex h-[82px] w-[82px]" />

        <div className="flex flex-col gap-1 py-[4.5px]">
          <p className="text-caption-2 text-gray-2">{mainCategory?.categoryName || '카테고리'}</p>
          <div className="flex items-center gap-1">
            <h2 className="text-body-3 text-gray-1">{info.name}</h2>
            <StatusBadge time={info.todayClosingTime} />
          </div>
          {info.tel && (
            <div className="flex items-center gap-2 text-gray-2">
              <Phone size={16} />
              <span className="text-caption-2">{info.tel}</span>
            </div>
          )}

          {info.address && (
            <div className="flex items-center gap-2 text-gray-2">
              <MapPin size={16} />
              <div className="text-caption-2">{info.address}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

StoreHeader.displayName = 'StoreHeader'
