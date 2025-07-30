import axios from 'axios'

// 네이버 지역 검색 API의 응답 아이템 타입
export interface LocalSearchItem {
  title: string // 업체, 기관명 (HTML 태그 포함될 수 있음)
  link: string // 상세 정보 URL
  category: string // 분류 정보
  description: string // 상세 설명
  telephone: string // 전화번호
  address: string // 기본 주소
  roadAddress: string // 도로명 주소
  mapx: string // 지도상의 X좌표 (경도)
  mapy: string // 지도상의 Y좌표 (위도)
}

// 네이버 지역 검색 API의 전체 응답 타입
export interface LocalSearchResponse {
  lastBuildDate: string // 검색 결과 생성 시간
  total: number // 총 검색 결과 개수
  start: number // 검색 시작 위치
  display: number // 한 번에 표시할 검색 결과 개수
  items: LocalSearchItem[] // 검색 결과 아이템 배열
}

// 네이버 지역 검색 API 요청 파라미터 타입
interface SearchLocalParams {
  query: string
  display?: number
  start?: number
  sort?: 'random' | 'comment'
}

class SearchService {
  /**
   * 서버의 프록시를 통해 네이버 지역 검색 API를 호출합니다.
   * @param params - 검색어(query) 및 기타 옵션
   */
  async searchLocal(params: SearchLocalParams): Promise<LocalSearchResponse> {
    // GET 요청에 대한 파라미터는 `params` 옵션으로 전달합니다.
    const { data } = await axios.get<LocalSearchResponse>('/naver/v1/search/local.json', {
      params,
      headers: {
        'X-Naver-Client-Id': import.meta.env.VITE_NAVER_SEARCH_CLIENT_ID,
        'X-Naver-Client-Secret': import.meta.env.VITE_NAVER_SEARCH_CLIENT_SECRET,
      },
    })
    return data
  }
}

const searchService = new SearchService()
export default searchService

import { useQuery } from '@tanstack/react-query'

export const useNaverSearch = (query: string) => {
  return useQuery({
    // queryKey에 검색어를 포함시켜, 검색어가 바뀔 때마다 새로운 데이터를 요청하도록 합니다.
    queryKey: ['localSearch', query],
    // 실제 데이터 페칭 함수
    queryFn: () => searchService.searchLocal({ query, display: 5, start: 1 }),
    // `enabled: !!query` 옵션은 query가 비어있지 않을 때만 요청을 보내도록 합니다.
    // 즉, 사용자가 검색어를 입력했을 때만 API가 호출됩니다.
    enabled: !!query,
    // staleTime을 설정하여 동일한 검색어에 대해 불필요한 API 호출을 방지할 수 있습니다.
    staleTime: 5 * 60 * 1000, // 5분
  })
}
