import React from 'react'
import { Button } from '@ui/common/components/button'

export interface OnboardingNavigationButtonsProps {
  onNext: () => void
  onSkip?: () => void
  nextButtonText?: string
  skipButtonText?: string
  disabled?: boolean
  showSkipButton?: boolean
  hideSkipButton?: boolean
}

export const OnboardingNavigationButtons: React.FC<OnboardingNavigationButtonsProps> = ({
  onNext,
  onSkip,
  nextButtonText = '다음으로',
  skipButtonText = '건너뛰기',
  disabled = false,
  showSkipButton = true,
  hideSkipButton = false,
}) => {
  return (
    <div className="flex w-full flex-col items-center gap-4 pb-[35px]">
      <Button
        onClick={onNext}
        disabled={disabled}
        className="h-[39px] w-full rounded-[10px] bg-primary text-caption-0 text-white transition-all duration-150 active:scale-[0.98] active:bg-[#00B800] disabled:bg-[#BCBCBC] disabled:active:scale-100 disabled:active:bg-[#BCBCBC]"
      >
        {nextButtonText}
      </Button>

      {(showSkipButton || hideSkipButton) && (
        <button
          onClick={hideSkipButton ? undefined : onSkip}
          className={`text-caption-2 underline decoration-[0.7px] underline-offset-2 ${
            hideSkipButton
              ? 'pointer-events-none text-transparent decoration-transparent'
              : 'text-gray-2 decoration-gray-3'
          }`}
        >
          {skipButtonText}
        </button>
      )}
    </div>
  )
}
