import React from 'react'
import { DatePicker } from '@ui/common/components/date-picker'
import { TimePicker } from '@ui/common/components/time-picker'
import { Congestion } from '@/features/map/context/map-context'
import { cn } from '@ui/common/lib/utils'
import { formatTime } from '@/shared/utils/format'

import { FilterButtonGroup, FilterPanelLayout, PriceRangeSlider } from '@/shared/ui'
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
      <div className="flex flex-col">
        {/* 운영 형태 */}
        <div>
          <h4 className="text-body-5 text-gray-1">운영 형태</h4>
          <div className="flex flex-wrap items-center gap-2 text-caption-1">
            {/* 실시간 버튼 */}
            <button
              onClick={() => updateFilter({ isRealtime: !filterState.isRealtime })}
              className={cn(
                'flex h-[35px] items-center rounded-[50px] border px-3 transition-colors',
                filterState.isRealtime ? 'border-gray-1 bg-gray-1 text-white' : 'border-gray-3 bg-white text-gray-1'
              )}
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
          <h4 className="text-body-5 text-gray-1">혼잡도</h4>
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
