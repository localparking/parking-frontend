import React from 'react'
import { Button } from '@ui/common/components/button'

interface OnboardingNavigationButtonsProps {
  /** 다음으로 버튼 클릭 핸들러 */
  onNext: () => void
  /** 건너뛰기 버튼 클릭 핸들러 (선택사항) */
  onSkip?: () => void
  /** 다음으로 버튼 텍스트 (기본값: "다음으로") */
  nextButtonText?: string
  /** 건너뛰기 버튼 텍스트 (기본값: "건너뛰기") */
  skipButtonText?: string
  /** 다음으로 버튼 비활성화 여부 */
  disabled?: boolean
  /** 건너뛰기 버튼 표시 여부 (기본값: true) */
  showSkipButton?: boolean
  /** 건너뛰기 버튼을 투명하게 만들어 위치만 유지 (기본값: false) */
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
    <div className="flex w-full flex-col items-center gap-4 px-[25px]">
      <Button
        onClick={onNext}
        disabled={disabled}
        className="h-[39px] w-full rounded-[10px] bg-primary text-[12px] font-bold text-white transition-all duration-150 active:scale-[0.98] active:bg-[#00B800] disabled:bg-[#BCBCBC] disabled:active:scale-100 disabled:active:bg-[#BCBCBC]"
      >
        {nextButtonText}
      </Button>

      {(showSkipButton || hideSkipButton) && (
        <button
          onClick={hideSkipButton ? undefined : onSkip}
          className={`text-[10px] font-semibold underline decoration-[0.7px] underline-offset-2 ${
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
