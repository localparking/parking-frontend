import React, { useCallback } from 'react'
import CheckIcon from '@ui/common/assets/icons/check=2.svg'

interface OnboardingCheckboxProps {
  id: string
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  showArrow?: boolean
}

const OnboardingCheckboxComponent: React.FC<OnboardingCheckboxProps> = ({
  id,
  checked,
  onChange,
  label,
  showArrow = true,
}) => {
  const handleToggle = useCallback(() => {
    onChange(!checked)
  }, [checked, onChange])

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div
          className="relative cursor-pointer transition-transform duration-150 hover:scale-105 active:scale-95"
          onClick={handleToggle}
        >
          <input type="checkbox" id={id} checked={checked} onChange={handleToggle} className="sr-only" />
          <div className="transition-all duration-200 ease-in-out">
            {checked ? (
              <CheckIcon className="h-[18px] w-[18px]" />
            ) : (
              <div className="h-[18px] w-[18px] rounded-full border-[1.3px] border-[#BCBCBC] transition-colors duration-200 hover:border-primary active:border-primary" />
            )}
          </div>
        </div>
        <label htmlFor={id} className="ml-3 cursor-pointer text-[10px] font-semibold text-gray-1 select-none">
          {label}
        </label>
      </div>
      {showArrow && (
        <button
          className="text-[#09090B] transition-colors duration-150 hover:text-primary active:text-primary"
          type="button"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  )
}

export const OnboardingCheckbox = React.memo(OnboardingCheckboxComponent)
OnboardingCheckbox.displayName = 'OnboardingCheckbox'
