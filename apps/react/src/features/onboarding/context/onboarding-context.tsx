import React, { createContext, useContext, useState } from 'react'
import { AgeRange, Weight } from '../model'

interface OnboardingContextValue {
  ageGroup: string | undefined
  setAgeGroup: React.Dispatch<React.SetStateAction<AgeRange | undefined>>
  weight: Weight | undefined
  setWeight: React.Dispatch<React.SetStateAction<Weight | undefined>>
  selectedCategories: number[]
  setSelectedCategories: React.Dispatch<React.SetStateAction<number[]>>
}

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined)

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ageGroup, setAgeGroup] = useState<AgeRange | undefined>(undefined)
  const [weight, setWeight] = useState<Weight | undefined>(undefined)
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
