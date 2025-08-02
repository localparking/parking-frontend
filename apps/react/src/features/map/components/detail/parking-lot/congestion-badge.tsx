import React from 'react'
import { cn } from '@ui/common/lib/utils'

interface CongestionBadgeProps {
  congestion?: string
}

const getCongestionColor = (congestion?: string) => {
  switch (congestion) {
    case '여유':
      return 'bg-green-100 text-green-600'
    case '보통':
      return 'bg-yellow-100 text-yellow-600'
    case '혼잡':
      return 'bg-red-100 text-red-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

export const CongestionBadge: React.FC<CongestionBadgeProps> = React.memo(({ congestion }) => {
  if (!congestion) return null

  return (
    <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold', getCongestionColor(congestion))}>
      {congestion}
    </span>
  )
})

CongestionBadge.displayName = 'CongestionBadge'
