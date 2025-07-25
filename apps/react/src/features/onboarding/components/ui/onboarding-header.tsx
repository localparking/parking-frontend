import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { ProgressBar } from './progress-bar'
import { OnboardingStep } from '../../model/onboarding.types'
import { cn } from '@ui/common/lib/utils'

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
    <div className={cn('w-full', className)}>
      <div className="flex w-full justify-start px-4 pb-2">
        <button
          onClick={onBack}
          disabled={!showBackButton}
          className={cn('text-black', {
            invisible: !showBackButton,
          })}
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
      </div>
      <ProgressBar currentStep={currentStep} currentStepIndex={0} totalSteps={totalSteps} />
    </div>
  )
}
