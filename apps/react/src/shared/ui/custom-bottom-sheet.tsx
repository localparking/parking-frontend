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

    const SNAP_TOP = 300 // 상단에서 300px 여유
    const SNAP_BOTTOM = windowHeight - 100 // 하단에서 100px만 노출
    const SNAP_MID = Math.floor((SNAP_TOP + SNAP_BOTTOM) / 2) // 적당한 중간값

    return [SNAP_TOP, SNAP_MID, SNAP_BOTTOM]
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

  // 드래그 시작 시 스크롤 초기화 판단
  const onDragStart = (event: MouseEvent | TouchEvent | PointerEvent) => {
    const contentEl = contentRef.current
    const dragTarget = event.target as Node
    if (contentEl && contentEl.contains(dragTarget)) return
    if (contentEl) contentEl.scrollTop = 0
  }

  // 드래그 종료 시 스냅 전환
  const onDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offsetY = info.offset.y
    const offsetX = info.offset.x
    if (Math.abs(offsetX) > Math.abs(offsetY)) return

    const velocityY = info.velocity.y
    const contentEl = contentRef.current
    if (!snapPoints || !contentEl) return

    // 가장 열려있는 상태(index 0)에서 컨텐츠가 스크롤 중이면 위치 고정
    if (activeSnapIndex === 0 && contentEl.scrollTop > 0) {
      controls.start({ y: snapPoints[activeSnapIndex] }, { duration: 0.3, ease: 'easeOut' })
      return
    }

    // 방향 기반으로 한 단계만 이동 (필요 시 '가장 가까운 스냅' 로직으로 바꿀 수 있음)
    const direction = offsetY + velocityY * 0.5 > 0 ? 1 : -1
    const nextIndex = Math.max(0, Math.min(snapPoints.length - 1, activeSnapIndex + direction))
    setActiveSnapIndex(nextIndex)
  }

  if (!snapPoints) return null

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
      className="fixed bottom-0 z-15 mx-auto flex h-full w-full max-w-[768px] flex-col rounded-t-[40px] bg-white shadow-lg"
      style={{ y: snapPoints[activeSnapIndex] }}
    >
      <div className="flex w-full flex-shrink-0 cursor-grab justify-center py-5">
        <div className="h-[3px] w-[150px] rounded-full bg-gray-300" />
      </div>

      <div
        ref={contentRef}
        className={cn(
          'flex flex-1 flex-col pb-10',
          activeSnapIndex === snapPoints.length - 1 ? 'overflow-y-hidden' : 'overflow-y-auto'
        )}
        style={{ touchAction: 'pan-y pan-x', overscrollBehavior: 'contain' }}
      >
        {children}
      </div>
    </motion.div>
  )
}

export default BottomSheet
