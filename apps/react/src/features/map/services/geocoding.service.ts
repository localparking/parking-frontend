import type { GeocodeResponse, GeocodeResult } from '../model'

export const geocodeAddress = (address: string): Promise<GeocodeResult> => {
  return new Promise((resolve, reject) => {
    if (!window.naver?.maps?.Service) {
      reject(new Error('네이버 지도 API가 로드되지 않았습니다'))
      return
    }

    window.naver.maps.Service.geocode({ query: address }, (status: string, response: GeocodeResponse) => {
      console.log('지오코딩 콜백 status:', status, 'response:', response)
      console.log('응답 내부 status:', response?.v2?.status)

      const actualStatus = response?.v2?.status
      if (actualStatus !== 'OK') {
        reject(new Error(`지오코딩 실패. 응답 상태: ${actualStatus}`))
        return
      }

      const items = response?.v2?.addresses

      if (!items || items.length === 0) {
        reject(new Error('검색 결과가 없습니다'))
        return
      }

      const firstAddress = items[0]

      if (!firstAddress || !firstAddress.x || !firstAddress.y) {
        reject(new Error('좌표 정보가 없습니다'))
        return
      }

      const lng = parseFloat(firstAddress.x)
      const lat = parseFloat(firstAddress.y)

      if (isNaN(lng) || isNaN(lat)) {
        reject(new Error('잘못된 좌표 형식입니다'))
        return
      }

      console.log(`지오코딩 성공: ${address} -> (${lat}, ${lng})`)
      resolve({
        lat,
        lng,
        address: firstAddress,
      })
    })
  })
}
