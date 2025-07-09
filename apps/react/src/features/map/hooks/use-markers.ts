import { useCallback, useRef } from 'react'
import type { MarkerData, NaverMarker, AddressMarkerData } from '../model'
import { displayMarkers, displayMarkersFromAddresses } from '../services'

export const useMarkers = () => {
  const markersRef = useRef<NaverMarker[]>([])

  const clearAllMarkers = useCallback(() => {
    markersRef.current.forEach((marker) => {
      marker.setMap(null)
    })
    markersRef.current = []
    console.log('모든 마커가 제거되었습니다.')
  }, [])

  // 좌표 기반 마커
  const addMarkers = useCallback((markers: MarkerData[]) => {
    if (!window.currentMap) {
      console.warn('지도가 초기화되지 않았습니다.')
      return
    }

    try {
      const newMarkers = displayMarkers(markers, window.currentMap)
      markersRef.current.push(...newMarkers)
      console.log(`${newMarkers.length}개의 마커가 추가되었습니다.`)
    } catch (error) {
      console.error('마커 추가 중 오류 발생:', error)
    }
  }, [])

  // 주소 기반 마커
  const addMarkersFromAddresses = useCallback(async (markers: AddressMarkerData[]) => {
    if (!window.currentMap) {
      console.warn('지도가 초기화되지 않았습니다.')
      return
    }

    try {
      const result = await displayMarkersFromAddresses(markers, window.currentMap)
      markersRef.current.push(...result.successful)

      console.log(`총 ${result.total}개 중 ${result.successful.length}개 마커 생성 성공`)
      if (result.failed.length > 0) {
        console.warn(`${result.failed.length}개 마커 생성 실패:`, result.failed)
      }

      return result
    } catch (error) {
      console.error('주소 기반 마커 추가 중 오류 발생:', error)
    }
  }, [])

  return {
    addMarkers,
    addMarkersFromAddresses,
    clearAllMarkers,
  }
}
