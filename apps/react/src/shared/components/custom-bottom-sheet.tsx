import React, { useState, useEffect, useMemo, useRef } from 'react'
import { motion, useAnimation, PanInfo } from 'framer-motion'
import { cn } from '@ui/common/lib/utils'

type BottomSheetProps = {
  children: React.ReactNode
  activeSnapIndex: number
  setActiveSnapIndex: (index: number) => void
  snapPoints?: number[]
}

const BottomSheet = ({
  children,
  activeSnapIndex,
  setActiveSnapIndex,
  snapPoints: customSnapPoints,
}: BottomSheetProps) => {
  const [windowHeight, setWindowHeight] = useState<number | null>(null)
  const controls = useAnimation()
  const contentRef = useRef<HTMLDivElement>(null)

  const snapPoints = useMemo(() => {
    if (customSnapPoints) return customSnapPoints
    if (windowHeight === null) return null

    const SNAP_MID = windowHeight - 400
    const SNAP_BOTTOM = windowHeight - 100
    return [SNAP_MID, SNAP_BOTTOM]
  }, [windowHeight, customSnapPoints])

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight)
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (snapPoints) {
      controls.start({ y: snapPoints[activeSnapIndex] }, { duration: 0.3, ease: 'easeOut' })
    }
  }, [activeSnapIndex, snapPoints, controls])

  // ✨ UX 개선: 드래그 시작 위치에 따라 스크롤 초기화 여부 결정
  const onDragStart = (event: MouseEvent | TouchEvent | PointerEvent) => {
    const contentEl = contentRef.current
    // event.target은 드래그가 시작된 가장 안쪽의 DOM 요소를 가리킴
    const dragTarget = event.target as Node

    // 드래그 시작 지점이 스크롤 영역(contentEl) 내부에 포함되는지 확인
    if (contentEl && contentEl.contains(dragTarget)) {
      // 포함된다면(컨텐츠 영역을 드래그), 스크롤 초기화를 하지 않고 기본 스크롤 동작에 맡김
      return
    }

    // 드래그 시작 지점이 핸들바 등 외부에 있다면 스크롤을 맨 위로 초기화
    if (contentEl) {
      contentEl.scrollTop = 0
    }
  }

  const onDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offsetY = info.offset.y
    const offsetX = info.offset.x

    if (Math.abs(offsetX) > Math.abs(offsetY)) {
      return
    }

    const velocityY = info.velocity.y
    const contentEl = contentRef.current

    if (!snapPoints || !contentEl) return

    // 이 로직은 이제 핸들바를 끌 때만 적용되므로 사실상 불필요하지만,
    // 혹시 모를 엣지 케이스를 위한 방어코드로 남겨둘 수 있습니다.
    if (activeSnapIndex === 0 && contentEl.scrollTop > 0) {
      controls.start({ y: snapPoints[activeSnapIndex] }, { duration: 0.3, ease: 'easeOut' })
      return
    }

    const direction = offsetY + velocityY * 0.5 > 0 ? 1 : -1
    const nextIndex = Math.max(0, Math.min(snapPoints.length - 1, activeSnapIndex + direction))
    setActiveSnapIndex(nextIndex)
  }

  if (!snapPoints) {
    return null
  }

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: snapPoints[0], bottom: snapPoints[snapPoints.length - 1] }}
      dragElastic={{ top: 0.05, bottom: 0.1 }}
      dragMomentum={false}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      initial={{ y: snapPoints[activeSnapIndex] }}
      animate={controls}
      className="fixed bottom-0 z-15 mx-auto flex h-full w-full max-w-[600px] flex-col rounded-t-[40px] bg-white shadow-lg"
      style={{ y: snapPoints[activeSnapIndex] }}
    >
      <div className="flex w-full flex-shrink-0 cursor-grab justify-center py-5">
        <div className="h-[3px] w-[150px] rounded-full bg-gray-300" />
      </div>
      <div
        ref={contentRef}
        className={cn(
          'flex max-h-[400px] flex-1 flex-col pb-10',
          activeSnapIndex === 1 ? 'overflow-y-hidden' : 'overflow-y-auto'
        )}
        style={{ touchAction: 'pan-y pan-x', overscrollBehavior: 'contain' }}
      >
        {children}
      </div>
    </motion.div>
  )
}

export default BottomSheet
