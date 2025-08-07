import { cn } from '@ui/common/lib/utils'

interface ButtonProps {
  onClick?: () => void
  disabled?: boolean
  className?: string
  children?: React.ReactNode
  loading?: boolean
}

function Button(props: ButtonProps) {
  const { onClick, disabled, className, children, loading } = props

  return (
    <button
      className={cn(
        'h-[39px] w-full cursor-pointer rounded-[10px] bg-primary-1 px-8 text-caption-1 text-white',
        'transition-transform duration-100 active:scale-[0.98]',
        'disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50',
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}

export default Button
