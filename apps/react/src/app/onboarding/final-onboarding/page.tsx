import { createFileRoute } from '@tanstack/react-router'
import { AgeSelection, ParkingPreference, VisitPurpose } from '@/features/onboarding/components/steps'
import { OnboardingProvider, useOnboarding } from '@/features/onboarding'
import { useEffect } from 'react'
import { useNativeMessageHandler } from '@/shared/hooks'
import { useRouter } from '@tanstack/react-router'
import { useAuth } from '@/features/auth'
import { isWebView } from '@/shared/utils/webview'

export const Route = createFileRoute('/onboarding/final-onboarding/')({
  component: FinalOnboardingPage,
})

function OnboardingFlow() {
  const { state, submitOnboardingToServer } = useOnboarding()
  const { handleWebViewMessage } = useNativeMessageHandler()
  const auth = useAuth()
  const navigate = useRouter().navigate

  useEffect(() => {
    if (state.isCompleted) {
      const doComplete = async () => {
        await auth.refetchUser()
        navigate({ to: '/', replace: true })
      }
      doComplete()
    }
  }, [state.isCompleted, auth, navigate])

  return (
    <>
      {state.currentStep === 'age-selection' && <AgeSelectionWrapper />}
      {state.currentStep === 'parking-preference' && <ParkingPreference />}
      {state.currentStep === 'visit-purpose' && <VisitPurpose />}
    </>
  )
}

function AgeSelectionWrapper() {
  const router = useRouter()
  const handleBack = () => {
    router.navigate({ to: '/onboarding/terms' })
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
