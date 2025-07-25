import React, { createContext, useContext, useState } from 'react'
import { AgeRange, Weight } from '.'

interface OnboardingContextValue {
  ageGroup: string | null
  setAgeGroup: React.Dispatch<React.SetStateAction<AgeRange | null>>
  weight: Weight | null
  setWeight: React.Dispatch<React.SetStateAction<Weight | null>>
  selectedCategories: number[]
  setSelectedCategories: React.Dispatch<React.SetStateAction<number[]>>
}

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined)

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ageGroup, setAgeGroup] = useState<AgeRange | null>(null)
  const [weight, setWeight] = useState<Weight | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])

  const contextValue: OnboardingContextValue = {
    ageGroup,
    setAgeGroup,
    weight,
    setWeight,
    selectedCategories,
    setSelectedCategories,
  }

  return <OnboardingContext.Provider value={contextValue}>{children}</OnboardingContext.Provider>
}

export const useOnboardingContext = () => {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error('useOnboardingContext must be used within OnboardingProvider')
  return ctx
}

export const useOnboarding = useOnboardingContext
