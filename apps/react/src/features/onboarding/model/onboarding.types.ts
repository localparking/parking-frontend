export type OnboardingStep =
  | 'splash'
  | 'landing-1'
  | 'landing-2'
  | 'landing-3'
  | 'landing-4'
  | 'terms'
  | 'age-selection'
  | 'parking-preference'
  | 'visit-purpose'
  | 'complete'

export type AgeRange = '10대' | '20대' | '30대' | '40대' | '50대 이상'

export type ParkingPreference = 'price' | 'space' | 'location'

export type VisitPurpose = 'cafe' | 'restaurant' | 'leisure' | 'life' | 'other'

export interface TermsAgreement {
  allAgreed: boolean
  age14Plus: boolean
  serviceTerms: boolean
  privacyPolicy: boolean
  marketingOptional: boolean
}

export interface OnboardingData {
  currentStep: OnboardingStep
  ageRange?: AgeRange
  parkingPreferences: ParkingPreference[]
  visitPurposes: VisitPurpose[]
  termsAgreement: TermsAgreement
  isCompleted: boolean
}

export interface OnboardingState {
  data: OnboardingData
  isLoading: boolean
  error?: string
}

export type OnboardingAction =
  | { type: 'SET_STEP'; payload: OnboardingStep }
  | { type: 'SET_AGE_RANGE'; payload: AgeRange }
  | { type: 'TOGGLE_PARKING_PREFERENCE'; payload: ParkingPreference }
  | { type: 'TOGGLE_VISIT_PURPOSE'; payload: VisitPurpose }
  | { type: 'SET_TERMS_AGREEMENT'; payload: Partial<TermsAgreement> }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'RESET_ONBOARDING' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
