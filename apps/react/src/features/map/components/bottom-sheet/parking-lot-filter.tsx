import React from 'react'
import { useParkingLotFilter } from '../../hooks/use-parking-lot-filter'
import { FilterButtonGroup } from './filter-button'
import { PriceRangeSlider } from './price-range-slider'
import { DatePicker } from '@ui/common/components/date-picker'
import { TimePicker } from '@ui/common/components/time-picker'
import { Congestion, DayOfWeek } from '../../context/map-context'

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

  const onApply = () => {
    handleApply()
    onClose()
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col space-y-6 pb-4">
          {/* 운영 형태 */}
          <div>
            <h4 className="mb-2 text-xs font-bold text-gray-900">운영 형태</h4>
            <div className="flex flex-wrap gap-2">
              {/* 실시간 버튼 */}
              <button
                onClick={() => updateFilter({ isRealtime: !filterState.isRealtime })}
                className={`rounded-full border px-4 py-1 text-xs font-semibold transition-colors ${
                  filterState.isRealtime
                    ? 'border-gray-900 bg-gray-1 text-white'
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
              >
                실시간
              </button>
              <FilterButtonGroup
                options={FREE_STATUS_OPTIONS}
                selectedValue={filterState.isFree}
                onSelect={(value) => updateFilter({ isFree: value as boolean | undefined })}
              />
            </div>
          </div>

          {/* 혼잡도 (개선된 FilterButtonGroup 사용) */}
          <div>
            <h4 className="mb-2 text-xs font-bold text-gray-900">혼잡도</h4>
            <FilterButtonGroup
              options={CONGESTION_OPTIONS}
              selectedValue={filterState.congestion || []}
              onSelect={handleCongestionToggle}
              multiSelect
            />
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
                    onChange={(value) => handleDateTimeChange({ checkTime: filterState.checkTime })}
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

      <div className="flex gap-4 bg-white p-4 pb-12">
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
