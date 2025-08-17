import React from 'react'
import { Congestion } from '@/features/map/context/map-context'

import { FilterItem, FilterPanelLayout, PriceRangeSlider, DatePicker, TimePicker } from '@/shared/ui'
import { useParkingLotFilter } from '@/features/parking-lot/hook/use-parking-lot-filter'

const FREE_STATUS_OPTIONS = [
  { label: '무료', value: true as boolean },
  { label: '유료', value: false as boolean },
]

const CONGESTION_OPTIONS = [
  { label: '혼잡', value: Congestion.HIGH },
  { label: '보통', value: Congestion.MEDIUM },
  { label: '여유', value: Congestion.LOW },
]

const OPERATING_TIME_OPTIONS = [
  { label: '전체', value: 'all' as const },
  { label: '영업중', value: 'open' as const },
  { label: '24시간 영업', value: '24hours' as const },
  { label: '요일 시간', value: 'datetime' as const },
]

export const ParkingLotFilter: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const {
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
  } = useParkingLotFilter()

  return (
    <FilterPanelLayout title="내 주변 주차장 설정" onClose={onClose} onReset={handleReset} onApply={handleApply}>
      <div className="flex flex-col gap-4">
        {/* 운영 형태 */}
        <h4 className="text-body-5 text-gray-1">운영 형태</h4>
        <div className="flex flex-wrap items-center gap-2">
          {/* 실시간 버튼 */}
          <FilterItem
            isSelected={!!filterState.isRealtime}
            onClick={() => updateFilter({ isRealtime: !filterState.isRealtime })}
            label="실시간"
          />
          {FREE_STATUS_OPTIONS.map((option) => (
            <FilterItem
              key={String(option.value)}
              isSelected={filterState.isFree === option.value}
              onClick={() => updateFilter({ isFree: option.value as boolean | undefined })}
              label={option.label}
            />
          ))}
        </div>

        {/* 1시간 기준 주차비용 - 유료 선택시에만 표시 */}
        {filterState.isFree === false && (
          <PriceRangeSlider
            label="1시간 기준 주차비용"
            min={0}
            max={10000}
            step={1000}
            value={sliderValue}
            onChange={setSliderValue}
            formatValue={formatSliderValue}
          />
        )}

        {/* 혼잡도 */}
        <h4 className="text-body-5 text-gray-1">혼잡도</h4>
        <div className="flex flex-wrap items-center gap-2">
          {CONGESTION_OPTIONS.map((option) => (
            <FilterItem
              key={option.value}
              isSelected={filterState.congestion?.includes(option.value) ?? false}
              onClick={() => handleCongestionToggle(option.value)}
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
