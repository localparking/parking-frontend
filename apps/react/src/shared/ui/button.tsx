import { cn } from '@ui/common/lib/utils'

interface ButtonProps {
  onClick?: () => void
  disabled?: boolean
  className?: string
  text?: string
  loading?: boolean
}

function Button(props: ButtonProps) {
  const { onClick, disabled, className, text, loading } = props

  return (
    <button
      className={cn(
        'h-[39px] w-full cursor-pointer rounded-[10px] bg-primary-1 px-8 text-white',
        'transition-transform duration-100 active:scale-[0.98]',
        'disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50',
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <p className="text-caption-1">{loading ? 'Loading...' : text}</p>
    </button>
  )
}

export default Button
