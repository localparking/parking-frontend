import React from 'react'
import { cn } from '@ui/common/lib/utils'
import { useOnboardingContext } from '../../model/onboarding.context'
import { AgeRange } from '../../model'

interface AgeSelectionProps {
  onBack?: () => void
  hideBackButton?: boolean
}

export const AgeSelection: React.FC<AgeSelectionProps> = () => {
  const { ageGroup, setAgeGroup } = useOnboardingContext()

  const ageRanges: { label: string; value: AgeRange }[] = [
    { label: '10대', value: AgeRange.AGE_10 },
    { label: '20대', value: AgeRange.AGE_20 },
    { label: '30대', value: AgeRange.AGE_30 },
    { label: '40대', value: AgeRange.AGE_40 },
    { label: '50대 이상', value: AgeRange.AGE_50_PLUS },
  ]

  const handleAgeSelect = (value: AgeRange) => {
    setAgeGroup(value)
  }

  return (
    <>
      <h1 className="mt-[82px] px-6 text-[19px] font-semibold text-gray-1">연령대를 선택하세요</h1>
      <div className="mt-[44px] w-full space-y-[20px] px-6">
        {ageRanges.map((age) => (
          <button
            key={age.value}
            onClick={() => handleAgeSelect(age.value)}
            className={cn(
              'flex w-full items-center justify-center rounded-[10px] border px-[32px] py-[12px] text-[12px] font-semibold',
              {
                'border-primary bg-primary-lighter text-primary shadow-[0_0_5px_1px_var(--color-primary-light)]':
                  ageGroup === age.value,
                'border-primary bg-white text-gray-1': ageGroup !== age.value,
              }
            )}
          >
            {age.label}
          </button>
        ))}
      </div>
    </>
    // </OnboardingLayout>
  )
}
