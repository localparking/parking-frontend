import React, { useCallback } from 'react'
import { useOnboarding } from '../../hooks'
import MainLogoImage from '@ui/common/assets/3d/mainlogo.png'
import { OnboardingCheckbox } from '../ui'
import { OnboardingLayout } from '../ui/onboarding-layout'

export const TermsAgreement: React.FC = () => {
  const { state, setTermsAgreement, toggleAllAgreement, goToNextStep, canProceed } = useOnboarding()

  const handleAgreementChange = useCallback(
    (key: keyof typeof state.termsAgreement, value: boolean) => {
      setTermsAgreement({ [key]: value })
    },
    [setTermsAgreement]
  )

  const handleAge14PlusChange = useCallback(
    (checked: boolean) => {
      handleAgreementChange('age14Plus', checked)
    },
    [handleAgreementChange]
  )

  const handleServiceTermsChange = useCallback(
    (checked: boolean) => {
      handleAgreementChange('serviceTerms', checked)
    },
    [handleAgreementChange]
  )

  const handlePrivacyPolicyChange = useCallback(
    (checked: boolean) => {
      handleAgreementChange('privacyPolicy', checked)
    },
    [handleAgreementChange]
  )

  const handleMarketingOptionalChange = useCallback(
    (checked: boolean) => {
      handleAgreementChange('marketingOptional', checked)
    },
    [handleAgreementChange]
  )

  return (
    <OnboardingLayout
      currentStep="terms"
      totalSteps={3}
      onNext={goToNextStep}
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
            <OnboardingCheckbox
              id="age14Plus"
              checked={state.termsAgreement.age14Plus}
              onChange={handleAge14PlusChange}
              label="[필수] 만 14세 이상입니다."
            />

            <OnboardingCheckbox
              id="serviceTerms"
              checked={state.termsAgreement.serviceTerms}
              onChange={handleServiceTermsChange}
              label="[필수] 서비스 이용 약관"
            />

            <OnboardingCheckbox
              id="privacyPolicy"
              checked={state.termsAgreement.privacyPolicy}
              onChange={handlePrivacyPolicyChange}
              label="[필수] 개인정보 처리 방침"
            />

            <OnboardingCheckbox
              id="marketingOptional"
              checked={state.termsAgreement.marketingOptional}
              onChange={handleMarketingOptionalChange}
              label="[선택] 마케팅 정보 수신 동의"
            />
          </div>
        </div>
      </div>
    </OnboardingLayout>
  )
}
