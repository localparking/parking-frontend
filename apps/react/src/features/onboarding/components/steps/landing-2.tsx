import React, { useState } from 'react'
import CashImage from '@ui/common/assets/3d/cash.png'
import { OnboardingLayout } from '../ui/onboarding-layout'

interface LandingPageTwoProps {
  onNext: () => void
  onSkip: () => void
}

export const LandingPageTwo: React.FC<LandingPageTwoProps> = ({ onNext, onSkip: _onSkip }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <OnboardingLayout currentStep="landing-2" totalSteps={3} hideBackButton onNext={onNext} onSkip={_onSkip}>
      <div className="relative flex flex-1 items-center justify-center">
        <div className="absolute top-1/2 left-1/2 h-[266px] w-[266px] -translate-x-1/2 -translate-y-1/2">
          <img
            src={CashImage}
            alt="현금 3D 이미지"
            className={`h-full w-full object-contain transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        <div className="absolute bottom-[calc(50%+180px)] left-1/2 -translate-x-1/2 px-4 text-center">
          <p className="text-[14px] leading-[25px] font-semibold whitespace-nowrap text-gray-1">
            주차요금, 아직도 제값 다 내고 계세요?
            <br />
            어차피 마실 커피 사고, 주차는 공짜로 즐기세요.
          </p>
        </div>
      </div>
    </OnboardingLayout>
  )
}
