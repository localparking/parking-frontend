import React from 'react'
import { useOnboarding } from '../../hooks'
import type { VisitPurpose as VisitPurposeType } from '../../model/onboarding.types'
import { OnboardingLayout } from '../../layouts/onboarding-layout'
import CoffeeImage from '@ui/common/assets/3d/coffee.png'
import RestaurantImage from '@ui/common/assets/3d/restaurant.png'
import LeisureImage from '@ui/common/assets/3d/leisure.png'
import LifeImage from '@ui/common/assets/3d/life.png'
import OtherImage from '@ui/common/assets/3d/other.png'

export const VisitPurpose: React.FC = () => {
  const { state, toggleVisitPurpose, goToNextStep, goToPreviousStep } = useOnboarding()

  const purposes: { key: VisitPurposeType; label: string; bgColor: string }[] = [
    { key: 'cafe', label: '카페를 방문할 때', bgColor: '#FFEF78' },
    { key: 'restaurant', label: '식당을 방문할 때', bgColor: '#BBF7D0' },
    { key: 'leisure', label: '여가활동을 즐길 때', bgColor: '#FFD5D5' },
    { key: 'life', label: '생활 편의를 이용할 때', bgColor: '#DFDEFF' },
    { key: 'other', label: '기타', bgColor: '#F5F5F5' },
  ]

  const handlePurposeSelect = (purpose: VisitPurposeType) => {
    toggleVisitPurpose(purpose)
  }

  const canProceed = state.visitPurposes.length > 0

  return (
    <OnboardingLayout
      currentStep="visit-purpose"
      totalSteps={3}
      onBack={goToPreviousStep}
      onNext={goToNextStep}
      nextButtonText="시작하기"
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
                className={`flex h-[58px] w-full items-center rounded-[15px] border p-4 ${
                  isSelected
                    ? 'border-primary bg-primary-lighter shadow-[0_0_5px_1px_var(--color-primary-light)]'
                    : 'border-primary bg-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center">
                    <div
                      className="flex h-[40px] w-[40px] items-center justify-center rounded-full"
                      style={{ backgroundColor: purpose.bgColor }}
                    >
                      {purpose.key === 'cafe' && (
                        <img src={CoffeeImage} alt="카페" className="h-[24px] w-[24px] object-contain" />
                      )}
                      {purpose.key === 'restaurant' && (
                        <img src={RestaurantImage} alt="식당" className="h-[24px] w-[24px] object-contain" />
                      )}
                      {purpose.key === 'leisure' && (
                        <img src={LeisureImage} alt="여가" className="h-[24px] w-[24px] object-contain" />
                      )}
                      {purpose.key === 'life' && (
                        <img src={LifeImage} alt="편의" className="h-[24px] w-[24px] object-contain" />
                      )}
                      {purpose.key === 'other' && (
                        <img src={OtherImage} alt="기타" className="h-[24px] w-[24px] object-contain" />
                      )}
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
