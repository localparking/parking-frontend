import { OnboardingApi, OnboardingApiCompleteOnboardingRequest } from '@data/user-api-axios/api'
import apiInstance from '@/shared/libs/api'

class OnboardingService extends OnboardingApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  async submitOnboarding(body: OnboardingApiCompleteOnboardingRequest) {
    const { data } = await this.completeOnboarding(body)
    return data
  }
}

export const onboardingService = new OnboardingService()
