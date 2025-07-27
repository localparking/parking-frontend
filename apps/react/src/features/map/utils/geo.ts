/**
 * 두 위도/경도 지점 간의 거리를 미터(m) 단위로 반환합니다.
 * @param lat1 지점 1의 위도
 * @param lon1 지점 1의 경도
 * @param lat2 지점 2의 위도
 * @param lon2 지점 2의 경도
 */
export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0
  }

  const R = 6371e3 // 지구의 반지름 (미터)
  const φ1 = (lat1 * Math.PI) / 180 // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // 미터(m) 단위 거리
}
