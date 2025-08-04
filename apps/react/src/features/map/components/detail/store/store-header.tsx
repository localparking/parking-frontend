import React from 'react'
import { Phone } from 'lucide-react'
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
      <div className="flex items-start gap-6">
        <div className="flex h-[82px] w-[82px] flex-shrink-0 items-center justify-center">
          <img
            src={getCategoryIconPath(mainCategory?.categoryId || 0, parentIdToPrefixMap)}
            alt="가게"
            className="h-full w-full rounded-lg"
          />
        </div>

        <div className="flex flex-col">
          <div className="mb-1 text-xs text-gray-500">{mainCategory?.categoryName || '카테고리'}</div>
          <div className="flex items-start gap-1.5">
            <h2 className="text-sm font-semibold text-gray-900">{info.name}</h2>
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap',
                info.isOpen ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
              )}
            >
              {info.isOpen ? '영업중' : '영업종료'}
            </span>
          </div>
          <div className="my-1 text-xs font-semibold text-gray-900">
            {info.isOpen ? '영업중' : '영업종료'} {info.todayClosingTime ? `${info.todayClosingTime}까지` : ''}
          </div>
          {info.tel && (
            <div className="flex w-fit items-center gap-2.5 rounded-full bg-gray-50 px-4 py-[5px]">
              <Phone size={12} className="flex-shrink-0" />
              <span className="text-xs font-semibold text-gray-900">{info.tel}</span>
            </div>
          )}
        </div>
      </div>
      <div className="mt-2.5 text-xs text-gray-500">{info.address || '주소 정보 없음'}</div>
    </div>
  )
})

StoreHeader.displayName = 'StoreHeader'
