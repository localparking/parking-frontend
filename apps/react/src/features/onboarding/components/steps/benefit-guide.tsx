import React from 'react'
import EtcImage from '@/assets/images/etc.png'
import LogoIcon from '@/assets/icons/app-logo.svg'

const steps = [
  {
    text: (
      <>
        목적지 근방의 <span className="text-primary-1">제휴상점</span> 찾고
      </>
    ),
  },
  {
    text: (
      <>
        혜택 제공 가격에 맞게 <span className="text-primary-1">제품 구매</span> 시,
      </>
    ),
  },
  {
    text: (
      <>
        <span className="text-primary-1">주차 혜택</span> 바로 적용!
      </>
    ),
  },
]

const StepItem = ({ number, text }: { number: number; text: React.ReactNode }) => (
  <div className="flex items-center gap-4 text-caption-2">
    <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[5px] bg-primary-1">
      <span className="text-white">{number}</span>
    </div>
    <div className="flex h-[30px] flex-1 items-center justify-center rounded-[5px] border border-primary-2 px-3">
      <span>{text}</span>
    </div>
  </div>
)

export const BenefitGuide = () => {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <LogoIcon className="h-[22px] w-[22px]" />
          <span className="text-caption-1 text-gray-2">동네 파킹에서만 만나볼 수 있는</span>
        </div>

        <h2 className="text-body-1">
          <span className="text-primary-1">3초면 끝!</span> 혜택 이용법
        </h2>
      </div>

      <div className="h-[201px] w-full">
        <img src={EtcImage} alt="기타 3D 이미지" className={`mx-auto h-[262px] w-[262px] object-contain`} />
      </div>

      <div className="flex w-full flex-col gap-3">
        {steps.map((step, index) => (
          <StepItem key={index} number={index + 1} text={step.text} />
        ))}
      </div>
    </div>
  )
}
