// components/TimePicker.tsx
import React from 'react'
import { cn } from '@/shared/utils'

type TimePickerProps = {
  value: string | null // 'HHmm' (정각만: 0000~2300) | null=전체
  onChange: (val: string | null) => void
  className?: string
  showAll?: boolean // 기본 true
  closeOnSelect?: boolean
}

const hours = Array.from({ length: 24 }, (_, h) => h)
const toHHmm = (h: number) => `${String(h).padStart(2, '0')}00`
const korHour = (h: number) => {
  const am = h < 12
  const hour12 = ((h + 11) % 12) + 1
  return `${am ? '오전' : '오후'} ${hour12}시`
}

export function TimePicker({ value, onChange, className, showAll = true, closeOnSelect = false }: TimePickerProps) {
  const [open, setOpen] = React.useState(true)
  const display =
    value === null
      ? '전체'
      : typeof value === 'string' && value.length >= 2
        ? korHour(Number(value.slice(0, 2)))
        : '전체'

  const handlePick = (v: string | null) => {
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
            {showAll && (
              <button
                type="button"
                onClick={() => {
                  handlePick(null)
                }}
                className={cn(
                  'w-full px-3 py-2 text-left text-sm',
                  value === null ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
                )}
              >
                전체
              </button>
            )}

            {hours.map((h) => {
              const hhmm = toHHmm(h)
              const label = korHour(h)
              return (
                <button
                  key={hhmm}
                  type="button"
                  onClick={() => handlePick(hhmm)}
                  className={cn(
                    'w-full px-3 py-2 text-left text-sm',
                    value === hhmm ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
                  )}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
