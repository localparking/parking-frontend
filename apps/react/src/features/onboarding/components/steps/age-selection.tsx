import React from 'react'
import { useOnboarding } from '../../hooks'
import { AgeRange } from '../../model/onboarding.types'
import { OnboardingLayout } from '../ui/onboarding-layout'
import { cn } from '@ui/common/lib/utils'

interface AgeSelectionProps {
  onBack?: () => void
  hideBackButton?: boolean
}

export const AgeSelection: React.FC<AgeSelectionProps> = ({ onBack, hideBackButton }) => {
  const { state, setAgeRange, goToNextStep, goToPreviousStep } = useOnboarding()

  const ageRanges: AgeRange[] = ['10대', '20대', '30대', '40대', '50대 이상']

  const handleAgeSelect = (age: AgeRange) => {
    setAgeRange(age)
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      goToPreviousStep()
    }
  }

  const canProceed = state.ageRange !== undefined

  return (
    <OnboardingLayout
      currentStep="age-selection"
      totalSteps={3}
      {...(hideBackButton ? { hideBackButton: true } : { onBack: handleBack, hideBackButton })}
      onNext={goToNextStep}
      onSkip={goToNextStep}
      disabledNext={!canProceed}
    >
      <h1 className="mt-[82px] px-6 text-[19px] font-semibold text-gray-1">연령대를 선택하세요</h1>
      <div className="mt-[44px] w-full space-y-[20px] px-6">
        {ageRanges.map((age) => (
          <button
            key={age}
            onClick={() => handleAgeSelect(age)}
            className={cn(
              'flex w-full items-center justify-center rounded-[10px] border px-[32px] py-[12px] text-[12px] font-semibold',
              {
                'border-primary bg-primary-lighter text-primary shadow-[0_0_5px_1px_var(--color-primary-light)]':
                  state.ageRange === age,
                'border-primary bg-white text-gray-1': state.ageRange !== age,
              }
            )}
          >
            {age}
          </button>
        ))}
      </div>
    </OnboardingLayout>
  )
}
