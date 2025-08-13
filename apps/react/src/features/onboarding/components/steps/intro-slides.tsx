import { useState, useEffect } from 'react'
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

const slideVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
}

const textVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
}

const usePreloadImages = (imageUrls: string[]) => {
  useEffect(() => {
    imageUrls.forEach((url) => {
      const img = new Image()
      img.src = url
    })
  }, [imageUrls])
}

export const IntroSlides = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  usePreloadImages(introSlidesData.map((slide) => slide.image))

  useEffect(() => {
    if (currentSlideIndex === 0) {
      const timer = setTimeout(() => {
        setCurrentSlideIndex(1)
      }, 1200)

      return () => clearTimeout(timer)
    }
  }, [currentSlideIndex])

  const currentSlideData = introSlidesData[currentSlideIndex]
  if (!currentSlideData) return null

  const isSecondSlide = currentSlideIndex === 1

  return (
    <>
      <div className="mb-10 h-[70px] px-[9px] py-[10px] text-body-4">
        <p>{commonText.line1}</p>
        <AnimatePresence>
          {isSecondSlide && (
            <motion.p
              variants={textVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {commonText.line2}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlideIndex}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="h-[228px] w-[246px]"
        >
          <img src={currentSlideData.image} alt={currentSlideData.alt} className="h-full w-full object-contain" />
        </motion.div>
      </AnimatePresence>
    </>
  )
}
