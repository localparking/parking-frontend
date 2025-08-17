import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useMotionValue, useDragControls, animate, PanInfo } from 'framer-motion'
import { cn } from '@ui/common/lib/utils'

type BottomSheetProps = {
  children: React.ReactNode
  activeSnapIndex: number // 0: 최대, 1: 중간, 2: 최소
  setActiveSnapIndex: (i: number) => void
  className?: string
}

const TOP_GAP = 300
const BOTTOM_PEEK = 100
const HANDLE_H = 56 // 핸들 영역 고정 높이(px) (디자인에 맞게 조절)
const SPRING = { type: 'spring' as const, stiffness: 500, damping: 40 }
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)

export default function BottomSheet({ children, activeSnapIndex, setActiveSnapIndex, className }: BottomSheetProps) {
  const [vh, setVh] = useState<number>(typeof window !== 'undefined' ? window.innerHeight : 0)
  const y = useMotionValue(0)
  const dragControls = useDragControls()
  const mounted = useRef(false)

  // 1) 뷰포트 높이 반영
  useEffect(() => {
    const onResize = () => setVh(window.innerHeight)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // 2) 스냅 계산 (translateY 기준)
  const { maxHeight, minHeight, travel } = useMemo(() => {
    const maxH = clamp(vh - TOP_GAP, 0, vh)
    const minH = clamp(BOTTOM_PEEK, 0, vh)
    return { maxHeight: maxH, minHeight: minH, travel: Math.max(0, maxH - minH) }
  }, [vh])

  const snapY = useMemo<[number, number, number]>(() => [0, travel * 0.5, travel], [travel])

  // 3) 외부 인덱스 → 스냅 이동
  useEffect(() => {
    const target = snapY[activeSnapIndex] ?? 0
    if (!mounted.current) {
      y.set(target)
      mounted.current = true
    } else {
      animate(y, target, SPRING)
    }
  }, [activeSnapIndex, snapY, y])

  // 4) 드래그 로직(부모에만 적용)
  const onDrag = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    y.set(clamp(y.get() + info.delta.y, 0, travel))
  }

  const onDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const current = y.get()
    const predicted = clamp(current + info.velocity.y * 0.2, 0, travel)
    const dists = snapY.map((v) => Math.abs(v - predicted))
    const idx = dists.indexOf(Math.min(...dists))
    setActiveSnapIndex(idx)
    const target = snapY[idx] ?? 0
    animate(y, target, SPRING)
  }

  const isMax = activeSnapIndex === 0

  // 5) 핸들: 항상 스냅 드래그 시작 (자식에 drag 절대 주지 말 것!)
  const onHandlePointerDown = (e: React.PointerEvent) => {
    dragControls.start(e)
  }

  // 6) 콘텐츠: 최대가 아니면 스냅 드래그 시작, 최대면 스크롤
  const onContentPointerDown = (e: React.PointerEvent) => {
    if (!isMax) dragControls.start(e)
  }

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      className={cn(
        'fixed bottom-0 z-[15] mx-auto w-full max-w-[768px] rounded-t-[24px] bg-white shadow-lg',
        'flex min-h-0 flex-col', // 자식 스크롤 허용
        className
      )}
      style={{ height: maxHeight, y }} // 높이는 고정, 이동은 translateY만
      drag="y"
      dragControls={dragControls}
      dragListener={false} // 핸들/콘텐츠에서 수동 시작만
      dragMomentum={false}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
    >
      {/* 상단 바: 항상 스냅 드래그 시작 */}
      <div
        onPointerDown={onHandlePointerDown}
        className="flex cursor-grab items-center justify-center select-none active:cursor-grabbing"
        style={{ height: HANDLE_H }}
      >
        <div className="h-[4px] w-[56px] rounded-full bg-gray-300" />
      </div>

      {/* 스크롤 컨테이너: 정확한 높이 지정이 포인트 */}
      <div
        onPointerDown={onContentPointerDown}
        className={cn('min-h-0 flex-1', isMax ? 'overflow-y-auto' : 'overflow-hidden')}
        style={{
          height: `calc(100% - ${HANDLE_H}px)`,
          touchAction: isMax ? 'pan-y' : 'none',
          overscrollBehavior: isMax ? 'contain' : 'none',
          WebkitOverflowScrolling: isMax ? 'touch' : undefined,
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {children}
      </div>
    </motion.div>
  )
}
