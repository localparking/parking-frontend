import React, { useCallback } from 'react'
import { useOnboarding } from '../../hooks'
import MainLogoImage from '@ui/common/assets/3d/mainlogo.png'
import { OnboardingCheckbox } from '../ui'
import { OnboardingLayout } from '../ui/onboarding-layout'
import type { TermsAgreement as TermsAgreementType } from '../../model/onboarding.types'

const termsData: { key: keyof Omit<TermsAgreementType, 'allAgreed'>; label: string }[] = [
  { key: 'age14Plus', label: '[필수] 만 14세 이상입니다.' },
  { key: 'serviceTerms', label: '[필수] 서비스 이용 약관' },
  { key: 'privacyPolicy', label: '[필수] 개인정보 처리 방침' },
  { key: 'marketingOptional', label: '[선택] 마케팅 정보 수신 동의' },
]

interface TermsAgreementProps {
  onNext?: () => void
}

export const TermsAgreement: React.FC<TermsAgreementProps> = ({ onNext }) => {
  const { state, setTermsAgreement, toggleAllAgreement, goToNextStep, canProceed } = useOnboarding()

  const handleAgreementChange = useCallback(
    (key: keyof TermsAgreementType, value: boolean) => {
      setTermsAgreement({ [key]: value })
    },
    [setTermsAgreement]
  )

  const handleNext = () => {
    if (onNext) {
      onNext()
    } else {
      goToNextStep()
    }
  }

  return (
    <OnboardingLayout
      currentStep="terms"
      totalSteps={3}
      onNext={handleNext}
      hideSkipButton
      hideBackButton
      disabledNext={!canProceed}
    >
      <div className="mt-[120px] px-6">
        <img src={MainLogoImage} alt="메인 로고" className="h-[60px] w-[60px] object-contain" />
        <h1 className="text-[19px] font-semibold text-gray-1">서비스 이용 동의</h1>
      </div>

      <div className="mt-[24px] flex w-full flex-col items-center px-6">
        <div className="w-full space-y-[15px]">
          <OnboardingCheckbox
            id="allAgreed"
            checked={state.termsAgreement.allAgreed}
            onChange={toggleAllAgreement}
            label="전체 이용 동의"
          />

          <div className="h-[2px] bg-primary" />

          <div className="space-y-[15px]">
            {termsData.map((term) => (
              <OnboardingCheckbox
                key={term.key}
                id={term.key}
                checked={state.termsAgreement[term.key]}
                onChange={(checked) => handleAgreementChange(term.key, checked)}
                label={term.label}
              />
            ))}
          </div>
        </div>
      </div>
    </OnboardingLayout>
  )
}
