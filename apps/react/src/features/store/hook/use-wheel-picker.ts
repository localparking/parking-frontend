import { useState, useRef, useEffect, useCallback } from 'react'

// 1. 명확한 타입 정의
type AmPm = '오전' | '오후'
type Hour = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
type Minute = 0 | 10 | 20 | 30 | 40 | 50

// 2. 외부에서 사용할 상태와 함수 타입 정의
export interface TimePickerState {
  ampm: AmPm
  hour: Hour
  minute: Minute
}

export const useTimePicker = (initialTime?: string) => {
  // 3. UI 렌더링에 필요한 데이터 (상수로 선언하여 불필요한 재생성 방지)
  const itemHeight = 50 // 각 아이템의 높이(px)
  const ampms: AmPm[] = ['오전', '오후']
  const hours: Hour[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const minutes: Minute[] = [0, 10, 20, 30, 40, 50]

  // 4. 초기 시간 파싱 및 상태 설정
  const parseTime = useCallback((timeString?: string): TimePickerState => {
    const date = timeString ? new Date(timeString) : new Date()
    let h = date.getHours()
    const m = Math.floor(date.getMinutes() / 10) * 10
    const a: AmPm = h >= 12 ? '오후' : '오전'
    h = h % 12
    h = h === 0 ? 12 : h // 0시는 12시로 변환

    return { ampm: a, hour: h as Hour, minute: m as Minute }
  }, [])

  const [selectedTime, setSelectedTime] = useState<TimePickerState>(() => parseTime(initialTime))

  // 5. 각 스크롤 컨테이너를 위한 Ref 생성
  const ampmRef = useRef<HTMLDivElement>(null)
  const hourRef = useRef<HTMLDivElement>(null)
  const minuteRef = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<number | null>(null)

  // 6. 상태가 변경되면 스크롤 위치를 동기화하는 useEffect
  useEffect(() => {
    const scrollTo = (ref: React.RefObject<HTMLDivElement | null>, data: any[], value: any) => {
      if (ref.current) {
        const index = data.indexOf(value)
        if (index > -1) {
          // 부드러운 스크롤 효과 추가
          ref.current.scrollTo({ top: index * itemHeight, behavior: 'smooth' })
        }
      }
    }
    scrollTo(ampmRef, ampms, selectedTime.ampm)
    scrollTo(hourRef, hours, selectedTime.hour)
    scrollTo(minuteRef, minutes, selectedTime.minute)
  }, [selectedTime])

  // 7. 스크롤 이벤트 핸들러 (디바운싱으로 성능 최적화)
  const createScrollHandler =
    (ref: React.RefObject<HTMLDivElement | null>, data: any[], key: keyof TimePickerState) => () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)

      scrollTimeoutRef.current = window.setTimeout(() => {
        if (ref.current) {
          const index = Math.round(ref.current.scrollTop / itemHeight)
          const value = data[index]
          if (value !== undefined) {
            setSelectedTime((prev) => ({ ...prev, [key]: value }))
          }
        }
      }, 150) // 스크롤이 멈춘 후 150ms 뒤에 상태 업데이트
    }

  // 8. 최종 선택된 시간을 ISO 문자열로 변환하는 함수
  const getSelectedTimeAsISO = useCallback(() => {
    let hour24: number = selectedTime.hour
    if (selectedTime.ampm === '오전' && selectedTime.hour === 12) hour24 = 0
    else if (selectedTime.ampm === '오후' && selectedTime.hour !== 12) hour24 += 12

    const date = new Date() // 날짜는 오늘 날짜 기준
    date.setHours(hour24, selectedTime.minute, 0, 0)
    return date.toISOString()
  }, [selectedTime])

  return {
    refs: { ampmRef, hourRef, minuteRef },
    data: { ampms, hours, minutes },
    state: selectedTime,
    actions: {
      handleAmPmScroll: createScrollHandler(ampmRef, ampms, 'ampm'),
      handleHourScroll: createScrollHandler(hourRef, hours, 'hour'),
      handleMinuteScroll: createScrollHandler(minuteRef, minutes, 'minute'),
      setSelectedTime,
      getSelectedTimeAsISO,
    },
  }
}
