import React from 'react'
import EtcImage from '@ui/common/assets/3d/etc.png'
import { OnboardingLayout } from '../../layouts/onboarding-layout'
import LogoIcon from '@ui/common/assets/onboarding/logo.svg'

interface LandingPageThreeProps {
  onNext: () => void
  onSkip: () => void
}

export const LandingPageThree: React.FC<LandingPageThreeProps> = ({ onNext, onSkip: _onSkip }) => {
  return (
    <OnboardingLayout currentStep="landing-3" totalSteps={3} hideBackButton onNext={onNext} onSkip={_onSkip}>
      <div className="flex-[1.5]"></div>

      <div className="mb-8 grid place-items-center [grid-template-areas:'hero']">
        <img src={EtcImage} alt="기타 3D 이미지" className="h-auto w-auto object-contain [grid-area:hero]" />

        <div className="z-10 flex flex-col items-center [grid-area:hero]">
          <div className="-mt-50 mb-4 flex items-center gap-2">
            <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-primary">
              <LogoIcon className="h-full w-full rounded-full" />
            </div>
            <span className="text-[12px] font-semibold whitespace-nowrap text-gray-2">
              동네 파킹에서만 만나볼 수 있는
            </span>
          </div>

          <h2 className="text-center text-[24px] font-semibold whitespace-nowrap text-gray-1">
            <span className="text-primary">3초면 끝!</span> 혜택 이용법
          </h2>
        </div>
      </div>

      {/* 혜택 이용법 단계 */}
      <div className="-mt-20 mb-8 flex w-full flex-col justify-center gap-[13px] px-[25px]">
        <div className="flex items-center gap-2">
          <div className="flex h-[28px] w-[28px] items-center justify-center rounded-[5px] bg-primary">
            <span className="text-[11px] font-medium text-white">1</span>
          </div>
          <div className="flex h-[28px] flex-1 items-center justify-center rounded-[5px] border border-primary-light px-3">
            <span className="text-[11px] font-medium text-gray-1">
              목적지 근방의 <span className="text-primary">제휴상점</span> 찾고
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-[28px] w-[28px] items-center justify-center rounded-[5px] bg-primary">
            <span className="text-[11px] font-medium text-white">2</span>
          </div>
          <div className="flex h-[28px] flex-1 items-center justify-center rounded-[5px] border border-primary-light px-3">
            <span className="text-[11px] font-medium text-gray-1">
              혜택 제공 가격에 맞게 <span className="text-primary">제품 구매</span> 시,
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-[28px] w-[28px] items-center justify-center rounded-[5px] bg-primary">
            <span className="text-[11px] font-medium text-white">3</span>
          </div>
          <div className="flex h-[28px] flex-1 items-center justify-center rounded-[5px] border border-primary-light px-3">
            <span className="text-[11px] font-medium text-gray-1">
              <span className="text-primary">주차 혜택</span> 바로 적용!
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1"></div>
    </OnboardingLayout>
  )
}
