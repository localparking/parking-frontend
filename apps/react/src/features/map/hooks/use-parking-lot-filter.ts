import { useState, useEffect, useMemo, useCallback } from 'react'
import { useMapContext, Congestion, DayOfWeek, ParkingLotSearchParams } from '../context/map-context'
import { formatPrice } from '@/shared/utils/format'

export const useParkingLotFilter = () => {
  const { parkingLotSearchParams, setParkingLotSearchParams } = useMapContext()
  const [sliderValue, setSliderValue] = useState(parkingLotSearchParams.maxFeePerHour || 0)

  const [filterState, setFilterState] = useState<ParkingLotSearchParams>(parkingLotSearchParams)

  useEffect(() => {
    setFilterState(parkingLotSearchParams)
    setSliderValue(parkingLotSearchParams.maxFeePerHour || 0)
  }, [parkingLotSearchParams])

  const updateFilter = useCallback((updates: Partial<ParkingLotSearchParams>) => {
    setFilterState((prev) => {
      const newState = { ...prev, ...updates }

      if (updates.isFree === true) {
        setSliderValue(0)
      }

      return newState
    })
  }, [])

  const handleCongestionToggle = useCallback(
    (congestion: Congestion) => {
      const current = filterState.congestion || []
      const newCongestion = current.includes(congestion)
        ? current.filter((c) => c !== congestion)
        : [...current, congestion]
      updateFilter({ congestion: newCongestion.length > 0 ? newCongestion : undefined })
    },
    [filterState.congestion, updateFilter]
  )

  const handleOperatingTimeChange = useCallback(
    (value: 'open' | '24hours' | 'all' | 'datetime') => {
      const baseUpdates = { isOpen: undefined, is24Hours: undefined, checkDayOfWeek: undefined, checkTime: undefined }
      if (value === 'open') updateFilter({ ...baseUpdates, isOpen: true })
      else if (value === '24hours') updateFilter({ ...baseUpdates, is24Hours: true })
      else if (value === 'datetime') {
        const now = new Date()
        const dayNames: DayOfWeek[] = [
          DayOfWeek.SUNDAY,
          DayOfWeek.MONDAY,
          DayOfWeek.TUESDAY,
          DayOfWeek.WEDNESDAY,
          DayOfWeek.THURSDAY,
          DayOfWeek.FRIDAY,
          DayOfWeek.SATURDAY,
        ]
        updateFilter({ ...baseUpdates, checkDayOfWeek: dayNames[now.getDay()], checkTime: '1200' })
      } else updateFilter(baseUpdates)
    },
    [updateFilter]
  )

  const handleDateTimeChange = useCallback(
    (updates: { checkDayOfWeek?: DayOfWeek; checkTime?: string }) => {
      updateFilter(updates)
    },
    [updateFilter]
  )

  const handleReset = useCallback(() => {
    const resetState = {
      sort: parkingLotSearchParams.sort,
      page: 0,
      isFree: undefined,
      isRealtime: undefined,
      congestion: undefined,
      maxFeePerHour: undefined,
      isOpen: undefined,
      is24Hours: undefined,
      checkDayOfWeek: undefined,
      checkTime: undefined,
    }
    setFilterState(resetState as ParkingLotSearchParams)
    setSliderValue(0)
  }, [parkingLotSearchParams.sort])

  const selectedOperatingTime = useMemo((): 'open' | '24hours' | 'all' | 'datetime' => {
    if (filterState.isOpen) return 'open'
    if (filterState.is24Hours) return '24hours'
    if (filterState.checkDayOfWeek && filterState.checkTime) return 'datetime'
    return 'all'
  }, [filterState.isOpen, filterState.is24Hours, filterState.checkDayOfWeek, filterState.checkTime])

  const formatSliderValue = useCallback((value: number) => {
    if (value === 0) return '무료'
    if (value >= 10000) return '10,000원+'
    return formatPrice(value)
  }, [])

  const handleApply = useCallback(() => {
    setParkingLotSearchParams((prev) => ({
      ...prev,
      ...filterState,
      maxFeePerHour: filterState.isFree === false ? sliderValue : undefined,
      page: 0,
    }))
  }, [filterState, sliderValue, setParkingLotSearchParams])

  return {
    filterState,
    sliderValue,
    selectedOperatingTime,
    setSliderValue,
    updateFilter,
    handleCongestionToggle,
    handleOperatingTimeChange,
    handleDateTimeChange,
    handleReset,
    handleApply,
    formatSliderValue,
  }
}
