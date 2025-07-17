import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { ProgressBar } from './progress-bar'
import { OnboardingStep } from '../../model/onboarding.types'

interface OnboardingHeaderProps {
  showBackButton?: boolean
  onBack?: () => void
  currentStep: OnboardingStep
  totalSteps: number
  className?: string
}

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  showBackButton = true,
  onBack,
  currentStep,
  totalSteps,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      {showBackButton && (
        <div className="flex w-full justify-start px-4 pb-2">
          <button onClick={onBack} className="text-[#000000]">
            <ArrowLeft className="h-6 w-6" />
          </button>
        </div>
      )}
      <ProgressBar currentStep={currentStep} currentStepIndex={0} totalSteps={totalSteps} />
    </div>
  )
}
