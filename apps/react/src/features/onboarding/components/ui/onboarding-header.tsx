import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { ProgressBar } from './progress-bar'
import { cn } from '@ui/common/lib/utils'

export interface OnboardingHeaderProps {
  showBackButton?: boolean
  onBack?: () => void
  currentStep: number
  className?: string
}

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  showBackButton = true,
  onBack,
  currentStep,
  className = '',
}) => {
  return (
    <div className={cn('w-full pt-[25px]', className)}>
      <div className="flex w-full justify-start pb-2">
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

      <ProgressBar currentStep={currentStep} />
    </div>
  )
}
