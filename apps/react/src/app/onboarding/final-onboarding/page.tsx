import { createFileRoute } from '@tanstack/react-router'
import { AgeSelection, ParkingPreference, VisitPurpose } from '@/features/onboarding/components/steps'
import { OnboardingProvider, useOnboarding } from '@/features/onboarding'
import { useEffect } from 'react'
import { useNativeMessageHandler } from '@/shared/hooks'

export const Route = createFileRoute('/onboarding/final-onboarding/')({
  component: FinalOnboardingPage,
})

function OnboardingFlow() {
  const { state } = useOnboarding()
  const { handleWebViewMessage } = useNativeMessageHandler()

  useEffect(() => {
    if (state.isCompleted) {
      const completeMessage = { type: 'onOnboardingComplete' as const, data: { hasCompletedOnboarding: true } }
      handleWebViewMessage(completeMessage)
    }
  }, [state.isCompleted, handleWebViewMessage])

  return (
    <>
      {state.currentStep === 'age-selection' && <AgeSelectionWrapper />}
      {state.currentStep === 'parking-preference' && <ParkingPreference />}
      {state.currentStep === 'visit-purpose' && <VisitPurpose />}
    </>
  )
}

function AgeSelectionWrapper() {
  const handleBack = () => {
    window.location.href = '/onboarding/terms'
  }

  return <AgeSelection onBack={handleBack} />
}

function FinalOnboardingPage() {
  return (
    <OnboardingProvider>
      <OnboardingFlow />
    </OnboardingProvider>
  )
}
