import apiInstance from '../libs/api'
import { OnboardingRequest, RegisterApi, RegisterRequest } from '@data/user-api-axios/api'

export const QUERY_KEY = 'register'

class RegisterService extends RegisterApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  async findTerms() {
    const { data } = await this.getTerms()
    return data
  }

  async postTerms(body: RegisterRequest) {
    const { data } = await this.registerAgreements({
      registerRequest: { ...body },
    })
    return { data }
  }
}

export default new RegisterService()
