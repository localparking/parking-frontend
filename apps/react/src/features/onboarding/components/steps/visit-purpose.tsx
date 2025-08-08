import { cn } from '@ui/common/lib/utils'
import { useOnboardingContext } from '../../context/onboarding-context'
import { CategoryResponse } from '@data/user-api-axios/api'

import CoffeeImage from '@ui/common/assets/3d/coffee-icon.png'
import RestaurantImage from '@ui/common/assets/3d/restaurant.png'
import CultureImage from '@ui/common/assets/3d/culture.png'
import LeisureImage from '@ui/common/assets/3d/leisure.png'
import StoreImage from '@ui/common/assets/3d/store.png'

const PURPOSE_DATA = {
  1: { label: '카페를 방문할 때', bgColor: '#FFEF78', image: { src: CoffeeImage, alt: '카페' } },
  2: { label: '음식점을 방문할 때', bgColor: '#BBF7D0', image: { src: RestaurantImage, alt: '식당' } },
  3: { label: '문화 활동을 즐길 때', bgColor: '#FFD5D5', image: { src: CultureImage, alt: '문화' } },
  4: { label: '여가 활동을 즐길 때', bgColor: '#DFDEFF', image: { src: LeisureImage, alt: '여가' } },
  5: { label: '상점을 이용할 때', bgColor: '#F5F5F5', image: { src: StoreImage, alt: '상점' } },
}

export const VisitPurpose = ({ categories }: { categories?: CategoryResponse }) => {
  const { selectedCategories, setSelectedCategories } = useOnboardingContext()

  if (!categories || !categories.category) {
    return null
  }

  return (
    <div className="space-y-[15px]">
      <h1 className="text-body-3">
        주로 차량을 이용해서
        <br />
        어디로 방문하시나요?
      </h1>
      <p className="text-caption-2 text-gray-2">복수선택이 가능해요!</p>

      <div className="flex w-full flex-col items-start">
        <div className="w-full space-y-[20px]">
          {categories.category.map((category) => {
            const isSelected = selectedCategories.includes(category.categoryId)
            const purpose = PURPOSE_DATA[category.categoryId]

            return (
              <button
                key={category.categoryId}
                onClick={() =>
                  setSelectedCategories((prev: number[]) => {
                    if (prev.includes(category.categoryId)) {
                      return prev.filter((id) => id !== category.categoryId)
                    } else {
                      return [...prev, category.categoryId]
                    }
                  })
                }
                className={cn(
                  'flex h-[58px] w-full items-center rounded-[15px] border border-primary-1 px-[18px] py-[9px]',
                  {
                    'bg-primary-1-lighter shadow-[0_0_5px_1px_var(--color-primary-2)]': isSelected,
                    'bg-white': !isSelected,
                  }
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center">
                    <div
                      className="flex h-[40px] w-[40px] items-center justify-center rounded-full"
                      style={{ backgroundColor: purpose.bgColor }}
                    >
                      <img
                        src={purpose.image.src}
                        alt={purpose.image.alt}
                        className="h-[32px] w-[32px] object-contain"
                      />
                    </div>
                  </div>
                  <span className="text-body-5">{purpose.label}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
