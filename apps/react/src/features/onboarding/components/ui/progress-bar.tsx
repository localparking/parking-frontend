import React from 'react'
import { OnboardingStep } from '../../model/onboarding.types'

interface ProgressBarProps {
  currentStep?: OnboardingStep
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const progressSteps = 3

  if (!currentStep) return null

  const getCurrentProgress = () => {
    if (currentStep === 'age-selection') return 1
    if (currentStep === 'parking-preference') return 2
    if (currentStep === 'visit-purpose') return 3
    return 0
  }

  const currentProgress = getCurrentProgress()

  return (
    <div className="flex items-center gap-2 p-4">
      {Array.from({ length: progressSteps }, (_, index) => (
        <div
          key={index}
          className={`h-[3px] flex-1 rounded-full ${index < currentProgress ? 'bg-primary' : 'bg-gray-3'}`}
        />
      ))}
    </div>
  )
}
