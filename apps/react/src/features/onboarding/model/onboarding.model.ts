import { OnboardingData, OnboardingState, OnboardingAction, OnboardingStep, TermsAgreement } from './onboarding.types'

// 초기 약관 동의 상태
const initialTermsAgreement: TermsAgreement = {
  allAgreed: false,
  age14Plus: false,
  serviceTerms: false,
  privacyPolicy: false,
  marketingOptional: false,
}

// 초기 온보딩 데이터
const initialOnboardingData: OnboardingData = {
  currentStep: 'age-selection',
  ageRange: undefined,
  parkingPreferences: [],
  visitPurposes: [],
  termsAgreement: initialTermsAgreement,
  isCompleted: false,
}

// 초기 상태
export const initialState: OnboardingState = {
  data: initialOnboardingData,
  isLoading: false,
  error: undefined,
}

// 온보딩 reducer
export const onboardingReducer = (state: OnboardingState, action: OnboardingAction): OnboardingState => {
  switch (action.type) {
    case 'SET_STEP':
      return {
        ...state,
        data: {
          ...state.data,
          currentStep: action.payload,
        },
      }

    case 'SET_AGE_RANGE':
      return {
        ...state,
        data: {
          ...state.data,
          ageRange: action.payload,
        },
      }

    case 'TOGGLE_PARKING_PREFERENCE':
      const currentPreferences = state.data.parkingPreferences
      const preferenceExists = currentPreferences.includes(action.payload)

      return {
        ...state,
        data: {
          ...state.data,
          parkingPreferences: preferenceExists
            ? currentPreferences.filter((p) => p !== action.payload)
            : [...currentPreferences, action.payload],
        },
      }

    case 'TOGGLE_VISIT_PURPOSE':
      const currentPurposes = state.data.visitPurposes
      const purposeExists = currentPurposes.includes(action.payload)

      return {
        ...state,
        data: {
          ...state.data,
          visitPurposes: purposeExists
            ? currentPurposes.filter((p) => p !== action.payload)
            : [...currentPurposes, action.payload],
        },
      }

    case 'SET_TERMS_AGREEMENT':
      const newTermsAgreement = {
        ...state.data.termsAgreement,
        ...action.payload,
      }

      // 전체 동의 상태 업데이트
      const allRequired =
        newTermsAgreement.age14Plus && newTermsAgreement.serviceTerms && newTermsAgreement.privacyPolicy

      return {
        ...state,
        data: {
          ...state.data,
          termsAgreement: {
            ...newTermsAgreement,
            allAgreed: allRequired && newTermsAgreement.marketingOptional,
          },
        },
      }

    case 'COMPLETE_ONBOARDING':
      return {
        ...state,
        data: {
          ...state.data,
          isCompleted: true,
        },
      }

    case 'RESET_ONBOARDING':
      return {
        ...initialState,
      }

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      }

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: undefined,
      }

    default:
      return state
  }
}

// 온보딩 단계 순서 정의
export const ONBOARDING_STEPS: OnboardingStep[] = ['age-selection', 'parking-preference', 'visit-purpose']

// 다음 단계 계산 유틸리티
// export const getNextStep = (currentStep: OnboardingStep): OnboardingStep | null => {
//   const currentIndex = ONBOARDING_STEPS.indexOf(currentStep)
//   if (currentIndex === -1 || currentIndex === ONBOARDING_STEPS.length - 1) {
//     return null
//   }
//   return ONBOARDING_STEPS[currentIndex + 1] ?? null
// }

// // 이전 단계 계산 유틸리티
// export const getPreviousStep = (currentStep: OnboardingStep): OnboardingStep | null => {
//   const currentIndex = ONBOARDING_STEPS.indexOf(currentStep)
//   if (currentIndex <= 0) {
//     return null
//   }
//   return ONBOARDING_STEPS[currentIndex - 1] ?? null
// }

// // 단계 진행률 계산
// export const getStepProgress = (currentStep: OnboardingStep): number => {
//   const currentIndex = ONBOARDING_STEPS.indexOf(currentStep)
//   return Math.round((currentIndex / (ONBOARDING_STEPS.length - 1)) * 100)
// }
