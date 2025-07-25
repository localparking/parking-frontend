import { CategoryApi } from '@data/user-api-axios/api'
import apiInstance from '@/shared/libs/api'

class CategoryService extends CategoryApi {
  constructor() {
    super(undefined, '', apiInstance)
  }

  async getCategoriesParent() {
    const { data } = await this.getCategories()
    return data
  }

  async getCategoriesAll() {
    const { data } = await this.getChildCategories()
    return data
  }
}

export const categoryService = new CategoryService()
