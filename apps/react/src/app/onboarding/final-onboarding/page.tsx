import { createFileRoute } from '@tanstack/react-router'
import { AgeSelection, ParkingPreference, VisitPurpose } from '@/features/onboarding/components/steps'
import { useState } from 'react'
import { OnboardingHeader, OnboardingNavigationButtons } from '@/features/onboarding/components'
import { categoryService } from '@/shared/services/category.service'

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
        <OnboardingNavigationButtons
          onNext={() => setCurrentStep((prev) => Math.min(prev + 1, 3))}
          hideSkipButton={true}
          // disabled={}
        />
      </div>
    </>
  )
}
