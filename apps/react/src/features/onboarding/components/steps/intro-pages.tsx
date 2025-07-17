import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { OnboardingLayout } from '../ui/onboarding-layout'

import CoffeeImage from '@ui/common/assets/3d/coffee.png'
import CashImage from '@ui/common/assets/3d/cash.png'

const introPagesData = [
  { step: 'landing-1', image: CashImage, alt: '현금 3D 이미지' },

  { step: 'landing-2', image: CoffeeImage, alt: '커피 3D 이미지' },
] as const

const commonText = {
  line1: '주차요금, 아직도 제값 다 내고 계세요?',
  line2: '어차피 마실 커피 사고, 주차는 공짜로 즐기세요.',
}

interface IntroPagesProps {
  onNext: () => void
  onSkip: () => void
}

export const IntroPages: React.FC<IntroPagesProps> = ({ onNext, onSkip }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    if (currentPageIndex === 0) {
      const timer = setTimeout(() => {
        setCurrentPageIndex(1)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [currentPageIndex])

  const currentPageData = introPagesData[currentPageIndex]

  if (!currentPageData) {
    return null
  }

  const isSecondPage = currentPageIndex === 1

  return (
    <OnboardingLayout
      currentStep={currentPageData.step}
      totalSteps={3}
      hideBackButton
      hideSkipButton={!isSecondPage}
      onNext={onNext}
      onSkip={onSkip}
    >
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        {/* 텍스트 컨테이너 */}
        <div className="mb-[30px] flex h-auto min-h-[50px] flex-col justify-center">
          {/* 첫 번째 줄 텍스트: 항상 렌더링 */}
          <p className="text-[14px] leading-[25px] font-semibold text-gray-1">{commonText.line1}</p>

          {/* 두 번째 줄 텍스트: 두 번째 페이지(인덱스 1)일 때만 애니메이션과 함께 렌더링 */}
          <AnimatePresence>
            {isSecondPage && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-[14px] leading-[25px] font-semibold text-gray-1"
              >
                {commonText.line2}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* 이미지 컨테이너: AnimatePresence로 이미지 전환 효과 추가 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-[266px] w-[266px]"
          >
            <img
              src={currentPageData.image}
              alt={currentPageData.alt}
              className={`h-full w-full object-contain transition-opacity duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </OnboardingLayout>
  )
}
