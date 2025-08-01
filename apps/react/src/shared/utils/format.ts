/**
 * 금액을 한국어 형식으로 포맷팅합니다.
 * @param price - 포맷팅할 금액
 * @returns 포맷팅된 금액 문자열 (예: "1,000 원")
 */
export const formatPrice = (price?: number): string => {
  return price ? `${price.toLocaleString('ko-KR')} 원` : '-'
}

/**
 * 숫자를 한국어 형식으로 포맷팅합니다.
 * @param value - 포맷팅할 숫자
 * @returns 포맷팅된 숫자 문자열 (예: "1,000")
 */
export const formatNumber = (value?: number): string => {
  return value ? value.toLocaleString('ko-KR') : '0'
}
