import React from 'react'
import { MapPin, Phone } from 'lucide-react'
import { cn } from '@ui/common/lib/utils'
import { getCategoryIconPath } from '@/shared/utils/category'
import { useCategoryContext } from '@/shared/context/category-context'
import type { StoreDetailResponse } from '@data/user-api-axios/api'

type StoreHeaderInfo = Omit<StoreDetailResponse, 'parkingBenefits' | 'associatedParkingLots'>

interface StoreHeaderProps {
  info: StoreHeaderInfo
}

export const StoreHeader: React.FC<StoreHeaderProps> = React.memo(({ info }) => {
  const { parentIdToPrefixMap } = useCategoryContext()
  const mainCategory = info.categories?.[0]

  return (
    <div>
      <div className="flex items-start gap-3">
        <div className="flex h-[82px] w-[82px] flex-shrink-0 items-center justify-center">
          <img
            src={getCategoryIconPath(mainCategory?.categoryId || 0, parentIdToPrefixMap)}
            alt="가게"
            className="h-full w-full rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="mb-1 text-caption-3 text-gray-2">{mainCategory?.categoryName || '카테고리'}</div>
          <div className="flex items-start">
            <h2 className="text-body-4 text-gray-1">{info.name}</h2>
            <span
              className={cn(
                'mt-1 rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap',
                info.isOpen ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
              )}
            >
              {info.isOpen ? '영업중' : '영업종료'} {info.todayClosingTime ? `${info.todayClosingTime}까지` : ''}
            </span>
          </div>
          {info.tel && (
            <div className="flex w-fit gap-2">
              <Phone size={12} className="flex-shrink-0" />
              <span className="text-caption-3 text-gray-2">{info.tel}</span>
            </div>
          )}

          {info.address && (
            <div className="flex w-fit gap-2">
              <MapPin size={12} className="flex-shrink-0" />
              <div className="text-caption-3 text-gray-2">{info.address}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

StoreHeader.displayName = 'StoreHeader'
