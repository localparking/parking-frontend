import { cn } from '@/shared/utils'
import { ChevronRight } from 'lucide-react'

interface MyPageMenuItemProps {
  title: string
  onClick?: () => void
  className?: string
}

export function MyPageMenuItem({ title, onClick, className }: MyPageMenuItemProps) {
  return (
    <div className={cn('flex w-full cursor-pointer items-center justify-between', className)} onClick={onClick}>
      <span className="text-body-6 text-gray-1">{title}</span>
      <ChevronRight className="h-5 w-5" />
    </div>
  )
}
