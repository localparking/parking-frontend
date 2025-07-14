import React, { useEffect } from 'react'
import LogoIcon from '@ui/common/assets/onboarding/logo.svg'
import { OnboardingLayout } from '../../layouts/onboarding-layout'

interface SplashScreenProps {
  onComplete: () => void
  duration?: number
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, duration)
    return () => clearTimeout(timer)
  }, [onComplete, duration])

  return (
    <OnboardingLayout currentStep="splash" totalSteps={3} hideBackButton hideSkipButton>
      <div className="absolute inset-0 -z-10 bg-primary" />

      <div className="flex flex-1 items-center justify-center">
        <LogoIcon className="h-[120px] w-[120px]" />
      </div>
    </OnboardingLayout>
  )
}
