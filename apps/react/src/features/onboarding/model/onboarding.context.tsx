import React, { createContext, useCallback, useContext, useReducer } from 'react'
import {
  AgeRange,
  OnboardingData,
  ParkingPreference,
  VisitPurpose,
  TermsAgreement,
  initialState,
  onboardingReducer,
  getNextStep,
  getPreviousStep,
  getStepProgress,
} from '../model'

interface OnboardingContextValue {
  state: OnboardingData
  isLoading: boolean
  error?: string
  progress: number
  canProceed: boolean

  setStep: (step: OnboardingData['currentStep']) => void
  goToNextStep: () => void
  goToPreviousStep: () => void
  setAgeRange: (age: AgeRange) => void
  toggleParkingPreference: (pref: ParkingPreference) => void
  toggleVisitPurpose: (purpose: VisitPurpose) => void
  setTermsAgreement: (agreement: Partial<TermsAgreement>) => void
  toggleAllAgreement: () => void
  completeOnboarding: () => void
  resetOnboarding: () => void
  skipCurrentStep: () => void
}

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined)

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(onboardingReducer, initialState)

  const setStep = useCallback((step: OnboardingData['currentStep']) => {
    dispatch({ type: 'SET_STEP', payload: step })
  }, [])

  const goToNextStep = useCallback(() => {
    const nextStep = getNextStep(state.data.currentStep)
    if (nextStep) setStep(nextStep)
  }, [state.data.currentStep, setStep])

  const goToPreviousStep = useCallback(() => {
    const prev = getPreviousStep(state.data.currentStep)
    if (prev) setStep(prev)
  }, [state.data.currentStep, setStep])

  const setAgeRange = useCallback((age: AgeRange) => {
    dispatch({ type: 'SET_AGE_RANGE', payload: age })
  }, [])

  const toggleParkingPreference = useCallback((pref: ParkingPreference) => {
    dispatch({ type: 'TOGGLE_PARKING_PREFERENCE', payload: pref })
  }, [])

  const toggleVisitPurpose = useCallback((purpose: VisitPurpose) => {
    dispatch({ type: 'TOGGLE_VISIT_PURPOSE', payload: purpose })
  }, [])

  const setTermsAgreement = useCallback((agreement: Partial<TermsAgreement>) => {
    dispatch({ type: 'SET_TERMS_AGREEMENT', payload: agreement })
  }, [])

  const toggleAllAgreement = useCallback(() => {
    const { termsAgreement } = state.data
    const newAllAgreed = !termsAgreement.allAgreed
    dispatch({
      type: 'SET_TERMS_AGREEMENT',
      payload: {
        allAgreed: newAllAgreed,
        age14Plus: newAllAgreed,
        serviceTerms: newAllAgreed,
        privacyPolicy: newAllAgreed,
        marketingOptional: newAllAgreed,
      },
    })
  }, [state.data.termsAgreement])

  const completeOnboarding = useCallback(() => {
    dispatch({ type: 'COMPLETE_ONBOARDING' })
  }, [])

  const resetOnboarding = useCallback(() => {
    dispatch({ type: 'RESET_ONBOARDING' })
  }, [])

  const skipCurrentStep = useCallback(() => {
    const { currentStep } = state.data
    if (currentStep === 'age-selection' || currentStep === 'parking-preference' || currentStep === 'visit-purpose') {
      goToNextStep()
    }
  }, [state.data.currentStep, goToNextStep])

  const canProceedFn = () => {
    const { currentStep, ageRange, parkingPreferences, visitPurposes, termsAgreement } = state.data
    switch (currentStep) {
      case 'terms':
        return termsAgreement.age14Plus && termsAgreement.serviceTerms && termsAgreement.privacyPolicy
      case 'age-selection':
        return ageRange !== undefined
      case 'parking-preference':
        return parkingPreferences.length > 0
      case 'visit-purpose':
        return visitPurposes.length > 0
      default:
        return true
    }
  }

  const contextValue: OnboardingContextValue = {
    state: state.data,
    isLoading: state.isLoading,
    error: state.error,
    progress: getStepProgress(state.data.currentStep),
    canProceed: canProceedFn(),
    setStep,
    goToNextStep,
    goToPreviousStep,
    setAgeRange,
    toggleParkingPreference,
    toggleVisitPurpose,
    setTermsAgreement,
    toggleAllAgreement,
    completeOnboarding,
    resetOnboarding,
    skipCurrentStep,
  }

  return <OnboardingContext.Provider value={contextValue}>{children}</OnboardingContext.Provider>
}

export const useOnboardingContext = () => {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error('useOnboardingContext must be used within OnboardingProvider')
  return ctx
}
