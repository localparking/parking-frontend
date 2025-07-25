import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AgeSelection, ParkingPreference, VisitPurpose } from '@/features/onboarding/components/steps'
import { useState } from 'react'
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
  const auth = useAuth()
  const navigate = useNavigate()

  const { ageGroup, weight, selectedCategories } = useOnboarding()

  const handleOnboardingSubmit = async () => {
    try {
      await onboardingService.submitOnboarding({
        onboardingRequest: {
          ageGroup,
          weight,
          categoryIds: selectedCategories,
        },
      })
      await auth.refetchUser()
      navigate({ to: '/', replace: true })
    } catch (error: any) {
      console.error('Onboarding submission failed:', error)
      alert('온보딩 제출에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleNextStep = async () => {
    if (currentStep === 3) {
      await handleOnboardingSubmit()
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, 3))
    }
  }
  return (
    <>
      <OnboardingHeader
        currentStep={currentStep}
        onBack={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
        showBackButton={currentStep > 1}
      />

      {currentStep === 1 && <AgeSelection />}
      {currentStep === 2 && <ParkingPreference />}
      {currentStep === 3 && <VisitPurpose categories={categories} />}

      <div className="mt-auto w-full pt-8">
        <OnboardingNavigationButtons onNext={handleNextStep} onSkip={handleOnboardingSubmit} showSkipButton />
      </div>
    </>
  )
}
