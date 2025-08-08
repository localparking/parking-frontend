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
    <div className="mt-[168px] flex h-full flex-col">
      <section className="flex flex-1 flex-col justify-between">
        <div className="flex flex-col items-center text-center">
          {currentStep === 'intro' && <IntroSlides />}
          {currentStep === 'guide' && <BenefitGuide />}
        </div>

        <OnboardingNavigationButtons
          onNext={currentStep === 'intro' ? handleIntroComplete : handleGuideComplete}
          onSkip={handleGuideComplete}
        />
      </section>
    </div>
  )
}
