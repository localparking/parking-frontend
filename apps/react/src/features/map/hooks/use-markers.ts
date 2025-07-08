import { useCallback, useRef } from 'react'
import type { MarkerData, NaverMarker } from '../model'
import { displayMarkers, displayMarkersFromAddresses } from '../services/map.service'

export const useMarkers = () => {
  const markersRef = useRef<NaverMarker[]>([])

  // 모든 마커 제거
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((marker) => {
      marker.setMap(null)
    })
    markersRef.current = []
    console.log('모든 마커가 제거되었습니다.')
  }, [])

  // 좌표 기반 마커 표시
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

  // 주소 기반 마커 표시
  const addMarkersFromAddresses = useCallback(
    async (markers: (Omit<MarkerData, 'lat' | 'lng'> & { address: string })[]) => {
      if (!window.currentMap) {
        console.warn('지도가 초기화되지 않았습니다.')
        return
      }

      try {
        const newMarkers = await displayMarkersFromAddresses(markers, window.currentMap)
        markersRef.current.push(...newMarkers)
        console.log(`${newMarkers.length}개의 마커가 추가되었습니다.`)
      } catch (error) {
        console.error('주소 기반 마커 추가 중 오류 발생:', error)
      }
    },
    []
  )

  // 마커 제거
  const deleteMarkers = useCallback(
    (markers: MarkerData[]) => {
      clearMarkers()
    },
    [clearMarkers]
  )

  // 주소 기반 마커 업데이트
  const updateMarkersFromAddresses = useCallback(
    async (markers: (Omit<MarkerData, 'lat' | 'lng'> & { address: string })[]) => {
      clearMarkers()
      await addMarkersFromAddresses(markers)
    },
    [clearMarkers, addMarkersFromAddresses]
  )

  // 현재 마커 개수 조회
  const getMarkerCount = useCallback(() => {
    return markersRef.current.length
  }, [])

  return {
    addMarkers,
    addMarkersFromAddresses,
    deleteMarkers,
    updateMarkersFromAddresses,
    clearMarkers,
    getMarkerCount,
  }
}
