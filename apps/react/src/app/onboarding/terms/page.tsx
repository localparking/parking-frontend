import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { TermsAgreement } from '@/features/onboarding/components/steps'
import { OnboardingProvider, useOnboarding } from '@/features/onboarding'
import { useNativeMessageHandler } from '@/shared/hooks'

export const Route = createFileRoute('/onboarding/terms/')({
  component: TermsPage,
})

function TermsPage() {
  const { handleWebViewMessage } = useNativeMessageHandler()

  const handleTermsAgreed = () => {
    const message = { type: 'onTermsAgreed' as const, data: { hasAgreedToTerms: true } }
    handleWebViewMessage(message)
  }

  return (
    <OnboardingProvider>
      <TermsAgreementWrapper onTermsAgreed={handleTermsAgreed} />
    </OnboardingProvider>
  )
}

function TermsAgreementWrapper({ onTermsAgreed }: { onTermsAgreed: () => void }) {
  const { state, canProceed, setStep } = useOnboarding()

  React.useEffect(() => {
    setStep('terms')
  }, [setStep])

  return <TermsAgreement onNext={onTermsAgreed} />
}
