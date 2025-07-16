import { createFileRoute } from '@tanstack/react-router'
import { OnboardingFlow } from '@/features/onboarding'
import { OnboardingProvider } from '@/features/onboarding/model/onboarding.context'

export const Route = createFileRoute('/onboarding/')({
  component: OnboardingPage,
})

function OnboardingPage() {
  return (
    <div className="h-screen w-full">
      <OnboardingProvider>
        <OnboardingFlow />
      </OnboardingProvider>
    </div>
  )
}
