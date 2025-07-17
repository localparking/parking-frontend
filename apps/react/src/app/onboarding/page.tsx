import { createFileRoute } from '@tanstack/react-router'
import { OnboardingProvider } from '@/features/onboarding/model/onboarding.context'
import { useOnboarding } from '@/features/onboarding/hooks'
import {
  SplashScreen,
  TermsAgreement,
  AgeSelection,
  ParkingPreference,
  VisitPurpose,
  Completion,
} from '@/features/onboarding/components/steps'
import { LandingPageOne } from '@/features/onboarding/components/steps/landing-1'
import { LandingPageTwo } from '@/features/onboarding/components/steps/landing-2'
import { LandingPageThree } from '@/features/onboarding/components/steps/landing-3'
import { LandingPageFour } from '@/features/onboarding/components/steps/landing-4'

export const Route = createFileRoute('/onboarding/')({
  component: OnboardingPage,
})

function OnboardingView() {
  const { state, goToNextStep, setStep } = useOnboarding()

  switch (state.currentStep) {
    case 'splash':
      return <SplashScreen onComplete={goToNextStep} />
    case 'landing-1':
      return <LandingPageOne onNext={goToNextStep} onSkip={() => setStep('landing-4')} />
    case 'landing-2':
      return <LandingPageTwo onNext={goToNextStep} onSkip={() => setStep('landing-4')} />
    case 'landing-3':
      return <LandingPageThree onNext={goToNextStep} onSkip={() => setStep('landing-4')} />
    case 'landing-4':
      return (
        <LandingPageFour
          onNext={goToNextStep}
          onKakaoLogin={() => {
            // todo: 카카오 로그인 API 구현
            console.log('카카오 로그인')
            goToNextStep()
          }}
          onAppleLogin={() => {
            // todo: 애플 로그인 API 구현
            console.log('애플 로그인')
            goToNextStep()
          }}
          onGuestStart={() => {
            // todo: 비로그인 사용자로 시작
            console.log('비로그인 사용자 시작')
            goToNextStep()
          }}
        />
      )
    case 'terms':
      return <TermsAgreement />
    case 'age-selection':
      return <AgeSelection />
    case 'parking-preference':
      return <ParkingPreference />
    case 'visit-purpose':
      return <VisitPurpose />
    case 'complete':
      return <Completion />
    default:
      return <SplashScreen onComplete={goToNextStep} />
  }
}

function OnboardingPage() {
  return (
    <OnboardingProvider>
      <OnboardingView />
    </OnboardingProvider>
  )
}
