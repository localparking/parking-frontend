import React from 'react'
import { Button } from '@ui/common/components/button'
import MainLogoImage from '@ui/common/assets/3d/mainlogo.png'
import KakaoLogoIcon from '@ui/common/assets/icons/kakao-logo.svg'
import AppleLogoIcon from '@ui/common/assets/icons/apple-logo.svg'
import { OnboardingLayout } from '../ui/onboarding-layout'

interface LandingPageFourProps {
  onNext: () => void
  onKakaoLogin: () => void
  onAppleLogin: () => void
  onGuestStart: () => void
}

export const LandingPageFour: React.FC<LandingPageFourProps> = ({
  onNext,
  onKakaoLogin,
  onAppleLogin,
  onGuestStart,
}) => {
  return (
    <OnboardingLayout currentStep="landing-4" totalSteps={3} hideBackButton hideSkipButton>
      {/* 중앙 컨텐츠 */}
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="mb-12 text-center">
          <h1 className="text-[24px] leading-[29px] font-semibold text-gray-1">
            가장 가까운 <span className="text-primary">무료주차 혜택</span>,
            <br />
            지금 찾아볼까요?
          </h1>
        </div>

        <div className="mb-16">
          <img src={MainLogoImage} alt="메인 로고 3D 이미지" className="h-[200px] w-[200px] object-contain" />
        </div>
      </div>

      {/* 하단 로그인 버튼들 */}
      <div className="flex w-full flex-col gap-4 px-[25px] pb-8">
        {/* 카카오 로그인 */}
        <div className="relative">
          <Button
            onClick={onKakaoLogin}
            className="relative flex h-[39px] w-full items-center justify-center gap-2 rounded-[10px] bg-kakao text-[12px] text-gray-1 transition-all duration-150 active:scale-[0.98] active:bg-[#FFE600]"
          >
            <KakaoLogoIcon className="absolute left-[30px] h-[20px] w-[20px]" />
            카카오로 시작하기
          </Button>
        </div>

        {/* 애플 로그인 */}
        <div className="relative">
          <Button
            onClick={onAppleLogin}
            className="relative flex h-[39px] w-full items-center justify-center gap-2 rounded-[10px] bg-gray-1 text-[12px] text-white transition-all duration-150 active:scale-[0.98] active:bg-[#111111]"
          >
            <AppleLogoIcon className="absolute left-[30px] h-[20px] w-[20px]" />
            애플로 시작하기
          </Button>
        </div>

        {/* 로그인 없이 시작하기 */}
        <div className="text-center">
          <button
            onClick={onGuestStart}
            className="text-[10px] font-semibold text-gray-2 underline decoration-gray-3 decoration-[0.7px] underline-offset-2"
          >
            로그인 없이 시작하기
          </button>
        </div>
      </div>
    </OnboardingLayout>
  )
}
