import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { IntroSlides, BenefitGuide } from '@/features/onboarding/components/steps'
import { useNativeMessageHandler } from '@/shared/hooks'

export const Route = createFileRoute('/onboarding/landing/')({
  component: LandingPage,
})

function LandingPage() {
  const [currentStep, setCurrentStep] = useState<'intro' | 'guide'>('intro')
  const { handleWebViewMessage } = useNativeMessageHandler()

  const handleIntroComplete = () => {
    setCurrentStep('guide')
  }

  const handleGuideComplete = () => {
    const message = { type: 'onLandingComplete' as const, data: { hasCompletedLanding: true } }
    handleWebViewMessage(message)
  }

  const handleSkip = () => {
    const message = { type: 'onLandingComplete' as const, data: { hasCompletedLanding: true } }
    handleWebViewMessage(message)
  }

  if (currentStep === 'intro') {
    return <IntroSlides onNext={handleIntroComplete} onSkip={handleIntroComplete} />
  }

  return <BenefitGuide onNext={handleGuideComplete} onSkip={handleSkip} />
}
