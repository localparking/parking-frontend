import React from 'react'

interface TimePickerProps {
  value?: string // HHmm 형식
  onChange?: (value: string) => void
  className?: string
}

export const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, className = '' }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

  const currentHour = value ? value.substring(0, 2) : '12'
  const currentMinute = value ? value.substring(2, 4) : '00'

  const handleHourChange = (hour: string) => {
    onChange?.(hour + currentMinute)
  }

  const handleMinuteChange = (minute: string) => {
    onChange?.(currentHour + minute)
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <select
        value={currentHour}
        onChange={(e) => handleHourChange(e.target.value)}
        className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-gray-500 focus:outline-none"
      >
        {hours.map((hour) => (
          <option key={hour} value={hour}>
            {hour}시
          </option>
        ))}
      </select>
      <span className="text-xs text-gray-500">:</span>
      <select
        value={currentMinute}
        onChange={(e) => handleMinuteChange(e.target.value)}
        className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-gray-500 focus:outline-none"
      >
        {minutes.map((minute) => (
          <option key={minute} value={minute}>
            {minute}분
          </option>
        ))}
      </select>
    </div>
  )
}
