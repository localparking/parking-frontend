import React from 'react'
import { OnboardingHeader, OnboardingNavigationButtons } from '.'
import { OnboardingStep } from '../../model/onboarding.types'

interface OnboardingLayoutProps {
  currentStep: OnboardingStep
  totalSteps: number
  onBack?: () => void
  onNext?: () => void
  onSkip?: () => void
  hideSkipButton?: boolean
  hideBackButton?: boolean
  disabledNext?: boolean
  children: React.ReactNode
  nextButtonText?: string
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onSkip,
  hideSkipButton,
  hideBackButton,
  disabledNext,
  nextButtonText,
  children,
}) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white px-6 py-6" style={{ opacity: 0.9 }}>
      <OnboardingHeader
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBack={onBack}
        showBackButton={!hideBackButton}
      />

      {children}

      {onNext && (
        <div className="mt-auto w-full pt-8">
          <OnboardingNavigationButtons
            onNext={onNext}
            onSkip={onSkip ?? onNext}
            hideSkipButton={hideSkipButton}
            disabled={disabledNext}
            nextButtonText={nextButtonText}
          />
        </div>
      )}
    </div>
  )
}
