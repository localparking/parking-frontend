import React, { useMemo } from 'react'
import { cn } from '@/shared/utils' // cn 유틸리티 import 추가

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
  const percentage = useMemo(() => {
    if (max === min) return 0
    return ((value - min) / (max - min)) * 100
  }, [value, min, max])

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value))
  }

  return (
    <div className={cn('relative', className)}>
      <p className="text-body-5 text-gray-1">{label}</p>

      <div className="relative pt-8">
        {/* 트랙 */}
        <div className="relative h-[11px]">
          <div className="absolute h-full w-full rounded-[10px] bg-primary-2" />
          <div
            className="absolute top-1/2 h-[6px] -translate-y-1/2 rounded-[10px] bg-primary-1"
            style={{ width: `calc(${percentage}% + 4px)` }}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleSliderChange}
            className="slider-custom w-full"
          />
        </div>

        {/* 툴팁: 위치 계산 로직 수정 */}
        <div
          className="slider-tooltip absolute top-0 rounded bg-primary-2 px-2 py-1 text-xs whitespace-nowrap text-primary-1 shadow-md"
          style={{
            left: `${percentage}%`,
            // 툴팁이 슬라이더 안쪽에 머물도록 transform 값을 동적으로 조절
            transform: `translateX(-${percentage}%)`,
          }}
        >
          {formatValue(value)}
        </div>

        {/* 하단 라벨 */}
        <div className="mt-4 flex justify-between text-caption-2 text-gray-2">
          <span>{formatValue(min)}</span>
          <span>{formatValue(max)}</span>
        </div>
      </div>
    </div>
  )
}
