import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AgeSelection, ParkingPreference, VisitPurpose } from '@/features/onboarding/components/steps'
import { useEffect, useState } from 'react'
import { OnboardingHeader, OnboardingNavigationButtons } from '@/features/onboarding/components'
import { categoryService } from '@/shared/services/category.service'
import { onboardingService } from '@/shared/services/onboarding.service'
import { useOnboarding } from '@/features/onboarding/model/onboarding.context'
import { useAuth } from '@/features/auth'

export const Route = createFileRoute('/onboarding/final-onboarding/')({
  component: OnboardingFlow,
  loader: async () => {
    const categories = await categoryService.getCategoriesParent()
    return { categories: categories.data || { category: [] } }
  },
})

function OnboardingFlow() {
  const { categories } = Route.useLoaderData()
  const [currentStep, setCurrentStep] = useState(1)
  const [onboardingComplete, setOnboardingComplete] = useState(false)

  const auth = useAuth()
  const navigate = useNavigate()
  const { ageGroup, weight, selectedCategories } = useOnboarding()

  // auth.user 상태가 변경될 때마다, 온보딩이 완료되었는지 확인
  useEffect(() => {
    if (onboardingComplete && auth.user?.isOnboarding) {
      navigate({ to: '/', replace: true })
    }
  }, [auth.user, onboardingComplete, navigate])

  const handleOnboardingSubmit = async () => {
    try {
      await onboardingService.submitOnboarding({
        onboardingRequest: {
          ageGroup,
          weight,
          categoryIds: selectedCategories,
        },
      })
      // 제출이 완료되었다고 플래그를 설정하고, useEffect가 내비게이션을 처리하도록 함
      setOnboardingComplete(true)
      await auth.refetchUser() // 이 함수가 호출되면 auth.user 상태가 변경됨
    } catch (error: any) {
      alert('온보딩 제출에 실패했습니다. 다시 시도해주세요.')
      setOnboardingComplete(false) // 실패 시 플래그 리셋
    }
  }

  const handleNextStep = async () => {
    if (currentStep === 3) {
      await handleOnboardingSubmit()
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, 3))
    }
  }

  const disabled = () => {
    if (currentStep === 1) {
      return !ageGroup
    }
    if (currentStep === 2) {
      return !weight
    }
    if (currentStep === 3) {
      return selectedCategories.length === 0
    }
    return false
  }

  return (
    <div className="flex h-full flex-col justify-center">
      <OnboardingHeader
        currentStep={currentStep}
        onBack={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
        showBackButton={currentStep > 1}
      />
      <section className="mt-[100px]">
        {currentStep === 1 && <AgeSelection />}
        {currentStep === 2 && <ParkingPreference />}
        {currentStep === 3 && <VisitPurpose categories={categories} />}
      </section>

      <div className="mt-auto w-full pt-8">
        <OnboardingNavigationButtons
          onNext={handleNextStep}
          onSkip={handleOnboardingSubmit}
          showSkipButton
          disabled={disabled()}
          nextButtonText={currentStep === 3 ? '시작하기' : '다음으로'}
        />
      </div>
    </div>
  )
}
