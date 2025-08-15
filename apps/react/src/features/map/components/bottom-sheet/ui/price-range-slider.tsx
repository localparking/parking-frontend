import React, { useMemo } from 'react'

interface PriceRangeSliderProps {
  label: string
  min?: number
  max?: number
  step?: number
  value: number
  onChange: (value: number) => void
  formatValue: (value: number) => string
  className?: string
}

export const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  label,
  min = 0,
  max = 10000,
  step = 1000,
  value,
  onChange,
  formatValue,
  className = '',
}) => {
  // 슬라이더 값에 따른 진행률(%)을 계산합니다.
  const percentage = useMemo(() => {
    if (max === min) return 0
    return ((value - min) / (max - min)) * 100
  }, [value, min, max])

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value))
  }

  return (
    <div className={className}>
      <h4 className="text-body-5 text-gray-1">{label}</h4>
      <div className="space-y-6">
        <div className="relative py-4">
          <div className="relative">
            {/* 배경 트랙 */}
            <div className="absolute left-0 h-[11px] w-full rounded-[10px] bg-primary-2" />
            {/* 진행 바 */}
            <div
              className="absolute left-1 h-[6px] rounded-[10px] bg-primary-1"
              style={{
                width: `calc(${percentage}% - 5px)`,
                top: '2px',
              }}
            />
            {/* 슬라이더 */}
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={handleSliderChange}
              className="slider-custom w-full"
            />
            {/* 따라다니는 툴팁 */}
            <div className="absolute -bottom-8 -translate-x-1/2 transform" style={{ left: `${percentage}%` }}>
              <div className="rounded bg-primary-2 px-2 py-1 text-xs whitespace-nowrap text-primary-1 shadow-md">
                {formatValue(value)}
              </div>
            </div>
          </div>
        </div>
        {/* 하단 라벨 */}
        <div className="flex justify-between pb-4 text-caption-2 text-gray-2">
          <span>{formatValue(min)}</span>
          <span>{formatValue(max)}</span>
        </div>
      </div>
    </div>
  )
}
