import { OnboardingProvider, useOnboarding } from '@/features/onboarding'
import { OnboardingHeader, OnboardingNavigationButtons } from '@/features/onboarding/components'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/onboarding')({
  component: RouteComponent,
})

export const OnboardingLayout = () => {
  const { navigationBar, bottomButton } = useOnboarding()

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white px-[34px] pb-6" style={{ opacity: 0.9 }}>
      <OnboardingHeader
        currentStep={navigationBar.currentStep}
        onBack={navigationBar.onBack}
        showBackButton={!navigationBar.showBackButton}
      />

      <Outlet />

      {bottomButton.onNext && (
        <div className="mt-auto w-full pt-8">
          <OnboardingNavigationButtons
            onNext={bottomButton.onNext}
            onSkip={bottomButton.onSkip ?? bottomButton.onNext}
            hideSkipButton={bottomButton.hideSkipButton}
            disabled={bottomButton.disabled}
          />
        </div>
      )}
    </div>
  )
}

function RouteComponent() {
  return (
    <OnboardingProvider>
      <OnboardingLayout />
    </OnboardingProvider>
  )
}
