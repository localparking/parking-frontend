import React, { useEffect } from 'react'
import CoffeeImage from '@ui/common/assets/3d/coffee.png'
import { OnboardingLayout } from '../../layouts/onboarding-layout'

interface LandingPageOneProps {
  onNext: () => void
  onSkip: () => void
}

export const LandingPageOne: React.FC<LandingPageOneProps> = ({ onNext, onSkip: _onSkip }) => {
  useEffect(() => {
    const timer = setTimeout(onNext, 1000)
    return () => clearTimeout(timer)
  }, [onNext])

  return (
    <OnboardingLayout currentStep="landing-1" totalSteps={3} hideBackButton hideSkipButton>
      <div className="relative flex flex-1 items-center justify-center">
        <img
          src={CoffeeImage}
          alt="커피 3D 이미지"
          className="absolute top-1/2 left-1/2 h-[266px] w-[266px] -translate-x-1/2 -translate-y-1/2 object-contain"
        />

        <div className="absolute bottom-[calc(50%+180px)] left-1/2 -translate-x-1/2 px-4 text-center">
          <p className="text-[14px] leading-[25px] font-semibold whitespace-nowrap text-gray-1">
            주차요금, 아직도 제값 다 내고 계세요?
            <br />
            어차피 마실 커피 사고, 주차는 공짜로 즐기세요.
          </p>
        </div>
      </div>

      <div className="invisible mt-auto w-full pt-8">
        <div className="flex w-full flex-col items-center gap-4 px-[25px]">
          <div className="h-[39px] w-full" />
          <div className="h-[16px]" />
        </div>
      </div>
    </OnboardingLayout>
  )
}
