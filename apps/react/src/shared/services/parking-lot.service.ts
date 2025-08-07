import { ParkingApi, ParkingLotSearchRequest } from '@data/user-api-axios/api'
import apiInstance from '@/shared/libs/api'
import { useQuery } from '@tanstack/react-query'

export const QUERY_KEY = 'parking-lot'

class ParkingLotService extends ParkingApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  async postParkingLotMapSearch(body: ParkingLotSearchRequest) {
    try {
      const { data } = await this.searchParkingLots({ parkingLotSearchRequest: body })
      return { data }
    } catch (error) {
      console.error('Error posting parking lot map search:', error)
      throw error
    }
  }

  async postParkingLotKeywordSearch(body: ParkingLotSearchRequest) {
    try {
      const { data } = await this.searchByText1({ parkingLotSearchRequest: { ...body } })
      return { data }
    } catch (error) {
      console.error('Error posting parking lot keyword search:', error)
      throw error
    }
  }

  useParkingLotMapSearch = (body: ParkingLotSearchRequest) => {
    return useQuery({
      queryKey: ['parkingLotMapSearch', body],
      queryFn: () => this.postParkingLotMapSearch(body),
      select: (data) => data.data.data,
      enabled: !!body.query,
      staleTime: 5 * 60 * 1000,
    })
  }

  useParkingLotKeywordSearch = ({ body, enabled }: { body: ParkingLotSearchRequest; enabled: boolean }) => {
    return useQuery({
      queryKey: ['parkingLotKeywordSearch', body],
      queryFn: () => this.postParkingLotKeywordSearch(body),
      select: (data) => data.data.data?.content,
      enabled: enabled && !!body.query,
      staleTime: 5 * 60 * 1000,
    })
  }
}

export default new ParkingLotService()
