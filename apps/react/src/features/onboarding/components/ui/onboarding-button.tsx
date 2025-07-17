import React from 'react'
import { cn } from '@ui/common/lib/utils'

interface OnboardingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  loading?: boolean
}

export const OnboardingButton: React.FC<OnboardingButtonProps> = ({
  variant = 'primary',
  loading = false,
  className,
  disabled,
  children,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 font-semibold text-xs rounded-[10px] h-[39px] w-[292px] px-8'

  const variantClasses = {
    primary: 'bg-primary text-white active:scale-95',
    secondary: 'bg-gray-1 text-white active:scale-95',
  }

  return (
    <button className={cn(baseClasses, variantClasses[variant], className)} disabled={disabled || loading} {...props}>
      {loading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {children}
    </button>
  )
}
