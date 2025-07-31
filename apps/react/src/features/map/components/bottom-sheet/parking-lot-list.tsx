import React, { useRef, useCallback, useMemo } from 'react'
import { PageResponseParkingLotListResponse } from '@data/user-api-axios/api'
import { cn } from '@ui/common/lib/utils'

interface ParkingLotListProps {
  pages: PageResponseParkingLotListResponse[] | undefined
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onFetchNextPage: () => void
}

export const ParkingLotList: React.FC<ParkingLotListProps> = ({
  pages,
  hasNextPage,
  isFetchingNextPage,
  onFetchNextPage,
}) => {
  const parkingLots = useMemo(() => pages?.flatMap((page) => page.content || []) || [], [pages])

  const observer = useRef<IntersectionObserver | undefined>(undefined)
  const lastParkingLotElementRef = useCallback(
    (node: HTMLLIElement | null) => {
      if (isFetchingNextPage) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting && hasNextPage) {
          onFetchNextPage()
        }
      })
      if (node) observer.current.observe(node)
    },
    [isFetchingNextPage, hasNextPage, onFetchNextPage]
  )

  if (parkingLots.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-center text-gray-500">
          <p className="text-sm">주변에 주차장이 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <ul className="space-y-2.5">
        {parkingLots.map((parkingLot, index) => (
          <li
            key={parkingLot.parkingCode}
            className="mx-4"
            ref={index === parkingLots.length - 1 ? lastParkingLotElementRef : undefined}
          >
            <div className="rounded-lg border border-white bg-white p-3 shadow-sm">
              <div className="flex items-start justify-between">
                {/* 왼쪽 상단: 주차 정보 */}
                <div className="text-left">
                  <div className="mb-1 text-[10px] text-gray-500">
                    {parkingLot.capacity && parkingLot.curCapacity
                      ? `주차 ${parkingLot.curCapacity}면 / ${parkingLot.capacity}면`
                      : '주차 정보 없음'}
                  </div>
                </div>

                {/* 오른쪽 상단: 요금 정보 */}
                <div className="text-right">
                  <div className="rounded-full bg-green-50 px-2 py-0.5">
                    {parkingLot.hourlyFee && parkingLot.hourlyFee > 0 ? (
                      <span className="text-[10px] font-semibold text-green-600">
                        {parkingLot.hourlyFee.toLocaleString()}원
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-green-600">무료</span>
                    )}
                  </div>
                </div>
              </div>

              {/* 하단 정보 */}
              <div className="mt-2 flex items-center justify-between">
                {/* 왼쪽 하단: 상호명과 영업시간 */}
                <div className="flex items-center gap-1">
                  <h3 className="text-sm font-semibold text-gray-900">{parkingLot.name}</h3>
                  <span
                    className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', {
                      'bg-green-100 text-green-600': parkingLot.isOpen,
                      'bg-red-100 text-red-600': !parkingLot.isOpen,
                    })}
                  >
                    {parkingLot.isOpen ? '영업중' : '영업종료'}
                  </span>
                </div>

                {/* 오른쪽 하단: 1시간 요금 라벨 */}
                <div className="text-[10px] text-gray-500">1시간 요금</div>
              </div>

              {/* 태그들 */}
              {(parkingLot.hourlyFee === 0 || parkingLot.isRealtime) && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {parkingLot.hourlyFee === 0 && (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      무료
                    </span>
                  )}
                  {parkingLot.isRealtime && (
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      실시간
                    </span>
                  )}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      {isFetchingNextPage && (
        <div className="p-4 text-center">
          <div className="text-sm text-gray-500">더 불러오는 중...</div>
        </div>
      )}
    </div>
  )
}
