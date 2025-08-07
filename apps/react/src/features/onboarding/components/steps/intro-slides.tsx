import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import CoffeeImage from '@ui/common/assets/3d/coffee.png'
import CashImage from '@ui/common/assets/3d/cash.png'

const introSlidesData = [
  { step: 'landing-1', image: CashImage, alt: '현금 3D 이미지' },
  { step: 'landing-2', image: CoffeeImage, alt: '커피 3D 이미지' },
] as const

const commonText = {
  line1: '주차요금, 아직도 제값 다 내고 계세요?',
  line2: '어차피 마실 커피 사고, 주차는 공짜로 즐기세요.',
}

export const IntroSlides = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    if (currentSlideIndex === 0) {
      const timer = setTimeout(() => {
        setCurrentSlideIndex(1)
      }, 1200)

      return () => clearTimeout(timer)
    }
  }, [currentSlideIndex])

  const currentSlideData = introSlidesData[currentSlideIndex]

  if (!currentSlideData) {
    return null
  }

  const isSecondSlide = currentSlideIndex === 1

  return (
    <>
      <div className="mb-[30px] flex h-auto min-h-[50px] flex-col justify-center">
        <p className="text-body-4">{commonText.line1}</p>

        <AnimatePresence>
          {isSecondSlide && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-body-4 text-nowrap"
            >
              {commonText.line2}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlideIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-[266px] w-[266px]"
        >
          <img
            src={currentSlideData.image}
            alt={currentSlideData.alt}
            className={`h-full w-full object-contain transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        </motion.div>
      </AnimatePresence>
    </>
  )
}
