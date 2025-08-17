import React, { useRef, useEffect, useMemo } from 'react'
import { cn } from '@ui/common/lib/utils'

interface InfiniteListViewProps<T extends { [key: string]: any }> {
  pages: any[] | undefined
  renderItem: (item: T) => React.ReactNode
  getKey: (item: T) => string | number
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onFetchNextPage: () => void
  emptyMessage: string
  className?: string
}

export function InfiniteListView<T extends { [key: string]: any }>({
  pages,
  renderItem,
  getKey,
  hasNextPage,
  isFetchingNextPage,
  onFetchNextPage,
  emptyMessage,
  className,
}: InfiniteListViewProps<T>) {
  const items = useMemo(() => pages?.flatMap((page) => page.content || []) || [], [pages])
  const observerTarget = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          onFetchNextPage()
        }
      },
      { threshold: 1.0 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [onFetchNextPage, hasNextPage, isFetchingNextPage])

  if (items.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-center text-gray-500">
          <p className="text-caption-2">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <ul className={className}>
        {items.map((item) => (
          <li key={getKey(item)}>{renderItem(item)}</li>
        ))}
      </ul>

      <div ref={observerTarget} className={cn('h-1', { invisible: isFetchingNextPage || !hasNextPage })} />
      {isFetchingNextPage && (
        <div className="p-4 text-center">
          <div className="text-caption-2 text-gray-2">더 불러오는 중...</div>
        </div>
      )}
    </div>
  )
}
