import React from 'react'
import { cn } from '@ui/common/lib/utils'

interface FilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSelected: boolean
  icon?: React.ReactNode
  label: React.ReactNode
}

export const FilterItem = React.memo(({ isSelected, icon, label, className, ...props }: FilterChipProps) => {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      className={cn(
        'flex min-w-[55px] items-center justify-center gap-1 rounded-[18px] border px-2 py-[6px] hover:cursor-pointer',
        isSelected ? 'border-gray-1 bg-gray-1 text-white' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
      )}
      {...props}
    >
      {icon && <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white">{icon}</div>}
      <span className={cn('shrink-0 text-body-6 whitespace-nowrap', className)}>{label}</span>
    </button>
  )
})

FilterItem.displayName = 'FilterItem'
