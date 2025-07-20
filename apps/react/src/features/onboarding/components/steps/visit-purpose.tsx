import React from 'react'
import { cn } from '@ui/common/lib/utils'
import { useOnboarding } from '../../hooks'
import type { VisitPurpose as VisitPurposeType } from '../../model/onboarding.types'
import { OnboardingLayout } from '../ui/onboarding-layout'

import CoffeeImage from '@ui/common/assets/3d/coffee.png'
import RestaurantImage from '@ui/common/assets/3d/restaurant.png'
import LeisureImage from '@ui/common/assets/3d/leisure.png'
import LifeImage from '@ui/common/assets/3d/life.png'
import OtherImage from '@ui/common/assets/3d/other.png'

const PURPOSE_DATA = {
  cafe: { label: '카페를 방문할 때', bgColor: '#FFEF78', image: { src: CoffeeImage, alt: '카페' } },
  restaurant: { label: '식당을 방문할 때', bgColor: '#BBF7D0', image: { src: RestaurantImage, alt: '식당' } },
  leisure: { label: '여가활동을 즐길 때', bgColor: '#FFD5D5', image: { src: LeisureImage, alt: '여가' } },
  life: { label: '생활 편의를 이용할 때', bgColor: '#DFDEFF', image: { src: LifeImage, alt: '편의' } },
  other: { label: '기타', bgColor: '#F5F5F5', image: { src: OtherImage, alt: '기타' } },
}

const purposes = Object.keys(PURPOSE_DATA).map((key) => ({
  key: key as VisitPurposeType,
  ...PURPOSE_DATA[key as keyof typeof PURPOSE_DATA],
}))

export const VisitPurpose: React.FC = () => {
  const { state, toggleVisitPurpose, goToPreviousStep, submitOnboardingToServer } = useOnboarding()

  const handlePurposeSelect = (purpose: VisitPurposeType) => {
    toggleVisitPurpose(purpose)
  }

  const handleComplete = async () => {
    try {
      await submitOnboardingToServer()
    } catch (error) {
      console.error('온보딩 완료 실패:', error)
      // 에러 처리 (사용자에게 알림 등)
    }
  }

  const canProceed = state.visitPurposes.length > 0

  return (
    <OnboardingLayout
      currentStep="visit-purpose"
      totalSteps={3}
      onBack={goToPreviousStep}
      onNext={handleComplete}
      nextButtonText="완료"
      disabledNext={!canProceed}
    >
      <div className="mt-[82px] px-6">
        <h1 className="text-[19px] leading-[24px] font-semibold text-gray-1">
          주로 차량을 이용해서
          <br />
          어디로 방문하시나요?
        </h1>
        <p className="mt-[18px] text-[10px] font-semibold text-gray-2">복수선택이 가능해요!</p>
      </div>

      <div className="mt-[44px] flex w-full flex-col items-start px-6">
        <div className="w-full space-y-3">
          {purposes.map((purpose) => {
            const isSelected = state.visitPurposes.includes(purpose.key)
            return (
              <button
                key={purpose.key}
                onClick={() => handlePurposeSelect(purpose.key)}
                className={cn('flex h-[58px] w-full items-center rounded-[15px] border border-primary p-4', {
                  'bg-primary-lighter shadow-[0_0_5px_1px_var(--color-primary-light)]': isSelected,
                  'bg-white': !isSelected,
                })}
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
                        className="h-[24px] w-[24px] object-contain"
                      />
                    </div>
                  </div>
                  <span className="text-[14px] font-semibold text-gray-1">{purpose.label}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </OnboardingLayout>
  )
}
