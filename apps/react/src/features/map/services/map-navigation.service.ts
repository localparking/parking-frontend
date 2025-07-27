import type { Coordinates } from '../model'

export const moveToCoordinates = (lat: number, lng: number, zoom?: number) => {
  if (!window.currentMap || !window.naver) {
    console.warn('지도가 초기화되지 않았습니다.')
    return
  }

  try {
    const targetPosition = new window.naver.maps.LatLng(lat, lng)
    window.currentMap.setCenter(targetPosition)

    if (zoom !== undefined) {
      window.currentMap.setZoom(zoom)
    }

    console.log(`지도 이동 완료: (${lat}, ${lng}), 줌: ${zoom || '변경없음'}`)
  } catch (error) {
    console.error('지도 이동 중 오류 발생:', error)
    throw new Error('지도 이동에 실패했습니다.')
  }
}

// 지도 경계 영역 설정 (여러 좌표를 모두 포함하도록)
export const fitToBounds = (coordinates: Coordinates[], padding?: number) => {
  if (!window.currentMap || !window.naver) {
    console.warn('지도가 초기화되지 않았습니다.')
    return
  }

  if (coordinates.length === 0) {
    console.warn('좌표가 제공되지 않았습니다.')
    return
  }

  try {
    // 좌표들을 LatLng 객체로 변환
    const positions = coordinates.map((coord) => new window.naver.maps.LatLng(coord.lat, coord.lng))

    // 경계 영역 생성
    const bounds = new window.naver.maps.LatLngBounds()
    positions.forEach((position) => bounds.extend(position))

    const fitBoundsOptions = {
      top: padding || 50,
      right: padding || 50,
      bottom: padding || 50,
      left: padding || 50,
    }

    window.currentMap.fitBounds(bounds, fitBoundsOptions)

    console.log(`${coordinates.length}개 좌표를 포함하도록 지도 영역 조정 완료`)
  } catch (error) {
    console.error('지도 경계 설정 중 오류 발생:', error)
    throw new Error('지도 경계 설정에 실패했습니다.')
  }
}
