import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { IntroSlides, BenefitGuide } from '@/features/onboarding/components/steps'
import { useNavigate } from '@tanstack/react-router'
import bridge from '@/shared/bridge'

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
    localStorage.setItem('hasCompletedLanding', 'true')
    bridge.setLandingStatus(true)
    navigate({ to: '/login', replace: true })
  }

  const handleSkip = () => {
    localStorage.setItem('hasCompletedLanding', 'true')
    bridge.setLandingStatus(true)
    navigate({ to: '/login', replace: true })
  }

  if (currentStep === 'intro') {
    return <IntroSlides onNext={handleIntroComplete} onSkip={handleSkip} />
  }

  return <BenefitGuide onNext={handleGuideComplete} onSkip={handleSkip} />
}
