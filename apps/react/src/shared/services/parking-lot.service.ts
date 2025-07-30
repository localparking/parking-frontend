import { ParkingApi, ParkingLotSearchRequest } from '@data/user-api-axios/api'
import apiInstance from '@/shared/libs/api'

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
}

export default new ParkingLotService()
