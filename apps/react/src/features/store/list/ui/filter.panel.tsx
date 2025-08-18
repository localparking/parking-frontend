import React from 'react'
import { useCategoryContext } from '@/shared/context/category-context'

import { findParentCategoryByIds } from '@/shared/utils'
import { DatePicker, FilterItem, FilterPanelLayout, TimePicker } from '@/shared/ui'
import { useStoreFilter } from '@/features/store/hook/use-store-filter'
import { StoreCategoryIcon } from '@/shared/ui/custom-icons'

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

export const StoreFilter: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { categoryTree } = useCategoryContext()

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

  return (
    <FilterPanelLayout title="내 주변 매장 설정" onClose={onClose} onReset={handleReset} onApply={handleApply}>
      <div className="flex flex-col gap-4">
        {/* 매장 종류 */}
        <h4 className="text-body-5 text-gray-1">매장 종류</h4>
        <div className="flex flex-wrap gap-2">
          <FilterItem
            isSelected={!filterState.categoryIds || filterState.categoryIds.length === 0}
            onClick={() => updateFilter({ categoryIds: undefined })}
            label="전체"
          />
          {parentCategories.map((category) => (
            <FilterItem
              key={category.categoryId}
              isSelected={selectedParentCategory?.categoryId === category.categoryId}
              onClick={() => handleParentCategorySelect(category.categoryId)}
              icon={<StoreCategoryIcon category={category} className="h-5 w-5" />}
              label={category.categoryName}
            />
          ))}
        </div>

        {/* 자식 카테고리 */}
        {childCategories.length > 0 && (
          <>
            <h4 className="text-body-5 text-gray-1">매장 세부 종류</h4>
            <div className="flex flex-wrap items-center gap-2">
              <FilterItem
                isSelected={selectedParentCategory ? isParentOnlySelected(selectedParentCategory.categoryId) : false}
                onClick={() => selectedParentCategory && handleChildCategoryReset(selectedParentCategory.categoryId)}
                label="전체"
              />
              {childCategories.map((category) => (
                <FilterItem
                  key={category.categoryId}
                  isSelected={filterState.categoryIds?.includes(category.categoryId) ?? false}
                  onClick={() => handleCategoryToggle(category.categoryId)}
                  label={category.categoryName}
                />
              ))}
            </div>
          </>
        )}

        {/* 최대 무료 주차시간 */}
        <h4 className="text-body-5 text-gray-1">최대 무료 주차시간</h4>
        <div className="flex flex-wrap items-center gap-2">
          {PARKING_TIME_OPTIONS.map((option) => (
            <FilterItem
              key={String(option.value)}
              isSelected={filterState.maxFreeMin === option.value}
              onClick={() => updateFilter({ maxFreeMin: option.value })}
              label={option.label}
            />
          ))}
        </div>

        {/* 운영시간 */}
        <h4 className="text-body-5 text-gray-1">운영시간</h4>

        <div className="flex flex-wrap items-center gap-2">
          {OPERATING_TIME_OPTIONS.map((option) => (
            <FilterItem
              key={option.value}
              isSelected={selectedOperatingTime === option.value}
              onClick={() => handleOperatingTimeChange(option.value)}
              label={option.label}
            />
          ))}
        </div>

        {/* DateTimePicker 팝업 */}
        {selectedOperatingTime === 'datetime' && (
          <div className="flex gap-2">
            <DatePicker
              className="flex-1"
              value={filterState.checkDayOfWeek ?? null}
              onChange={(dow) => handleDateTimeChange({ checkDayOfWeek: dow as typeof filterState.checkDayOfWeek })}
            />

            <TimePicker
              className="flex-1"
              value={filterState.checkTime ?? null}
              onChange={(hhmm) => handleDateTimeChange({ checkTime: hhmm ?? undefined })}
            />
          </div>
        )}
      </div>
    </FilterPanelLayout>
  )
}
