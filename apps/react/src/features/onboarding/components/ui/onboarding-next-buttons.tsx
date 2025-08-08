import Button from '@/shared/ui/button'

export interface OnboardingNavigationButtonsProps {
  onNext: () => void
  onSkip?: () => void
  nextButtonText?: string
  skipButtonText?: string
  disabled?: boolean
  hideSkipButton?: boolean
}

export function OnboardingNavigationButtons(props: OnboardingNavigationButtonsProps) {
  const {
    onNext,
    onSkip,
    nextButtonText = '다음으로',
    skipButtonText = '건너뛰기',
    disabled = false,
    hideSkipButton = false,
  } = props

  return (
    <div className="flex flex-col gap-1">
      <Button onClick={onNext} disabled={disabled}>
        {nextButtonText}
      </Button>

      <Button onClick={onSkip} className="bg-transparent">
        {!hideSkipButton && <p className="text-caption-2 text-gray-2">{skipButtonText}</p>}
      </Button>
    </div>
  )
}
