import React from 'react'
import { cn } from '@/shared/utils'
import { useOnboardingContext } from '@/features/onboarding/context/onboarding-context'
import { AgeRange } from '@/features/onboarding/model'

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
    <div>
      <h1 className="pt-[10px] text-body-3">연령대를 선택하세요</h1>

      <div className="mt-16 w-full space-y-6">
        {ageRanges.map((age) => (
          <button
            key={age.value}
            onClick={() => handleAgeSelect(age.value)}
            className={cn(
              'flex h-[43px] w-full items-center justify-center rounded-[10px] border px-8 py-3 text-caption-2',
              ageGroup === age.value
                ? 'border-primary-1 bg-primary-3 text-primary-1 shadow-[0_0_5px_1px_var(--color-primary-2)]'
                : 'border-primary-1 bg-white'
            )}
          >
            {age.label}
          </button>
        ))}
      </div>
    </div>
  )
}
