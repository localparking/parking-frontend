import { useRouter } from '@tanstack/react-router'
import { cn } from '@/shared/utils'
import { LucideChevronLeft } from 'lucide-react'

import type { ReactNode } from 'react'

interface DetailHeaderBarProps {
  title?: string
  right?: ReactNode
  left?: ReactNode
  showBackButton?: boolean
  onBackClick?: () => void
  className?: string
}

export function DetailHeaderBar({
  title,
  right,
  left,
  onBackClick,
  className,
  showBackButton = true,
}: DetailHeaderBarProps) {
  const router = useRouter()

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick()
    } else {
      router.history.back()
    }
  }

  return (
    <header
      className={cn(
        'fixed top-safe-top z-[50] flex h-[50px] w-full max-w-[768px] items-center justify-between bg-white px-6 py-3',
        className
      )}
    >
      <div className="z-10 flex h-[30px] w-[30px] items-center justify-center">
        {showBackButton && !left && (
          <button type="button" onClick={handleBackClick} className="p-2">
            <LucideChevronLeft className="h-6 w-6" />
          </button>
        )}
        {left}
      </div>

      {/* Title Area */}
      {title && <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-body-4">{title}</h1>}

      {/* Right Area */}
      <div className="z-10">{right}</div>
    </header>
  )
}
