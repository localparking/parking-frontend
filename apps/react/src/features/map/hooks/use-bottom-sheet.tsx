// hooks/useBottomSheet.ts
import { useState, useCallback, useMemo, ReactNode } from 'react'
import BottomSheet from '@/shared/components/custom-bottom-sheet'

export const useBottomSheet = () => {
  const [activeSnapIndex, setActiveSnapIndex] = useState(1)
  const [content, setContent] = useState<ReactNode | null>(null)

  const open = useCallback((newContent: ReactNode) => {
    setContent(newContent)
    setActiveSnapIndex(0)
  }, [])

  const close = useCallback(() => {
    setActiveSnapIndex(1)
  }, [])

  const BottomSheetComponent = useMemo(() => {
    // 렌더링할 컨텐츠가 없으면 null을 반환하여 렌더링하지 않음

    return (
      <BottomSheet activeSnapIndex={activeSnapIndex} setActiveSnapIndex={(index) => setActiveSnapIndex(index)}>
        {content}
      </BottomSheet>
    )
  }, [content, activeSnapIndex, close])

  return { open, close, BottomSheetComponent }
}
