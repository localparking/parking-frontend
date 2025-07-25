import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { IntroSlides, BenefitGuide } from '@/features/onboarding/components/steps'
import { useNavigate } from '@tanstack/react-router'
import bridge from '@/shared/bridge'
import { isWebView } from '@/shared/utils/webview'
import { OnboardingNavigationButtons } from '@/features/onboarding/components'

export const Route = createFileRoute('/onboarding/landing/')({
  component: LandingPage,
})

function LandingPage() {
  const [currentStep, setCurrentStep] = useState<'intro' | 'guide'>('intro')

  const navigate = useNavigate()

  const handleIntroComplete = () => {
    setCurrentStep('guide')
  }

  const handleGuideComplete = () => {
    if (isWebView()) {
      bridge.setLandingStatus()
    } else {
      localStorage.setItem('hasCompletedLanding', 'true')
    }
    navigate({ to: '/login', replace: true })
  }

  return (
    <div className="relative flex w-full flex-1 flex-col text-center">
      <section className="flex w-full flex-1 flex-col items-center justify-center">
        {currentStep === 'intro' && <IntroSlides />}
        {currentStep === 'guide' && <BenefitGuide />}
      </section>

      <OnboardingNavigationButtons
        onNext={currentStep === 'intro' ? handleIntroComplete : handleGuideComplete}
        onSkip={handleGuideComplete}
      />
    </div>
  )
}
