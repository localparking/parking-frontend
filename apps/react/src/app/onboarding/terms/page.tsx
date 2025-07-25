import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { TermsAgreement } from '@/features/onboarding/components/steps'
import { OnboardingProvider, useOnboarding } from '@/features/onboarding'
import registerService from '@/shared/services/register.service'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/features/auth'

export const Route = createFileRoute('/onboarding/terms/')({
  component: TermsPage,
})

function TermsPage() {
  return (
    <OnboardingProvider>
      <TermsAgreementWrapper />
    </OnboardingProvider>
  )
}

const termsData: { key: 'age14Plus' | 'serviceTerms' | 'privacyPolicy' | 'marketingOptional'; label: string }[] = [
  { key: 'age14Plus', label: '[필수] 만 14세 이상입니다' },
  { key: 'serviceTerms', label: '[필수] 서비스 이용 약관' },
  { key: 'privacyPolicy', label: '[필수] 개인정보 처리 방침' },
  { key: 'marketingOptional', label: '[선택] 마케팅 정보 수신 동의' },
]

const keyToTitleMap = {
  age14Plus: '만 14세 이상입니다',
  serviceTerms: '서비스 이용 약관',
  privacyPolicy: '개인정보 처리 방침',
  marketingOptional: '마케팅 정보 수신 동의',
} as const

function TermsAgreementWrapper() {
  const { state, setStep } = useOnboarding()
  const { refetchUser } = useAuth()
  const navigate = useNavigate()

  React.useEffect(() => {
    setStep('terms')
  }, [setStep])
  // 약관동의 및 API 호출
  const handleTermsAgreed = async () => {
    const termsResponse = await registerService.findTerms()
    const terms = termsResponse?.data?.terms || []

    const agreements = terms.map((term) => {
      const cleanTitle = term.title?.replace(/\[.*?\]\s*/, '').trim()
      const key = Object.entries(keyToTitleMap).find(([, v]) => v === cleanTitle)?.[0]

      const agreed = term.mandatory ? true : key ? state.termsAgreement[key] : false
      return { termId: term.termId, agreed }
    })
    await registerService.postTerms({ agreements })
    await refetchUser()
    navigate({ to: '/onboarding/final-onboarding', replace: true })
  }

  return <TermsAgreement onNext={handleTermsAgreed} termsData={termsData} />
}
