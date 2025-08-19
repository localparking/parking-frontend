import { cn } from '@ui/common/lib/utils'
import { useId } from 'react'

interface ProfileToggleSwitchProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function ProfileToggleSwitch({ label, checked, onChange }: ProfileToggleSwitchProps) {
  const id = useId()

  return (
    <div className="flex items-center justify-between">
      <label htmlFor={id} className="cursor-pointer text-body-5 text-gray-1">
        {label}
      </label>

      <label htmlFor={id} className="relative cursor-pointer">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div className={cn(`h-5 w-10 rounded-full transition-colors`, checked ? 'bg-primary-1' : 'bg-gray-3')}>
          <div
            className={cn(
              `h-5 w-5 rounded-full bg-white shadow-md transition-transform`,
              checked ? 'translate-x-5' : 'translate-x-0'
            )}
          />
        </div>
      </label>
    </div>
  )
}
