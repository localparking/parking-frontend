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
import { onboardingService } from '../services/onboarding.service'

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
  submitOnboardingToServer: () => Promise<void>
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
    if (nextStep) {
      setStep(nextStep)
    } else {
      // visit-purpose 단계가 마지막이므로 온보딩 완료
      dispatch({ type: 'COMPLETE_ONBOARDING' })
    }
  }, [state.data.currentStep, setStep])

  const goToPreviousStep = useCallback(() => {
    const prev = getPreviousStep(state.data.currentStep)
    if (prev) {
      setStep(prev)
    }
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

  const submitOnboardingToServer = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'CLEAR_ERROR' })

      // 온보딩 데이터를 API 형식으로 변환
      const { ageRange, parkingPreferences, visitPurposes } = state.data

      // 나이대 매핑
      const ageGroupMap: Record<AgeRange, string> = {
        '10대': 'AGE_10',
        '20대': 'AGE_20',
        '30대': 'AGE_30',
        '40대': 'AGE_40',
        '50대 이상': 'AGE_50_PLUS',
      }

      // 가중치 매핑 (parkingPreferences를 weight로 변환)
      const weightMap: Record<ParkingPreference, string> = {
        price: 'PRICE',
        space: 'PARKING_SPACE',
        location: 'DISTANCE',
      }

      // 방문 목적을 카테고리 ID로 매핑 (임시 매핑)
      const categoryMap: Record<VisitPurpose, number> = {
        cafe: 1,
        restaurant: 2,
        leisure: 3,
        life: 4,
        other: 5,
      }

      const ageGroup = (() => {
        if (!ageRange) return undefined
        switch (ageRange) {
          case '10대':
            return 'AGE_10'
          case '20대':
            return 'AGE_20'
          case '30대':
            return 'AGE_30'
          case '40대':
            return 'AGE_40'
          case '50대 이상':
            return 'AGE_50_PLUS'
          default:
            return undefined
        }
      })()

      const weight = (() => {
        if (parkingPreferences.length === 0) return undefined
        const preference = parkingPreferences[0]
        switch (preference) {
          case 'price':
            return 'PRICE'
          case 'space':
            return 'PARKING_SPACE'
          case 'location':
            return 'DISTANCE'
          default:
            return undefined
        }
      })()

      const requestBody = {
        ageGroup,
        weight,
        categoryIds: visitPurposes.map((purpose) => categoryMap[purpose]),
      }

      await onboardingService.submitOnboarding(requestBody)

      // API 호출 성공 시 온보딩 완료 상태로 변경
      dispatch({ type: 'COMPLETE_ONBOARDING' })
    } catch (error) {
      console.error('온보딩 완료 API 호출 실패:', error)
      dispatch({ type: 'SET_ERROR', payload: '온보딩 완료 중 오류가 발생했습니다.' })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [state.data])

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
    submitOnboardingToServer,
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

export const useOnboarding = useOnboardingContext
