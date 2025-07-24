import { OnboardingApi } from '@data/user-api-axios/api'
import apiInstance from '@/shared/libs/api'

class OnboardingService extends OnboardingApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  async submitOnboarding(body: { ageGroup?: string; weight?: string; categoryIds?: number[] }) {
    const { data } = await this.completeOnboarding({
      onboardingRequest: { ...body },
    })
    return data
  }

  async getCategories() {
    const { data } = await this.getCategories()
    return data
  }
}

export const onboardingService = new OnboardingService()
