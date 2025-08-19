import React from 'react'
import { cn } from '@ui/common/lib/utils'

type DayOfWeekEn = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'

type DatePickerProps = {
  value: DayOfWeekEn | null // null = 전체
  onChange: (val: DayOfWeekEn | null) => void
  className?: string
  closeOnSelect?: boolean
}

const DOWS_MON_FIRST: { ko: string; en: DayOfWeekEn }[] = [
  { ko: '월', en: 'MONDAY' },
  { ko: '화', en: 'TUESDAY' },
  { ko: '수', en: 'WEDNESDAY' },
  { ko: '목', en: 'THURSDAY' },
  { ko: '금', en: 'FRIDAY' },
  { ko: '토', en: 'SATURDAY' },
  { ko: '일', en: 'SUNDAY' },
]

export function DatePicker({ value, onChange, className, closeOnSelect = false }: DatePickerProps) {
  const [open, setOpen] = React.useState(true)
  const items = React.useMemo(() => DOWS_MON_FIRST, [])

  const display = value ? (items.find((i) => i.en === value)?.ko ?? value) : '전체'

  const handlePick = (v: DayOfWeekEn | null) => {
    onChange(v)
    if (closeOnSelect) setOpen(false)
  }

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-left text-base',
          'focus:ring-2 focus:ring-gray-900/10 focus:outline-none'
        )}
      >
        {display}
      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] right-0 left-0 z-20 rounded-xl border border-gray-200 bg-white shadow-md">
          <div className="max-h-64 overflow-y-auto py-2">
            {/* 전체 */}
            <button
              type="button"
              onClick={() => handlePick(null)}
              className={cn(
                'w-full px-3 py-2 text-left text-sm',
                value === null ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
              )}
            >
              전체
            </button>

            {items.map(({ ko, en }) => (
              <button
                key={en}
                type="button"
                onClick={() => handlePick(en)}
                className={cn(
                  'w-full px-3 py-2 text-left text-sm',
                  value === en ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
                )}
              >
                {ko}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
