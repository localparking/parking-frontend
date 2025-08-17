import { cn } from '@ui/common/lib/utils'

interface StatusBadgeProps {
  isOpen?: boolean
}

function StatusBadge({ isOpen }: StatusBadgeProps) {
  if (isOpen === null) return null

  return (
    <span
      className={cn(
        'rounded-full px-2 py-1 text-caption-4 whitespace-nowrap',
        isOpen ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
      )}
    >
      {isOpen ? '영업중' : '영업마감'}
    </span>
  )
}

export default StatusBadge
