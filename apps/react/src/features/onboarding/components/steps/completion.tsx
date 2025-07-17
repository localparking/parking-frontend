import React from 'react'
import { useOnboarding } from '../../hooks'
import { OnboardingLayout } from '../ui/onboarding-layout'
import { OnboardingButton } from '../ui'

export const Completion: React.FC = () => {
  const { state, completeOnboarding, resetOnboarding, goToPreviousStep } = useOnboarding()

  const handleComplete = () => {
    completeOnboarding()
    // todo: 완료 후 페이지 이동 로직 추가
  }

  return (
    <OnboardingLayout currentStep="complete" totalSteps={3} onBack={goToPreviousStep} hideSkipButton>
      <div className="flex flex-col items-center px-6 py-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mb-2 text-center text-2xl font-bold">설정이 완료되었습니다!</h1>
          <p className="text-center text-gray-600">이제 맞춤형 주차 서비스를 이용할 수 있습니다.</p>
        </div>

        <div className="mb-8 w-full max-w-md rounded-lg bg-gray-50 p-4">
          <h3 className="mb-3 font-semibold text-gray-800">설정 정보</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">나이대:</span> {state.ageRange}
            </div>
            <div>
              <span className="font-medium">중요 요소:</span> {state.parkingPreferences.join(', ')}
            </div>
            <div>
              <span className="font-medium">이용 목적:</span> {state.visitPurposes.join(', ')}
            </div>
            <div>
              <span className="font-medium">약관 동의:</span>{' '}
              {state.termsAgreement.age14Plus && state.termsAgreement.serviceTerms && state.termsAgreement.privacyPolicy
                ? '완료'
                : '미완료'}
            </div>
          </div>
        </div>

        <div className="w-full max-w-md space-y-3">
          <OnboardingButton variant="primary" onClick={handleComplete} className="w-full">
            서비스 시작하기
          </OnboardingButton>

          <OnboardingButton variant="secondary" onClick={resetOnboarding} className="w-full">
            다시 설정하기
          </OnboardingButton>
        </div>
      </div>
    </OnboardingLayout>
  )
}
