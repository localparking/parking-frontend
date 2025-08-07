import Button from '@/shared/ui/button'
import { cn } from '@ui/common/lib/utils'
import React from 'react'

export interface OnboardingNavigationButtonsProps {
  onNext: () => void
  onSkip?: () => void
  nextButtonText?: string
  skipButtonText?: string
  disabled?: boolean
  showSkipButton?: boolean
  hideSkipButton?: boolean
}

export function OnboardingNavigationButtons(props: OnboardingNavigationButtonsProps) {
  const {
    onNext,
    onSkip,
    nextButtonText = '다음으로',
    skipButtonText = '건너뛰기',
    disabled = false,
    showSkipButton = true,
    hideSkipButton = false,
  } = props

  return (
    <div className="flex w-full flex-col items-center gap-4 pb-[35px]">
      <Button onClick={onNext} disabled={disabled}>
        {nextButtonText}
      </Button>

      {(showSkipButton || hideSkipButton) && (
        <Button
          onClick={hideSkipButton ? undefined : onSkip}
          className={cn(
            'h-5 bg-transparent text-caption-2 underline',
            hideSkipButton
              ? 'pointer-events-none text-transparent decoration-transparent'
              : 'text-gray-2 decoration-gray-3'
          )}
        >
          {skipButtonText}
        </Button>
      )}
    </div>
  )
}
