import React from 'react'
import { cn } from '@ui/common/lib/utils'

type FilterOption<T> = {
  label: React.ReactNode
  value: T
}

interface FilterButtonGroupProps<T> {
  options: FilterOption<T>[]
  selectedValue: T | T[] | undefined
  onSelect: (value: T) => void
  multiSelect?: boolean
  className?: string
}

export const FilterButtonGroup = <T extends string | number | boolean | undefined>({
  options,
  selectedValue,
  onSelect,
  multiSelect = false,
  className = 'flex flex-wrap gap-2',
}: FilterButtonGroupProps<T>) => {
  return (
    <div className={className}>
      {options.map(({ label, value }) => {
        const isSelected = multiSelect
          ? (Array.isArray(selectedValue) && selectedValue.includes(value)) ||
            (value === undefined && selectedValue === undefined)
          : selectedValue === value

        return (
          <button
            key={String(value)}
            onClick={() => onSelect(value)}
            className={cn('rounded-full border px-4 py-1 text-xs font-semibold transition-colors', {
              'border-gray-900 bg-gray-1 text-white': isSelected,
              'border-gray-300 bg-white text-gray-900': !isSelected,
            })}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
