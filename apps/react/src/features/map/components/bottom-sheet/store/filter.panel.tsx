import React from 'react'
import { useCategoryContext } from '@/shared/context/category-context'
import { DayOfWeek } from '@/features/map/context/map-context'
import { useStoreFilter } from '@/features/map'
import { FilterButtonGroup } from '../ui/filter-button'
import { DatePicker } from '@ui/common/components/date-picker'
import { TimePicker } from '@ui/common/components/time-picker'
import { cn } from '@ui/common/lib/utils'
import { getCategoryIconPath, findParentCategoryByIds } from '@/shared/utils/category'
import { formatTime } from '@/shared/utils/format'
import { FilterPanelLayout } from '../generic/filter-panel-layout'

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

export const StoreFilter: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { categoryTree, parentIdToPrefixMap } = useCategoryContext()

  const {
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
  } = useStoreFilter()

  const parentCategories = categoryTree

  const selectedParentCategory = findParentCategoryByIds(categoryTree, filterState.categoryIds)
  const childCategories = selectedParentCategory?.children || []

  const onApply = () => {
    handleApply()
    onClose()
  }

  return (
    <FilterPanelLayout title="내 주변 가게 설정" onClose={onClose} onReset={handleReset} onApply={handleApply}>
      <div className="flex flex-col">
        {/* 가게 종류 */}
        <div>
          <h4 className="text-body-5 text-gray-1">가게 종류</h4>
          <div className="flex flex-wrap gap-2 py-4">
            {/* 전체 */}
            <button
              onClick={() => updateFilter({ categoryIds: undefined })}
              className={cn(
                'flex h-[35px] items-center rounded-[50px] border border-gray-3 bg-gray-1 px-3 py-2 text-white transition-colors',
                {
                  'border-gray-3 bg-white text-gray-1': filterState.categoryIds && filterState.categoryIds.length > 0,
                }
              )}
            >
              <span className="text-caption-1">전체</span>
            </button>

            {/* 부모 카테고리 */}
            {parentCategories.map((category) => (
              <button
                key={category.categoryId}
                onClick={() => handleParentCategorySelect(category.categoryId)}
                className={cn(
                  'flex h-[35px] items-center gap-1 rounded-[50px] border border-gray-3 bg-gray-1 px-3 py-2 text-white transition-colors',
                  {
                    'border-gray-300 bg-white text-gray-900':
                      selectedParentCategory?.categoryId !== category.categoryId,
                  }
                )}
              >
                <img
                  src={getCategoryIconPath(category.categoryId, parentIdToPrefixMap)}
                  alt={category.categoryName}
                  className="h-5 w-5"
                />
                <span className="text-caption-1">{category.categoryName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 자식 카테고리 */}
        {childCategories.length > 0 && (
          <div>
            <h4 className="text-body-5 text-gray-1">가게 세부 종류</h4>
            <FilterButtonGroup
              options={[
                { label: '전체', value: undefined },
                ...childCategories.map((category) => ({
                  label: category.categoryName,
                  value: category.categoryId,
                })),
              ]}
              selectedValue={
                selectedParentCategory && isParentOnlySelected(selectedParentCategory.categoryId)
                  ? undefined // "전체" 버튼 선택 상태
                  : filterState.categoryIds || undefined
              }
              onSelect={(value) => {
                if (value === undefined && selectedParentCategory) {
                  handleChildCategoryReset(selectedParentCategory.categoryId)
                } else if (typeof value === 'number') {
                  handleCategoryToggle(value)
                }
              }}
              multiSelect
            />
          </div>
        )}

        {/* 최대 무료 주차시간 */}
        <div>
          <h4 className="text-body-5 text-gray-1">최대 무료 주차시간</h4>
          <FilterButtonGroup
            options={PARKING_TIME_OPTIONS}
            selectedValue={filterState.maxFreeMin}
            onSelect={(value) => updateFilter({ maxFreeMin: value })}
          />
        </div>

        {/* 운영시간 */}
        <div>
          <h4 className="text-body-5 text-gray-1">운영시간</h4>
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
                <div className="text-caption-2 text-gray-600">
                  선택된 시간: {new Date().toLocaleDateString('ko-KR')} {formatTime(filterState.checkTime)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </FilterPanelLayout>
  )
}
