import { useEffect, useMemo, useState, useCallback } from 'react'
import { DayOfWeek, StoreSearchParams, useMapContext } from '../context/map-context'

export const useStoreFilter = () => {
  const { storeSearchParams, setStoreSearchParams } = useMapContext()

  const [filterState, setFilterState] = useState<StoreSearchParams>(storeSearchParams)

  useEffect(() => {
    setFilterState(storeSearchParams)
  }, [storeSearchParams])

  const updateFilter = useCallback((updates: Partial<StoreSearchParams>) => {
    setFilterState((prev) => ({ ...prev, ...updates }))
  }, [])

  const handleCategoryToggle = useCallback(
    (categoryId: number) => {
      const current = filterState.categoryIds || []
      const exists = current.includes(categoryId)
      const next = exists ? current.filter((id) => id !== categoryId) : [...current, categoryId]
      updateFilter({ categoryIds: next.length > 0 ? next : undefined })
    },
    [filterState.categoryIds, updateFilter]
  )

  const handleParentCategorySelect = useCallback(
    (parentCategoryId: number) => {
      updateFilter({ categoryIds: [parentCategoryId] })
    },
    [updateFilter]
  )

  const handleChildCategoryReset = useCallback(
    (parentCategoryId: number) => {
      updateFilter({ categoryIds: [parentCategoryId] })
    },
    [updateFilter]
  )

  const isParentOnlySelected = useCallback(
    (parentCategoryId: number) => {
      return filterState.categoryIds?.length === 1 && filterState.categoryIds[0] === parentCategoryId
    },
    [filterState.categoryIds]
  )

  const handleOperatingTimeChange = useCallback(
    (value: 'open' | '24hours' | 'all' | 'datetime') => {
      const baseUpdates = {
        isOpen: undefined,
        is24Hours: undefined,
        checkDayOfWeek: undefined,
        checkTime: undefined,
      }

      if (value === 'open') {
        updateFilter({ ...baseUpdates, isOpen: true })
      } else if (value === '24hours') {
        updateFilter({ ...baseUpdates, is24Hours: true })
      } else if (value === 'datetime') {
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
        updateFilter({
          ...baseUpdates,
          checkDayOfWeek: dayNames[now.getDay()],
          checkTime: '1200',
        })
      } else {
        updateFilter(baseUpdates)
      }
    },
    [updateFilter]
  )

  const handleDateTimeChange = useCallback(
    (updates: { checkDayOfWeek?: DayOfWeek; checkTime?: string }) => {
      updateFilter(updates)
    },
    [updateFilter]
  )

  const selectedOperatingTime = useMemo((): 'open' | '24hours' | 'all' | 'datetime' => {
    if (filterState.isOpen) return 'open'
    if (filterState.is24Hours) return '24hours'
    if (filterState.checkDayOfWeek && filterState.checkTime) return 'datetime'
    return 'all'
  }, [filterState.isOpen, filterState.is24Hours, filterState.checkDayOfWeek, filterState.checkTime])

  const handleReset = useCallback(() => {
    const resetState: StoreSearchParams = {
      sort: storeSearchParams.sort,
      page: 0,
      categoryIds: undefined,
      maxFreeMin: undefined,
      isOpen: undefined,
      is24Hours: undefined,
      checkDayOfWeek: undefined,
      checkTime: undefined,
    }
    setFilterState(resetState)
  }, [storeSearchParams.sort])

  const handleApply = useCallback(() => {
    setStoreSearchParams((prev) => ({
      ...prev,
      ...filterState,
      page: 0,
    }))
  }, [filterState, setStoreSearchParams])

  return {
    filterState,
    selectedOperatingTime,
    updateFilter,
    handleCategoryToggle,
    handleParentCategorySelect,
    handleChildCategoryReset,
    isParentOnlySelected,
    handleOperatingTimeChange,
    handleDateTimeChange,
    handleReset,
    handleApply,
  }
}
