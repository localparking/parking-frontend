import React from 'react'
import { useOnboarding } from '../../hooks'
import type { ParkingPreference as ParkingPreferenceType } from '../../model/onboarding.types'
import { OnboardingLayout } from '../ui/onboarding-layout'
import CashImage from '@ui/common/assets/3d/cash.png'
import SpaceImage from '@ui/common/assets/3d/space.png'
import LocationImage from '@ui/common/assets/3d/locate.png'

export const ParkingPreference: React.FC = () => {
  const { state, toggleParkingPreference, goToNextStep, goToPreviousStep } = useOnboarding()

  const preferences: { key: ParkingPreferenceType; label: string; image: string; imageSize: string }[] = [
    { key: 'price', label: '가격', image: CashImage, imageSize: 'h-[100px] w-[100px]' },
    { key: 'location', label: '위치 및 접근성', image: LocationImage, imageSize: 'h-[70px] w-[70px]' },
    { key: 'space', label: '주차공간', image: SpaceImage, imageSize: 'h-[100px] w-[100px]' },
  ]

  const handlePreferenceSelect = (preference: ParkingPreferenceType) => {
    toggleParkingPreference(preference)
  }

  const canProceed = state.parkingPreferences.length > 0

  return (
    <OnboardingLayout
      currentStep="parking-preference"
      totalSteps={3}
      onBack={goToPreviousStep}
      onNext={goToNextStep}
      disabledNext={!canProceed}
    >
      <div className="mt-[82px] px-6">
        <h1 className="text-[19px] leading-[24px] font-semibold text-gray-1">
          주차 중 가장 중요하게
          <br />
          여기는 것은 무엇인가요?
        </h1>
        <p className="mt-[18px] text-[10px] font-semibold text-gray-2">복수선택이 가능해요!</p>
      </div>

      <div className="mt-[44px] flex w-full justify-center">
        <div className="grid grid-cols-2 gap-6">
          {preferences.map((preference, index) => {
            const isSelected = state.parkingPreferences.includes(preference.key)
            return (
              <button
                key={preference.key}
                onClick={() => handlePreferenceSelect(preference.key)}
                className={`relative flex h-[140px] w-[130px] flex-col items-center justify-center rounded-[20px] border p-4 ${
                  isSelected
                    ? 'border-primary bg-primary-lighter shadow-[0_0_5px_1px_var(--color-primary-light)]'
                    : 'border-gray-3 bg-white'
                } ${index === 2 ? 'col-span-2 mx-auto' : ''}`}
              >
                <img
                  src={preference.image}
                  alt={preference.label}
                  className={`${preference.imageSize} -translate-y-3 transform object-contain`}
                />
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 transform text-center text-[14px] font-semibold whitespace-nowrap text-gray-1">
                  {preference.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </OnboardingLayout>
  )
}
