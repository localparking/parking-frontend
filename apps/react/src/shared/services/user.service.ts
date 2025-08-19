import { AuthApi, UserApi } from '@data/user-api-axios/api'
import type { MyInfoUpdateRequestDto, MyInfoResponseDto } from '@data/user-api-axios/api'
import axios from 'axios'
import apiInstance, { defaultOptions } from '../libs/api'

class UserService extends UserApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  async me() {
    try {
      const { data } = await this.getMyInfo()
      return data
    } catch (e: any) {
      throw e
    }
  }

  async updateMyProfile(payload: MyInfoUpdateRequestDto) {
    try {
      const { data } = await super.updateMyInfo({ myInfoUpdateRequestDto: payload })
      return data
    } catch (e: any) {
      throw e
    }
  }

  async getMyProfile() {
    try {
      const { data } = await super.getMyInfo()
      return data
    } catch (e: any) {
      throw e
    }
  }

  async withdraw() {
    try {
      const { data } = await super.withdrawUser()
      return data
    } catch (e: any) {
      throw e
    }
  }

  //   async getAuth() {
  //     try {
  //       const authApi = new AuthApi(undefined, '', axios.create(defaultOptions))
  //       const { data } = await authApi.authControllerGetAuth()
  //       return { data }
  //     } catch (e: any) {
  //       throw e
  //     }
  //   }

  //   async signIn({ accountId, password }: LoginFormType) {
  //     const { data } = await this.authControllerPostAuth({
  //       postAuthReqDto: {
  //         accountId,
  //         password,
  //       },
  //     })
  //     return data
  //   }
}

export default new UserService()
