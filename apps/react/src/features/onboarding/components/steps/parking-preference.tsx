import React from 'react'
import CashImage from '@/assets/3d/cash.png'
import SpaceImage from '@/assets/3d/space.png'
import LocationImage from '@/assets/3d/locate.png'
import { cn } from '@/shared/utils'
import { useOnboardingContext } from '@/features/onboarding/context/onboarding-context'
import { Weight } from '@/features/onboarding/model'

export const ParkingPreference: React.FC = () => {
  const { weight, setWeight } = useOnboardingContext()

  const preferences: { key: Weight; label: string; image: string; imageSize: string }[] = [
    { key: Weight.PRICE, label: '가격', image: CashImage, imageSize: 'h-[100px] w-[100px]' },
    {
      key: Weight.DISTANCE,
      label: '위치 및 접근성',
      image: LocationImage,
      imageSize: 'h-[70px] w-[70px]',
    },
    { key: Weight.PARKING_SPACE, label: '주차공간', image: SpaceImage, imageSize: 'h-[100px] w-[100px]' },
  ]

  return (
    <div>
      <h1 className="align-text-bottom text-body-3">
        주차 중 가장 중요하게
        <br />
        여기는 것은 무엇인가요?
      </h1>

      <div className="mt-12 flex w-full justify-center">
        <div className="grid grid-cols-2 gap-6">
          {preferences.map((preference, index) => {
            const isSelected = weight === preference.key
            return (
              <button
                key={preference.key}
                onClick={() => setWeight(preference.key)}
                className={cn(
                  'relative flex h-[140px] w-[130px] flex-col items-center justify-center rounded-[20px] border border-primary-1 p-4',
                  isSelected ? 'bg-primary-3 text-primary-1 shadow-[0_0_5px_1px_var(--color-primary-2)]' : 'bg-white',
                  { 'col-span-2 mx-auto': index === 2 }
                )}
              >
                <img
                  src={preference.image}
                  alt={preference.label}
                  className={cn(preference.imageSize, '-translate-y-3 transform object-contain')}
                />
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 transform text-center text-body-5 whitespace-nowrap">
                  {preference.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
