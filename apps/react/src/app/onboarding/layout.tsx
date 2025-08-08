import { OnboardingProvider } from '@/features/onboarding/context/onboarding-context'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/onboarding')({
  component: RouteComponent,
})

export const OnboardingLayout = () => {
  return (
    <div className="flex w-full flex-1 flex-col px-6 pb-6">
      <Outlet />
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
