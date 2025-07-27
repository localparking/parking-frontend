// import { useCallback } from 'react'
// import { moveToCoordinates, fitToBounds } from '../services'

// export const useMapNavigation = () => {
//   const moveTo = useCallback((lat: number, lng: number, zoom?: number) => {
//     try {
//       moveToCoordinates(lat, lng, zoom)
//     } catch (error) {
//       console.error('지도 이동 실패:', error)
//     }
//   }, [])

//   // 여러 좌표를 모두 포함하도록 지도 영역 조정
//   const fitToCoordinates = useCallback((coordinates: { lat: number; lng: number }[], padding?: number) => {
//     try {
//       fitToBounds(coordinates, padding)
//     } catch (error) {
//       console.error('지도 영역 조정 실패:', error)
//     }
//   }, [])

//   return {
//     moveTo,
//     fitToCoordinates,
//   }
// }
