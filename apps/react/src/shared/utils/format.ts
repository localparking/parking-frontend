/**
 * 금액을 한국어 형식으로 포맷팅합니다.
 * @param price - 포맷팅할 금액
 * @returns 포맷팅된 금액 문자열 (예: "1,000 원")
 */
export const formatPrice = (price?: number): string => {
  return price ? `${price.toLocaleString('ko-KR')}원` : '-'
}

/**
 * 숫자를 한국어 형식으로 포맷팅합니다.
 * @param value - 포맷팅할 숫자
 * @returns 포맷팅된 숫자 문자열 (예: "1,000")
 */
export const formatNumber = (value?: number): string => {
  return value ? value.toLocaleString('ko-KR') : '0'
}

export function formatTime(slot?: { begin: string; end: string }): string
export function formatTime(time?: string): string
export function formatTime(arg?: { begin: string; end: string } | string): string {
  if (!arg) return '정보 없음'
  if (typeof arg === 'string') {
    // 단일 시간 문자열 처리: 'HHmm' 또는 'HH:mm' → 'HH:mm'
    if (/^\d{2}:\d{2}$/.test(arg)) return arg
    const digitsOnly = arg.replace(':', '')
    if (/^\d{4}$/.test(digitsOnly)) {
      return `${digitsOnly.substring(0, 2)}:${digitsOnly.substring(2, 4)}`
    }
    return arg
  }

  const slot = arg
  if (!slot.begin || !slot.end) return '정보 없음'
  if ((slot.begin === '0000' && slot.end === '2400') || (slot.begin === '00:00' && slot.end === '24:00'))
    return '24시간'

  // HHMM 형식을 HH:MM 형식으로 변환
  const formatTimeString = (time: string) => {
    if (time.length === 4) {
      return `${time.substring(0, 2)}:${time.substring(2, 4)}`
    }
    return time
  }

  return `${formatTimeString(slot.begin)}~${formatTimeString(slot.end)}`
}
