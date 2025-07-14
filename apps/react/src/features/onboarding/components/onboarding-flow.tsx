import React from 'react'
import { useOnboarding } from '../hooks'
import { SplashScreen, TermsAgreement, AgeSelection, ParkingPreference, VisitPurpose, Completion } from './steps'
import { LandingPageOne } from './steps/landing-1'
import { LandingPageTwo } from './steps/landing-2'
import { LandingPageThree } from './steps/landing-3'
import { LandingPageFour } from './steps/landing-4'

export const OnboardingFlow: React.FC = () => {
  const { state, goToNextStep, setStep } = useOnboarding()

  const renderCurrentStep = () => {
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

  return <div className="min-h-screen bg-white">{renderCurrentStep()}</div>
}
