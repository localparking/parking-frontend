import apiInstance from '../libs/api'
import { StoreApi, StoreSearchRequest } from '@data/user-api-axios/api'

export const QUERY_KEY = 'store'

class StoreService extends StoreApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  async findStoreDetail(params: { storeId: number }) {
    const { data } = await this.getStoreDetail({ ...params })
    return data
  }

  async postStoreMapSearch(body: StoreSearchRequest) {
    try {
      const { data } = await this.search({
        storeSearchRequest: { ...body },
      })
      return { data }
    } catch (error) {
      console.error('Error posting store map search:', error)
      throw error
    }
  }
}

export default new StoreService()
