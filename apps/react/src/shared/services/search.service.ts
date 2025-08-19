import { useQuery } from '@tanstack/react-query'
import { ResponseDtoListSearchItemResponse, SearchApi } from '@data/user-api-axios/api'

class SearchService extends SearchApi {
  async searchNaver(query: string): Promise<ResponseDtoListSearchItemResponse> {
    const { data } = await this.search1({ query })
    return data
  }

  useNaverSearch = (query: string) => {
    return useQuery({
      queryKey: ['localSearch', query],
      queryFn: () => this.searchNaver(query),
      select: (data) => data.data?.filter((item) => item.roadAddress),
      enabled: !!query,
      staleTime: 5 * 60 * 1000,
    })
  }
}

export default new SearchService()
