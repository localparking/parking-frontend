import { OrderApi } from '@data/user-api-axios/api'
import apiInstance from '@/shared/libs/api'

class OrderService extends OrderApi {
  constructor() {
    super(undefined, '', apiInstance)
  }
}

export default new OrderService()
