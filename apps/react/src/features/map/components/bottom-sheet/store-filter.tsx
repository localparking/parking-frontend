import React from 'react'
import { useCategoryContext } from '@/shared/context/category-context'
import { DayOfWeek } from '../../context/map-context'
import { useStoreFilter } from '../../hooks/use-store-filter'
import { FilterButtonGroup } from './filter-button'
import { DatePicker } from '@ui/common/components/date-picker'
import { TimePicker } from '@ui/common/components/time-picker'
import { cn } from '@ui/common/lib/utils'

const PARKING_TIME_OPTIONS = [
  { label: '전체', value: undefined },
  { label: '30분', value: 30 },
  { label: '1시간', value: 60 },
  { label: '2시간', value: 120 },
  { label: '3시간 이상', value: 180 },
]

const OPERATING_TIME_OPTIONS = [
  { label: '전체', value: 'all' as const },
  { label: '영업중', value: 'open' as const },
  { label: '24시간 영업', value: '24hours' as const },
  { label: '요일 시간', value: 'datetime' as const },
]

const ICON_MAP = {
  cafe: '/icons/cafe-icon.png',
  food: '/icons/food-icon.png',
  culture: '/icons/culture-icon.png',
  leisure: '/icons/leisure-icon.png',
  shopping: '/icons/shopping-icon.png',
  parking: '/icons/parking-icon.png',
} as const

export const StoreFilter: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { categoryTree, parentIdToPrefixMap } = useCategoryContext()

  const {
    filterState,
    selectedOperatingTime,
    updateFilter,
    handleChildCategoryToggle,
    handleOperatingTimeChange,
    handleDateTimeChange,
    handleReset,
    handleApply,
  } = useStoreFilter()

  const parentCategories = categoryTree.filter(
    (category) => category.parentId === null || category.parentId === undefined
  )

  const findParentCategory = (categoryId: number | undefined) => {
    if (!categoryId) return null

    const directParent = categoryTree.find((cat) => cat.categoryId === categoryId)
    if (directParent && (directParent.parentId === null || directParent.parentId === undefined)) {
      return directParent
    }

    for (const parent of categoryTree) {
      if (parent.children.some((child) => child.categoryId === categoryId)) {
        return parent
      }
    }
    return null
  }

  const selectedParentCategory = findParentCategory(filterState.categoryId)
  const childCategories = selectedParentCategory?.children || []

  const getIconPath = (categoryId: number) => {
    const prefix = parentIdToPrefixMap.get(categoryId) || 'food'
    return ICON_MAP[prefix as keyof typeof ICON_MAP] || ICON_MAP.food
  }

  const onApply = () => {
    handleApply()
    onClose()
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col space-y-6 pb-4">
          {/* 가게 종류 */}
          <div>
            <h4 className="mb-2 text-xs font-bold text-gray-900">가게 종류</h4>
            <div className="flex flex-wrap gap-2">
              {/* 전체 */}
              <button
                onClick={() => updateFilter({ categoryId: undefined })}
                className={cn(
                  'flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
                  !filterState.categoryId
                    ? 'border-gray-1 bg-gray-1 text-white'
                    : 'border-gray-300 bg-white text-gray-900'
                )}
              >
                <span>전체</span>
              </button>
              {/* 부모 카테고리 */}
              {parentCategories.map((category) => (
                <button
                  key={category.categoryId}
                  onClick={() => updateFilter({ categoryId: category.categoryId })}
                  className={cn(
                    'flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
                    selectedParentCategory?.categoryId === category.categoryId
                      ? 'border-gray-1 bg-gray-1 text-white'
                      : 'border-gray-300 bg-white text-gray-900'
                  )}
                >
                  <img src={getIconPath(category.categoryId)} alt={category.categoryName} className="h-4 w-4" />
                  <span>{category.categoryName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 자식 카테고리 */}
          {childCategories.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-bold text-gray-900">가게 세부 종류</h4>
              <FilterButtonGroup
                options={[
                  { label: '전체', value: undefined },
                  ...childCategories.map((category) => ({
                    label: category.categoryName,
                    value: category.categoryId,
                  })),
                ]}
                selectedValue={filterState.categoryIds || undefined}
                onSelect={(value) => {
                  if (value === undefined) {
                    updateFilter({ categoryIds: undefined })
                  } else if (typeof value === 'number') {
                    handleChildCategoryToggle(value)
                  }
                }}
                multiSelect
              />
            </div>
          )}

          {/* 최대 무료 주차시간 */}
          <div>
            <h4 className="mb-2 text-xs font-bold text-gray-900">최대 무료 주차시간</h4>
            <FilterButtonGroup
              options={PARKING_TIME_OPTIONS}
              selectedValue={filterState.maxFreeMin}
              onSelect={(value) => updateFilter({ maxFreeMin: value })}
            />
          </div>

          {/* 운영시간 */}
          <div>
            <h4 className="mb-2 text-xs font-bold text-gray-900">운영시간</h4>
            <div className="space-y-3">
              <FilterButtonGroup
                options={OPERATING_TIME_OPTIONS}
                selectedValue={selectedOperatingTime}
                onSelect={handleOperatingTimeChange}
              />

              {/* DateTimePicker 팝업 */}
              {selectedOperatingTime === 'datetime' && (
                <div className="space-y-2">
                  <DatePicker
                    value={new Date().toISOString()}
                    onChange={(value) => {
                      if (!value) return
                      const date = new Date(value)
                      const dayNames: DayOfWeek[] = [
                        DayOfWeek.SUNDAY,
                        DayOfWeek.MONDAY,
                        DayOfWeek.TUESDAY,
                        DayOfWeek.WEDNESDAY,
                        DayOfWeek.THURSDAY,
                        DayOfWeek.FRIDAY,
                        DayOfWeek.SATURDAY,
                      ]
                      handleDateTimeChange({
                        checkDayOfWeek: dayNames[date.getDay()],
                        checkTime: filterState.checkTime,
                      })
                    }}
                    placeholder="날짜를 선택하세요"
                    className="w-full"
                  />
                  <TimePicker
                    value={filterState.checkTime}
                    onChange={(value) => handleDateTimeChange({ checkTime: value })}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-600">
                    선택된 시간: {new Date().toLocaleDateString('ko-KR')} {filterState.checkTime?.substring(0, 2)}:
                    {filterState.checkTime?.substring(2, 4)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 border-t border-gray-100 bg-white p-4 pb-12">
        <button
          onClick={handleReset}
          className="flex-1 rounded-lg bg-gray-200 px-5 py-3 text-xs font-bold text-gray-600"
        >
          초기화
        </button>
        <button onClick={onApply} className="flex-2 rounded-lg bg-gray-1 px-5 py-3 text-xs font-bold text-white">
          적용하기
        </button>
      </div>
    </div>
  )
}
