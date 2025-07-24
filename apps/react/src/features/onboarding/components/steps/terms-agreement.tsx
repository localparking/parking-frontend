import React, { useCallback, useEffect } from 'react'
import { useOnboarding } from '../../hooks'
import { useNavigate } from '@tanstack/react-router'
import MainLogoImage from '@ui/common/assets/3d/mainlogo.png'
import { OnboardingCheckbox } from '../ui'
import { OnboardingLayout } from '../ui/onboarding-layout'
import type { TermsAgreement as TermsAgreementType } from '../../model/onboarding.types'
import { useAuth } from '@/features/auth/hooks/use-auth'

interface TermsAgreementProps {
  onNext?: () => void
  termsData: { key: keyof TermsAgreementType; label: string }[]
}

export const TermsAgreement: React.FC<TermsAgreementProps> = ({ onNext, termsData }) => {
  const { state, setTermsAgreement, toggleAllAgreement, goToNextStep, canProceed } = useOnboarding()
  const navigate = useNavigate()
  const { user, setUser } = useAuth()

  useEffect(() => {
    if (user === null) {
      navigate({ to: '/login', replace: true })
    }
  }, [user, navigate])

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

  const handleBack = () => {
    setUser(null)
  }

  return (
    <OnboardingLayout
      currentStep="terms"
      totalSteps={3}
      onNext={handleNext}
      onBack={handleBack}
      hideSkipButton
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
