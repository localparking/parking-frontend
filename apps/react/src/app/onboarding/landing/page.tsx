import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { IntroSlides, BenefitGuide } from '@/features/onboarding/components/steps'
import { useNavigate } from '@tanstack/react-router'
import bridge from '@/shared/bridge'
import { isWebView } from '@/shared/utils/webview'

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

  const handleSkip = () => {
    if (isWebView()) {
      bridge.setLandingStatus()
    } else {
      localStorage.setItem('hasCompletedLanding', 'true')
    }
    navigate({ to: '/login', replace: true })
  }

  if (currentStep === 'intro') {
    return <IntroSlides onNext={handleIntroComplete} onSkip={handleSkip} />
  }

  return <BenefitGuide onNext={handleGuideComplete} onSkip={handleSkip} />
}
