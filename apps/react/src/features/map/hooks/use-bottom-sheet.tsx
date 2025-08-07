import { useState, useCallback, useMemo, ReactNode } from 'react'
import BottomSheet from '@/shared/components/custom-bottom-sheet'

interface UseBottomSheetProps {
  initialContent?: ReactNode
}

export const useBottomSheet = (props: UseBottomSheetProps) => {
  const [activeSnapIndex, setActiveSnapIndex] = useState(1)
  const [content, setContent] = useState<ReactNode | null>(props.initialContent)

  const open = useCallback((newContent: ReactNode) => {
    setContent(newContent)
    setActiveSnapIndex(0)
  }, [])

  const close = useCallback(() => {
    setActiveSnapIndex(1)
  }, [])

  const BottomSheetComponent = useMemo(() => {
    return (
      <BottomSheet activeSnapIndex={activeSnapIndex} setActiveSnapIndex={(index) => setActiveSnapIndex(index)}>
        {content}
      </BottomSheet>
    )
  }, [content, activeSnapIndex, close])

  return { open, close, BottomSheetComponent }
}
