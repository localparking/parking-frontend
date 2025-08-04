import { useQuery } from '@tanstack/react-query'
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
      const { data } = await this.search({ storeSearchRequest: { ...body } })
      return { data }
    } catch (error) {
      console.error('Error posting store map search:', error)
      throw error
    }
  }

  async postStoreKeywordSearch(body: StoreSearchRequest) {
    try {
      const { data } = await this.searchByText({ storeSearchRequest: { ...body } })
      return { data }
    } catch (error) {
      console.error('Error posting store keyword search:', error)
      throw error
    }
  }

  useStoreMapSearch = (body: StoreSearchRequest) => {
    return useQuery({
      queryKey: ['storeMapSearch', body],
      queryFn: () => this.postStoreMapSearch(body),
      select: (data) => data.data.data,
      enabled: !!body.query,
      staleTime: 5 * 60 * 1000,
    })
  }

  useStoreKeywordSearch = ({ body, enabled }: { body: StoreSearchRequest; enabled: boolean }) => {
    return useQuery({
      queryKey: ['storeKeywordSearch', body],
      queryFn: () => this.postStoreKeywordSearch(body),
      select: (data) => data.data.data?.content,
      enabled: enabled && !!body.query,
      staleTime: 5 * 60 * 1000,
    })
  }
}

export default new StoreService()
