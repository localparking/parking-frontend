import React, { useCallback } from 'react'
import CheckIcon from '@ui/common/assets/icons/check=2.svg'
import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'

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
              <CheckIcon className="h-[22px] w-[22px]" />
            ) : (
              <div className="h-[22px] w-[22px] rounded-full border-[1.3px] border-[#BCBCBC] transition-colors duration-200 hover:border-primary active:border-primary" />
            )}
          </div>
        </div>

        <label htmlFor={id} className="ml-6 cursor-pointer text-body-4 text-gray-1 select-none">
          {label}
        </label>
      </div>

      {showArrow && (
        <Link
          className="text-[#09090B] transition-colors duration-150 hover:text-primary active:text-primary"
          to={`/onboarding/terms/detail`}
          search={{ termId: id }}
        >
          <p className="text-caption-2 text-gray-2">보기</p>
        </Link>
      )}
    </div>
  )
}

export const OnboardingCheckbox = React.memo(OnboardingCheckboxComponent)
OnboardingCheckbox.displayName = 'OnboardingCheckbox'
