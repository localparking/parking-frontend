import React, { useState } from 'react'
import EtcImage from '@ui/common/assets/3d/etc.png'
import { OnboardingLayout } from '../ui/onboarding-layout'
import LogoIcon from '@ui/common/assets/onboarding/logo.svg'

interface BenefitGuideProps {
  onNext: () => void
  onSkip: () => void
}

const steps = [
  {
    number: 1,
    text: (
      <>
        목적지 근방의 <span className="text-primary">제휴상점</span> 찾고
      </>
    ),
  },
  {
    number: 2,
    text: (
      <>
        혜택 제공 가격에 맞게 <span className="text-primary">제품 구매</span> 시,
      </>
    ),
  },
  {
    number: 3,
    text: (
      <>
        <span className="text-primary">주차 혜택</span> 바로 적용!
      </>
    ),
  },
]

const StepItem = ({ number, text }: { number: number; text: React.ReactNode }) => (
  <div className="flex items-center gap-2">
    <div className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[5px] bg-primary">
      <span className="text-[11px] font-medium text-white">{number}</span>
    </div>
    <div className="flex h-[28px] flex-1 items-center justify-center rounded-[5px] border border-primary-light px-3">
      <span className="text-[11px] font-medium text-gray-1">{text}</span>
    </div>
  </div>
)

export const BenefitGuide: React.FC<BenefitGuideProps> = ({ onNext, onSkip }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <OnboardingLayout currentStep="landing-3" totalSteps={3} hideBackButton onNext={onNext} onSkip={onSkip}>
      <div className="flex flex-1 flex-col items-center justify-center px-[25px]">
        <div className="flex flex-col items-center">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-primary">
              <LogoIcon className="h-full w-full rounded-full" />
            </div>
            <span className="text-[12px] font-semibold text-gray-2">동네 파킹에서만 만나볼 수 있는</span>
          </div>
          <h2 className="text-center text-[24px] font-semibold text-gray-1">
            <span className="text-primary">3초면 끝!</span> 혜택 이용법
          </h2>
        </div>

        <div className="my-12 h-[121px] w-[237px]">
          <img
            src={EtcImage}
            alt="기타 3D 이미지"
            className={`h-full w-full object-contain transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        <div className="flex w-full flex-col gap-[13px]">
          {steps.map((step) => (
            <StepItem key={step.number} number={step.number} text={step.text} />
          ))}
        </div>
      </div>
    </OnboardingLayout>
  )
}
