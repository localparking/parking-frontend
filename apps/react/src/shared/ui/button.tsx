import { cn } from '@ui/common/lib/utils'
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
}

function Button(props: ButtonProps) {
  const { className, loading, children, ...rest } = props

  return (
    <button
      className={cn(
        'relative h-[39px] w-full cursor-pointer rounded-[10px] bg-primary-1 px-8',
        'transition-transform duration-100 active:scale-[0.98]',
        'disabled:cursor-not-allowed disabled:bg-gray-3 disabled:opacity-50',
        className
      )}
      disabled={loading || props.disabled}
      {...rest}
    >
      <div className="flex items-center justify-center gap-2 text-caption-1 text-white">
        {loading ? '로딩 중...' : children}
      </div>
    </button>
  )
}

export default Button
