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
  className = 'flex flex-wrap gap-2 py-4 text-caption-1',
}: FilterButtonGroupProps<T>) => {
  return (
    <div className={className}>
      {options.map(({ label, value }) => {
        const isArray = Array.isArray(selectedValue)
        const isValueUndefined = value === undefined
        const isSelectedValueUndefined = selectedValue === undefined

        const isMultiSelectSelected = isArray && selectedValue.includes(value)
        const isUndefinedMatch = isValueUndefined && isSelectedValueUndefined
        const isSingleSelectSelected = selectedValue === value

        const isSelected = multiSelect ? isMultiSelectSelected || isUndefinedMatch : isSingleSelectSelected

        return (
          <button
            key={String(value)}
            onClick={() => onSelect(value)}
            className={cn(
              'flex h-[35px] items-center rounded-[50px] border px-3 transition-colors',
              isSelected ? 'border-gray-1 bg-gray-1 text-white' : 'border-gray-3 bg-white text-gray-1'
            )}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
