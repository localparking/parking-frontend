import { createFileRoute, useNavigate } from '@tanstack/react-router'
import registerService from '@/shared/services/register.service'
import { useCallback, useState } from 'react'
import { useAuth } from '@/features/auth'
import { AgreementDto } from '@data/user-api-axios/api'
import { OnboardingCheckbox, OnboardingNavigationButtons } from '@/features/onboarding/components'
import MainLogoImage from '@ui/common/assets/3d/mainlogo.png'

export const Route = createFileRoute('/onboarding/terms/')({
  component: TermsPage,
  loader: async () => {
    const termsResponse = await registerService.findTerms()
    return { terms: termsResponse?.data?.terms || [] }
  },
})

function TermsPage() {
  const { terms } = Route.useLoaderData()
  const { refetchUser } = useAuth()
  const navigate = useNavigate()

  const [agreedTerms, setAgreedTerms] = useState<AgreementDto[]>(
    terms.map((term) => ({ termId: term.termId, agreed: false }))
  )

  const handleTermsAgreed = async () => {
    await registerService.postTerms({ agreements: agreedTerms })
    await refetchUser()
    navigate({ to: '/onboarding/final-onboarding', replace: true })
  }

  const disabled = useCallback(() => {
    return terms
      .filter((term) => term.mandatory)
      .map((term) => !agreedTerms.some((agreed) => agreed.termId === term.termId && agreed.agreed))
      .includes(true)
  }, [terms, agreedTerms])

  const toggleAllAgreement = (checked: boolean) => {
    const updatedAgreements = agreedTerms.map((term) => ({ ...term, agreed: checked }))
    setAgreedTerms(updatedAgreements)
  }

  const toggleAgreement = (termId: number, checked: boolean) => {
    const updatedAgreements = agreedTerms.map((term) => (term.termId === termId ? { ...term, agreed: checked } : term))
    setAgreedTerms(updatedAgreements)
  }

  return (
    <>
      <div className="mt-[70px]">
        <img src={MainLogoImage} alt="메인 로고" className="h-[64px] w-[64px] object-contain" />
        <h1 className="text-body-3 text-gray-1">서비스 이용 동의</h1>
      </div>

      <div className="mt-[30px] flex w-full flex-col items-center">
        <div className="w-full">
          <OnboardingCheckbox
            id="allAgreed"
            checked={terms.every((term) =>
              agreedTerms?.some((agreed) => agreed.termId === term.termId && agreed.agreed)
            )}
            onChange={(checked) => toggleAllAgreement(checked)}
            label="전체 이용 동의"
            showArrow={false}
          />

          <div className="mt-[11px] mb-[19px] h-[2px] rounded-[2px] bg-primary" />

          <div className="space-y-[15px]">
            {terms.map((term) => (
              <OnboardingCheckbox
                key={term.termId}
                id={term.termId.toString()}
                checked={agreedTerms?.some((agreed) => agreed.termId === term.termId && agreed.agreed) ?? false}
                onChange={(checked) => toggleAgreement(term.termId, checked)}
                label={term.title ?? ''}
                // TODO content가 없는 경우에는 false로 처리
                showArrow={term.title !== '[필수] 만 14세 이상입니다'}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto w-full pt-8">
        <OnboardingNavigationButtons onNext={handleTermsAgreed} hideSkipButton={true} disabled={disabled()} />
      </div>
    </>
  )
}
