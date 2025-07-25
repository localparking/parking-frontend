import { OnboardingProvider } from '@/features/onboarding/model/onboarding.context'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/onboarding')({
  component: RouteComponent,
})

export const OnboardingLayout = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white px-[34px] pb-6">
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
