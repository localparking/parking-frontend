import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { IntroSlides, BenefitGuide } from '@/features/onboarding/components/steps'
import { useNavigate } from '@tanstack/react-router'
import bridge from '@/shared/bridge'
import { isWebView } from '@/shared/utils/webview'
import { useOnboarding } from '@/features/onboarding'

export const Route = createFileRoute('/onboarding/landing/')({
  component: LandingPage,
})

function LandingPage() {
  const [currentStep, setCurrentStep] = useState<'intro' | 'guide'>('intro')

  const navigate = useNavigate()
  const { setNextAction, setSkipAction } = useOnboarding()

  useEffect(() => {
    setNextAction(currentStep === 'intro' ? handleIntroComplete : handleGuideComplete)
    setSkipAction(handleGuideComplete)
  }, [setNextAction, setSkipAction, currentStep])

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

  if (currentStep === 'intro') return <IntroSlides />
  if (currentStep === 'guide') return <BenefitGuide />

  return null
}
