import { useState, useRef, useEffect, useMemo, useCallback } from 'react'

type AmPm = '오전' | '오후'
type Hour = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
type Minute = 0 | 10 | 20 | 30 | 40 | 50

export interface TimePickerState {
  ampm: AmPm
  hour: Hour
  minute: Minute
}

interface UseTimePickerProps {
  initialTime?: string
  closingTime?: string
}

export const useTimePicker = ({ initialTime, closingTime }: UseTimePickerProps) => {
  const itemHeight = 50
  const scrollTimeoutRef = useRef<number | null>(null)

  const timeUtils = useMemo(() => {
    const now = new Date()
    const closingDate = new Date()
    if (closingTime) {
      const [hStr, mStr] = closingTime.split(':')
      const h = Number(hStr)
      const m = Number(mStr)
      if (!Number.isNaN(h) && !Number.isNaN(m)) {
        closingDate.setHours(h, m, 59, 999)
      } else {
        closingDate.setHours(23, 59, 59, 999)
      }
    } else {
      closingDate.setHours(23, 59, 59, 999)
    }

    const stateToDate = (state: TimePickerState): Date => {
      const date = new Date()
      let hour24: number = state.hour
      if (state.ampm === '오전' && state.hour === 12) hour24 = 0
      else if (state.ampm === '오후' && state.hour !== 12) hour24 += 12
      date.setHours(hour24, state.minute, 0, 0)
      return date
    }

    const isValidTime = (time: TimePickerState): boolean => {
      const selectedDate = stateToDate(time)
      const nowWithMargin = new Date(now.getTime() - 60000)
      return selectedDate >= nowWithMargin && selectedDate <= closingDate
    }

    return { isValidTime, stateToDate }
  }, [closingTime])

  const parseAndSetInitialTime = useCallback(
    (time?: string): TimePickerState => {
      const date = time ? new Date(time) : new Date()
      if (Number.isNaN(date.getTime())) {
        Object.assign(date, new Date())
      }
      if (!time) date.setMinutes(date.getMinutes() + (10 - (date.getMinutes() % 10)))
      date.setSeconds(0, 0)

      let h = date.getHours()
      const m = date.getMinutes()
      const a: AmPm = h >= 12 ? '오후' : '오전'
      h = h % 12
      h = h === 0 ? 12 : h
      const initialState: TimePickerState = { ampm: a, hour: h as Hour, minute: m as Minute }

      const fallback: TimePickerState = { ampm: '오후', hour: 12, minute: 0 }
      return timeUtils.isValidTime(initialState) ? initialState : fallback
    },
    [timeUtils]
  )

  const [selectedTime, setSelectedTime] = useState<TimePickerState>(() => parseAndSetInitialTime(initialTime))

  useEffect(() => {
    setSelectedTime(parseAndSetInitialTime(initialTime))
  }, [initialTime, parseAndSetInitialTime])

  const availableData = useMemo(() => {
    const allHours: Hour[] = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    const allMinutes: Minute[] = [0, 10, 20, 30, 40, 50]

    const availableAmpms: AmPm[] = (['오전', '오후'] as AmPm[]).filter((ampm) =>
      allHours.some((hour) => allMinutes.some((minute) => timeUtils.isValidTime({ ampm, hour, minute })))
    )

    const availableHours: Hour[] = allHours.filter((hour) =>
      allMinutes.some((minute) => timeUtils.isValidTime({ ...selectedTime, hour, minute }))
    )

    const availableMinutes: Minute[] = allMinutes.filter((minute) => timeUtils.isValidTime({ ...selectedTime, minute }))

    return { availableAmpms, availableHours, availableMinutes }
  }, [selectedTime, timeUtils])

  useEffect(() => {
    let corrected = false
    const newTime = { ...selectedTime }

    if (!availableData.availableAmpms.includes(newTime.ampm)) {
      newTime.ampm = availableData.availableAmpms[0]!
      corrected = true
    }
    if (!availableData.availableHours.includes(newTime.hour)) {
      newTime.hour = availableData.availableHours[0]!
      corrected = true
    }
    if (!availableData.availableMinutes.includes(newTime.minute)) {
      newTime.minute = availableData.availableMinutes[0]!
      corrected = true
    }

    if (corrected) {
      setSelectedTime(newTime)
    }
  }, [selectedTime, availableData])

  const refs = {
    ampmRef: useRef<HTMLDivElement>(null),
    hourRef: useRef<HTMLDivElement>(null),
    minuteRef: useRef<HTMLDivElement>(null),
  }

  useEffect(() => {
    const scrollTo = (ref: React.RefObject<HTMLDivElement | null>, data: any[], value: any) => {
      if (ref.current) {
        const index = data.indexOf(value)
        if (index > -1) {
          ref.current.scrollTo({ top: index * itemHeight, behavior: 'smooth' })
        }
      }
    }
    scrollTo(refs.ampmRef, availableData.availableAmpms, selectedTime.ampm)
    scrollTo(refs.hourRef, availableData.availableHours, selectedTime.hour)
    scrollTo(refs.minuteRef, availableData.availableMinutes, selectedTime.minute)
  }, [selectedTime, availableData])

  const createScrollHandler = (key: keyof TimePickerState, data: any[]) => () => {
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    const ref = refs[`${key}Ref`]

    scrollTimeoutRef.current = window.setTimeout(() => {
      if (ref.current) {
        const index = Math.round(ref.current.scrollTop / itemHeight)
        const value = data[index]
        if (value !== undefined && selectedTime[key] !== value) {
          setSelectedTime((prev) => ({ ...prev, [key]: value }))
        }
      }
    }, 150)
  }

  return {
    refs,
    data: availableData,
    state: selectedTime,
    isValid: timeUtils.isValidTime(selectedTime),
    actions: {
      handleAmPmScroll: createScrollHandler('ampm', availableData.availableAmpms),
      handleHourScroll: createScrollHandler('hour', availableData.availableHours),
      handleMinuteScroll: createScrollHandler('minute', availableData.availableMinutes),
      setSelectedTime,
      getSelectedTimeAsISO: () => timeUtils.stateToDate(selectedTime).toISOString(),
    },
  }
}
